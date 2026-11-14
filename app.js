document.addEventListener('DOMContentLoaded', function () {
  initCart();
  initCustomizer();
  initSizeSelectors();
  initCheckoutHandoff();
});

function getCart() {
  try { return JSON.parse(localStorage.getItem('4cast-cart') || '[]'); } catch (e) { return []; }
}
function setCart(cart) { localStorage.setItem('4cast-cart', JSON.stringify(cart)); }
function renderCartCount() {
  var el = document.getElementById('cart-count');
  if (el) el.textContent = getCart().length;
}
function initCart() {
  renderCartCount();
  document.querySelectorAll('.add-cart').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cart = getCart();
      cart.push({ garment: btn.getAttribute('data-garment') || '4CAST item', timestamp: new Date().toISOString() });
      setCart(cart);
      renderCartCount();
      btn.textContent = 'Added ✓';
      setTimeout(function () { btn.textContent = 'Add To Cart'; }, 1200);
    });
  });
}

function initCustomizer() {
  var input = document.getElementById('custom-name');
  var preview = document.getElementById('preview-name');
  var select = document.getElementById('garment-select');
  var garmentLabel = document.getElementById('preview-garment');
  if (input && preview) {
    var render = function () {
      var v = (input.value || '').trim().toUpperCase();
      preview.textContent = v ? v : 'YOUR NAME';
    };
    input.addEventListener('input', render);
    render();
  }
  if (select && garmentLabel) {
    select.addEventListener('change', function () {
      garmentLabel.textContent = '[ ' + select.value + ' ]';
    });
  }
}

function initSizeSelectors() {
  var btns = document.querySelectorAll('.size-btn');
  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });
}

function initCheckoutHandoff() {
  var btn = document.getElementById('checkout-btn');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var select = document.getElementById('garment-select');
    var input = document.getElementById('custom-name');
    var activeSize = document.querySelector('.size-btn.active');
    var payload = {
      brandEmail: '4castfishingapparel@gmail.com',
      garment: select ? select.value : null,
      customizationText: input ? input.value.trim().toUpperCase() : null,
      size: activeSize ? activeSize.getAttribute('data-size') : null,
      timestamp: new Date().toISOString()
    };
    console.log('4CAST checkout handoff payload:', payload);
    alert('Stripe Secure Checkout Handoff Initialized. Routing order payload & custom text data to: 4castfishingapparel@gmail.com (Note: Live payment gateway triggers upon Chris confirming price points & supplier activation).');
  });
}
