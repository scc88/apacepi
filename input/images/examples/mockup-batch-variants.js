(function () {
  'use strict';
  var variants = {
    white: {
      label: 'Variant 1 · White',
      docId: 'AMLO-SGP-0001/V1',
      batch: 'WHT-24A',
      colour: 'White',
      appear: 'White, round, biconvex film-coated tablet, debossed “A10” on one side and plain on the other.',
      swatchBg: '#ffffff', swatchBorder: '#94a3b8', swatchText: '#334155',
      coat: [
        { n: 'Hypromellose (E464)', neu: false },
        { n: 'Titanium dioxide (E171)', neu: false },
        { n: 'Macrogol (E1521)', neu: false }
      ],
      safety: 'No additional side effects are specific to this (white) variant.',
      safetyNone: true
    },
    red: {
      label: 'Variant 2 · Red',
      docId: 'AMLO-SGP-0001/V2',
      batch: 'RED-24B',
      colour: 'Red',
      appear: 'Red, round, biconvex film-coated tablet, debossed “A10” on one side and plain on the other.',
      swatchBg: '#d1352b', swatchBorder: '#b91c1c', swatchText: '#ffffff',
      coat: [
        { n: 'Hypromellose (E464)', neu: false },
        { n: 'Titanium dioxide (E171)', neu: false },
        { n: 'Iron oxide red (E172)', neu: true },
        { n: 'Macrogol (E1521)', neu: false }
      ],
      safety: 'This red-coated variant additionally contains iron oxide red (E172). Very rarely, hypersensitivity to the colourant — skin rash or itching — has been reported; stop taking and tell your doctor if this happens. (Does not apply to the white variant.)',
      safetyNone: false
    }
  };

  var tablet = document.getElementById('tablet');
  var appearText = document.getElementById('appearText');
  var kColour = document.getElementById('kColour');
  var coat = document.getElementById('coat');
  var mVariant = document.getElementById('mVariant');
  var mDocId = document.getElementById('mDocId');
  var mBatch = document.getElementById('mBatch');
  var safetyNote = document.getElementById('safetyNote');
  var safetyText = document.getElementById('safetyText');
  var segBtns = document.querySelectorAll('.seg [data-v]');
  var diffToggle = document.getElementById('diffToggle');

  function render(key) {
    var v = variants[key];
    tablet.style.background = v.swatchBg;
    tablet.style.borderColor = v.swatchBorder;
    tablet.style.border = '1px solid ' + v.swatchBorder;
    tablet.style.color = v.swatchText;
    appearText.textContent = v.appear;
    kColour.textContent = v.colour;
    mVariant.textContent = v.label;
    mDocId.textContent = v.docId;
    mBatch.textContent = v.batch;
    coat.innerHTML = '';
    v.coat.forEach(function (c) {
      var el = document.createElement('span');
      el.className = 'c' + (c.neu ? ' new' : '');
      el.textContent = c.n + (c.neu ? '  ← differs' : '');
      coat.appendChild(el);
    });
    safetyText.textContent = v.safety;
    safetyNote.classList.toggle('none', v.safetyNone);
    safetyNote.querySelector('.vn-ic').textContent = v.safetyNone ? 'ℹ️' : '⚠️';
  }

  segBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      segBtns.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      render(b.getAttribute('data-v'));
    });
  });

  diffToggle.addEventListener('click', function () {
    var on = diffToggle.getAttribute('aria-pressed') === 'true';
    diffToggle.setAttribute('aria-pressed', on ? 'false' : 'true');
    document.body.classList.toggle('diff', !on);
  });

  render('white');
})();
