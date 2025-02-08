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

    // ✅ Номыг сагсанд нэмэх функц
    const addToCart = (book) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(book);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${book.title} сагсанд нэмэгдлээ!`);
    };

    // 📌 **BookComponent - Номыг component байдлаар үүсгэх**
    class BookComponent {
        constructor(book) {
            this.book = book;
        }

        render() {
            const bookItem = document.createElement("div");
            bookItem.classList.add("product");

            const bookImage = document.createElement("img");
            bookImage.src = `https://covers.openlibrary.org/b/id/${this.book.cover_i}-M.jpg`;
            bookImage.alt = this.book.title;
            bookImage.style.width = "150px";
            bookImage.style.height = "200px";

            const bookTitle = document.createElement("h3");
            bookTitle.textContent = this.book.title;

            const bookAuthor = document.createElement("p");
            bookAuthor.textContent = `Зохиолч: ${this.book.author_name ? this.book.author_name.join(", ") : "Тодорхойгүй"}`;

            const bookYear = document.createElement("p");
            bookYear.textContent = `Нийтлэгдсэн он: ${this.book.first_publish_year || "Тодорхойгүй"}`;

            const bookISBN = document.createElement("p");
            bookISBN.textContent = `ISBN: ${this.book.isbn ? this.book.isbn[0] : "Тодорхойгүй"}`;

            const addToCartBtn = document.createElement("button");
            addToCartBtn.textContent = "🛒 Сагсанд нэмэх";
            addToCartBtn.classList.add("add-to-cart");

            addToCartBtn.addEventListener("click", () => {
                addToCart({
                    id: this.book.key,
                    title: this.book.title,
                    author: this.book.author_name ? this.book.author_name.join(", ") : "Тодорхойгүй",
                    year: this.book.first_publish_year || "Тодорхойгүй",
                    isbn: this.book.isbn ? this.book.isbn[0] : "Тодорхойгүй"
                });
            });

            bookItem.appendChild(bookImage);
            bookItem.appendChild(bookTitle);
            bookItem.appendChild(bookAuthor);
            bookItem.appendChild(bookYear);
            bookItem.appendChild(bookISBN);
            bookItem.appendChild(addToCartBtn);

            return bookItem;
        }
    }

    // ✅ Open Library API-с номын мэдээлэл татах
    if (document.getElementById("product-list")) {
        fetch("https://openlibrary.org/search.json?q=programming&limit=10")
            .then((response) => response.json())
            .then((data) => {
                const productList = document.getElementById("product-list");
                productList.innerHTML = "";

                if (!data.docs || data.docs.length === 0) {
                    productList.innerHTML = "<p>Одоогоор номын мэдээлэл алга байна.</p>";
                    return;
                }

                data.docs.forEach((bookData) => {
                    const bookComponent = new BookComponent(bookData);
                    productList.appendChild(bookComponent.render());
                });
            })
            .catch((error) => console.error("Error fetching books:", error));
    }

    // ✅ Сагсны мэдээллийг cart.html хуудсан дээр харуулах
    const updateCartUI = () => {
        const cartItems = document.getElementById("cart-items");
        if (cartItems) {
            cartItems.innerHTML = "";
            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            if (cart.length === 0) {
                cartItems.innerHTML = "<p>📭 Таны сагс хоосон байна.</p>";
                return;
            }

            cart.forEach((item) => {
                const cartItem = document.createElement("div");
                cartItem.classList.add("cart-item");
                cartItem.innerHTML = `
                    <h3>${item.title}</h3>
                    <p>Зохиолч: ${item.author}</p>
                    <p>Нийтлэгдсэн он: ${item.year}</p>
                    <p>ISBN: ${item.isbn}</p>
                `;
                cartItems.appendChild(cartItem);
            });
        }
    };

    updateCartUI();

    // ✅ "Сагсыг хоослох" товчийг идэвхжүүлэх
    const clearCartBtn = document.getElementById("clear-cart");
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", () => {
            localStorage.removeItem("cart");
            updateCartUI();
            alert("Сагс хоосорлоо! 🗑️");
        });
    }
});
