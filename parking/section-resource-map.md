# Section → FHIR ePI resource map

Which SmPC and PIL content goes where in a FHIR ePI bundle.

Contents:
1. How to read this map
2. Maturity tiers
3. SmPC section map
4. PIL section map
5. Reverse index: what populates each resource
6. Content that maps to nothing
7. Codes and the version caveat

---

## 1. How to read this map

Every section of a label travels down **two channels at once**:

**Channel 1 — narrative.** Every section, without exception, becomes a
`Composition.section` with the approved text in `section.text.div`. This is the whole
document, preserved. Nothing is left out of this channel.

**Channel 2 — discrete data.** *Some* sections also yield facts that populate product
resources. Section 3 yields a dose form. Section 8 yields an authorisation number.
Section 4.9 yields nothing at all.

The tables below describe **Channel 2 only**, because Channel 1 is uniform. A section with
an empty "Discrete data" row is not being ignored — its text is fully present in the
Composition. It simply has no structured counterpart.

The two channels are redundant by design: the dose form appears both as narrative prose in
section 3 and as a coded element on the product resources. They must agree, and Level 4
review checks that they do.

---

## 2. Maturity tiers

Not all of this is worth attempting at once. Each mapping below carries a tier:

**Tier 0 — narrative only.** The Composition, correctly sectioned, plus minimal product
identity. A complete, valid, useful ePI. Most first implementations stop here, and that is
a reasonable place to stop.

**Tier 1 — core product data.** Names, dose forms, routes, ingredients, packaging,
authorisation. Mechanically extractable from well-defined sections. This is where most
production ePI programmes operate.

**Tier 2 — clinical use data.** Indications, contraindications, interactions and
undesirable effects as coded `ClinicalUseDefinition` resources. Extracting these reliably
from free prose is a research-grade problem, not a conversion task. Treat Tier 2 as
roadmap, and be candid that a Tier 2 claim needs clinical review, not just QA.

Declare your target tier in `conversion-profile.yaml`. A conversion that reaches Tier 1
honestly is more valuable than one that claims Tier 2 unreliably.

---

## 3. SmPC section map

### Document header (before section 1)

| Content | Discrete data | FHIR target | Tier |
|---|---|---|---|
| Black triangle / additional monitoring statement | additional monitoring flag | `MedicinalProductDefinition.additionalMonitoringIndicator` | 1 |
| Document title | title string | `Composition.title` | 0 |

The additional monitoring statement is easy to lose because it sits outside the numbered
structure. Assign it to the document header, not to section 1.

### 1. Name of the medicinal product

| Discrete data | FHIR target | Tier |
|---|---|---|
| Full presentation name | `MedicinalProductDefinition.name.productName` | 1 |
| Invented name, strength, dose form as separate parts | `MedicinalProductDefinition.name.part` (with `part.type`) | 1 |
| Country / language / jurisdiction of the name | `MedicinalProductDefinition.name.usage` | 1 |

Splitting the name into parts is what lets a system find "all 5 mg presentations" later.
Store the whole string as well — do not rely on the parse alone.

### 2. Qualitative and quantitative composition

| Discrete data | FHIR target | Tier |
|---|---|---|
| Active substance | `Ingredient.substance.code` + `SubstanceDefinition`, `Ingredient.role` = active | 1 |
| Strength (presentation and/or concentration) | `Ingredient.substance.strength.presentation` / `.concentration` | 1 |
| Salt-to-base relationship | `Ingredient.substance.strength.referenceStrength`, `SubstanceDefinition.relationship` | 1 |
| "Excipient(s) with known effect" | `Ingredient.role` = excipient, plus narrative | 1 |
| Full excipient list | see section 6.1 | 1 |

Section 2 and section 6.1 both describe ingredients and must produce one consistent set of
`Ingredient` resources, not two competing ones. Decide which section is authoritative for
each field before you start.

### 3. Pharmaceutical form

| Discrete data | FHIR target | Tier |
|---|---|---|
| Dose form as manufactured | `ManufacturedItemDefinition.manufacturedDoseForm` | 1 |
| Dose form as administered | `AdministrableProductDefinition.administrableDoseForm` | 1 |
| Combined dose form for the product | `MedicinalProductDefinition.combinedPharmaceuticalDoseForm` | 1 |
| Unit of presentation | `ManufacturedItemDefinition.unitOfPresentation` | 1 |
| Visual description (colour, shape, debossing, score line) | `ManufacturedItemDefinition.property` | 1 |

The three dose forms are genuinely different for reconstituted products — a powder for
solution for infusion is a powder in the vial and a solution at the bedside. Conflating
them is the most common Tier 1 modelling error.

### 4. Clinical particulars

