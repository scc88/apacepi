---
name: epi-conversion
description: Convert legacy medicinal product labelling documents (SmPC, PIL, PI, CMI, package leaflet, prescribing information) from DOCX or PDF into HL7 FHIR ePI compliant XML using a repeatable, auditable pipeline. Use this skill whenever the user mentions SmPC, PIL, ePI, product information, package leaflet, drug labelling conversion, structured labelling, IDMP, FHIR medicinal product resources, or asks to turn label documents into structured or machine-readable data — even if they do not say "FHIR" explicitly. Also use when reviewing, validating, or QA-ing an already-converted ePI bundle.
---

# Legacy Label → FHIR ePI Conversion

Convert an approved labelling document into a FHIR ePI document bundle without altering
a single word of the approved text.

## The one rule that governs everything

**Never retype, rewrite, summarise, correct or "clean up" approved label text.**

Regulatory text is legally binding. A converted label that reads *slightly* differently from
the approved document is a compliance defect, not a formatting quirk. Language models are
excellent classifiers and terrible transcribers — they normalise quietly and confidently.

So this pipeline is built so that **the model never emits label text at all**. Extraction
assigns every block of text a stable ID and a hash. The model works only with IDs. A
deterministic script pulls the original text back out by ID when it builds the XML. A
fidelity check then proves, by hash, that nothing changed.

If you find yourself typing label content into a JSON or XML file, stop — you have left
the method.

## Division of labour

| Work | Who does it | Why |
|---|---|---|
| Text extraction | Script | Must be reproducible and hash-verifiable |
| Section classification | **Rules first**; model only on what rules cannot resolve | Most headings are deterministic; judgement is the exception, not the default |
| Terminology mapping | Model proposes → human confirms | Judgement, and regulatorily significant |
| XML assembly | Script | No creative latitude wanted |
| Fidelity verification | Script | Must be objective evidence |
| Release sign-off | Qualified human | Accountability cannot be delegated |

The model's output at every stage is a **proposal file**, never a deliverable.

## Pipeline

Run these in order. Each stage writes a file into the working directory; each stage reads
only the previous stage's file. That is what makes the process repeatable and auditable.

```
0. Pin      → conversion-profile.yaml   (which spec, which jurisdiction, which maps)
1. Triage   → triage.md                 (is this document convertible, and at what cost)
2. Extract  → document.json             (blocks: id, text, hash, order, provenance)
3. Segment  → segmentation.draft.json   (rules resolve what they can)     [script]
            → segmentation.json         (model judges the residue only)   [model]
4. Map      → datapoints.json           (facts → controlled terminology)  [model]
5. Assemble → bundle.xml                (FHIR ePI document bundle)
6. Verify   → verification.md           (fidelity + schema + profile + human)
7. Record   → conversion-record.md      (the audit trail)
```

### Stage 0 — Pin the target before touching the source

Read `assets/conversion-profile.template.yaml` and fill it in with the user. It records the
ePI implementation guide name **and version**, the jurisdiction, the document type, and the
paths to the section map and terminology registry in use.

This matters because "FHIR ePI" is not one fixed thing — the implementation guide is
versioned and jurisdictions layer their own requirements on top. A conversion is only
reproducible if the target is pinned. If the user cannot name a version, that is the first
thing to resolve; do not proceed on assumption.

### Stage 1 — Triage the source

Classify the input, because this determines accuracy and effort more than anything else:

- **Tier A — DOCX with real heading styles.** Structure is already machine-readable. Highest fidelity, lowest cost, and usually no model involvement at Stage 3 at all.
- **Tier B — DOCX with visually-formatted headings** (bold body text, manual numbering). Structure must be inferred.
- **Tier C — born-digital PDF.** Text extractable; reading order and tables must be reconstructed.

**Scanned and image-based documents are not supported.** OCR is deliberately out of scope,
and the PDF extractor refuses such files rather than degrading quietly. The fidelity
guarantee rests on hashing text that came from the document itself; hashes computed over
OCR output would prove only that the XML matches the OCR, not that the OCR matches the
original. That is a far weaker claim which looks identical in the report — and a control
that overstates itself is worse than one that is absent.

If only a scan exists, transcription and full human proofreading must happen first, using
tooling of the implementer's own choosing. The proofread text then becomes the source
document for audit purposes and its provenance is recorded in `conversion-record.md`. State
this plainly to the user rather than attempting a workaround.

Record the tier, page/word count, language, and any obvious hazards (multi-column layout,
landscape tables, embedded images carrying information, tracked changes, mixed languages).

### Stage 2 — Extract

```bash
python scripts/extract_docx.py <input.docx> -o document.json
python scripts/extract_pdf.py  <input.pdf>  -o document.json
```

Produces a flat, ordered list of blocks. Every block carries `id`, `type`, `text`,
`sha256`, and `order`. Nothing is discarded — footnotes, table cells and captions all become
blocks, because anything dropped here is silently lost from the final label.

Inspect the block list before continuing. If reading order looks scrambled, or a table has
collapsed into prose, fix extraction now. Downstream stages cannot repair bad extraction.

### Stage 3 — Segment: rules first, model on the residue only

**Run the deterministic segmenter before involving the model at all.**

```bash
python scripts/segment_rules.py --document document.json \
    --section-map maps/section-map-eu-qrd-smpc.csv --prefix smpc \
    -o segmentation.draft.json
```

