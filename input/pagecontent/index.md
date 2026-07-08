<style>
  .epi-page *, .epi-page *::before, .epi-page *::after { box-sizing:border-box; }
  .epi-page { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; color:#111827; }
  .epi-page .hero { text-align:center; padding:44px 20px 34px; border-bottom:1px solid #e5e7eb; margin-bottom:36px; }
  .epi-page .hero .eyebrow { font-size:.72em; font-weight:700; text-transform:uppercase; letter-spacing:.2em; color:#003087; margin-bottom:14px; }
  .epi-page .hero h1 { font-size:2.2em; font-weight:800; color:#111827; margin:0 0 14px; line-height:1.15; }
  .epi-page .hero h1 span { background:linear-gradient(135deg,#003087,#2563eb); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .epi-page .hero p { font-size:1em; color:#6b7280; max-width:640px; margin:0 auto; line-height:1.65; }
  .epi-page .section-title { font-size:1.15em; font-weight:700; color:#111827; margin:38px 0 16px; display:flex; align-items:center; gap:8px; }
  .epi-page .section-title::after { content:''; flex:1; height:1px; background:#e5e7eb; margin-left:8px; }
  .epi-page p { line-height:1.75; color:#374151; margin:0 0 14px; }
  .epi-page .lead { font-size:1.02em; color:#4b5563; }
  .epi-page .card-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:14px; margin-bottom:28px; }
  .epi-page .card { background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; padding:22px; }
  .epi-page .card .icon { font-size:1.4em; margin-bottom:10px; }
  .epi-page .card .ctitle { font-weight:700; color:#003087; margin-bottom:8px; font-size:.98em; }
  .epi-page .card p { font-size:.88em; color:#4b5563; line-height:1.6; margin:0 0 8px; }
  .epi-page .card ul { margin:0; padding-left:18px; }
  .epi-page .card li { font-size:.88em; color:#4b5563; line-height:1.55; margin-bottom:4px; }
  .epi-page .scope-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:28px; }
  .epi-page .scope-card { border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; background:#fff; }
  .epi-page .scope-card .sc-head { padding:12px 18px; font-weight:700; font-size:.9em; display:flex; align-items:center; gap:8px; }
  .epi-page .scope-card.in .sc-head { background:#f0fff4; color:#1a7f37; border-bottom:1px solid #bbf7d0; }
  .epi-page .scope-card.out .sc-head { background:#fff1f0; color:#cf222e; border-bottom:1px solid #fecaca; }
  .epi-page .scope-card .sc-body { padding:16px 18px; font-size:.88em; color:#4b5563; line-height:1.65; }
  .epi-page .resource-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin:12px 0 0; list-style:none; padding:0; }
  .epi-page .resource-grid li { background:#f0f4ff; border:1px solid #bfdbfe; border-radius:6px; padding:7px 10px; font-size:.8em; color:#1d4ed8; font-weight:600; }
  .epi-page .alert { border-radius:8px; padding:14px 18px; margin:0 0 20px; font-size:.9em; line-height:1.65; }
  .epi-page .alert .alabel { font-weight:800; text-transform:uppercase; font-size:.72em; letter-spacing:.1em; display:block; margin-bottom:5px; }
  .epi-page .alert-note { background:#eff6ff; border:1px solid #bfdbfe; border-left:4px solid #2563eb; color:#1e40af; }
  @media (max-width:700px){ .epi-page .scope-grid, .epi-page .resource-grid { grid-template-columns:1fr; } }
</style>

<div class="epi-page">

  <div class="hero">
    <div class="eyebrow">HL7 FHIR · APAC Regional ePI</div>
    <h1>A common standard for <span>electronic medicinal product information</span></h1>
    <p>Defining how electronic Product Information (ePI) is exchanged across Asia Pacific (APAC) countries — giving patients and healthcare professionals trustworthy, up-to-date, structured medicinal product information.</p>
  </div>

  <div class="section-title">Purpose</div>
  <p class="lead">To define a common standard for exchanging electronic medicinal product information (ePI) in Asia Pacific (APAC) countries.</p>
  <p>ePI supports the following:</p>
  <ul>
    <li>Common and/or national metadata resources</li>
    <li>Common and/or national terminologies and code systems</li>
    <li>National languages</li>
    <li>National HCP templates (if available)</li>
    <li>National PIL templates (if available)</li>
    <li>ASEAN SmPC template (optional)</li>
    <li>ASEAN PIL template (optional)</li>
  </ul>

  <div class="section-title">Goals</div>
  <div class="card-grid">
    <div class="card">
      <div class="icon">🎯</div>
      <div class="ctitle">Immediate goal</div>
      <p>Expose ePI consumers and the vendor community to a set of profiles that identify the data elements, code systems and value sets commonly used in ePIs regardless of the jurisdiction.</p>
    </div>
    <div class="card">
      <div class="icon">🧭</div>
      <div class="ctitle">Strategic goal</div>
      <p>Offer a better route for patients to access trustworthy, up-to-date medicinal product information that better meets their individual needs.</p>
    </div>
  </div>

  <div class="section-title">Scope</div>
  <div class="scope-grid">
    <div class="scope-card in">
      <div class="sc-head">✅ In Scope</div>
      <div class="sc-body">
        Countries in the APAC region. ePI (information for healthcare practitioner, information for the patient, package label). Human pharmaceutical, radiopharmaceutical and biologic medicinal products (prescription and physician-administered).
      </div>
    </div>
    <div class="scope-card out">
      <div class="sc-head">🚫 Out of Scope</div>
      <div class="sc-body">
        Over the counter (non-prescription) drugs, Investigational and authorized medicinal products, Medical devices co-packed with a biopharmaceutical product (e.g., pre-filled syringe), natural health products, medical devices, food and veterinary drugs.
      </div>
    </div>
  </div>

  <div class="card" style="background:#fff;">
    <div class="ctitle">HL7 FHIR resources</div>
    <ul class="resource-grid">
      <li>List</li>
      <li>Manufactured Item Definition</li>
      <li>Bundle</li>
      <li>Administrable Product Definition</li>
      <li>Composition</li>
      <li>Ingredient</li>
      <li>Binary</li>
      <li>Substance Definition</li>
      <li>Organization</li>
      <li>Packaged Product Definition</li>
      <li>Regulated Authorization</li>
      <li>Clinical Use Definition</li>
      <li>Medicinal Product Definition</li>
      <li>Medication Statement</li>
    </ul>
  </div>

  <div class="section-title">Background</div>
  <p>In recent years, e-labeling has been introduced in many countries around the world, including the APAC countries. As of November 2024, 3 APAC countries - Singapore, Malaysia, and Thailand - have issued official e-labeling guidance, while Indonesia initiated a nation-wide e-labeling pilot in June 2023. Current e-labeling initiatives in APAC focus on publishing electronic labels in PDF format online, integrating machine-readable codes on packaging for accessibility, and phasing out paper labels. This transition has demonstrated significant benefits, providing patients and healthcare professionals with timely, accessible product information, while also promoting resource efficiency and environmental sustainability by reducing paper usage.</p>

  <p>However, to fully leverage e-labeling’s potential, integrate it with other healthcare systems and maximise the benefits for patients’ health, there is a need to transition from the conventional PDF format of e-label to a structured-content format complying with international standards. HL7 FHIR is a widely used standard in APAC healthcare systems, making it an ideal choice to adopt for structured e-label. Internationally, the EMA and Jordan have issued regulations to transition to FHIR-based electronic product information (ePI) format, sparking interest among APAC regulators. Notably, Thailand and Malaysia have already initiated conversation on how to move forward in this direction.</p>

  <p>Firstly, an important aspect needed to be considered for the transition from unstructured content to FHIR is the current labeling template in APAC countries. At present, there is no harmonized single regional template that have been adopted for both healthcare professional and patient labels in APAC. Some countries such as Thailand, Malaysia, Indonesia require national template for the patient information leaflet (PIL), though these templates differ across countries (see APPENDIX 1). In terms of the healthcare professional labels, Thailand has started to mandate the APAC template for newly registered products and will also require the template to be used during renewal and labeling variations, while all other countries haven’t enforced a national template. The absence of national and regional template poses a challenge in transitioning towards FHIR standard, as an established template would facilitate semi-automated conversion, simplify the development of FHIR authoring tool as well as provide a uniform e-label structure.</p>

  <p>The APAC template for both healthcare professional labeling and patient labeling was agreed upon among APAC countries in 2003; however, it has not been officially adopted by most countries (except for Thailand) (see APPENDIX 2). Utilising this template in each country as part of the FHIR transition - beginning with products for which paper labels have been eliminated – would facilitate the establishing of FHIR ePI structure and transition in each country as well as avoiding supply challenge for products still using paper labels. A common format would also allow APAC countries to exchange experience, technical expertise and accelerate the FHIR adoption process, bringing along the benefits to patients through FHIR application use cases at the earliest.</p>

  <p>Another critical aspect to consider in the transition to FHIR-based e-PI is the establishment of controlled terminology within each country. Controlled terminology refers to standardized vocabularies to ensure consistent and accurate representation of data within FHIR. Currently, no APAC country has specific requirements for the use of standard terminology in e-labeling. This poses a challenge for conversion to FHIR e-PI, ensuring consistency and interoperability, particularly as FHIR-based e-labels are integrated with other healthcare systems.</p>

  <p>The specific controlled terminologies required for FHIR ePI implementation vary depending on the type of ePI being adopted (Type 1, 2, or 3). Particularly for type 2 ePI, terminologies for specific elements like dosage form and ingredients need to be standardized (please see section for more details). To address this gap, it is recommended that each APAC country consider to adopt internationally recognized standards, such as ISO IDMP (Identification of Medicinal Products), to establish robust and consistent terminologies. Leveraging such standards will facilitate alignment with global best practices, support automated processes, and enhance the integration of e-labels into digital healthcare ecosystems.</p>

</div>
