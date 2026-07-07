(function(){
  "use strict";

  // ---- Drug index built from the PAXLOVID Singapore ePI data pack ----
  // tier: crit = contraindicated (do not co-prescribe), warn = caution/monitor, ok = no interaction
  var DRUGS = [
    // ---- CONTRAINDICATED (CRITICAL) ----
    {n:"alfuzosin", use:"enlarged prostate", t:"crit", note:"Contraindicated — raised alfuzosin levels; hypotension risk."},
    {n:"ranolazine", use:"angina", t:"crit", note:"Contraindicated — increased ranolazine exposure."},
    {n:"amiodarone", use:"heart rhythm", t:"crit", note:"Contraindicated — antiarrhythmic; serious arrhythmia risk."},
    {n:"dronedarone", use:"heart rhythm", t:"crit", note:"Contraindicated — antiarrhythmic; serious arrhythmia risk."},
    {n:"flecainide", use:"heart rhythm", t:"crit", note:"Contraindicated — antiarrhythmic; serious arrhythmia risk."},
    {n:"propafenone", use:"heart rhythm", t:"crit", note:"Contraindicated — antiarrhythmic; serious arrhythmia risk."},
    {n:"quinidine", use:"heart rhythm", t:"crit", note:"Contraindicated — antiarrhythmic; serious arrhythmia risk."},
    {n:"colchicine", use:"gout", t:"crit", note:"Contraindicated in renal/hepatic impairment — serious/fatal toxicity."},
    {n:"lurasidone", use:"schizophrenia", t:"crit", note:"Contraindicated — markedly increased exposure."},
    {n:"pimozide", use:"schizophrenia", t:"crit", note:"Contraindicated — QT prolongation / arrhythmia risk."},
    {n:"silodosin", use:"enlarged prostate", t:"crit", note:"Contraindicated — raised levels; hypotension risk."},
    {n:"eplerenone", use:"heart", t:"crit", note:"Contraindicated — hyperkalaemia / hypotension risk."},
    {n:"ivabradine", use:"heart", t:"crit", note:"Contraindicated — increased exposure; bradycardia."},
    {n:"dihydroergotamine", use:"migraine", t:"crit", note:"Contraindicated — ergot toxicity (vasospasm/ischaemia)."},
    {n:"ergotamine", use:"migraine", t:"crit", note:"Contraindicated — ergot toxicity (vasospasm/ischaemia)."},
    {n:"methylergonovine", use:"postpartum bleeding", t:"crit", note:"Contraindicated — ergot toxicity (vasospasm/ischaemia)."},
    {n:"lovastatin", use:"cholesterol", t:"crit", note:"Contraindicated — risk of myopathy / rhabdomyolysis."},
    {n:"simvastatin", use:"cholesterol", t:"crit", note:"Contraindicated — risk of myopathy / rhabdomyolysis."},
    {n:"lomitapide", use:"cholesterol", t:"crit", note:"Contraindicated — markedly increased exposure; hepatotoxicity."},
    {n:"voclosporin", use:"immune / lupus nephritis", t:"crit", note:"Contraindicated — see label section 4.3."},
    {n:"eletriptan", use:"migraine", t:"crit", note:"Contraindicated — increased exposure."},
    {n:"ubrogepant", use:"migraine", t:"crit", note:"Contraindicated — increased exposure."},
    {n:"finerenone", use:"kidney disease", t:"crit", note:"Contraindicated — hyperkalaemia risk."},
    {n:"suzetrigine", use:"acute pain", t:"crit", note:"Contraindicated — see label section 4.3."},
    {n:"naloxegol", use:"opioid constipation", t:"crit", note:"Contraindicated — increased exposure."},
    {n:"sildenafil", use:"pulmonary hypertension (PAH)", t:"crit", note:"Contraindicated for PAH — increased exposure; hypotension/syncope."},
    {n:"triazolam", use:"sleep / anxiety", t:"crit", note:"Contraindicated — prolonged sedation / respiratory depression."},
    {n:"midazolam (oral)", use:"sleep / anxiety", t:"crit", note:"Oral midazolam contraindicated — prolonged sedation / respiratory depression."},
    {n:"flibanserin", use:"low sexual desire (HSDD)", t:"crit", note:"Contraindicated — increased exposure; hypotension/syncope."},
    {n:"tolvaptan", use:"low sodium", t:"crit", note:"Contraindicated — increased exposure."},
    {n:"apalutamide", use:"prostate cancer", t:"crit", note:"Contraindicated — strong CYP3A inducer; loss of PAXLOVID efficacy."},
    {n:"enzalutamide", use:"prostate cancer", t:"crit", note:"Contraindicated — strong CYP3A inducer; loss of PAXLOVID efficacy."},
    {n:"carbamazepine", use:"seizures", t:"crit", note:"Contraindicated — CYP3A inducer; loss of PAXLOVID efficacy."},
    {n:"phenobarbital", use:"seizures", t:"crit", note:"Contraindicated — CYP3A inducer; loss of PAXLOVID efficacy."},
    {n:"primidone", use:"seizures", t:"crit", note:"Contraindicated — CYP3A inducer; loss of PAXLOVID efficacy."},
    {n:"phenytoin", use:"seizures", t:"crit", note:"Contraindicated — CYP3A inducer; loss of PAXLOVID efficacy."},
    {n:"rifampin", use:"bacterial infection / TB", t:"crit", note:"Contraindicated — strong inducer; loss of PAXLOVID efficacy.", alias:["rifampicin"]},
    {n:"rifapentine", use:"bacterial infection / TB", t:"crit", note:"Contraindicated — strong inducer; loss of PAXLOVID efficacy."},
    {n:"lumacaftor/ivacaftor", use:"cystic fibrosis", t:"crit", note:"Contraindicated — CYP3A inducer reduces PAXLOVID efficacy.", alias:["lumacaftor","ivacaftor"]},
    {n:"St John's Wort", use:"herbal — low mood", t:"crit", note:"Contraindicated — herbal inducer; loss of PAXLOVID efficacy.", alias:["st johns wort","hypericum"]},

    // ---- CAUTION / MONITOR (WARNING) ----
    {n:"warfarin", use:"anticoagulant", t:"warn", note:"Monitor INR closely."},
    {n:"rivaroxaban", use:"anticoagulant", t:"warn", note:"Avoid — increased bleeding risk."},
    {n:"dabigatran", use:"anticoagulant", t:"warn", note:"Reduce dose or avoid — bleeding risk."},
    {n:"apixaban", use:"anticoagulant", t:"warn", note:"Dose-dependent — increased bleeding risk."},
    {n:"amlodipine", use:"blood pressure (CCB)", t:"warn", note:"Calcium-channel blocker — may need dose decrease."},
    {n:"diltiazem", use:"blood pressure (CCB)", t:"warn", note:"Calcium-channel blocker — may need dose decrease."},
    {n:"verapamil", use:"blood pressure (CCB)", t:"warn", note:"Calcium-channel blocker — may need dose decrease."},
    {n:"digoxin", use:"heart failure / rhythm", t:"warn", note:"Monitor serum digoxin levels."},
    {n:"atorvastatin", use:"cholesterol", t:"warn", note:"Consider pausing during PAXLOVID course."},
    {n:"rosuvastatin", use:"cholesterol", t:"warn", note:"Consider pausing during PAXLOVID course."},
    {n:"clarithromycin", use:"antibiotic", t:"warn", note:"Dose adjust in renal impairment."},
    {n:"quetiapine", use:"antipsychotic", t:"warn", note:"Reduce dose — increased sedation risk."},
    {n:"clozapine", use:"antipsychotic", t:"warn", note:"Reduce dose / monitor for toxicity."},
    {n:"cyclosporine", use:"immunosuppressant", t:"warn", note:"Avoid or monitor levels — expert consult.", alias:["ciclosporin"]},
    {n:"tacrolimus", use:"immunosuppressant", t:"warn", note:"Avoid or monitor levels — expert consult."},
    {n:"everolimus", use:"immunosuppressant", t:"warn", note:"Avoid or monitor levels — expert consult."},
    {n:"sirolimus", use:"immunosuppressant", t:"warn", note:"Avoid or monitor levels — expert consult."},
    {n:"rifabutin", use:"antibiotic / TB", t:"warn", note:"Reduce rifabutin dose."},
    {n:"bosentan", use:"pulmonary hypertension", t:"warn", note:"Stop bosentan at least 36 h before PAXLOVID."},
    {n:"salmeterol", use:"asthma / COPD inhaler", t:"warn", note:"Avoid — cardiovascular (QT/palpitations) risk."},
    {n:"ethinylestradiol", use:"hormonal contraceptive", t:"warn", note:"Use additional non-hormonal contraception.", alias:["ethinyl estradiol","oral contraceptive","combined pill"]},
    {n:"dexamethasone", use:"corticosteroid", t:"warn", note:"CYP3A steroid — Cushing's/adrenal risk; prefer prednisolone."},
    {n:"fluticasone", use:"steroid inhaler / nasal", t:"warn", note:"CYP3A steroid — Cushing's/adrenal risk; prefer beclomethasone."},

    // ---- NO INTERACTION (OK) ----
    {n:"paracetamol", use:"pain / fever", t:"ok", note:"No interaction identified in this label.", alias:["acetaminophen"]},
    {n:"metformin", use:"type 2 diabetes", t:"ok", note:"No interaction identified in this label."},
    {n:"cetirizine", use:"allergy / antihistamine", t:"ok", note:"No interaction identified in this label."},
    {n:"amoxicillin", use:"antibiotic", t:"ok", note:"No interaction identified in this label."},
    {n:"omeprazole", use:"acid reflux", t:"ok", note:"No interaction identified in this label."},
    {n:"levothyroxine", use:"thyroid", t:"ok", note:"No interaction identified in this label."}
  ];

  var TIER = {crit:{rank:0, label:"Contraindicated"}, warn:{rank:1, label:"Caution"}, ok:{rank:2, label:"No interaction"}};
  var QUICK = ["simvastatin","warfarin","rifampin","amlodipine","paracetamol","St John's Wort"];

  // give each drug a stable id + searchable haystack
  DRUGS.forEach(function(d,i){
    d.id = "d"+i;
    d.hay = (d.n + " " + d.use + " " + (d.alias?d.alias.join(" "):"")).toLowerCase();
  });
  var BY_ID = {};
  DRUGS.forEach(function(d){ BY_ID[d.id]=d; });

  var selected = []; // array of ids, insertion order

  // ---- DOM refs ----
  var input   = document.getElementById("drugSearch");
  var listEl  = document.getElementById("drugList");
  var addBtn  = document.getElementById("addBtn");
  var quickEl = document.getElementById("quickChips");
  var selBar  = document.getElementById("selBar");
  var selEmpty= document.getElementById("selEmpty");
  var banner  = document.getElementById("banner");
  var verdict = document.getElementById("verdict");
  var countsEl= document.getElementById("counts");
  var resBody = document.getElementById("resBody");

  var matches = [];      // current filtered list
  var activeIdx = -1;    // highlighted option index

  function esc(s){ return s.replace(/[&<>"]/g, function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];}); }
  function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

  function highlight(name, q){
    if(!q) return esc(name);
    var i = name.toLowerCase().indexOf(q.toLowerCase());
    if(i<0) return esc(name);
    return esc(name.slice(0,i)) + "<mark>" + esc(name.slice(i,i+q.length)) + "</mark>" + esc(name.slice(i+q.length));
  }

  function filter(q){
    q = q.trim().toLowerCase();
    var out = DRUGS.filter(function(d){
      if(selected.indexOf(d.id)>=0) return false;      // hide already-added
      if(!q) return false;
      return d.hay.indexOf(q) >= 0;
    });
    // rank: name-startsWith first, then severity, then alpha
    out.sort(function(a,b){
      var as = a.n.toLowerCase().indexOf(q)===0 ? 0:1;
      var bs = b.n.toLowerCase().indexOf(q)===0 ? 0:1;
      if(as!==bs) return as-bs;
      if(TIER[a.t].rank!==TIER[b.t].rank) return TIER[a.t].rank-TIER[b.t].rank;
      return a.n.localeCompare(b.n);
    });
    return out.slice(0,10);
  }

  function renderList(){
    var q = input.value.trim();
    matches = filter(q);
    activeIdx = -1;
    input.removeAttribute("aria-activedescendant");

    if(!q){
      listEl.hidden = true; input.setAttribute("aria-expanded","false");
      addBtn.disabled = true; return;
    }
    if(matches.length===0){
      listEl.innerHTML = '<li class="none">No match in the PAXLOVID label index.</li>';
      listEl.hidden = false; input.setAttribute("aria-expanded","true");
      addBtn.disabled = true; return;
    }
    listEl.innerHTML = matches.map(function(d,i){
      return '<li class="opt" id="opt-'+d.id+'" role="option" aria-selected="false" data-id="'+d.id+'" data-i="'+i+'">'
        + '<span class="dot '+d.t+'" aria-hidden="true"></span>'
        + '<span class="nm">'+highlight(d.n,q)+'</span>'
        + '<span class="use">'+esc(d.use)+'</span></li>';
    }).join("");
    listEl.hidden = false;
    input.setAttribute("aria-expanded","true");
    addBtn.disabled = false;
  }

  function setActive(i){
    var opts = listEl.querySelectorAll(".opt");
    if(!opts.length) return;
    if(i<0) i = opts.length-1;
    if(i>=opts.length) i = 0;
    activeIdx = i;
    opts.forEach(function(o,idx){
      var on = idx===i;
      o.setAttribute("aria-selected", on?"true":"false");
      if(on){ input.setAttribute("aria-activedescendant", o.id); o.scrollIntoView({block:"nearest"}); }
    });
  }

  function addDrug(id){
    if(!id || selected.indexOf(id)>=0) return;
    selected.push(id);
    input.value=""; renderList();
    renderSelected(); renderResults();
    input.focus();
  }

  function removeDrug(id){
    var i = selected.indexOf(id);
    if(i>=0) selected.splice(i,1);
    renderSelected(); renderResults(); renderList();
  }

  function commitFromInput(){
    if(activeIdx>=0 && matches[activeIdx]){ addDrug(matches[activeIdx].id); return; }
    if(matches.length===1){ addDrug(matches[0].id); return; }
    // exact-ish name match fallback
    var q = input.value.trim().toLowerCase();
    var exact = DRUGS.filter(function(d){return selected.indexOf(d.id)<0;})
      .find(function(d){ return d.n.toLowerCase()===q || (d.alias&&d.alias.indexOf(q)>=0); });
    if(exact) addDrug(exact.id);
    else if(matches[0]) addDrug(matches[0].id);
  }

  // ---- Selected chips ----
  function renderSelected(){
    if(selected.length===0){
      selBar.innerHTML=""; selBar.appendChild(selEmpty); selEmpty.hidden=false;
      return;
    }
    selEmpty.hidden=true;
    // display sorted by severity so chips echo the verdict order
    var ids = selected.slice().sort(function(a,b){ return TIER[BY_ID[a].t].rank - TIER[BY_ID[b].t].rank; });
    var html = ids.map(function(id){
      var d = BY_ID[id];
      return '<span class="chip '+d.t+'" role="listitem">'
        + '<span class="cdot dot '+d.t+'" aria-hidden="true"></span>'
        + cap(esc(d.n))
        + '<button type="button" aria-label="Remove '+esc(d.n)+'" data-rm="'+id+'">&times;</button></span>';
    }).join("");
    html += '<button type="button" class="clear-all" id="clearAll">Clear all</button>';
    selBar.innerHTML = html;
  }

  // ---- Results ----
  function renderResults(){
    var c = {crit:0, warn:0, ok:0};
    selected.forEach(function(id){ c[BY_ID[id].t]++; });

    // banner
    banner.className = "banner " + (selected.length===0 ? "idle" : (c.crit? "crit" : c.warn? "warn" : "ok"));
    if(selected.length===0){
      verdict.textContent = "Add medicines to screen against PAXLOVID";
      countsEl.innerHTML = "";
    } else {
      if(c.crit) verdict.innerHTML = '<span aria-hidden="true">&#9940;</span> Do not co-prescribe';
      else if(c.warn) verdict.innerHTML = '<span aria-hidden="true">&#9888;</span> Caution — review before prescribing';
      else verdict.innerHTML = '<span aria-hidden="true">&#10003;</span> No interactions identified';
      countsEl.innerHTML =
        '<span class="count crit"><b>'+c.crit+'</b> contraindicated</span>'
      + '<span class="count warn"><b>'+c.warn+'</b> caution</span>'
      + '<span class="count ok"><b>'+c.ok+'</b> no interaction</span>';
    }

    if(selected.length===0){
      resBody.innerHTML = '<tr><td colspan="3" class="res-empty">Results appear here, sorted by severity.</td></tr>';
      return;
    }
    var ids = selected.slice().sort(function(a,b){
      var r = TIER[BY_ID[a].t].rank - TIER[BY_ID[b].t].rank;
      return r!==0 ? r : BY_ID[a].n.localeCompare(BY_ID[b].n);
    });
    resBody.innerHTML = ids.map(function(id){
      var d = BY_ID[id];
      var sevTxt = d.t==="crit"?"Contraindicated":d.t==="warn"?"Caution":"OK";
      return '<tr>'
        + '<td class="sev"><span class="sev-badge '+d.t+'">'+sevTxt+'</span></td>'
        + '<td class="drug">'+cap(esc(d.n))+'<small>'+esc(d.use)+'</small></td>'
        + '<td class="note">'+esc(d.note)+'</td>'
        + '</tr>';
    }).join("");
  }

  // ---- Quick add ----
  function renderQuick(){
    quickEl.innerHTML = QUICK.map(function(name){
      var d = DRUGS.find(function(x){return x.n===name;});
      if(!d) return "";
      return '<button type="button" class="qadd" data-id="'+d.id+'">'+esc(d.n)+'</button>';
    }).join("");
    updateQuick();
  }
  function updateQuick(){
    quickEl.querySelectorAll(".qadd").forEach(function(b){
      b.disabled = selected.indexOf(b.getAttribute("data-id"))>=0;
    });
  }

  // ---- Events ----
  input.addEventListener("input", renderList);
  input.addEventListener("keydown", function(e){
    if(e.key==="ArrowDown"){ e.preventDefault(); if(listEl.hidden) renderList(); setActive(activeIdx+1); }
    else if(e.key==="ArrowUp"){ e.preventDefault(); setActive(activeIdx-1); }
    else if(e.key==="Enter"){ e.preventDefault(); if(input.value.trim()) commitFromInput(); }
    else if(e.key==="Escape"){ input.value=""; renderList(); }
  });
  input.addEventListener("blur", function(){ setTimeout(function(){ listEl.hidden=true; input.setAttribute("aria-expanded","false"); }, 150); });

  listEl.addEventListener("mousedown", function(e){
    var li = e.target.closest(".opt"); if(!li) return;
    e.preventDefault(); addDrug(li.getAttribute("data-id"));
  });

  addBtn.addEventListener("click", function(){ if(input.value.trim()) commitFromInput(); });

  quickEl.addEventListener("click", function(e){
    var b = e.target.closest(".qadd"); if(!b) return; addDrug(b.getAttribute("data-id"));
  });

  selBar.addEventListener("click", function(e){
    var rm = e.target.closest("[data-rm]");
    if(rm){ removeDrug(rm.getAttribute("data-rm")); return; }
    if(e.target.id==="clearAll"){ selected=[]; renderSelected(); renderResults(); renderList(); input.focus(); }
  });

  // keep quick-add disabled state in sync after any change
  var _sel = renderSelected, _res = renderResults;
  renderSelected = function(){ _sel(); updateQuick(); };
  renderResults  = function(){ _res(); };

  // ---- init ----
  renderQuick();
  renderSelected();
  renderResults();
})();
