# Building a Singapore ePI (Type 4) — A Step-by-Step Blueprint

### Worked reference: the PAXLOVID Summary of Product Characteristics (SmPC)

**Reference instance:** [`input/instances/Bundle-epi-paxlovid-sgp-smpc.xml`](../input/instances/Bundle-epi-paxlovid-sgp-smpc.xml)
**FHIR release:** R5 · **Bundle type:** `document` · **Standard:** HL7 FHIR ePI (Vulcan Global Core ePI) as adopted for APAC / HSA Singapore

---

## 0. Purpose & how to use this document

This document explains, **resource by resource and in the ideal build order**, how the PAXLOVID ePI XML was constructed. It is the **golden-standard blueprint** for the HSA ePI pilot: pharmaceutical companies should follow this recipe to build ePI FHIR documents for their own products.

- **What is fixed** — the *shape* of the document: which FHIR resources are used, how they reference each other, which terminologies are used, and the section skeleton of the SmPC.
- **What you change** — the *content*: your company, your product, your substances, your clinical particulars, your dosing.

> **Read the reference instance alongside this guide.** Every XML snippet below is taken (and pretty-printed) directly from the PAXLOVID Bundle so you can find the corresponding block in the file.

> ⚠️ **Draft-data disclaimer.** The reference instance is an illustrative sample. Identifiers such as the registration number `PAXH-SIN-0126`, the document id `PAXH-SIN-0126/0`, and the HSA local code-system URLs (`https://www.hsa.gov.sg/epi/…`) are **placeholders to be confirmed with HSA**. Do not treat them as approved values.

---

## 1. What you are building — the FHIR document model

An ePI is a **FHIR document**: a `Bundle` (`type = document`) whose **first entry is a `Composition`**. The Composition is the human-readable "spine" (the SmPC, section by section). Every other resource in the Bundle is a structured, machine-readable object that the Composition's sections **point to** by reference.

```
Bundle (document)
├── Composition ......... the SmPC spine — sections 1–7, narrative + references  ← MUST be first entry
├── Organization ........ the product owner / marketing authorisation holder
├── MedicinalProductDefinition ... the product's identity
├── RegulatedAuthorization ....... the HSA marketing authorisation
├── SubstanceDefinition (×n) ..... each active + reference excipient substance
├── Ingredient (×n) .............. actives (with strength) + excipients
├── ManufacturedItemDefinition (×n) ... each physical tablet (colour/shape/imprint)
├── AdministrableProductDefinition .... the form as administered + route
├── PackagedProductDefinition ......... the pack / carton
├── ClinicalUseDefinition (×n) ........ indication, contraindications, interactions,
│                                        warnings, undesirable effects
└── MedicationKnowledge .......... structured (machine-readable) dosing — the "Dose Structure"
```

**In the PAXLOVID reference, that is 152 resources:** 1 Composition, 1 Organization, 1 MedicinalProductDefinition, 1 RegulatedAuthorization, 3 SubstanceDefinitions, 22 Ingredients, 2 ManufacturedItemDefinitions, 1 AdministrableProductDefinition, 1 PackagedProductDefinition, **118 ClinicalUseDefinitions**, and 1 MedicationKnowledge.

### Why this is "ePI Type 4"

Per the [Use Cases page](../input/pagecontent/usecases.md), **Type 4** is the fully-structured, digital-first tier: *"all content is encoded as discrete data elements using standardized terminologies… incorporates the Dose Structure for machine-readable dosing."* This instance qualifies because:

- Every clinical particular (indications, contraindications, interactions, warnings, adverse reactions) is a **coded `ClinicalUseDefinition`**, not just narrative.
- Dosing is captured as **machine-readable `MedicationKnowledge`** (dose amounts, timing, eGFR thresholds), not only prose.
- Product data uses international terminologies throughout (EDQM, SNOMED CT, UNII, ATC, LOINC, UCUM, ISO 3166).

---

## 2. Prerequisites — terminologies & tooling

### 2.1 International code systems used

