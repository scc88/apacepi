<style>
  .epi-page *, .epi-page *::before, .epi-page *::after { box-sizing:border-box; }
  .epi-page { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; color:#111827; }
  .epi-page .hero { text-align:center; padding:40px 20px 30px; border-bottom:1px solid #e5e7eb; margin-bottom:36px; }
  .epi-page .hero .eyebrow { font-size:.72em; font-weight:700; text-transform:uppercase; letter-spacing:.2em; color:#003087; margin-bottom:12px; }
  .epi-page .hero h1 { font-size:2em; font-weight:800; color:#111827; margin:0 0 12px; line-height:1.15; }
  .epi-page .hero h1 span { background:linear-gradient(135deg,#003087,#2563eb); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .epi-page .hero p { font-size:.95em; color:#6b7280; max-width:640px; margin:0 auto 20px; line-height:1.6; }
  .epi-page .hero a.btn { display:inline-block; background:#003087; color:#fff; padding:12px 26px; border-radius:8px; font-weight:700; font-size:.95em; text-decoration:none; }
  .epi-page .section-title { font-size:1.15em; font-weight:700; color:#111827; margin:38px 0 16px; display:flex; align-items:center; gap:8px; }
  .epi-page .section-title::after { content:''; flex:1; height:1px; background:#e5e7eb; margin-left:8px; }
  .epi-page p { line-height:1.7; color:#374151; margin:0 0 14px; }
  .epi-page .lead { font-size:1.02em; color:#4b5563; }
  .epi-page a { color:#2563eb; }
  .epi-page .facts { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:12px; margin-bottom:28px; }
  .epi-page .fact { background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; padding:16px 18px; }
  .epi-page .fact .fl { font-size:.7em; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:#6b7280; margin-bottom:6px; }
  .epi-page .fact .fv { font-size:.95em; font-weight:700; color:#111827; }
  .epi-page .card-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:14px; margin-bottom:28px; }
  .epi-page .card { background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; padding:20px; }
  .epi-page .card .icon { font-size:1.4em; margin-bottom:10px; }
  .epi-page .card .ctitle { font-weight:700; color:#003087; margin-bottom:6px; font-size:.95em; }
  .epi-page .card p { font-size:.86em; color:#4b5563; line-height:1.6; margin:0; }
  .epi-page .alert { border-radius:8px; padding:14px 18px; margin:0 0 20px; font-size:.9em; line-height:1.65; }
  .epi-page .alert .alabel { font-weight:800; text-transform:uppercase; font-size:.72em; letter-spacing:.1em; display:block; margin-bottom:5px; }
  .epi-page .alert-note { background:#eff6ff; border:1px solid #bfdbfe; border-left:4px solid #2563eb; color:#1e40af; }
  .epi-page .alert-important { background:#fff8c5; border:1px solid #fde68a; border-left:4px solid #f59e0b; color:#78350f; }
  .epi-page .steps { counter-reset:step; margin-bottom:20px; }
  .epi-page .step { display:flex; gap:14px; padding:14px 0; border-bottom:1px solid #f3f4f6; }
  .epi-page .step:last-child { border-bottom:none; }
  .epi-page .step .num { counter-increment:step; flex-shrink:0; width:28px; height:28px; border-radius:50%; background:#003087; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:.85em; }
  .epi-page .step .num::before { content:counter(step); }
  .epi-page .step .sbody .st { font-weight:700; color:#111827; font-size:.92em; margin-bottom:3px; }
  .epi-page .step .sbody p { font-size:.86em; color:#4b5563; margin:0; }
  .epi-page .link-row { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:22px; }
  .epi-page .link-row a { font-size:.84em; font-weight:600; color:#1d4ed8; text-decoration:none; padding:8px 14px; border-radius:6px; background:#eff6ff; border:1px solid #bfdbfe; }
  .epi-page .link-row a.gh { background:#111827; color:#fff; border-color:#111827; }
  .epi-page .placeholder { border:1px dashed #cbd5e1; background:#f8fafc; border-radius:10px; padding:20px 22px; margin-bottom:24px; }
  .epi-page .placeholder .ph-tag { display:inline-block; font-size:.68em; font-weight:800; text-transform:uppercase; letter-spacing:.1em; color:#9a6700; background:#fff8c5; border:1px solid #fde68a; border-radius:99px; padding:3px 10px; margin-bottom:10px; }
  .epi-page .placeholder p { color:#64748b; margin:0; font-size:.9em; line-height:1.65; }
</style>

<div class="epi-page" markdown="1">

<div class="hero">
  <div class="eyebrow">Singapore · Health Sciences Authority</div>
  <h1>SG ePI <span>Pilot</span></h1>
  <p>Singapore's pilot to move Product Information from static PDF labels to structured HL7 FHIR ePI, built on the Vulcan Global Core ePI standard as adopted for the APAC region.</p>
  <a class="btn" href="buildguide.html">Open the ePI Build Guide →</a>
</div>

<div class="alert alert-important" markdown="1">
<span class="alabel">⚠️ Draft pilot</span>
This pilot and its reference materials are illustrative and under active development. Identifiers, local code-system URLs, and registration numbers used in the reference instance are <b>placeholders to be confirmed with HSA</b> and must not be treated as approved values.
</div>

<div class="section-title">At a glance</div>
<div class="facts">
  <div class="fact"><div class="fl">Regulator</div><div class="fv">HSA Singapore</div></div>
  <div class="fact"><div class="fl">Standard</div><div class="fv">HL7 FHIR ePI (Vulcan Global Core)</div></div>
  <div class="fact"><div class="fl">FHIR release</div><div class="fv">R5</div></div>
  <div class="fact"><div class="fl">Reference product</div><div class="fv">PAXLOVID SmPC</div></div>
</div>

<div class="section-title">What this pilot is</div>
<p class="lead">The SG ePI Pilot demonstrates how a Summary of Product Characteristics (SmPC) can be authored as a structured FHIR document rather than a static PDF — using the same regional profiles, terminologies, and best practices defined throughout this Implementation Guide.</p>
<p>A single, centrally-managed Medicinal Product Information data set can then be rendered into locally-compliant, patient-friendly digital leaflets, kept up to date, and integrated with downstream healthcare systems. The pilot uses the PAXLOVID SmPC as a complete, end-to-end worked example.</p>

<div class="section-title">Goals</div>
<div class="card-grid">
  <div class="card">
    <div class="icon">🏗️</div>
    <div class="ctitle">Prove the build</div>
    <p>Establish a repeatable, resource-by-resource recipe that companies can follow to construct compliant ePI FHIR documents for their own products.</p>
  </div>
  <div class="card">
    <div class="icon">🌏</div>
    <div class="ctitle">Regional alignment</div>
    <p>Adopt the Vulcan Global Core ePI as the shared baseline so Singapore's approach stays interoperable with the wider APAC region.</p>
  </div>
  <div class="card">
    <div class="icon">🧪</div>
    <div class="ctitle">Validate end-to-end</div>
    <p>Exercise the full pipeline — authoring, structured data, terminology binding, and rendering — against a real, complete product label.</p>
  </div>
</div>

<div class="section-title">How to take part</div>
<div class="steps">
  <div class="step"><div class="num"></div><div class="sbody"><div class="st">Read the reference instance</div><p>Review the worked <a href="Bundle-paxlovid-sgp-smpc-epi.html">PAXLOVID Singapore SmPC Bundle</a> — the golden-standard ePI document for the pilot.</p></div></div>
  <div class="step"><div class="num"></div><div class="sbody"><div class="st">Follow the Build Guide</div><p>The <a href="buildguide.html">ePI Build Guide (SG)</a> explains, resource by resource and in build order, how the reference document was constructed and what you change for your own product.</p></div></div>
  <div class="step"><div class="num"></div><div class="sbody"><div class="st">Apply terminology &amp; best practice</div><p>Bind elements to the <a href="terminology.html">preferred controlled terminologies</a> and structure narrative per the guide's technical best practices.</p></div></div>
</div>

<div class="section-title" id="reference">Reference instances &amp; source</div>
<p>The pilot's golden-standard ePIs are two PAXLOVID Singapore document Bundles built from the <b>same product data</b> — the healthcare-professional <b>SmPC</b> and the <b>patient leaflet (PIL)</b>. Only the Bundle and Composition differ between them; all product, ingredient and clinical resources are shared. Browse each rendered resource, or view and download the raw FHIR source from GitHub.</p>
<p style="font-size:.82em;font-weight:700;color:#003087;margin:0 0 6px;">SmPC — for healthcare professionals</p>
<div class="link-row">
  <a href="Bundle-paxlovid-sgp-smpc-epi.html">📄 Rendered Bundle</a>
  <a class="gh" href="https://github.com/scc88/aseanepi/blob/main/input/instances/Bundle-epi-paxlovid-sgp-smpc.xml">↗ Source XML on GitHub</a>
  <a href="https://raw.githubusercontent.com/scc88/aseanepi/main/input/instances/Bundle-epi-paxlovid-sgp-smpc.xml">⬇ Raw XML</a>
</div>
<p style="font-size:.82em;font-weight:700;color:#003087;margin:0 0 6px;">PIL — for patients</p>
<div class="link-row">
  <a href="Bundle-paxlovid-sgp-pil-epi.html">📄 Rendered Bundle</a>
  <a class="gh" href="https://github.com/scc88/aseanepi/blob/main/input/instances/Bundle-epi-paxlovid-sgp-pil.xml">↗ Source XML on GitHub</a>
  <a href="https://raw.githubusercontent.com/scc88/aseanepi/main/input/instances/Bundle-epi-paxlovid-sgp-pil.xml">⬇ Raw XML</a>
</div>

<div class="section-title" id="showcase">Singapore ePI showcase</div>
<p>See the pilot's structured PAXLOVID data rendered as interactive Singapore ePIs — the same source data presented for two audiences.</p>
<div class="link-row">
  <a href="Bundle-paxlovid-sgp-smpc-epi.html">📱 Paxlovid — SmPC (healthcare professional)</a>
  <a href="Bundle-paxlovid-sgp-pil-epi.html">📱 Paxlovid — PIL (patient leaflet)</a>
</div>

<div class="section-title" id="concepts">Concept mockups — dynamic ePI</div>
<p>Because the ePI is structured data and no longer a static PDF, the same PAXLOVID dataset can be presented in dynamic, interactive ways tailored to each audience. These are working, self-contained concept mockups built on the pilot data — each opens in a new tab. (Illustrative only; not medical advice.)</p>
<p style="font-size:.82em;font-weight:700;color:#003087;margin:0 0 6px;">For patients</p>
<div class="link-row">
  <a href="examples/mockup-adaptive-leaflet.html" target="_blank" rel="noopener">🧬 Adaptive “My Leaflet”</a>
  <a href="examples/mockup-dose-tracker.html" target="_blank" rel="noopener">📆 Dose companion &amp; 5-day tracker</a>
  <a href="examples/mockup-multilingual.html" target="_blank" rel="noopener">🌏 Four languages &amp; accessible</a>
</div>
<p style="font-size:.82em;font-weight:700;color:#003087;margin:0 0 6px;">For healthcare professionals</p>
<div class="link-row">
  <a href="examples/mockup-interaction-checker.html" target="_blank" rel="noopener">⚕️ Interaction &amp; contraindication checker</a>
  <a href="examples/mockup-renal-calculator.html" target="_blank" rel="noopener">🧮 Renal-dose calculator</a>
  <a href="examples/mockup-cds-alert.html" target="_blank" rel="noopener">🔔 CDS / EMR prescribing alert</a>
</div>
<p style="font-size:.82em;font-weight:700;color:#003087;margin:0 0 6px;">For HSA / regulator</p>
<div class="link-row">
  <a href="examples/mockup-version-diff.html" target="_blank" rel="noopener">🔀 Version diff &amp; change tracking</a>
  <a href="examples/mockup-portfolio-query.html" target="_blank" rel="noopener">🔎 Portfolio surveillance queries</a>
  <a href="examples/mockup-conformance.html" target="_blank" rel="noopener">✅ Conformance dashboard</a>
</div>
<p style="font-size:.82em;font-weight:700;color:#003087;margin:0 0 6px;">ePI authoring &amp; lifecycle</p>
<div class="link-row">
  <a href="examples/mockup-batch-variants.html" target="_blank" rel="noopener">🎨 Batch-specific ePI variants</a>
</div>

<div class="section-title" id="sg-terminology">Singapore-specific terminology</div>
<div class="placeholder">
  <span class="ph-tag">Placeholder · to be confirmed with HSA</span>
  <p>This section will document any Singapore-specific controlled terminology, local code systems, and value-set bindings that apply to HSA ePI submissions — supplementing the regional <a href="terminology.html">preferred terminologies</a>. Content to be added.</p>
</div>

<div class="section-title" id="sg-best-practice">Singapore-specific best practices</div>
<div class="placeholder">
  <span class="ph-tag">Placeholder · to be confirmed with HSA</span>
  <p>This section will capture Singapore-specific authoring conventions, structural rules, and submission requirements for HSA ePI — supplementing the general technical best practices. Content to be added.</p>
</div>

<div class="alert alert-note" markdown="1">
<span class="alabel">Related</span>
Full profiles, value sets, and examples are on the <a href="artifacts.html">Artifacts</a> page. For the step-by-step construction walkthrough, go straight to the <a href="buildguide.html">ePI Build Guide (SG)</a>.
</div>

</div>
