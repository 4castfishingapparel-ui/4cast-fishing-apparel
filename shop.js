
function money(n){return '$'+n;}
function byId(id){return PRODUCTS.filter(function(p){return p.id===id;})[0];}
function qs(k){var m=new RegExp('[?&]'+k+'=([^&]*)').exec(location.search);return m?decodeURIComponent(m[1]):'';}

function renderShop(){
  var cats=[['','Shop All'],['his','For Him'],['hers','For Her'],['swim','Swim'],['hats','Hats'],['more','Beach & More'],['gear','Gear & Gadgets'],['family','Family Matching']];
  var cur=qs('cat');
  var chips=document.getElementById('chips');
  chips.innerHTML=cats.map(function(c){
    return '<a class="chip'+(c[0]===cur?' on':'')+'" href="shop.html'+(c[0]?('?cat='+c[0]):'')+'">'+c[1]+'</a>';
  }).join('');
  var list=PRODUCTS.filter(function(p){return !cur||p.cat===cur;});
  document.getElementById('shop-grid').innerHTML=list.map(function(p){
    return '<a class="shop-card" href="product.html?id='+p.id+'">'
      +'<span class="sc-photo"><img src="'+p.img+'" alt="'+p.name+'">'+(p.tag?'<span class="tag">'+p.tag+'</span>':'')+'</span>'
      +'<span class="sc-name">'+p.name+'</span>'
      +'<span class="sc-benefit">'+p.blurb.split('. ')[0]+'.</span>'
      +'<span class="sc-meta">'+p.catLabel+(p.customName?' · Add your name':'')+'</span>'
      +'<span class="sc-price">'+money(p.price)+'</span></a>';
  }).join('');
}