| Domain | System (`system` URI) | Used for |
|---|---|---|
| Dose form, route, packaging | `https://standardterms.edqm.eu` (EDQM Standard Terms) | Film-coated tablet `10221000`, Oral use `20053000`, Carton `30007000` |
| Diseases / conditions | `http://snomed.info/sct` (SNOMED CT) | Indication `840539006`, contraindication conditions |
| Active substances | `http://fdasis.nlm.nih.gov` (FDA UNII) | Nirmatrelvir `7R9A5P7H32`, Ritonavir `O3J8G9O825` |
| Medicinal product class | `http://www.whocc.no/atc` (WHO ATC) | `J05AE30` nirmatrelvir and ritonavir |
| Lab / patient characteristics | `http://loinc.org` (LOINC) | eGFR `62238-1` |
| Units of measure | `http://unitsofmeasure.org` (UCUM) | `mg`, `mL/min/{1.73_m2}` |
| Country / jurisdiction | `urn:iso:std:iso:3166` | `SG` Singapore |
| Language | `urn:ietf:bcp:47` | `en` English |
| Name-part / role / type enums | `http://hl7.org/fhir/…` | FHIR-defined code systems |

### 2.2 HSA local (Singapore) code systems

The reference uses draft HSA namespaces for locally-governed concepts. **Confirm the final URLs and codes with HSA** before production:

- `https://www.hsa.gov.sg/epi/document-id` · `…/document-type` · `…/section-code`
- `https://www.hsa.gov.sg/epi/registration-number` · `…/organisation` · `…/substance`
- `https://www.hsa.gov.sg/epi/soc` (system organ class) · `…/adr-frequency`
- `http://hl7.org/fhir/uv/emedicinal-product-info/CodeSystem/epi-ig` (physical-property codes: colour, shape, size, imprint — from the Vulcan ePI IG)

### 2.3 Tooling

- A FHIR R5 authoring/validation tool (e.g. the HL7 FHIR Validator, or SUSHI/FSH if you author in FHIR Shorthand).
- Access to the terminologies above (or a terminology server) for code lookups.
- The Vulcan Global Core ePI IG for profile definitions: <https://hl7.org/fhir/uv/emedicinal-product-info/>.

---

## 3. The ideal build order

You **author bottom-up** (build the things that get referenced before the things that reference them), then **assemble top-down** (Composition first inside the Bundle). Compose the Composition last, because it references everything else.

| Step | Resource | Depends on | Count in ref |
|---|---|---|---|
| 1 | `Organization` | — | 1 |
| 2 | `MedicinalProductDefinition` | — | 1 |
| 3 | `RegulatedAuthorization` | MPD, Organization | 1 |
| 4 | `SubstanceDefinition` | — | 3 |
| 5 | `Ingredient` | MPD, SubstanceDefinition | 22 |
| 6 | `ManufacturedItemDefinition` | — | 2 |
| 7 | `AdministrableProductDefinition` | — | 1 |
| 8 | `PackagedProductDefinition` | (MID) | 1 |
| 9 | `ClinicalUseDefinition` | MPD | 118 |
| 10 | `MedicationKnowledge` | — | 1 |
| 11 | `Composition` | **all of the above** | 1 |
| 12 | `Bundle` (wrap) | Composition + all | 1 |

---

## 4. Step-by-step, resource by resource

Throughout, every resource is given a stable logical id (e.g. `org-owner`, `mpd-paxlovid`). That id is what the Bundle `fullUrl` and all `reference` elements use, so **choose a clear id convention and keep it consistent** (the reference uses `mpd-…`, `subd-…`, `ingr-…`, `mid-…`, `apd-…`, `ppd-…`, `cud-…`, `mk-…`).

### Step 1 — `Organization` (the product owner / MAH)

Represents the marketing-authorisation holder. Referenced by `RegulatedAuthorization.holder`, `Composition.author`, and SmPC section 7 (Product Owner).

```xml
<Organization>
  <id value="org-owner"/>
  <identifier>
    <system value="https://www.hsa.gov.sg/epi/organisation"/>
    <value value="PFIZER-INC"/>
  </identifier>
  <active value="true"/>
  <name value="Pfizer Inc."/>
  <contact>
    <address><city value="New York"/><country value="United States"/></address>
  </contact>
</Organization>
```

