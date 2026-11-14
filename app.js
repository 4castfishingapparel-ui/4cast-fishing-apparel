document.addEventListener('DOMContentLoaded', function () {
  initDesignBag();
  initCustomizer();
  initSizeSelectors();
  initDesignRequest();
  initThreadPicker();
  initReveal();
});

function getBag() {
  try { return JSON.parse(localStorage.getItem('4cast-cart') || '[]'); } catch (e) { return []; }
}
function setBag(bag) { localStorage.setItem('4cast-cart', JSON.stringify(bag)); }
function renderBagCount() {
  var el = document.getElementById('cart-count');
  if (el) el.textContent = getBag().length;
}
function initDesignBag() {
  renderBagCount();
  document.querySelectorAll('.add-cart').forEach(function (btn) {
    if (!btn.getAttribute('data-label')) btn.setAttribute('data-label', btn.textContent);
    btn.addEventListener('click', function () {
      var bag = getBag();
      bag.push({ garment: btn.getAttribute('data-garment') || '4CAST item', timestamp: new Date().toISOString() });
      setBag(bag);
      renderBagCount();
      btn.textContent = 'Added to Bag ✓';
      setTimeout(function () { btn.textContent = btn.getAttribute('data-label'); }, 1300);
    });
  });
}

function currentDesign() {
  var select = document.getElementById('garment-select');
  var input = document.getElementById('custom-name');
  var activeSize = document.querySelector('.size-btn.active');
  var thread = document.getElementById('summary-thread');
  return {
    garment: select ? select.value : null,
    name: input ? input.value.trim().toUpperCase() : null,
    size: activeSize ? activeSize.getAttribute('data-size') : null,
    thread: thread ? thread.textContent : '4CAST Gold'
  };
}

function initCustomizer() {
  var input = document.getElementById('custom-name');
  var preview = document.getElementById('preview-name');
  var select = document.getElementById('garment-select');
  var garmentLabel = document.getElementById('preview-garment');
  var stage = document.getElementById('preview-stage');
  var useEl = document.getElementById('preview-use');
  var count = document.getElementById('char-count');
  var sumName = document.getElementById('summary-name');
  var sumGarment = document.getElementById('summary-garment');

  function renderName() {
    var v = (input.value || '').trim().toUpperCase();
    if (preview) preview.textContent = v ? v : 'YOUR NAME';
    if (sumName) sumName.textContent = v ? v : 'YOUR NAME';
    if (count) count.textContent = (input.value || '').length;
  }
  if (input && preview) {
    input.addEventListener('input', renderName);
    renderName();
  }
  if (select) {
    select.addEventListener('change', function () {
      var opt = select.options[select.selectedIndex];
      if (garmentLabel) garmentLabel.textContent = select.value;
      if (sumGarment) sumGarment.textContent = select.value;
      if (useEl && opt.getAttribute('data-art')) useEl.setAttribute('href', '#svg-' + opt.getAttribute('data-art'));
      if (stage && opt.getAttribute('data-stage')) {
        stage.classList.remove('stage-camo', 'stage-cobalt', 'stage-coral');
        stage.classList.add(opt.getAttribute('data-stage'));
      }
    });
  }
}

function initSizeSelectors() {
  var btns = document.querySelectorAll('.size-btn');
  var sumSize = document.getElementById('summary-size');
  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      if (sumSize) sumSize.textContent = btn.getAttribute('data-size');
    });
  });
}

function initDesignRequest() {
  var btn = document.getElementById('request-btn');
  if (btn) {
    btn.addEventListener('click', function () {
      var d = currentDesign();
      var subject = encodeURIComponent('4CAST Design Request — ' + (d.garment || 'Custom garment'));
      var body = encodeURIComponent(
        'Hi 4CAST team,\n\nI would like this design:\n\nGarment: ' + (d.garment || '') +
        '\nName on garment: ' + (d.name || '') +
        '\nSize: ' + (d.size || '') +
        '\nThread: ' + (d.thread || '4CAST Gold') + '\n\nPlease confirm launch pricing and next steps.\n'
      );
      window.location.href = 'mailto:4castfishingapparel@gmail.com?subject=' + subject + '&body=' + body;
    });
  }
  var legacy = document.getElementById('checkout-btn');
  if (legacy) {
    legacy.addEventListener('click', function () {
      alert('Design requests are open now — checkout opens with launch pricing. Use "Send Design Request" and we will confirm everything by email.');
    });
  }
}

function initThreadPicker() {
  var btns = document.querySelectorAll('.thread-btn');
  var preview = document.getElementById('preview-name');
  var chest = document.getElementById('chest-logo');
  var sumThread = document.getElementById('summary-thread');
  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var color = btn.getAttribute('data-color');
      if (preview) { preview.style.color = color; preview.style.textShadow = '0 0 18px ' + color + '66'; }
      if (chest) chest.style.backgroundColor = color;
      if (sumThread) sumThread.textContent = btn.getAttribute('data-name');
      var cap = document.getElementById('preview-caption');
      if (cap) cap.textContent = 'CUSTOM NAME \u2022 ' + btn.getAttribute('data-name').toUpperCase() + ' THREAD \u2022 BACK PLACEMENT';
    });
  });
}

function initReveal() {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  els.forEach(function (el) { io.observe(el); });
}
