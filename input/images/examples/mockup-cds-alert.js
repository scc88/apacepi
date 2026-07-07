(function(){
  "use strict";
  var overlay   = document.getElementById('overlay');
  var dialog    = document.getElementById('dialog');
  var prescribe = document.getElementById('prescribeBtn');
  var continueBtn = document.getElementById('continueBtn');
  var dismissBtn  = document.getElementById('dismissBtn');
  var remainLbl   = document.getElementById('remainLbl');
  var summary   = document.getElementById('summary');
  var resList   = document.getElementById('resList');
  var resetBtn  = document.getElementById('resetBtn');
  var signBtn   = document.getElementById('signBtn');
  var sumTime   = document.getElementById('sumTime');
  var alerts    = Array.prototype.slice.call(dialog.querySelectorAll('.alert'));
  var lastFocus = null;

  var resTypeMeta = {
    cancel:   {cls:'cancel',   rt:'rt--cancel',   text:'Order cancelled'},
    modify:   {cls:'modify',   rt:'rt--modify',   text:'Modified'},
    'accept-dose':{cls:'modify', rt:'rt--modify', text:'Reduced regimen applied'},
    override: {cls:'override', rt:'rt--override', text:'Overridden'}
  };

  function focusables(container){
    return Array.prototype.slice.call(container.querySelectorAll(
      'button:not([disabled]), a[href], textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(function(el){ return el.offsetParent !== null; });
  }

  function updateRemaining(){
    var remaining = alerts.filter(function(a){ return !a.classList.contains('resolved'); }).length;
    remainLbl.textContent = remaining;
    if(remaining === 0){
      continueBtn.disabled = false;
      continueBtn.firstChild.nodeValue = 'Continue to order ';
      remainLbl.textContent = '✓';
      document.getElementById('continueHint').textContent = 'All alerts resolved. You can continue the order.';
    } else {
      continueBtn.disabled = true;
    }
  }

  function resolveAlert(alert, actKey, reasonText){
    var meta = resTypeMeta[actKey] || resTypeMeta.modify;
    alert.classList.add('resolved');
    var badge = alert.querySelector('.resbadge');
    badge.className = 'resbadge resbadge--' + meta.cls;
    var label = meta.text;
    if(actKey === 'override' && reasonText){ label = 'Overridden — ' + reasonText; }
    badge.textContent = '● ' + label;
    alert.setAttribute('data-resolution', actKey);
    alert.setAttribute('data-reason', reasonText || '');
    updateRemaining();
  }

  // per-alert action delegation
  alerts.forEach(function(alert){
    var overrideBox = alert.querySelector('.override');
    var overrideBtn = alert.querySelector('[data-act="override"]');
    alert.addEventListener('click', function(e){
      var btn = e.target.closest('button[data-act]');
      if(!btn) return;
      var act = btn.getAttribute('data-act');
      if(act === 'override'){
        var open = !overrideBox.hasAttribute('hidden');
        if(open){ overrideBox.setAttribute('hidden',''); overrideBtn.setAttribute('aria-expanded','false'); }
        else { overrideBox.removeAttribute('hidden'); overrideBtn.setAttribute('aria-expanded','true'); overrideBox.querySelector('textarea').focus(); }
      } else if(act === 'override-cancel'){
        overrideBox.setAttribute('hidden',''); overrideBtn.setAttribute('aria-expanded','false'); overrideBtn.focus();
      } else if(act === 'override-save'){
        var ta = overrideBox.querySelector('textarea');
        if(!ta.value.trim()){ ta.focus(); ta.style.borderColor = 'var(--crit)'; return; }
        resolveAlert(alert, 'override', ta.value.trim());
      } else if(act === 'cancel'){
        resolveAlert(alert, 'cancel');
      } else if(act === 'modify'){
        resolveAlert(alert, 'modify');
      } else if(act === 'accept-dose'){
        resolveAlert(alert, 'accept-dose');
      }
    });
  });

  function openModal(){
    lastFocus = document.activeElement;
    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    // focus the dialog then first control
    dialog.setAttribute('tabindex','-1');
    dialog.focus();
    var f = focusables(dialog);
    if(f.length) f[0].focus();
  }

  function closeModal(){
    overlay.setAttribute('hidden','');
    document.body.style.overflow = '';
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function buildSummary(){
    resList.innerHTML = '';
    alerts.forEach(function(a){
      var act = a.getAttribute('data-resolution') || 'modify';
      var reason = a.getAttribute('data-reason') || '';
      var meta = resTypeMeta[act] || resTypeMeta.modify;
      var row = document.createElement('div');
      row.className = 'rline';
      var badge = '<span class="rt ' + meta.rt + '">' + meta.text + '</span>';
      var txt = '<span>' + a.getAttribute('data-label');
      if(act === 'override' && reason){ txt += ' — <em>reason: ' + escapeHtml(reason) + '</em>'; }
      txt += '</span>';
      row.innerHTML = badge + txt;
      resList.appendChild(row);
    });
    var now = new Date();
    sumTime.textContent = now.toLocaleString('en-SG', {hour:'2-digit', minute:'2-digit', day:'2-digit', month:'short'});
  }

  function escapeHtml(s){
    return s.replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  prescribe.addEventListener('click', openModal);
  dismissBtn.addEventListener('click', closeModal);

  continueBtn.addEventListener('click', function(){
    if(continueBtn.disabled) return;
    buildSummary();
    closeModal();
    summary.hidden = false;
    summary.focus();
    summary.scrollIntoView({behavior: (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'), block:'start'});
  });

  resetBtn.addEventListener('click', function(){
    // clear resolutions
    alerts.forEach(function(a){
      a.classList.remove('resolved');
      a.removeAttribute('data-resolution'); a.removeAttribute('data-reason');
      var ta = a.querySelector('textarea'); if(ta){ ta.value=''; ta.style.borderColor=''; }
      var ob = a.querySelector('.override'); if(ob){ ob.setAttribute('hidden',''); }
      var obtn = a.querySelector('[data-act="override"]'); if(obtn){ obtn.setAttribute('aria-expanded','false'); }
    });
    updateRemaining();
    summary.hidden = true;
    prescribe.focus();
  });

  signBtn.addEventListener('click', function(){
    signBtn.textContent = '✓ Sent to pharmacy (demo)';
    signBtn.disabled = true;
  });

  // keyboard: ESC to close, focus trap
  document.addEventListener('keydown', function(e){
    if(overlay.hasAttribute('hidden')) return;
    if(e.key === 'Escape'){ e.preventDefault(); closeModal(); return; }
    if(e.key === 'Tab'){
      var f = focusables(dialog);
      if(!f.length) return;
      var first = f[0], last = f[f.length-1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  });

  // click on backdrop closes
  overlay.addEventListener('mousedown', function(e){
    if(e.target === overlay) closeModal();
  });

  updateRemaining();
})();
