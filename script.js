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

    // ✅ Номын мэдээллийг авах
    fetch("https://openlibrary.org/search.json?q=programming&limit=9")
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById("product-list");
            productList.innerHTML = "";

            data.docs.forEach(book => {
                const bookCard = document.createElement("div");
                bookCard.classList.add("book-card");
                bookCard.innerHTML = `
                    <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" alt="${book.title}">
                    <h3>${book.title}</h3>
                    <p>Зохиолч: ${book.author_name ? book.author_name.join(", ") : "Тодорхойгүй"}</p>
                    <button class="add-to-cart" data-id="${book.key}" data-title="${book.title}">🛒 Сагсанд нэмэх</button>
                `;
                productList.appendChild(bookCard);
            });

            document.querySelectorAll(".add-to-cart").forEach(button => {
                button.addEventListener("click", (e) => {
                    const bookId = e.target.getAttribute("data-id");
                    const bookTitle = e.target.getAttribute("data-title");
                    let cart = JSON.parse(localStorage.getItem("cart")) || [];

                    if (!cart.some(item => item.id === bookId)) {
                        cart.push({ id: bookId, title: bookTitle });
                        localStorage.setItem("cart", JSON.stringify(cart));
                    }

                    e.target.textContent = "✅ Сагсанд нэмэгдсэн";
                    updateCartUI();
                });
            });
        })
        .catch(error => console.error("⚠️ Алдаа:", error));
});
