(function(){
  "use strict";

  // Regimen data. Each day = {am:[nir,rit], pm:[nir,rit]|null}
  var REGIMENS = {
    none: {
      label: "No / mild impairment (eGFR ≥ 60)",
      alert: "Take 2 pink (nirmatrelvir 150 mg) + 1 white (ritonavir 100 mg) tablets twice a day for 5 days.",
      sub: "2 pink + 1 white every morning and every evening, for 5 days.",
      day: function(){ return {am:[2,1], pm:[2,1]}; }
    },
    moderate: {
      label: "Moderate impairment (eGFR ≥ 30 to < 60)",
      alert: "Take 1 pink + 1 white tablet twice a day. Your pack may contain more tablets than you need — only take the dose shown here.",
      sub: "1 pink + 1 white every morning and every evening, for 5 days.",
      day: function(){ return {am:[1,1], pm:[1,1]}; }
    },
    severe: {
      label: "Severe impairment (eGFR < 30, including haemodialysis)",
      alert: "Take your dose ONCE a day. Day 1 is larger (2 pink + 1 white); Days 2–5 are 1 pink + 1 white. On dialysis days, take the dose AFTER haemodialysis. Your pack may contain more tablets than you need.",
      sub: "One dose per day. Day 1: 2 pink + 1 white. Days 2–5: 1 pink + 1 white. No second (evening) dose.",
      day: function(d){ return { am: (d===1 ? [2,1] : [1,1]), pm:null }; }
    }
  };

  var DAYS = [1,2,3,4,5];
  var DAY_SUB = {1:"Start today", 2:"", 3:"", 4:"", 5:"Last day"};

  var state = { reg:"none", taken:{} }; // taken keyed "d-am"/"d-pm"

  var body = document.getElementById("schedBody");
  var segBtns = Array.prototype.slice.call(document.querySelectorAll(".seg button"));
  var regAlertText = document.getElementById("regAlertText");
  var schedSub = document.getElementById("schedSub");

  function pillHTML(nir, rit){
    var out = "";
    if(nir>0) out += '<span class="pill nir">'+nir+' × pink</span>';
    if(rit>0) out += '<span class="pill rit">'+rit+' × white</span>';
    return out;
  }

  function slotHTML(dayNum, when, dose){
    var key = dayNum + "-" + when;
    var whenLabel = when==="am" ? "☀ Morning" : "🌙 Evening";
    if(!dose){
      return '<button type="button" class="slot empty" disabled aria-label="Day '+dayNum+' '+ (when==="am"?"morning":"evening") +': no dose">'
           + '<span class="box"></span>'
           + '<span class="pills"><span class="none">No dose today</span></span>'
           + '</button>';
    }
    var isTaken = !!state.taken[key];
    var aria = "Day "+dayNum+" "+(when==="am"?"morning":"evening")+": "
             + dose[0]+" pink and "+dose[1]+" white tablets. "
             + (isTaken? "Taken. Activate to mark as not taken." : "Not taken. Activate to mark as taken.");
    return '<button type="button" class="slot'+(isTaken?" taken":"")+'" data-key="'+key+'" aria-pressed="'+isTaken+'" aria-label="'+aria+'">'
         + '<span class="box" aria-hidden="true">'+(isTaken?"✓":"")+'</span>'
         + '<span class="pills"><span class="when">'+whenLabel+'</span>'
         + '<span class="pillrow">'+pillHTML(dose[0],dose[1])+'</span></span>'
         + '</button>';
  }

  function build(){
    var reg = REGIMENS[state.reg];
    regAlertText.textContent = reg.alert;
    schedSub.textContent = reg.sub;

    var html = "";
    DAYS.forEach(function(d){
      var dose = reg.day(d);
      var ddText = DAY_SUB[d] || "";
      html += "<tr>"
            + '<th scope="row" class="rowlabel"><span class="d">Day '+d+'</span>'
            + (ddText? '<span class="dd">'+ddText+'</span>' : "")
            + "</th>"
            + '<td class="cell">'+slotHTML(d,"am",dose.am)+'</td>'
            + '<td class="cell">'+slotHTML(d,"pm",dose.pm)+'</td>'
            + "</tr>";
    });
    body.innerHTML = html;
    updateProgress();
  }

  function totalDoses(){
    var reg = REGIMENS[state.reg], n=0;
    DAYS.forEach(function(d){
      var dose = reg.day(d);
      if(dose.am) n++;
      if(dose.pm) n++;
    });
    return n;
  }

  function updateProgress(){
    var total = totalDoses();
    var done = 0;
    // only count ticks that are valid for current regimen
    var reg = REGIMENS[state.reg];
    DAYS.forEach(function(d){
      var dose = reg.day(d);
      if(dose.am && state.taken[d+"-am"]) done++;
      if(dose.pm && state.taken[d+"-pm"]) done++;
    });
    var pct = total? Math.round(done/total*100) : 0;
    document.getElementById("doneN").textContent = done;
    document.getElementById("totalN").textContent = total;
    document.getElementById("progPct").textContent = pct + "% complete";
    var fill = document.getElementById("progFill");
    fill.style.width = pct + "%";
    var barEl = document.querySelector(".prog-bar");
    barEl.setAttribute("aria-valuenow", pct);
    document.getElementById("progDone").hidden = !(total>0 && done===total);
  }

  // Regimen selection
  segBtns.forEach(function(btn){
    btn.addEventListener("click", function(){
      state.reg = btn.getAttribute("data-reg");
      state.taken = {}; // reset ticks on regimen change
      segBtns.forEach(function(b){ b.setAttribute("aria-pressed", b===btn ? "true":"false"); });
      build();
    });
  });

  // Slot ticking (event delegation)
  body.addEventListener("click", function(e){
    var slot = e.target.closest(".slot");
    if(!slot || slot.classList.contains("empty")) return;
    var key = slot.getAttribute("data-key");
    if(!key) return;
    var now = !state.taken[key];
    state.taken[key] = now;
    slot.classList.toggle("taken", now);
    slot.setAttribute("aria-pressed", now ? "true":"false");
    slot.querySelector(".box").textContent = now ? "✓" : "";
    updateProgress();
  });

  document.getElementById("resetBtn").addEventListener("click", function(){
    state.taken = {};
    build();
  });

  // Missed-dose flow
  var missFlow = document.getElementById("missFlow");
  var vNow = document.getElementById("verdictNow");
  var vSkip = document.getElementById("verdictSkip");
  document.getElementById("missStart").addEventListener("click", function(){
    var showing = !missFlow.hidden;
    missFlow.hidden = showing;
    this.textContent = showing ? "Check what to do" : "Close";
    if(!showing){ vNow.hidden = true; vSkip.hidden = true; }
  });
  Array.prototype.slice.call(missFlow.querySelectorAll("[data-miss]")).forEach(function(b){
    b.addEventListener("click", function(){
      var within = b.getAttribute("data-miss")==="within";
      vNow.hidden = !within;
      vSkip.hidden = within;
    });
  });

  build();
})();
