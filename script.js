let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ADD TO CART */
function addToCart(name, price, image) {
    price = Number(price);

    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, image, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Added to Cart");
}

/* UPDATE CART COUNT */
function updateCartCount() {
    let count = document.getElementById("cartCount");
    if (count) {
        count.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
    }
}

updateCartCount();

/* PREMIUM CART DISPLAY */
if (document.getElementById("cartItems")) {

    let container = document.getElementById("cartItems");
    let subtotal = 0;

    container.innerHTML = "";

    cart.forEach((item, index) => {

        subtotal += item.price * item.qty;

        container.innerHTML += `
        <div style="display:flex;align-items:center;gap:20px;background:white;padding:15px;margin-bottom:15px;border-radius:10px;box-shadow:0 3px 10px rgba(0,0,0,0.1);">
            <img src="${item.image}" width="100">
            <div style="flex:1;">
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>
                <div>
                    <button onclick="changeQty(${index}, -1)">-</button>
                    ${item.qty}
                    <button onclick="changeQty(${index}, 1)">+</button>
                    <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
                </div>
            </div>
            <p><b>₹${item.price * item.qty}</b></p>
        </div>
        `;
    });

    let delivery = 50;
    let discount = subtotal > 500 ? 50 : 0;
    let grand = subtotal + delivery - discount;

    document.getElementById("subtotal").innerText = "Subtotal: ₹" + subtotal;
    document.getElementById("delivery").innerText = "Delivery: ₹" + delivery;
    document.getElementById("discount").innerText = "Discount: -₹" + discount;
    document.getElementById("grandTotal").innerText = "Total: ₹" + grand;
}

/* CHANGE QUANTITY */
function changeQty(index, change) {
    cart[index].qty += change;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
}

/* REMOVE ITEM */
function removeItem(index){
    cart.splice(index,1);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
}

/* CHECKOUT SUMMARY */
if(document.getElementById("orderSummary")){

    let summary = document.getElementById("orderSummary");
    let subtotal = 0;

    cart.forEach(item=>{
        subtotal += item.price * item.qty;

        summary.innerHTML += `
            <p>${item.name} x ${item.qty} - ₹${item.price * item.qty}</p>
        `;
    });

    let delivery = 50;
    let discount = subtotal > 500 ? 50 : 0;
    let final = subtotal + delivery - discount;

    document.getElementById("finalTotal").innerText =
        "Total Payable: ₹" + final;
}

/* CONFIRM ORDER */
function confirmOrder(){

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;

    if(name==="" || phone==="" || address===""){
        alert("Please fill all required fields.");
        return;
    }

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders.push({
        items: cart,
        total: document.getElementById("finalTotal").innerText,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.removeItem("cart");

    alert("Order Confirmed Successfully 🎉");
    window.location="orders.html";
}

/* SEARCH */
function searchProduct(){
    let input = document.getElementById("searchInput");
    if(!input) return;

    let filter = input.value.toLowerCase();
    let cards = document.querySelectorAll(".product-card");

    cards.forEach(card=>{
        let text = card.innerText.toLowerCase();
        card.style.display = text.includes(filter) ? "" : "none";
    });
}

/* FILTER CATEGORY */
function filterCategory(category){
    let cards = document.querySelectorAll(".product-card");

    cards.forEach(card=>{
        if(category==="all"){
            card.style.display="block";
        } else {
            card.style.display =
                card.getAttribute("data-category")===category
                ? "block" : "none";
        }
    });
}

/* ORDER HISTORY */
if(document.getElementById("orderHistory")){

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let container = document.getElementById("orderHistory");

    orders.forEach(order=>{
        container.innerHTML += `
            <div style="background:white;padding:15px;margin-bottom:15px;border-radius:10px;">
                <p><b>Date:</b> ${order.date}</p>
                <p><b>Total:</b> ${order.total}</p>
                <hr>
            </div>
        `;
    });
}

/* AI CHAT */
function toggleAI(){
    let box = document.getElementById("aiBox");

    if(box.style.display === "flex"){
        box.style.display = "none";
    } else {
        box.style.display = "flex";
    }
}

function aiReply(){
    let input = document.getElementById("aiInput").value.toLowerCase();
    let messages = document.getElementById("aiMessages");

    let db={
        fever:"Take Paracetamol 500mg.",
        cough:"Cough Syrup recommended.",
        cold:"Vitamin C helps.",
        headache:"Combiflam suggested.",
        acidity:"Use Digene.",
        weakness:"Multivitamin recommended."
    };

    let reply="Consult doctor for proper advice.";

    for(let key in db){
        if(input.includes(key)) reply=db[key];
    }

    messages.innerHTML+=`<p><b>You:</b> ${input}</p>`;
    messages.innerHTML+=`<p><b>AI:</b> ${reply}</p>`;

    document.getElementById("aiInput").value="";
    messages.scrollTop=messages.scrollHeight;
}