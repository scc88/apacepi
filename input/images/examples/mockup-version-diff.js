(function(){
  "use strict";
  var list = document.getElementById('difflist');
  var rows = Array.prototype.slice.call(list.querySelectorAll('.row'));
  var norows = document.getElementById('norows');

  // ---- View toggle (Unified / Split) ----
  var btnUnified = document.getElementById('view-unified');
  var btnSplit = document.getElementById('view-split');

  function setView(mode){
    var split = (mode === 'split');
    btnUnified.setAttribute('aria-pressed', String(!split));
    btnSplit.setAttribute('aria-pressed', String(split));
    document.querySelectorAll('.view-unified').forEach(function(el){ el.classList.toggle('hidden', split); });
    document.querySelectorAll('.view-split').forEach(function(el){ el.classList.toggle('hidden', !split); });
  }
  btnUnified.addEventListener('click', function(){ setView('unified'); });
  btnSplit.addEventListener('click', function(){ setView('split'); });

  // ---- Filter chips ----
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));

  function applyFilter(type){
    chips.forEach(function(c){ c.setAttribute('aria-pressed', String(c.getAttribute('data-filter') === type)); });
    var visible = 0;
    rows.forEach(function(r){
      var show = (type === 'all') || (r.getAttribute('data-type') === type);
      r.classList.toggle('hidden', !show);
      if(show) visible++;
    });
    norows.classList.toggle('hidden', visible !== 0);
  }

  chips.forEach(function(c){
    c.addEventListener('click', function(){ applyFilter(c.getAttribute('data-filter')); });
  });

  // ---- Derive counts from the DOM so summary stays truthful ----
  var counts = {all: rows.length, added:0, changed:0, removed:0, unchanged:0};
  rows.forEach(function(r){ var t = r.getAttribute('data-type'); if(counts[t] !== undefined) counts[t]++; });
  document.getElementById('c-changed').textContent = counts.changed;
  document.getElementById('c-added').textContent = counts.added;
  document.getElementById('c-removed').textContent = counts.removed;
  document.getElementById('c-unchanged').textContent = counts.unchanged;
  document.getElementById('c-total').textContent = counts.all;
  document.querySelectorAll('.cnt').forEach(function(el){
    var k = el.getAttribute('data-cnt'); if(counts[k] !== undefined) el.textContent = counts[k];
  });

  // init
  setView('unified');
  applyFilter('all');
})();
