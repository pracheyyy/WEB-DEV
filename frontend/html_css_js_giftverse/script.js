/* ============================================================
   GIFTVERSES — script.js
   Product data, cart, wishlist, occasion filter, mobile nav
   ============================================================ */

const PRODUCTS = [
  {
    id: "p1",
    name: "Golden Hour Birthday Hamper",
    category: "Hampers",
    occasion: "birthday",
    desc: "Candles, chocolates, a handwritten note card, and a tiny bouquet — all in one box.",
    price: 1899,
    was: 2399,
    tag: "bestseller",
    img: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&h=500&fit=crop&q=80"
  },
  {
    id: "p2",
    name: "Amber & Oud Candle Duo",
    category: "Home",
    occasion: "home",
    desc: "Hand-poured soy candles in reusable ceramic jars. Burns 40+ hours each.",
    price: 899,
    was: null,
    tag: null,
    img: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=600&h=500&fit=crop&q=80"
  },
  {
    id: "p3",
    name: "Engraved Memory Locket",
    category: "Personalized",
    occasion: "anniversary",
    desc: "Sterling silver locket with a custom photo and engraved date inside.",
    price: 1299,
    was: null,
    tag: "new",
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=500&fit=crop&q=80"
  },
  {
    id: "p4",
    name: "Belgian Chocolate Truffle Box",
    category: "Edible Gifts",
    occasion: "corporate",
    desc: "24-piece assortment, handmade, no preservatives. Comes gift-wrapped.",
    price: 749,
    was: 899,
    tag: null,
    img: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&h=500&fit=crop&q=80"
  },
  {
    id: "p5",
    name: "Lucky Bamboo Desk Planter",
    category: "Plants",
    occasion: "home",
    desc: "Ceramic planter with a hand-tied gold ribbon. Low maintenance, high charm.",
    price: 599,
    was: null,
    tag: null,
    img: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=500&fit=crop&q=80"
  },
  {
    id: "p6",
    name: "Monogrammed Leather Journal",
    category: "Personalized",
    occasion: "graduation",
    desc: "Hand-stitched leather cover with gold-foil initials, refillable pages.",
    price: 1049,
    was: null,
    tag: null,
    img: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&h=500&fit=crop&q=80"
  },
  {
    id: "p7",
    name: "Welcome Home Succulent Trio",
    category: "Plants",
    occasion: "home",
    desc: "Three potted succulents in matching terracotta pots, ready to gift.",
    price: 749,
    was: null,
    tag: null,
    img: "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=600&h=500&fit=crop&q=80"
  },
  {
    id: "p8",
    name: "New Parents Baby Gift Box",
    category: "Hampers",
    occasion: "baby",
    desc: "Soft blankets, booties, and a keepsake card for the newest arrival.",
    price: 1599,
    was: 1899,
    tag: "new",
    img: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=500&fit=crop&q=80"
  },
  {
    id: "p9",
    name: "Corporate Gratitude Box",
    category: "Corporate",
    occasion: "corporate",
    desc: "Premium notebook, pen, and gourmet snacks — branded packaging available.",
    price: 1299,
    was: null,
    tag: null,
    img: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&h=500&fit=crop&q=80"
  }
];

/* ---------------- STATE ---------------- */
let cart = JSON.parse(localStorage.getItem("gv_cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("gv_wishlist") || "[]");
let activeFilter = null;

/* ---------------- RENDER PRODUCTS ---------------- */
function renderProducts() {
  const grid = document.getElementById("productGrid");
  const list = activeFilter ? PRODUCTS.filter(p => p.occasion === activeFilter) : PRODUCTS;

  if (list.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-dim);grid-column:1/-1;">No gifts found for this occasion yet.</p>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <div class="product-card">
      ${p.tag ? `<span class="ribbon-corner">${p.tag}</span>` : ""}
      <button class="wishlist-toggle ${wishlist.includes(p.id) ? "active" : ""}" data-id="${p.id}" aria-label="Add to wishlist">
        ${wishlist.includes(p.id) ? "♥" : "♡"}
      </button>
      <div class="product-thumb">
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=500&fit=crop&q=80';">
      </div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <span class="product-name">${p.name}</span>
        <p class="product-desc">${p.desc}</p>
        <div class="price-row">
          <span class="now">₹${p.price.toLocaleString("en-IN")}</span>
          ${p.was ? `<span class="was">₹${p.was.toLocaleString("en-IN")}</span>` : ""}
        </div>
        <button class="add-btn" data-id="${p.id}">Add to cart</button>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id));
  });
  grid.querySelectorAll(".wishlist-toggle").forEach(btn => {
    btn.addEventListener("click", () => toggleWishlist(btn.dataset.id));
  });
}

