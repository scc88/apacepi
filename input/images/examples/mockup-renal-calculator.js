(function(){
  "use strict";
  var range = document.getElementById('egfr-range');
  var num   = document.getElementById('egfr-num');
  var scale = document.getElementById('scale');
  var marker= document.getElementById('marker');
  var pill  = document.getElementById('pill');
  var bandrange = document.getElementById('bandrange');
  var regimen = document.getElementById('regimen');
  var dosebody= document.getElementById('dosebody');
  var tablets = document.getElementById('tablets');
  var callouts= document.getElementById('callouts');
  var dtoggle = document.getElementById('dtoggle');
  var dsw     = document.getElementById('dsw');
  var bandEls = scale.querySelectorAll('.band');

  var MAX = 120;
  var dialysis = false;

  function pillsHtml(nir, rit){
    var out = '';
    out += '<div class="pillgroup">';
    var nrow = '';
    for(var i=0;i<nir;i++){ nrow += '<span class="pill nir"></span>'; }
    out += '<div class="pillrow">'+ (nir? nrow : '') +'</div>';
    out += '<span class="pcount">'+nir+' × pink nir</span></div>';
    out += '<div class="pillgroup">';
    var rrow = '';
    for(var j=0;j<rit;j++){ rrow += '<span class="pill rit"></span>'; }
    out += '<div class="pillrow">'+ (rit? rrow : '') +'</div>';
    out += '<span class="pcount">'+rit+' × white rit</span></div>';
    return out;
  }

  function slot(title, symbol, nir, rit){
    if(nir===null){
      return '<div class="tslot"><h4>'+symbol+' '+title+'</h4><span class="empty-slot">No dose</span></div>';
    }
    return '<div class="tslot"><h4>'+symbol+' '+title+'</h4><div class="pills">'+pillsHtml(nir,rit)+'</div></div>';
  }

  function classify(v){
    if(v>=60) return 'mild';
    if(v>=30) return 'mod';
    return 'sev';
  }

  function render(){
    var v = clamp(parseInt(num.value,10));
    var band = classify(v);

    // marker + scale
    marker.style.left = (v/MAX*100) + '%';
    for(var i=0;i<bandEls.length;i++){
      bandEls[i].classList.toggle('active', bandEls[i].getAttribute('data-band')===band);
    }

    // dialysis toggle visibility
    if(band==='sev'){
      dtoggle.hidden = false;
    } else {
      dtoggle.hidden = true;
      dialysis = false;
      dsw.setAttribute('aria-pressed','false');
    }

    var rows = '';
    var tabHtml = '';
    var coHtml = '';

    if(band==='mild'){
      pill.className = 'band-pill mild';
      pill.textContent = 'No / mild impairment';
      bandrange.textContent = 'eGFR ≥ 60';
      regimen.innerHTML = '<strong>2 nirmatrelvir + 1 ritonavir</strong>, twice daily, for 5 days.';
      rows = row('☀ Morning · Days 1–5','2','1') + row('🌙 Evening · Days 1–5','2','1');
      tabHtml = slot('Morning (each day)','☀','2','1') + slot('Evening (each day)','🌙','2','1');
    }
    else if(band==='mod'){
      pill.className = 'band-pill mod';
      pill.textContent = 'Moderate impairment';
      bandrange.textContent = 'eGFR 30 to < 60';
      regimen.innerHTML = '<strong>1 nirmatrelvir + 1 ritonavir</strong>, twice daily, for 5 days.';
      rows = row('☀ Morning · Days 1–5','1','1') + row('🌙 Evening · Days 1–5','1','1');
      tabHtml = slot('Morning (each day)','☀','1','1') + slot('Evening (each day)','🌙','1','1');
      coHtml += callout('warn','Pack surplus','The standard daily blister card contains 4 nirmatrelvir + 2 ritonavir. This reduced regimen uses fewer tablets than the pack provides — extra tablets will remain. Dispense/counsel accordingly.');
    }
    else { // sev
      pill.className = 'band-pill sev';
      pill.textContent = 'Severe impairment';
      bandrange.textContent = 'eGFR < 30 · incl. haemodialysis';
      regimen.innerHTML = '<strong>Day 1:</strong> 2 nirmatrelvir + 1 ritonavir once. <strong>Days 2–5:</strong> 1 nirmatrelvir + 1 ritonavir once daily.';
      rows = row('Day 1 · single dose','2','1') + row('Days 2–5 · once daily','1','1');
      tabHtml = slot('Day 1 (once)','●','2','1') + slot('Days 2–5 (once daily)','○','1','1');
      coHtml += callout('crit','Pack contains more than needed','⚠ The daily pack holds more tablets than this once-daily regimen requires. Do not take the full card. Take only the dose shown above each day; discard or set aside the surplus tablets.');
      if(dialysis){
        coHtml += callout('info','Haemodialysis timing','Administer the dose AFTER haemodialysis.');
      }
    }

    dosebody.innerHTML = rows;
    tablets.innerHTML = tabHtml;
    callouts.innerHTML = coHtml;
  }

  function row(label, nir, rit){
    return '<tr><td class="rowh">'+label+'</td><td><span class="num">'+nir+'</span></td><td><span class="num">'+rit+'</span></td></tr>';
  }
  function callout(type, title, body){
    return '<div class="callout '+type+'"><span class="ct">'+title+'</span>'+body+'</div>';
  }

  function clamp(v){
    if(isNaN(v)) v = 0;
    if(v<0) v=0; if(v>MAX) v=MAX;
    return v;
  }

  // sync handlers
  function fromRange(){ num.value = range.value; render(); }
  function fromNum(){
    var v = clamp(parseInt(num.value,10));
    range.value = v;
    render();
  }
  range.addEventListener('input', fromRange);
  num.addEventListener('input', fromNum);
  num.addEventListener('blur', function(){ num.value = clamp(parseInt(num.value,10)); range.value = num.value; render(); });

  dsw.addEventListener('click', function(){
    dialysis = !dialysis;
    dsw.setAttribute('aria-pressed', dialysis ? 'true':'false');
    render();
  });

  render();
})();
