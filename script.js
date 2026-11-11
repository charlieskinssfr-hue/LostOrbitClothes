const products=[{id:"tracksuit",name:"Lost Orbit Tracksuit",price:95,colours:{Black:"images/tracksuit-black.webp",Pink:"images/tracksuit-pink.webp",Grey:"images/tracksuit-grey.webp"}},{id:"shorts",name:"Lost Orbit Shorts",price:44.95,colours:{Black:"images/shorts-black.webp",Pink:"images/shorts-pink.webp",Grey:"images/shorts-grey.webp"}},{id:"shirt",name:"Lost Orbit Shirt",price:65,colours:{Black:"images/shirt-black.webp",Pink:"images/shirt-pink.webp",Grey:"images/shirt-grey.webp"}}];let selected={};products.forEach(p=>selected[p.id]={colour:"Black",size:"M"});let cart=JSON.parse(localStorage.getItem("lostOrbitCart")||"[]");const money=n=>`$${n.toFixed(2)} AUD`;function save(){localStorage.setItem("lostOrbitCart",JSON.stringify(cart));renderCart()}function renderProducts(){productsEl.innerHTML=products.map(p=>{let s=selected[p.id];return `<article class="card"><div class="pic"><img id="img-${p.id}" src="${p.colours[s.colour]}" alt="${p.name} ${s.colour}"></div><div class="info"><span>${p.name}</span><span class="price">${money(p.price)}</span></div><span class="label">Colour: <b id="c-${p.id}">${s.colour}</b></span><div class="swatches">${Object.keys(p.colours).map(c=>`<button class="swatch ${c.toLowerCase()} ${c==s.colour?"active":""}" onclick="colour('${p.id}','${c}',this)" aria-label="${c}"></button>`).join("")}</div><label class="label">Size</label><select class="size" id="s-${p.id}" onchange="selected['${p.id}'].size=this.value">${["S","M","L","XL"].map(x=>`<option ${x==s.size?"selected":""}>${x}</option>`).join("")}</select><button class="btn add" onclick="add('${p.id}')">ADD TO CART</button></article>`}).join("")}function colour(id,c,el){selected[id].colour=c;let p=products.find(x=>x.id==id);document.getElementById("img-"+id).src=p.colours[c];document.getElementById("c-"+id).textContent=c;el.parentNode.querySelectorAll(".swatch").forEach(x=>x.classList.remove("active"));el.classList.add("active")}function add(id){let p=products.find(x=>x.id==id),s=selected[id],old=cart.find(x=>x.id==id&&x.colour==s.colour&&x.size==s.size);old?old.qty++:cart.push({id,colour:s.colour,size:s.size,qty:1});save();openCart()}function change(id,c,s,d){let x=cart.find(x=>x.id==id&&x.colour==c&&x.size==s);x.qty+=d;if(x.qty<1)cart=cart.filter(y=>y!==x);save()}function removeItem(id,c,s){cart=cart.filter(x=>!(x.id==id&&x.colour==c&&x.size==s));save()}function renderCart(){let count=cart.reduce((a,x)=>a+x.qty,0);cartCount.textContent=count;if(!cart.length)cartItems.innerHTML='<div class="empty">Your cart is empty.</div>';else cartItems.innerHTML=cart.map(x=>{let p=products.find(y=>y.id==x.id);return `<div class="item"><img class="thumb" src="${p.colours[x.colour]}"><div><h3>${p.name}</h3><p>${x.colour} · Size ${x.size} · ${money(p.price)}</p><div class="qty"><button onclick="change('${x.id}','${x.colour}','${x.size}',-1)">−</button><span>${x.qty}</span><button onclick="change('${x.id}','${x.colour}','${x.size}',1)">+</button></div><button class="remove" onclick="removeItem('${x.id}','${x.colour}','${x.size}')">REMOVE</button></div><b>${money(p.price*x.qty)}</b></div>`}).join("");let total=cart.reduce((a,x)=>a+products.find(p=>p.id==x.id).price*x.qty,0);document.getElementById("total").textContent=money(total)}function openCart(){cartEl.classList.add("on");shade.classList.add("on")}function closeCart(){cartEl.classList.remove("on");shade.classList.remove("on")}const productsEl=document.getElementById("products"),cartEl=document.getElementById("cart"),shade=document.getElementById("shade"),cartItems=document.getElementById("cartItems"),cartCount=document.getElementById("cartCount");openCartBtn=document.getElementById("openCart");openCartBtn.onclick=openCart;document.getElementById("closeCart").onclick=closeCart;shade.onclick=closeCart;const checkoutModal=document.getElementById("checkoutModal");
const checkoutForm=document.getElementById("checkoutForm");
const checkoutMessage=document.getElementById("checkoutMessage");
document.getElementById("checkout").onclick=()=>{
  if(!cart.length){alert("Your cart is empty.");return;}
  checkoutMessage.textContent="";
  checkoutModal.classList.add("on");
  document.body.classList.add("modal-open");
};
document.getElementById("closeCheckout").onclick=()=>{
  checkoutModal.classList.remove("on");
  document.body.classList.remove("modal-open");
};
checkoutModal.addEventListener("click",e=>{
  if(e.target===checkoutModal){
    checkoutModal.classList.remove("on");
    document.body.classList.remove("modal-open");
  }
});
checkoutForm.addEventListener("submit",async e=>{
  e.preventDefault();
  if(!cart.length){checkoutMessage.textContent="Your cart is empty.";return;}
  const submit=checkoutForm.querySelector('button[type="submit"]');
  submit.disabled=true; submit.textContent="CONNECTING TO SECURE CHECKOUT…";
  checkoutMessage.textContent="Preparing your secure checkout…";
  try{
    const response=await fetch("/api/create-checkout-session",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        customerName:document.getElementById("customerName").value.trim(),
        email:document.getElementById("customerEmail").value.trim(),
        items:cart.map(x=>({id:x.id,colour:x.colour,size:x.size,qty:x.qty}))
      })
    });
    const data=await response.json();
    if(!response.ok) throw new Error(data.error||"Checkout could not be started.");
    if(!data.url) throw new Error("The payment provider did not return a checkout link.");
    window.location.href=data.url;
  }catch(err){
    checkoutMessage.textContent=err.message.includes("Failed to fetch")
      ?"Secure payments aren't connected on this GitHub Pages deployment yet. Follow the Stripe + Vercel setup in README.txt."
      :err.message;
    submit.disabled=false; submit.textContent="CONTINUE TO SECURE PAYMENT";
  }
});
renderProducts();renderCart();