/* ---------------- CART LOGIC ---------------- */
function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart();
  renderCart();
  showToast("Added to cart");
  openCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("gv_cart", JSON.stringify(cart));
}

function cartTotal() {
  return cart.reduce((sum, item) => {
    const p = PRODUCTS.find(p => p.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

function renderCart() {
  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const countEl = document.getElementById("cartCount");
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);

  if (totalQty > 0) {
    countEl.style.display = "flex";
    countEl.textContent = totalQty;
  } else {
    countEl.style.display = "none";
  }

  if (cart.length === 0) {
    itemsEl.innerHTML = `<p class="empty-msg">Your cart is empty. Go find something nice.</p>`;
    totalEl.textContent = "₹0";
    return;
  }

  itemsEl.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(p => p.id === item.id);
    if (!p) return "";
    return `
      <div class="cart-item">
        <img src="${p.img}" alt="${p.name}">
        <div class="cart-item-info">
          <span class="cart-item-name">${p.name}</span>
          <span class="cart-item-price">₹${p.price.toLocaleString("en-IN")}</span>
          <div class="qty-controls">
            <button class="qty-btn" data-id="${p.id}" data-delta="-1">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" data-id="${p.id}" data-delta="1">+</button>
            <button class="remove-link" data-id="${p.id}">remove</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  totalEl.textContent = "₹" + cartTotal().toLocaleString("en-IN");

  itemsEl.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => changeQty(btn.dataset.id, parseInt(btn.dataset.delta)));
  });
  itemsEl.querySelectorAll(".remove-link").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.id));
  });
}

/* ---------------- WISHLIST ---------------- */
function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(w => w !== id);
  } else {
    wishlist.push(id);
  }
  localStorage.setItem("gv_wishlist", JSON.stringify(wishlist));
  renderProducts();
  renderWishlistCount();
}

function renderWishlistCount() {
  const el = document.getElementById("wishlistCount");
  if (wishlist.length > 0) {
    el.style.display = "flex";
    el.textContent = wishlist.length;
  } else {
    el.style.display = "none";
  }
}

/* ---------------- CART DRAWER OPEN/CLOSE ---------------- */
function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}
function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

/* ---------------- TOAST ---------------- */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------------- EVENT WIRING ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
  renderWishlistCount();

  document.getElementById("cartBtn").addEventListener("click", openCart);
  document.getElementById("closeCart").addEventListener("click", closeCart);
  document.getElementById("overlay").addEventListener("click", closeCart);

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("Your cart is empty");
      return;
    }
    showToast("Order placed! Thank you for gifting with us 🎁");
    cart = [];
    saveCart();
    renderCart();
    closeCart();
  });

  document.getElementById("wishlistBtn").addEventListener("click", () => {
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });

  // occasion filter
  document.querySelectorAll(".occasion-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const filter = pill.dataset.filter;
      activeFilter = activeFilter === filter ? null : filter;
      document.querySelectorAll(".occasion-pill").forEach(p => p.classList.remove("active"));
      if (activeFilter) pill.classList.add("active");
      renderProducts();
      document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
    });
  });

  document.getElementById("showAllBtn").addEventListener("click", (e) => {
    e.preventDefault();
    activeFilter = null;
    document.querySelectorAll(".occasion-pill").forEach(p => p.classList.remove("active"));
    renderProducts();
  });

  // mobile hamburger
  document.getElementById("hamburgerBtn").addEventListener("click", () => {
    document.getElementById("mainNav").classList.toggle("open");
    document.getElementById("hamburgerBtn").classList.toggle("open");
  });
  document.querySelectorAll("#mainNav a").forEach(a => {
    a.addEventListener("click", () => {
      document.getElementById("mainNav").classList.remove("open");
      document.getElementById("hamburgerBtn").classList.remove("open");
    });
  });

  // newsletter form
  document.getElementById("subscribeForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("subscribeEmail").value;
    showToast(`Subscribed! 10% off code sent to ${email}`);
    e.target.reset();
  });
});