var PD={color:'Gold',size:''};
var THREADS=[['Gold','#d4af37'],['White','#ffffff'],['Charcoal Black','#23262a'],['Cobalt','#7db3e8'],['Coral','#e2725b'],['Cypress','#9db98a']];
function renderProduct(){
  var p=byId(qs('id'));
  var el=document.getElementById('pd');
  if(!p){el.innerHTML='<p class="section-copy">That product is not in the shop. <a href="shop.html">Browse everything</a>.</p>';return;}
  document.title=p.name+' — 4CAST Fishing Apparel';
  PD.size=p.sizes.indexOf('M')>-1?'M':p.sizes[0];
  var sizes=p.sizes.map(function(s){return '<button type="button" class="szb'+(s===PD.size?' on':'')+'" data-size="'+s+'">'+s+'</button>';}).join('');
  var colorBlock='';
  if(p.logoColor){
    colorBlock='<div class="fld"><span class="fld-label">Logo / thread color</span><div class="swatches">'
      +THREADS.map(function(t,i){
        return '<button type="button" class="sw'+(i===0?' on':'')+'" data-color="'+t[0]+'" title="'+t[0]+'"><span class="sw-dot" style="background:'+t[1]+'"></span>'+t[0]+'</button>';
      }).join('')+'</div>'
      +'<div class="logo-preview"><span class="logo-tint" id="lp-mark" style="background-color:#d4af37"></span><span id="lp-text">4CAST wave in Gold</span></div></div>';
  }
  var nameBlock=p.customName?'<div class="fld"><span class="fld-label">Name to print (optional)</span><input id="f-name" type="text" maxlength="18" placeholder="YOUR NAME — last name or boat name"><p class="fld-note">Printed across the back in your thread color. Leave blank for the clean logo-only design.</p></div>':'';
  var modelBlock=(p.name.indexOf('Case for iPhone')>-1)?'<div class="fld"><span class="fld-label">iPhone model</span><input id="f-model" type="text" placeholder="e.g. iPhone 15 Pro Max"></div>':'';
  el.innerHTML='<div class="pd-grid">'
    +'<div class="pd-photo"><img src="'+p.img+'" alt="'+p.name+'">'+(p.tag?'<span class="tag">'+p.tag+'</span>':'')+'</div>'
    +'<div class="pd-info">'
    +'<p class="eyebrow">'+p.catLabel+'</p><h1>'+p.name+'</h1>'
    +'<p class="pd-price">'+money(p.price)+'</p>'
    +'<p class="pd-blurb">'+p.blurb+'</p>'
    +'<div class="fld"><span class="fld-label">Size</span><div class="szrow">'+sizes+'</div></div>'
    +colorBlock+nameBlock+modelBlock
    +'<div class="fld"><span class="fld-label">Quantity</span><select id="f-qty"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div>'
    +'<a class="order-btn big" id="order-btn" href="#">Order — <span id="order-total">'+money(p.price)+'</span></a>'
    +'<div class="trust-box"><span><strong>Free shipping</strong> on orders $75+</span><span><strong>Confirmed by email</strong> before it is made</span><span><strong>Free bumper sticker</strong> in every order</span></div>'
    +'<p class="fld-note">Ordering today is by email: your selections come straight to us, we confirm the design, size and total with you before anything is made — no surprises. Card checkout launches next.</p>'
    +'<details class="acc"><summary>Details</summary><p>'+p.blurb+'</p></details>'
    +'<details class="acc"><summary>Size &amp; Fit</summary><p>Available sizes: '+p.sizes.join(', ')+'. Made to order in your size — if you are between sizes, tell us in the order email and we will confirm the best fit before it is made.</p></details>'
    +'<details class="acc"><summary>Ordering, Shipping &amp; Returns</summary><p>Every piece is made to order after we confirm your order by email. If anything arrives damaged, misprinted, or not what you ordered, we make it right — reprint or refund. Changed-your-mind returns on made-to-order items are handled case by case; email us first and we will take care of you.</p></details>'
    +'</div></div>'
    +'<section class="section"><p class="eyebrow">Complete the Look</p><h2>You may also like</h2><div class="rail">'
    +PRODUCTS.filter(function(x){return x.id!==p.id&&(x.cat===p.cat||x.customName===p.customName);}).slice(0,4).map(function(x){
      return '<a class="shop-card rail-card" href="product.html?id='+x.id+'"><span class="sc-photo"><img src="'+x.img+'" alt="'+x.name+'"></span><span class="sc-name">'+x.name+'</span><span class="sc-price">'+money(x.price)+'</span></a>';
    }).join('')+'</div></section>';
  var szs=el.querySelectorAll('.szb');
  for(var k=0;k<szs.length;k++){szs[k].addEventListener('click',function(){
    for(var j=0;j<szs.length;j++)szs[j].classList.remove('on');
    this.classList.add('on');PD.size=this.getAttribute('data-size');upd();
  });}
  var sws=el.querySelectorAll('.sw');
  for(var i=0;i<sws.length;i++){sws[i].addEventListener('click',function(){
    for(var j=0;j<sws.length;j++)sws[j].classList.remove('on');
    this.classList.add('on');PD.color=this.getAttribute('data-color');
    var hex={'Gold':'#d4af37','White':'#ffffff','Charcoal Black':'#23262a','Cobalt':'#7db3e8','Coral':'#e2725b','Cypress':'#9db98a'}[PD.color];
    var m=document.getElementById('lp-mark');if(m)m.style.backgroundColor=hex;
    var t=document.getElementById('lp-text');if(t)t.textContent='4CAST wave in '+PD.color;
  });}
  function upd(){
    var q=parseInt(document.getElementById('f-qty').value,10)||1;
    document.getElementById('order-total').textContent=money(p.price*q);
    var size=PD.size;
    var body=['Product: '+p.name,'Price: '+money(p.price),'Size: '+size];
    if(p.logoColor)body.push('Logo / thread color: '+PD.color);
    var nm=document.getElementById('f-name');if(nm&&nm.value)body.push('Name to print: '+nm.value);
    var md=document.getElementById('f-model');if(md&&md.value)body.push('iPhone model: '+md.value);
    body.push('Quantity: '+q,'Total: '+money(p.price*q),'','Shipping name & address:','');
    document.getElementById('order-btn').href='mailto:4castfishingapparel@gmail.com?subject='+encodeURIComponent('Order: '+p.name)+'&body='+encodeURIComponent(body.join('\n'));
  }
  el.addEventListener('change',upd);el.addEventListener('input',upd);upd();
}
