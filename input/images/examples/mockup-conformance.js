(function(){
  var checks = Array.prototype.slice.call(document.querySelectorAll('.check'));
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll('.filter-btn[data-filter]'));
  var catSections = Array.prototype.slice.call(document.querySelectorAll('.cat'));

  function applyFilter(f){
    checks.forEach(function(c){
      var show = (f === 'all') || (c.getAttribute('data-status') === f);
      c.hidden = !show;
    });
    // Hide category headers that have no visible checks
    catSections.forEach(function(sec){
      var any = sec.querySelector('.check:not([hidden])');
      sec.style.display = any ? '' : 'none';
    });
  }

  filterBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      filterBtns.forEach(function(b){ b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  var expandBtn = document.getElementById('expandAll');
  expandBtn.addEventListener('click', function(){
    var expanded = expandBtn.getAttribute('aria-pressed') === 'true';
    var next = !expanded;
    checks.forEach(function(c){ if(!c.hidden) c.open = next; });
    expandBtn.setAttribute('aria-pressed', String(next));
    expandBtn.textContent = next ? 'Collapse all' : 'Expand all';
  });
})();
