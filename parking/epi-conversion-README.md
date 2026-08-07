# epi-conversion

A repeatable method for converting legacy medicinal product labelling (SmPC, PIL, PI, CMI)
from DOCX or PDF into FHIR ePI compliant XML.

Shareable as a skill: drop the folder into your LLM tool's skills directory, or paste
`SKILL.md` into a system prompt. The scripts run standalone on any machine with Python.

## Why this exists

Anyone can ask a language model to "turn this SmPC into FHIR XML". It will produce
something that looks right. The problem is that it will also, silently and confidently,
normalise a hyphen, tidy a sentence, drop a table row, or invent a dose form code — and
none of that is visible in a validation report.

This package exists to make that structurally impossible rather than merely discouraged.
The model never emits label text at all. It works with block IDs; a script pulls the
original text back out; a hash check proves nothing changed.

## The pipeline

```
0. Pin      → conversion-profile.yaml   which spec, which jurisdiction, which maps
1. Triage   → triage.md                 is this convertible, and at what cost
2. Extract  → document.json             blocks with IDs and hashes           [script]
3. Segment  → segmentation.json         block IDs → label sections           [model]
4. Map      → datapoints.json           facts → controlled terminology       [model]
5. Assemble → bundle.xml                FHIR ePI document bundle             [script]
6. Verify   → verification.md           fidelity, schema, profile, human
7. Record   → conversion-record.md      the audit trail
```

## Install

```bash
pip install python-docx pdfplumber
```

For Level 3 conformance checking you also need the official HL7 FHIR validator
(`validator_cli.jar`) and the ePI IG package for your pinned version.

## Quick start

```bash
python scripts/extract_docx.py MyProduct_SmPC.docx -o document.json
# review the block list, then produce segmentation.json and datapoints.json
python scripts/assemble_epi.py --profile conversion-profile.yaml \
    --document document.json --segmentation segmentation.json \
    --datapoints datapoints.json --section-map assets/section-map.template.csv \
    -o bundle.xml
python scripts/fidelity_check.py --document document.json \
    --bundle bundle.xml --segmentation segmentation.json
```

A complete worked example — synthetic SmPC and PIL, all intermediate files, and a passing
verification report — is in `examples/`.

## Before first production use

Three things need filling in once, by your organisation, and reviewed:

1. **`conversion-profile.yaml`** — the exact ePI IG name and version you are targeting.
2. **`section-map.*.csv`** — the `code` and `system` columns, from that pinned IG.
3. **`terminology-registry.csv`** — dose form, route and unit bindings, with an approver recorded.

These ship deliberately blank. Codes copied from memory validate cleanly and are wrong,
which is worse than being absent, because absence gets caught. Fill them from the
authoritative published specification and have someone sign off. That reviewed set of
files is then reused across every conversion — which is where the repeatability comes from.

## What this does not do

- It does not make a conversion submission-ready. It produces a **candidate ePI for qualified human review**, and the reports are written to say so.
- It does not OCR. Scanned documents need OCR first, and then full human proofreading, because hash checks can only prove the XML matches the OCR — not that the OCR matches the paper.
- It does not carry images into the bundle. Informational images are flagged, not converted.
- It does not translate. Both languages of a bilingual label are approved text.

## Layout

```
epi-conversion/
├── SKILL.md                        the method, for the model
├── README.md                       this file, for people
├── references/
│   ├── pipeline.md                 stage detail and file schemas
│   ├── section-maps.md             EU QRD and TGA heading registries
│   ├── terminology.md              binding rules, never-invent-codes
│   ├── fhir-assembly.md            bundle and resource structure
│   ├── validation.md               the four-level ladder
│   └── edge-cases.md               tables, images, multi-strength, bilingual, scanned
├── assets/
│   ├── conversion-profile.template.yaml
│   ├── section-map.template.csv
│   ├── terminology-registry.template.csv
│   └── conversion-record.template.md
├── scripts/
│   ├── extract_docx.py
│   ├── extract_pdf.py
│   ├── assemble_epi.py
│   └── fidelity_check.py
└── examples/                       worked end-to-end example
```

## Tested behaviour

The controls in `fidelity_check.py` and `assemble_epi.py` were verified against
deliberately corrupted bundles:

| Fault injected | Detected as |
|---|---|
| "3 years." rewritten as "Three years." | 1 lost + 1 added |
| A contraindication bullet deleted | 1 lost |
| An editorial cross-reference added | 1 added |
| A block omitted from segmentation | assembly refused |

The lost-plus-added pattern is the signature of paraphrase, which is the failure mode this
method exists to prevent.
