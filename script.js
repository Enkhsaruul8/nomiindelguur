document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");

    // ✅ Dark Mode хадгалах, унших
    if (localStorage.getItem("dark-mode") === "true") {
        document.body.classList.add("dark-mode");
    }

    darkModeToggle?.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("dark-mode", document.body.classList.contains("dark-mode"));
    });

    // ✅ Сагсны UI шинэчлэх функц
    function updateCartUI() {
        const cartItems = document.getElementById("cart-items");
        if (!cartItems) return;

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cartItems.innerHTML = "";

        if (cart.length === 0) {
            cartItems.innerHTML = "<p>🛒 Сагс хоосон байна.</p>";
            return;
        }

        cart.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <p><strong>${item.title}</strong></p>
                <p>Зохиолч: ${item.author}</p>
                <button class="remove-from-cart" data-id="${item.id}">❌ Хасах</button>
            `;
            cartItems.appendChild(cartItem);
        });

        document.querySelectorAll(".remove-from-cart").forEach(button => {
            button.addEventListener("click", (e) => {
                const itemId = e.target.getAttribute("data-id");
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                cart = cart.filter(item => item.id !== itemId);
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartUI();
            });
        });
    }

    updateCartUI();

    // ✅ Сагсыг хоослох товч
    const clearCartBtn = document.getElementById("clear-cart");
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", () => {
            localStorage.removeItem("cart");
            updateCartUI();
        });
    }

    // ✅ Web Component - Номын карт
    class BookCard extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: "open" });

            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        background: white;
                        padding: 15px;
                        border-radius: 10px;
                        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
                        text-align: center;
                        max-width: 250px;
                    }
                    img { max-width: 100%; height: auto; border-radius: 8px; }
                    button { background: #ff7e5f; color: white; padding: 10px; border-radius: 5px; cursor: pointer; }
                    button:hover { background: #feb47b; }
                </style>

                <img id="book-image" src="" alt="Book Cover">
                <h3 id="book-title"></h3>
                <p id="book-author"></p>
                <button id="add-to-cart">🛒 Сагсанд нэмэх</button>
            `;
        }

        connectedCallback() {
            const addToCartBtn = this.shadowRoot.getElementById("add-to-cart");

            addToCartBtn.addEventListener("click", () => {
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                const bookId = this.getAttribute("id");

                if (!cart.some(item => item.id === bookId)) {
                    cart.push({
                        id: bookId,
                        title: this.getAttribute("title"),
                        author: this.getAttribute("author"),
                    });

                    localStorage.setItem("cart", JSON.stringify(cart));
                }

                addToCartBtn.textContent = "✅ Сагсанд нэмэгдсэн";
            });
        }
    }

    customElements.define("book-card", BookCard);
});