### Step 2 — `MedicinalProductDefinition` (product identity)

The anchor of the whole ePI: nearly everything ultimately points back to it. It carries the registration number, the combined dose form, route, the **structured product name** (broken into typed parts), and the country/jurisdiction/language of use.

```xml
<MedicinalProductDefinition>
  <id value="mpd-paxlovid"/>
  <identifier>
    <system value="https://www.hsa.gov.sg/epi/registration-number"/>
    <value value="PAXH-SIN-0126"/>
  </identifier>
  <combinedPharmaceuticalDoseForm>
    <coding><system value="https://standardterms.edqm.eu"/>
      <code value="10221000"/><display value="Film-coated tablet"/></coding>
  </combinedPharmaceuticalDoseForm>
  <route>
    <coding><system value="https://standardterms.edqm.eu"/>
      <code value="20053000"/><display value="Oral use"/></coding>
  </route>
  <name>
    <productName value="PAXLOVID"/>
    <part><part value="PAXLOVID"/>
      <type><coding><system value="http://hl7.org/fhir/medicinal-product-name-part-type"/>
        <code value="InventedNamePart"/></coding></type></part>
    <part><part value="nirmatrelvir/ritonavir"/>
      <type><coding><code value="NonproprietaryNamePart"/></coding></type></part>
    <part><part value="150 mg/100 mg"/>
      <type><coding><code value="StrengthPart"/></coding></type></part>
    <part><part value="film-coated tablets"/>
      <type><coding><code value="DoseFormPart"/></coding></type></part>
  </name>
  <usage>
    <country><coding><system value="urn:iso:std:iso:3166"/><code value="SG"/>
      <display value="Singapore"/></coding></country>
    <jurisdiction><coding><system value="urn:iso:std:iso:3166"/><code value="SG"/>
      <display value="Singapore"/></coding></jurisdiction>
    <language><coding><system value="urn:ietf:bcp:47"/><code value="en"/>
      <display value="English"/></coding></language>
  </usage>
</MedicinalProductDefinition>
```

**SG note:** the `usage.country`/`jurisdiction` is `SG`, and `identifier` carries the HSA registration number. For your product, set these to your HSA registration.

### Step 3 — `RegulatedAuthorization` (the HSA marketing authorisation)

Ties the product (`subject`) to its authorisation holder (`holder`). In the reference the identifier is explicitly flagged as draft.

```xml
<RegulatedAuthorization>
  <id value="regauth-paxlovid"/>
  <identifier>
    <system value="https://www.hsa.gov.sg/epi/registration-number"/>
    <value value="PAXH-SIN-0126 (draft — HSA to confirm)"/>
  </identifier>
  <subject><reference value="MedicinalProductDefinition/mpd-paxlovid"/></subject>
  <status><coding><system value="http://hl7.org/fhir/publication-status"/>
    <code value="active"/></coding></status>
  <holder><reference value="Organization/org-owner"/></holder>
</RegulatedAuthorization>
```

### Step 4 — `SubstanceDefinition` (each substance)

One per distinct substance you need to name with a controlled code — the two actives (and, in the reference, lactose as a notable excipient). Uses FDA UNII codes.

```xml
<SubstanceDefinition>
  <id value="subd-nirmatrelvir"/>
  <code><code><coding><system value="http://fdasis.nlm.nih.gov"/>
    <code value="7R9A5P7H32"/><display value="Nirmatrelvir"/></coding></code></code>
  <name><name value="Nirmatrelvir"/></name>
</SubstanceDefinition>
```

Repeat for `subd-ritonavir` (UNII `O3J8G9O825`) and any substance you want a coded identity for.

### Step 5 — `Ingredient` (actives with strength + excipients)

Each `Ingredient` links a substance into the product (`for` → MPD), states its `role` (active vs excipient), and — for actives — the **strength** as a presentation ratio (amount per unit).

