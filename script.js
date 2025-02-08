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
                <p>Үнэ: ${item.price}₮</p>
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
                        max-width: 240px;
                        transition: transform 0.3s ease-in-out;
                        border: 1px solid #ddd;
                    }

                    :host(:hover) {
                        transform: scale(1.05);
                    }

                    img {
                        max-width: 100%;
                        height: 200px;
                        border-radius: 8px;
                        object-fit: cover;
                    }

                    h3 {
                        font-size: 1.1em;
                        margin: 10px 0;
                    }

                    p {
                        font-size: 0.9em;
                        color: #666;
                        margin: 5px 0;
                    }

                    .price {
                        font-size: 1.2em;
                        font-weight: bold;
                        color: #e74c3c;
                    }

                    button {
                        background: #ff7e5f;
                        color: white;
                        border: none;
                        padding: 10px;
                        border-radius: 5px;
                        cursor: pointer;
                        transition: background 0.3s;
                        width: 100%;
                        font-size: 0.9em;
                    }

                    button:hover {
                        background: #feb47b;
                    }

                    .added {
                        background: #28a745 !important;
                        pointer-events: none;
                    }

                    body.dark-mode :host {
                        background: #2c2c2c;
                        color: #fff;
                        border: 1px solid #444;
                    }

                    body.dark-mode .price {
                        color: #ffcc00;
                    }
                </style>

                <img id="book-image" src="" alt="Book Cover">
                <h3 id="book-title"></h3>
                <p id="book-author"></p>
                <p id="book-year"></p>
                <p id="book-isbn"></p>
                <p class="price" id="book-price"></p>
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
                        year: this.getAttribute("year"),
                        isbn: this.getAttribute("isbn"),
                        price: this.getAttribute("price"),
                    });

                    localStorage.setItem("cart", JSON.stringify(cart));
                    updateCartUI();
                }

                addToCartBtn.textContent = "✅ Сагсанд нэмэгдсэн";
                addToCartBtn.classList.add("added");
            });
        }
    }

    customElements.define("book-card", BookCard);

    // ✅ Open Library API-с ном татах
    fetch("https://openlibrary.org/search.json?q=programming&limit=9")
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById("product-list");
            productList.innerHTML = "";

            data.docs.forEach(book => {
                const bookElement = document.createElement("book-card");
                bookElement.setAttribute("id", book.key);
                bookElement.setAttribute("cover", `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`);
                bookElement.setAttribute("title", book.title);
                bookElement.setAttribute("author", book.author_name ? book.author_name.join(", ") : "Тодорхойгүй");
                bookElement.setAttribute("year", book.first_publish_year || "Тодорхойгүй");
                bookElement.setAttribute("isbn", book.isbn ? book.isbn[0] : "Тодорхойгүй");
                bookElement.setAttribute("price", Math.floor(Math.random() * 50000) + 10000); // Санамсаргүй үнэ

                productList.appendChild(bookElement);
            });
        })
        .catch(error => console.error("⚠️ Алдаа:", error));
});
