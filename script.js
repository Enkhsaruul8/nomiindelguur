document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");

    // ✅ Dark Mode хадгалах, унших
    if (localStorage.getItem("dark-mode") === "true") {
        document.body.classList.add("dark-mode");
    }

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("dark-mode", document.body.classList.contains("dark-mode"));
    });

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
                        background: var(--card-bg, #ffffff);
                        padding: 10px;
                        border-radius: 8px;
                        box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15);
                        text-align: center;
                        width: 100%;
                        max-width: 180px;
                        transition: transform 0.3s ease-in-out;
                        border: 1px solid var(--border-color, #ddd);
                    }

                    :host(:hover) {
                        transform: scale(1.05);
                    }

                    img {
                        max-width: 100%;
                        height: auto;
                        border-radius: 8px;
                    }

                    h3 {
                        font-size: 1em;
                        margin: 10px 0;
                    }

                    p {
                        font-size: 0.8em;
                        color: var(--subtext-color, #666);
                        margin: 5px 0;
                    }

                    button {
                        background: #ff7e5f;
                        color: white;
                        border: none;
                        padding: 8px;
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
                </style>

                <img id="book-image" src="" alt="Book Cover" loading="lazy">
                <h3 id="book-title"></h3>
                <p id="book-author"></p>
                <p id="book-year"></p>
                <p id="book-isbn"></p>
                <button id="add-to-cart">🛒 Сагсанд нэмэх</button>
            `;
        }

        connectedCallback() {
            this.shadowRoot.getElementById("book-image").src = this.getAttribute("cover");
            this.shadowRoot.getElementById("book-title").textContent = this.getAttribute("title");
            this.shadowRoot.getElementById("book-author").textContent = `Зохиолч: ${this.getAttribute("author")}`;
            this.shadowRoot.getElementById("book-year").textContent = `Нийтлэгдсэн он: ${this.getAttribute("year")}`;
            this.shadowRoot.getElementById("book-isbn").textContent = `ISBN: ${this.getAttribute("isbn")}`;

            const addToCartBtn = this.shadowRoot.getElementById("add-to-cart");

            addToCartBtn.addEventListener("click", () => {
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                cart.push({
                    id: this.getAttribute("id"),
                    title: this.getAttribute("title"),
                    author: this.getAttribute("author"),
                    year: this.getAttribute("year"),
                    isbn: this.getAttribute("isbn"),
                });

                localStorage.setItem("cart", JSON.stringify(cart));
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
                productList.appendChild(bookElement);
            });
        })
        .catch(error => console.error("⚠️ Алдаа:", error));
});