```xml
<Ingredient>
  <id value="ingr-nirmatrelvir"/>
  <status value="active"/>
  <for><reference value="MedicinalProductDefinition/mpd-paxlovid"/></for>
  <role><coding><system value="http://hl7.org/fhir/ingredient-role"/>
    <code value="active"/></coding></role>
  <substance>
    <code><concept><coding><system value="https://www.hsa.gov.sg/epi/substance"/>
      <code value="subd-nirmatrelvir"/><display value="Nirmatrelvir"/></coding></concept></code>
    <strength>
      <presentationRatio>
        <numerator><value value="150"/><unit value="mg"/>
          <system value="http://unitsofmeasure.org"/><code value="mg"/></numerator>
        <denominator><value value="1"/><unit value="film-coated tablet"/>
          <system value="https://standardterms.edqm.eu"/><code value="10221000"/></denominator>
      </presentationRatio>
    </strength>
  </substance>
</Ingredient>
```

**Excipients** follow the same pattern with `role = excipient` and usually no strength (e.g. `ingr-exc-lactose-monohydrate`, `ingr-exc-titanium-dioxide-e171`). The reference has 2 actives + 20 excipients = 22 Ingredients. Excipients are grouped per tablet and referenced from SmPC **section 6.1** (List of excipients).

### Step 6 — `ManufacturedItemDefinition` (each physical tablet)

Describes each manufactured tablet's **physical appearance** — colour, shape, size, imprint — using the ePI IG property codes. PAXLOVID is a co-pack, so there are two (nirmatrelvir tablet + ritonavir tablet).

```xml
<ManufacturedItemDefinition>
  <id value="mid-nirmatrelvir"/>
  <status value="active"/>
  <name value="Nirmatrelvir 150 mg film-coated tablet"/>
  <manufacturedDoseForm>
    <coding><system value="https://standardterms.edqm.eu"/>
      <code value="10221000"/><display value="Film-coated tablet"/></coding>
  </manufacturedDoseForm>
  <property>
    <type><coding><system value="http://hl7.org/fhir/uv/emedicinal-product-info/CodeSystem/epi-ig"/>
      <code value="color"/><display value="Color"/></coding></type>
    <valueCodeableConcept><text value="Pink"/></valueCodeableConcept>
  </property>
  <property>
    <type><coding><code value="shape"/><display value="Shape"/></coding></type>
    <valueCodeableConcept><text value="Oval"/></valueCodeableConcept>
  </property>
  <property>
    <type><coding><code value="size"/><display value="Size"/></coding></type>
    <valueMarkdown value="Approximately 17.6 mm in length and 8.6 mm in width"/>
  </property>
  <property>
    <type><coding><code value="imprint"/><display value="Imprint"/></coding></type>
    <valueMarkdown value="Debossed with ‘PFE’ on one side and ‘3CL’ on the other side"/>
  </property>
</ManufacturedItemDefinition>
```

### Step 7 — `AdministrableProductDefinition` (form as administered + route)

The product as the patient takes it — the administrable dose form, a consolidated physical description, and the route of administration.

```xml
<AdministrableProductDefinition>
  <id value="apd-paxlovid"/>
  <status value="active"/>
  <administrableDoseForm>
    <coding><system value="https://standardterms.edqm.eu"/>
      <code value="10221000"/><display value="Film-coated tablet"/></coding>
  </administrableDoseForm>
  <!-- color / shape / size / imprint properties consolidated across both tablets -->
  <routeOfAdministration>
    <code><coding><system value="https://standardterms.edqm.eu"/>
      <code value="20053000"/><display value="Oral use"/></coding></code>
  </routeOfAdministration>
</AdministrableProductDefinition>
```

### Step 8 — `PackagedProductDefinition` (the pack)

The marketed pack. Referenced from SmPC **section 6.5** (Nature and contents of container).

```xml
<PackagedProductDefinition>
  <id value="ppd-paxlovid"/>
  <name value="PAXLOVID film-coated tablets — daily-dose co-pack (nirmatrelvir + ritonavir)"/>
  <packaging>
    <quantity value="30"/>
    <type><coding><system value="https://standardterms.edqm.eu"/>
      <code value="30007000"/><display value="Carton"/></coding></type>
  </packaging>
</PackagedProductDefinition>
```

### Step 9 — `ClinicalUseDefinition` (the clinical particulars)