| Sub-section | Discrete data | FHIR target | Tier |
|---|---|---|---|
| 4.1 Therapeutic indications | Indication | `ClinicalUseDefinition` type = `indication` | 2 |
| | Free-text indication summary | `MedicinalProductDefinition.indication` | 1 |
| 4.2 Posology and method of administration | Route of administration | `AdministrableProductDefinition.routeOfAdministration.code` | 1 |
| | First dose, max single dose, max dose per day, max treatment period | `AdministrableProductDefinition.routeOfAdministration.*` | 2 |
| | Paediatric use statement | `MedicinalProductDefinition.pediatricUseIndicator` | 1 |
| 4.3 Contraindications | Contraindication | `ClinicalUseDefinition` type = `contraindication` | 2 |
| 4.4 Special warnings and precautions | Warning | `ClinicalUseDefinition` type = `warning` | 2 |
| 4.5 Interactions | Interaction, interactant, effect, management | `ClinicalUseDefinition` type = `interaction` | 2 |
| 4.6 Fertility, pregnancy and lactation | Population-specific warnings | `ClinicalUseDefinition.population` | 2 |
| 4.7 Effects on ability to drive | — | narrative only | 0 |
| 4.8 Undesirable effects | Adverse reaction + frequency | `ClinicalUseDefinition` type = `undesirable-effect`, `.undesirableEffect.frequencyOfOccurrence` | 2 |
| 4.9 Overdose | — | narrative only | 0 |

Section 4 is where the ambition gap sits. The adverse-reaction table in 4.8 looks
structured, and it is — but it is structured *typographically*, by system organ class and
frequency band, in a table whose semantics vary between sponsors. Extracting it into
`ClinicalUseDefinition` resources is a project in itself. At Tier 0–1, keep the table as
faithful XHTML in the narrative, which preserves every bit of the meaning for a human
reader.

### 5. Pharmacological properties

| Sub-section | Discrete data | FHIR target | Tier |
|---|---|---|---|
| 5.1 Pharmacodynamic properties | Pharmacotherapeutic group and ATC code | `MedicinalProductDefinition.classification` | 1 |
| 5.1 (remainder) | — | narrative only | 0 |
| 5.2 Pharmacokinetic properties | — | narrative only | 0 |
| 5.3 Preclinical safety data | — | narrative only | 0 |

The ATC code is the one high-value data point in an otherwise narrative-only section, and
it is easy to miss because it sits in the first line of 5.1 rather than in a field of its
own. Worth a dedicated extraction rule.

### 6. Pharmaceutical particulars

| Sub-section | Discrete data | FHIR target | Tier |
|---|---|---|---|
| 6.1 List of excipients | Excipient substances | `Ingredient.role` = excipient, `SubstanceDefinition` | 1 |
| 6.2 Incompatibilities | — | narrative only | 0 |
| 6.3 Shelf life | Shelf life period, in-use shelf life | `PackagedProductDefinition.packaging.shelfLifeStorage` (`ProductShelfLife.type`, `.period`) | 1 |
| 6.4 Special precautions for storage | Storage conditions | `ProductShelfLife.specialPrecautionsForStorage` | 1 |
| 6.5 Nature and contents of container | Container type and material | `PackagedProductDefinition.packaging.type`, `.material` | 1 |
| | Pack sizes | `PackagedProductDefinition.packaging.quantity`, `.containedItemQuantity` | 1 |
| | "Not all pack sizes may be marketed" | `PackagedProductDefinition.marketingStatus` | 1 |
| 6.6 Disposal and other handling | — | narrative only (may contain informational images) | 0 |

Section 6.3 often carries several distinct shelf lives — as packaged, after first opening,
after reconstitution, after dilution. Each is a separate `ProductShelfLife` with its own
type. Flattening them to one value loses safety-relevant information.

### 7–10. Administrative sections

| Section | Discrete data | FHIR target | Tier |
|---|---|---|---|
| 7. Marketing authorisation holder | Organisation name, address | `Organization`, `RegulatedAuthorization.holder` | 1 |
| 8. Marketing authorisation number(s) | Authorisation number | `RegulatedAuthorization.identifier` | 1 |
| 9. Date of first authorisation / renewal | Authorisation and renewal dates | `RegulatedAuthorization.statusDate`, `.validityPeriod` | 1 |
| 10. Date of revision of the text | Document date | `Composition.date` | 0 |

One MA number per presentation is normal. Multi-presentation products need one
`RegulatedAuthorization` per authorised presentation, linked to the right
`PackagedProductDefinition` — decide this in Stage 0.

### 11–12. Radiopharmaceutical sections

Sections 11 (Dosimetry) and 12 (Instructions for preparation) are narrative only at
Tier 0–1. They frequently contain tables and diagrams; see `edge-cases.md`.

---

## 4. PIL section map

The leaflet is **overwhelmingly a narrative document**. Almost all of its discrete data
duplicates the SmPC, and where it does, the SmPC is normally authoritative.

Do not build a second, parallel set of product resources from the PIL. Both documents
should reference the *same* product resources — that shared reference is the mechanism
that keeps a leaflet and its SmPC consistent, and it is one of the main practical benefits
of moving to ePI at all.