It resolves headings by three rules in priority order — section numbering, exact title
match, then heading-pattern match — and reports coverage. On a clean Tier A document this
routinely resolves everything, and **no model involvement is needed at this stage.** Do not
add it out of habit.

Whatever the rules cannot resolve lands in `residue`. That is the part that genuinely needs
judgement, and it is the only part the model should see:

- **Heading variants the map has not met** — "Contra-indications", "Interactions", "Pregnancy and lactation"
- **Possible sub-headings** — "Posology", "Paediatric population", "Elderly". These look like headings but belong *inside* a section. Promoting one splits a real section in two, which is why the rules never promote on their own.
- **Collisions** — a heading matching a `section_key` that already exists. Almost always a sub-heading whose wording overlaps a map pattern.
- **Everything on a Tier B or C source**, where "heading" is a visual property rather than a declared style.

For each residue item, decide whether it is a section or a sub-heading, then produce
`segmentation.json`:

- To **promote** it: add a section with its own `section_key`, `resolved_by: "model"`, `confidence: "low"` or `"medium"`, and move the following body blocks to it. Remove the residue entry.
- To **keep** it as a sub-heading: leave it where the draft put it and remove the residue entry.
- Either way, add a `flags` entry with `action: human_review` — a model decision is a proposal, not a resolution.

Rules that still apply to the whole file:

- Emit **block IDs only**. If `segmentation.json` contains a sentence of label text, the method has been abandoned.
- Every block must appear in a section or in `unassigned` with a reason. Silent omission is the most dangerous failure mode here.
- Do not merge, split, reorder or reword blocks.
- Preserve `resolved_by` on every section. The rule-versus-model split is reported by the assembler and belongs in the conversion record.

**Feed confirmed decisions back into the section map.** Every variant a human confirms
becomes a `heading_patterns` entry, so it is a rule next time. This is what makes the
method get cheaper: the first conversions in a portfolio need judgement often, the
hundredth rarely. A rising rule-coverage percentage is the clearest evidence the programme
is maturing, and "412 of 430 headings resolved by rule, 18 needed judgement, all 18
reviewed" is a far stronger assurance statement than any claim about model quality.

### Stage 4 — Map terminology (model work)

Extract the discrete data points (product name, strength, dose form, route, active
substance, MAH, authorisation number, pack size, shelf life…) and bind them to controlled
vocabulary.

**Never invent a code or code system URI.** Use only entries present in the terminology
registry. Where no entry matches, set `status: unmapped`, keep the original text, and flag
it. An unmapped element that is honestly flagged is a task; a plausible-looking invented
code is a defect that may survive review. See `references/terminology.md`.

Every data point records its `source_block`, so a reviewer can trace any value back to the
place in the original document it came from.

### Stage 5 — Assemble

```bash
python scripts/assemble_epi.py --profile conversion-profile.yaml \
    --document document.json --segmentation segmentation.json \
    --datapoints datapoints.json -o bundle.xml
```

The script builds the FHIR document bundle, pulling narrative text from `document.json` by
block ID. See `references/fhir-assembly.md` for the resource structure and what goes where.

### Stage 6 — Verify

```bash
python scripts/fidelity_check.py --document document.json --bundle bundle.xml
```

Four levels, in this order — see `references/validation.md`:

1. **Fidelity** — every block hash present in the bundle, no block lost, no text introduced. Automated, and the level regulators care about most.
2. **Well-formedness** — valid XML, valid FHIR structure.
3. **Conformance** — passes the pinned ePI profile in the official FHIR validator.
4. **Human review** — render the bundle back to a readable label and compare side by side against the original. The reviewer reads the rendered label, never the raw XML.

Levels 1–3 can pass on a document that is completely mis-sectioned, so level 4 is not optional.

### Stage 7 — Record

Complete `assets/conversion-record.template.md`. It captures source file hash, profile
version, tool versions, unmapped items, flags raised and how they were resolved, and who
signed off. Without this, a conversion cannot be defended or reliably repeated.

## Reference files

Read these as needed rather than upfront:

- `references/pipeline.md` — full stage detail, file schemas, worked example
- `references/section-maps.md` — EU QRD SmPC/PIL and TGA PI/CMI heading registries, and how to add a jurisdiction
- `references/section-resource-map.md` — which section content maps to which FHIR resource and element; read this before Stage 4
- `references/terminology.md` — binding rules, registry format, the never-invent-codes rule
- `references/fhir-assembly.md` — bundle and resource structure, narrative rules
- `references/validation.md` — the four-level ladder and what each catches
- `references/edge-cases.md` — tables, images, multi-strength products, bilingual labels, blue box, scanned documents

Templates to copy into the working directory: `assets/conversion-profile.template.yaml`,
`assets/section-map.template.csv`, `assets/terminology-registry.template.csv`,
`assets/conversion-record.template.md`.

`examples/` contains a complete worked conversion — synthetic SmPC and PIL, every
intermediate file, and a passing verification report. Read `examples/segmentation.json`
and `examples/datapoints.json` before producing your first ones; they show the expected
shape, including how to flag a missing required section and how to leave a coding honestly
unmapped.

## Reporting to the user

Be candid about residual risk. A conversion is not "done" because the XML validates.
State plainly: what was mapped, what was flagged, what remains unmapped, and what a human
still needs to check. Report the rule-versus-model split from Stage 3 — it is a stronger
assurance statement than any claim about model quality.

Do not describe output as regulatory-ready. This pipeline produces a *candidate* ePI for
qualified human review, and saying so is part of the deliverable.