This is the heart of a Type-4 ePI and the largest group (118 in the reference). **One resource per clinical fact.** All share `subject` → MPD and a `type`, but each `type` uses a different backbone element. The five flavours:

**9a. Indication** (`type = indication`) — SmPC 4.1

```xml
<ClinicalUseDefinition>
  <id value="cud-ind-1"/>
  <type value="indication"/>
  <subject><reference value="MedicinalProductDefinition/mpd-paxlovid"/></subject>
  <indication>
    <diseaseSymptomProcedure><concept>
      <coding><system value="http://snomed.info/sct"/><code value="840539006"/>
        <display value="Disease caused by SARS-CoV-2"/></coding>
      <text value="Mild-to-moderate COVID-19 in adults at high risk for progression to severe COVID-19"/>
    </concept></diseaseSymptomProcedure>
  </indication>
</ClinicalUseDefinition>
```

**9b. Contraindication** (`type = contraindication`) — SmPC 4.3. One per contraindicated condition/drug (the reference has hypersensitivity + 40 contraindicated co-medications, `cud-contra-01…40`).

```xml
<ClinicalUseDefinition>
  <id value="cud-contra-hypersensitivity"/>
  <type value="contraindication"/>
  <subject><reference value="MedicinalProductDefinition/mpd-paxlovid"/></subject>
  <contraindication>
    <diseaseSymptomProcedure><concept>
      <coding><system value="http://snomed.info/sct"/><code value="473011001"/>
        <display value="Allergic condition"/></coding>
      <text value="Hypersensitivity to the active substances (nirmatrelvir/ritonavir) or excipients"/>
    </concept></diseaseSymptomProcedure>
  </contraindication>
</ClinicalUseDefinition>
```

**9c. Interaction** (`type = interaction`) — SmPC 4.5. One per interacting agent (or group of agents). Captures the interactant, the `effect`, and the `management`.

```xml
<ClinicalUseDefinition>
  <id value="cud-int-01-alfuzosin"/>
  <type value="interaction"/>
  <subject><reference value="MedicinalProductDefinition/mpd-paxlovid"/></subject>
  <interaction>
    <interactant><itemCodeableConcept>
      <coding><system value="https://www.hsa.gov.sg/epi/draft-substance"/>
        <code value="alfuzosin"/><display value="alfuzosin"/></coding>
      <text value="Alpha 1-adrenoreceptor antagonist: alfuzosin"/>
    </itemCodeableConcept></interactant>
    <type><coding><system value="http://hl7.org/fhir/CodeSystem/clinical-use-definition-type"/>
      <code value="interaction"/></coding></type>
    <effect><concept><text value="↑ alfuzosin"/></concept></effect>
    <management><text value="Co-administration contraindicated due to potential hypotension (see section 4.3)."/></management>
  </interaction>
</ClinicalUseDefinition>
```
A single resource can cover several agents in one class (e.g. `cud-int-04` groups "amiodarone, dronedarone, flecainide, propafenone, quinidine").

**9d. Warning** (`type = warning`) — SmPC 4.4.

```xml
<ClinicalUseDefinition>
  <id value="cud-warn-hepatotoxicity"/>
  <type value="warning"/>
  <subject><reference value="MedicinalProductDefinition/mpd-paxlovid"/></subject>
  <warning><description value="Hepatotoxicity; caution in pre-existing liver disease"/></warning>
</ClinicalUseDefinition>
```

**9e. Undesirable effect** (`type = undesirable-effect`) — SmPC 4.8. One per adverse reaction, each classified by System Organ Class and frequency.

```xml
<ClinicalUseDefinition>
  <id value="cud-ae-01-hypersensitivity"/>
  <type value="undesirable-effect"/>
  <subject><reference value="MedicinalProductDefinition/mpd-paxlovid"/></subject>
  <undesirableEffect>
    <symptomConditionEffect><concept><text value="Hypersensitivity"/></concept></symptomConditionEffect>
    <classification><coding><system value="https://www.hsa.gov.sg/epi/soc"/>
      <display value="Immune system disorders"/></coding></classification>
    <frequencyOfOccurrence><coding><system value="https://www.hsa.gov.sg/epi/adr-frequency"/>
      <code value="uncommon"/><display value="Uncommon ≥1/1,000 to <1/100"/></coding></frequencyOfOccurrence>
  </undesirableEffect>
</ClinicalUseDefinition>
```