| Section | Discrete data | FHIR target | Tier |
|---|---|---|---|
| Title and "Read all of this leaflet carefully…" | Document title | `Composition.title` | 0 |
| "What is in this leaflet" contents box | — | narrative; the real ToC is `Composition.section` structure | 0 |
| 1. What X is and what it is used for | Indication (shared with SmPC 4.1) | `ClinicalUseDefinition` type = `indication` | 2 |
| 2. What you need to know before you take X | Contraindications, warnings, interactions (shared with SmPC 4.3–4.6) | `ClinicalUseDefinition` | 2 |
| — "Contains excipient X" statements | Excipient with known effect | `Ingredient.role` = excipient | 1 |
| 3. How to take X | Route, posology (shared with SmPC 4.2) | `AdministrableProductDefinition.routeOfAdministration` | 1 |
| 4. Possible side effects | Adverse reactions (shared with SmPC 4.8) | `ClinicalUseDefinition` type = `undesirable-effect` | 2 |
| — "Reporting of side effects" box | — | narrative; national content, tag it | 0 |
| 5. How to store X | Shelf life and storage (shared with SmPC 6.3/6.4) | `ProductShelfLife` | 1 |
| 6. Contents of the pack and other information | Full ingredient list | `Ingredient` | 1 |
| — "What X looks like and contents of the pack" | Appearance, pack sizes | `ManufacturedItemDefinition.property`, `PackagedProductDefinition.packaging` | 1 |
| — Marketing Authorisation Holder and Manufacturer | Organisations, with roles | `Organization`, `RegulatedAuthorization.holder` | 1 |
| — "This medicinal product is authorised in the Member States… under the following names" | Product name per country | `MedicinalProductDefinition.name.usage` (country, jurisdiction, language) | 1 |
| — "This leaflet was last revised in…" | Document date | `Composition.date` | 0 |
| — "The following information is intended for healthcare professionals only" | — | narrative; flag as professional content inside a patient document | 0 |

Two PIL-specific traps:

**The multi-country name list** in section 6 looks like boilerplate and is actually
high-value structured data — it is the mapping from one product to its trade names across
markets. `name.usage` exists precisely for this.

**The blue box / national content** varies by member state while the rest of the leaflet
does not. Tag these blocks at segmentation so a per-market variant can be generated without
re-reviewing the whole document.

---

## 5. Reverse index: what populates each resource

Useful when checking coverage — read down the middle column and ask whether you actually
extracted each source.

| Resource | Populated from | Tier |
|---|---|---|
| `Composition` | Every section of both documents; dates from SmPC 10 / PIL 6 | 0 |
| `MedicinalProductDefinition` | SmPC 1 (names), 3 (combined dose form), 4.1 (indication text), 4.2 (paediatric indicator), 5.1 (ATC); header (additional monitoring); PIL 6 (names by country) | 1 |
| `ManufacturedItemDefinition` | SmPC 3 (manufactured dose form, appearance), 2 + 6.1 (ingredients) | 1 |
| `AdministrableProductDefinition` | SmPC 3 (administrable dose form), 4.2 (route, dose limits) | 1 |
| `PackagedProductDefinition` | SmPC 6.3 (shelf life), 6.4 (storage), 6.5 (container, pack sizes); PIL 6 | 1 |
| `Ingredient` | SmPC 2 (actives, excipients with known effect), 6.1 (full excipient list); PIL 6 | 1 |
| `SubstanceDefinition` | SmPC 2 (substance identity, salt/base relationships) | 1 |
| `RegulatedAuthorization` | SmPC 7 (holder), 8 (number), 9 (dates) | 1 |
| `Organization` | SmPC 7; PIL 6 (MAH, manufacturers, local representatives) | 1 |
| `ClinicalUseDefinition` | SmPC 4.1, 4.3, 4.4, 4.5, 4.6, 4.8; PIL 1, 2, 4 | 2 |

Coverage check worth running at the end of Stage 4: for each Tier 1 row above, confirm
you extracted from every listed source section. Sections 5.1 and 6.4 are the ones most
often silently skipped, because they read as pure prose.

---

## 6. Content that maps to nothing

Explicitly listing these prevents someone assuming a gap is an error:

- SmPC 4.7, 4.9, 5.2, 5.3, 6.2, 6.6 — narrative only at every tier
- The bulk of 5.1 beyond the ATC line
- The PIL preamble and reporting boxes
- Table structure beyond its XHTML rendering
- Cross-references between sections ("see section 4.4") — these stay as text; they are not resolved into FHIR references at Tier 0–1

None of this is lost. It is all in `Composition.section`. It simply has no structured
counterpart, which is a property of the specification, not a defect in the conversion.

---

## 7. Codes and the version caveat

This map names **resources and elements**, which are stable across FHIR R5. It deliberately
names no **codes** and no **canonical profile URLs**.

Those come from the specific ePI implementation guide version pinned in
`conversion-profile.yaml`, and they move between versions and between jurisdictional
profiles. A code taken from anywhere other than the published IG will validate cleanly and
be wrong — the worst combination available, since it survives every automated check.

Which resources a given IG version actually requires, and how much of Tier 1 is mandatory
versus optional, is also version-specific. Confirm against the pinned IG before treating
any row here as a requirement rather than a possibility.
