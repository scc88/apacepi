(function(){
  "use strict";

  // ---- Data (from PAXLOVID data pack) ----
  var DOSE = {
    none:{
      big:"2 pink + 1 white tablet, twice a day",
      small:"Take together every morning and evening for 5 days. Swallow whole — do not chew or crush. With or without food.",
      pills:[["nir","N"],["nir","N"],["rit","R"]],
      times:["☀ Morning","🌙 Evening"],
      surplus:null
    },
    moderate:{
      big:"1 pink + 1 white tablet, twice a day",
      small:"Take together every morning and evening for 5 days. Swallow whole — do not chew or crush.",
      pills:[["nir","N"],["rit","R"]],
      times:["☀ Morning","🌙 Evening"],
      surplus:"Your pack may contain more tablets than you need. Take only the dose above — do not take the extra tablets."
    },
    severe:{
      big:"Day 1: 2 pink + 1 white once. Days 2–5: 1 pink + 1 white once daily",
      small:"Take once a day. If you are on dialysis, take your dose after your haemodialysis session.",
      pills:[["nir","N"],["rit","R"]],
      times:["Once daily"],
      surplus:"Your pack may contain more tablets than you need. Follow the reduced schedule above only."
    }
  };

  var MEDS = [
    {id:"simvastatin",  name:"simvastatin",  sev:"crit", note:"Do not take with PAXLOVID — risk of serious muscle injury from raised cholesterol-medicine levels."},
    {id:"sildenafil",   name:"sildenafil (for PAH)", sev:"crit", note:"Do not take with PAXLOVID when used for pulmonary hypertension (PAH)."},
    {id:"carbamazepine",name:"carbamazepine",sev:"crit", note:"Do not take with PAXLOVID — this seizure medicine can make PAXLOVID stop working."},
    {id:"warfarin",     name:"warfarin",     sev:"warn", note:"Can be used with monitoring — your INR (blood clotting) may need to be checked more often."},
    {id:"amlodipine",   name:"amlodipine",   sev:"warn", note:"Blood-pressure medicine — your doctor may lower the dose while you take PAXLOVID."},
    {id:"paracetamol",  name:"paracetamol",  sev:"ok",   note:"No interaction identified in this label — can be taken as usual."},
    {id:"metformin",    name:"metformin",    sev:"ok",   note:"No interaction identified in this label — can be taken as usual."}
  ];

  var SEVLABEL = {crit:"Contraindicated", warn:"Caution", ok:"No interaction"};
  var RENALLABEL = {none:"no / mild kidney impairment", moderate:"moderate kidney impairment", severe:"severe kidney impairment"};

  // ---- State ----
  var state = { renal:"none", preg:false, meds:{} };

  // ---- Build chips ----
  var chipWrap = document.getElementById("medChips");
  MEDS.forEach(function(m){
    var b = document.createElement("button");
    b.type = "button"; b.className = "chip"; b.setAttribute("data-sev", m.sev);
    b.setAttribute("aria-pressed","false"); b.setAttribute("data-id", m.id);
    b.innerHTML = '<span class="dot" aria-hidden="true"></span>' + m.name;
    b.addEventListener("click", function(){
      var on = b.getAttribute("aria-pressed") === "true";
      b.setAttribute("aria-pressed", on ? "false" : "true");
      if(on){ delete state.meds[m.id]; } else { state.meds[m.id] = true; }
      render();
    });
    chipWrap.appendChild(b);
  });

  // ---- Renal segmented control ----
  var segBtns = document.querySelectorAll("#renalSeg button");
  segBtns.forEach(function(btn){
    btn.addEventListener("click", function(){
      segBtns.forEach(function(b){ b.setAttribute("aria-pressed","false"); });
      btn.setAttribute("aria-pressed","true");
      state.renal = btn.getAttribute("data-renal");
      render();
    });
  });

  // ---- Pregnancy toggle ----
  var pregBtn = document.getElementById("pregToggle");
  pregBtn.addEventListener("click", function(){
    state.preg = !state.preg;
    pregBtn.setAttribute("aria-pressed", state.preg ? "true":"false");
    document.getElementById("pregLabel").textContent = state.preg ? "Yes" : "No";
    render();
  });

  // ---- Render ----
  function esc(s){ return String(s).replace(/[&<>]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;"}[c]; }); }

  function render(){
    var d = DOSE[state.renal];

    // profile summary
    var parts = [RENALLABEL[state.renal]];
    if(state.preg) parts.push("pregnant / breast-feeding");
    var nMeds = Object.keys(state.meds).length;
    parts.push(nMeds + (nMeds===1 ? " medicine listed" : " medicines listed"));
    document.getElementById("profileSummary").textContent = "Personalised for: " + parts.join(" · ");

    // dose pills
    var pw = document.getElementById("dosePills");
    pw.innerHTML = "";
    d.pills.forEach(function(p){
      var el = document.createElement("span");
      el.className = "pill " + p[0]; el.textContent = p[1];
      pw.appendChild(el);
    });
    document.getElementById("doseBig").textContent = d.big;
    document.getElementById("doseSmall").textContent = d.small;
    var tw = document.getElementById("doseTimes");
    tw.innerHTML = "";
    d.times.forEach(function(t){
      var s = document.createElement("span"); s.textContent = t; tw.appendChild(s);
    });
    var sn = document.getElementById("surplusNote");
    sn.innerHTML = d.surplus
      ? '<div class="surplus"><span class="ic" aria-hidden="true">⚠</span><span>'+esc(d.surplus)+'</span></div>'
      : "";

    // interactions
    var iw = document.getElementById("interactions");
    if(nMeds === 0){
      iw.innerHTML = '<p class="empty-meds">No medicines selected. Add any you take on the left to check them against this leaflet.</p>';
    } else {
      var order = {crit:0, warn:1, ok:2};
      var chosen = MEDS.filter(function(m){ return state.meds[m.id]; })
                       .sort(function(a,b){ return order[a.sev]-order[b.sev]; });
      iw.innerHTML = chosen.map(function(m){
        return '<div class="irow">'+
          '<span class="sevbadge '+m.sev+'">'+SEVLABEL[m.sev]+'</span>'+
          '<div class="med"><div class="name">'+esc(m.name)+'</div>'+
          '<div class="note">'+esc(m.note)+'</div></div></div>';
      }).join("");
    }

    // warnings — conditional
    var ww = document.getElementById("warnings");
    var items = [];
    items.push({cls:"info", ic:"ⓘ", txt:"Contains lactose. If you have been told you cannot tolerate some sugars, speak to your doctor before taking PAXLOVID."});
    if(state.preg){
      items.push({cls:"preg", ic:"⚠", txt:"You told us you are pregnant or breast-feeding. Avoid PAXLOVID unless your doctor decides otherwise. Use non-hormonal contraception during and for 7 days after; if breast-feeding, stop during and for 48 hours after the course."});
    }
    if(state.renal !== "none"){
      items.push({cls:"renal", ic:"🩺", txt:"Because of your "+RENALLABEL[state.renal]+", your dose above has been adjusted. Do not take the standard dose — follow the schedule shown."});
    }
    ww.innerHTML = items.map(function(it){
      return '<div class="wbox '+it.cls+'"><span class="ic" aria-hidden="true">'+it.ic+'</span><span>'+esc(it.txt)+'</span></div>';
    }).join("");

    // provenance
    var critCount = MEDS.filter(function(m){ return state.meds[m.id] && m.sev==="crit"; }).length;
    document.getElementById("provenance").textContent =
      "Source: PAXLOVID Singapore ePI · PAXH-SIN-0126/PIL/0 · filtered on device — "
      + (critCount>0 ? critCount+" contraindication(s) shown · " : "")
      + "dosing set = " + state.renal + ".";
  }

  render();
})();