> **Granularity rule of thumb:** create one `ClinicalUseDefinition` per atomic clinical statement. That is what makes the ePI computable (each fact can be queried, alerted on, and reused independently).

### Step 10 — `MedicationKnowledge` (the Dose Structure)

Machine-readable dosing — the defining feature of Type 4. It groups dosing into `indicationGuideline` → `dosingGuideline`s, each with a `treatmentIntent`, per-component `dosage`, and a `patientCharacteristic` that scopes the guideline (here: eGFR bands, so a system can pick the right dose for a patient's renal function).

```xml
<MedicationKnowledge>
  <id value="mk-paxlovid"/>
  <code><coding><system value="http://www.whocc.no/atc"/>
    <code value="J05AE30"/><display value="nirmatrelvir and ritonavir"/></coding></code>
  <status value="active"/>
  <indicationGuideline>
    <indication><concept><text value="Treatment of mild-to-moderate COVID-19 in adults at high risk…"/></concept></indication>

    <dosingGuideline>
      <treatmentIntent><text value="Standard dose (normal to mild renal impairment)"/></treatmentIntent>
      <dosage>
        <type><text value="Nirmatrelvir"/></type>
        <dosage>
          <text value="Nirmatrelvir 300 mg (two 150 mg tablets) orally every 12 hours for 5 days"/>
          <timing><repeat><frequency value="1"/><period value="12"/><periodUnit value="h"/></repeat></timing>
          <route><coding><system value="https://standardterms.edqm.eu"/>
            <code value="20053000"/><display value="Oral use"/></coding></route>
          <doseAndRate><doseQuantity><value value="300"/><unit value="mg"/>
            <system value="http://unitsofmeasure.org"/><code value="mg"/></doseQuantity></doseAndRate>
        </dosage>
      </dosage>
      <!-- second <dosage> block for Ritonavir 100 mg … -->
      <patientCharacteristic>
        <type><coding><system value="http://loinc.org"/><code value="62238-1"/>
          <display value="Glomerular filtration rate/1.73 sq M.predicted"/></coding></type>
        <valueRange><low><value value="60"/><unit value="mL/min/1.73m2"/>
          <system value="http://unitsofmeasure.org"/><code value="mL/min/{1.73_m2}"/></low></valueRange>
      </patientCharacteristic>
    </dosingGuideline>

    <!-- further dosingGuidelines: eGFR 30–<60 (reduced dose); eGFR <30 (not recommended) -->
  </indicationGuideline>
  <intendedRoute><coding><system value="https://standardterms.edqm.eu"/>
    <code value="20053000"/><display value="Oral use"/></coding></intendedRoute>
</MedicationKnowledge>
```

### Step 11 — `Composition` (assemble the SmPC spine)

Now wire everything together. The Composition carries document-level metadata and a **nested tree of `section`s** mirroring the SmPC (sections 1–7). Each `section` has: a `title`, a `code` (HSA `section-code`), a `text` narrative (`xhtml`), and — where structured data exists — one or more `entry` references to the resources you built above.

**Document header:**

```xml
<Composition>
  <id value="comp-paxlovid-smpc"/>
  <!-- contained Binary images (figures embedded in the narrative) -->
  <contained><Binary><id value="binary-image1"/><contentType value="image/png"/>
    <data value="…base64…"/></Binary></contained>
  <identifier><system value="https://www.hsa.gov.sg/epi/document-id"/>
    <value value="PAXH-SIN-0126/0"/></identifier>
  <status value="final"/>
  <type><coding><system value="https://www.hsa.gov.sg/epi/document-type"/>
    <code value="smpc"/><display value="Summary of Product Characteristics"/></coding></type>
  <date value="2026-01-14"/>
  <author><reference value="Organization/org-owner"/><display value="Pfizer Inc."/></author>
  <title value="PAXLOVID Film-Coated Tablets — Summary of Product Characteristics"/>
  <language value="en"/>
  <subject><reference value="MedicinalProductDefinition/mpd-paxlovid"/>
    <display value="PAXLOVID film-coated tablets"/></subject>
  <section> … the SmPC section tree … </section>
</Composition>
```

**Section skeleton and the entry-wiring map** — this is the SmPC structure the reference follows, and which resources each section links to:

| SmPC section | Sub-sections | `entry` references (structured data) |
|---|---|---|
| **1.** Name of the medicinal product | — | `MedicinalProductDefinition/mpd-paxlovid` |
| **2.** Qualitative and quantitative composition | — | active `Ingredient`s (nirmatrelvir, ritonavir) |
| **3.** Pharmaceutical form | 3.1, 3.2 per tablet | (narrative; MID describes appearance) |
| **4.** Clinical particulars | 4.1–4.9 | see below |
| 4.1 Therapeutic indications | — | `cud-ind-1` |
| 4.2 Posology & method of administration | 4.2.1–4.2.4 | (narrative; dosing in MedicationKnowledge) |
| 4.3 Contraindications | 4.3.1–4.3.41 | `cud-contra-hypersensitivity`, `cud-contra-01…40` |
| 4.4 Special warnings & precautions | 4.4.1–4.4.4 | (warnings as `cud-warn-*`) |
| 4.5 Interactions | — | `cud-int-01…58` |
| 4.6 Fertility, pregnancy, lactation | 4.6.1–4.6.4 | (narrative) |
| 4.7 Effects on ability to drive | — | (narrative) |
| 4.8 Undesirable effects | 4.8.1–4.8.2 | `cud-ae-01…14` |
| 4.9 Overdose | — | (narrative) |
| **5.** Pharmacological properties | 5.1–5.3 (+ many leaves) | (narrative) |
| **6.** Pharmaceutical particulars | 6.1–6.6 | 6.1 → excipient `Ingredient`s; 6.5 → `PackagedProductDefinition/ppd-paxlovid` |
| **7.** Product owner | — | `Organization/org-owner` |

**Example — one leaf section with narrative + entry:**

```xml
<section>
  <title value="4.1. Therapeutic indications"/>
  <code><coding><system value="https://www.hsa.gov.sg/epi/section-code"/>
    <code value="4.1"/><display value="4.1. Therapeutic indications"/></coding></code>
  <text><status value="generated"/>
    <div xmlns="http://www.w3.org/1999/xhtml"><p>PAXLOVID is indicated for the treatment of …</p></div>
  </text>
  <entry><reference value="ClinicalUseDefinition/cud-ind-1"/></entry>
</section>
```

**Rules for the Composition:**
- The **top section** wraps the whole SmPC; sections nest to mirror the numbering (4 → 4.3 → 4.3.2).
- Every section needs a `text.status` + `xhtml` `div` (even brief), because a FHIR document must be human-readable on its own.
- Add an `entry` only where a structured resource backs that section. Narrative-only sections (e.g. 4.7) need no entry.
- Figures are embedded as `contained` `Binary` (base64 PNG) and referenced from the narrative.

### Step 12 — Wrap in the `Bundle` (document)

Finally, assemble the document Bundle. **The Composition must be the first entry**; the order of the remaining entries is not semantically significant but the reference groups them logically (owner → product → substances → ingredients → items → packaging → clinical use → medication knowledge).

```xml
<Bundle xmlns="http://hl7.org/fhir">
  <id value="paxlovid-sgp-smpc-epi"/>
  <identifier>
    <system value="https://www.hsa.gov.sg/epi/document-id"/>
    <value value="PAXH-SIN-0126/0"/>
  </identifier>
  <type value="document"/>
  <timestamp value="2026-07-01T11:21:25Z"/>
  <entry>
    <fullUrl value="https://www.hsa.gov.sg/epi/Composition/comp-paxlovid-smpc"/>
    <resource><Composition> … </Composition></resource>
  </entry>
  <entry>
    <fullUrl value="https://www.hsa.gov.sg/epi/Organization/org-owner"/>
    <resource><Organization> … </Organization></resource>
  </entry>
  <!-- … one <entry> per resource, in build order … -->
</Bundle>
```

**`fullUrl` convention:** `https://www.hsa.gov.sg/epi/{ResourceType}/{id}`. Internal `reference` values use the relative `{ResourceType}/{id}` form (e.g. `Organization/org-owner`), which resolves against the entries' `fullUrl`s.

---

## 5. Assembly & referencing rules (quick reference)

1. **Document Bundle** — `Bundle.type = document`; **first entry is the Composition**; one Composition only.
2. **Every reference must resolve** — each `reference` (e.g. `Ingredient/ingr-…`) must match an entry `fullUrl` in the same Bundle. Build referenced resources first.
3. **Stable ids** — pick an id scheme and reuse it in `id`, `fullUrl`, and `reference`. Don't rename mid-build.
4. **Bundle identifier & version** — `document-id` uses `…/{registration}/{version}` (here `PAXH-SIN-0126/0`); increment the trailing version for each reissue.
5. **One fact per resource** — especially for `ClinicalUseDefinition`; that granularity is what "Type 4" buys you.
6. **Narrative + structure** — populate both: human-readable `text` in each Composition section **and** the coded `entry` resources.
7. **Terminology discipline** — prefer the international systems in §2.1; use HSA local systems only for locally-governed concepts, and confirm those URLs with HSA.

---

## 6. Validation & submission checklist

- [ ] `Bundle.type = document` and Composition is entry #1.
- [ ] Every `reference` resolves to a `fullUrl` in the Bundle (no dangling references).
- [ ] Each Composition `section` has `title`, `code`, and `text` (with `xhtml` div).
- [ ] Actives have `Ingredient.strength`; excipients have `role = excipient`.
- [ ] Physical appearance (colour/shape/size/imprint) present on each `ManufacturedItemDefinition`.
- [ ] Clinical particulars complete: indication(s), contraindications, interactions, warnings, undesirable effects — each a `ClinicalUseDefinition`.
- [ ] `MedicationKnowledge` dosing guidelines cover all patient bands (e.g. renal function).
- [ ] Codes validate against their systems (EDQM, SNOMED CT, UNII, ATC, LOINC, UCUM, ISO 3166).
- [ ] HSA local ids (registration number, document id) confirmed with HSA.
- [ ] Runs clean through the HL7 FHIR R5 validator (and, ideally, the Vulcan ePI IG profiles — see §7).

---

## 7. How to adapt this for your product (the reusable recipe)

1. **Swap the product identity** — replace `Organization`, `MedicinalProductDefinition`, `RegulatedAuthorization` with your company, product, and HSA registration.
2. **List your substances & ingredients** — one `SubstanceDefinition` per coded substance (use UNII); one `Ingredient` per active (with strength) and per excipient.
3. **Describe your dosage forms & pack** — `ManufacturedItemDefinition` per physical unit, one `AdministrableProductDefinition`, one `PackagedProductDefinition` per pack.
4. **Encode your clinical particulars** — one `ClinicalUseDefinition` per indication / contraindication / interaction / warning / adverse reaction. This is the bulk of the work; be exhaustive and atomic.
5. **Structure your dosing** — one `MedicationKnowledge` with dosing guidelines scoped by patient characteristics.
6. **Author the SmPC spine** — reuse the section 1–7 skeleton in §4 (Step 11); write the narrative and attach `entry` references where you have structured data.
7. **Wrap & validate** — assemble the document Bundle (Composition first) and run the checklist in §6.

### Recommended enhancement — bind to the Vulcan ePI profiles

The reference instance does **not** tag resources with `meta.profile`. For formal conformance and better validation, consider adding the Vulcan Global Core ePI profile canonical URLs to each resource's `meta.profile` (see the [Artifacts page](../input/pagecontent/epiElements.md) and <https://hl7.org/fhir/uv/emedicinal-product-info/>). Confirm the expected profile set with HSA for the pilot.

---

*This blueprint documents the structure of the PAXLOVID SmPC reference instance for the HSA ePI pilot. Content values shown are illustrative; regulatory identifiers and HSA code systems must be confirmed with HSA before production use.*
