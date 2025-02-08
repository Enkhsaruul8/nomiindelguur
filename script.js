document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");

    // Dark Mode хадгалах, унших
    if (localStorage.getItem("dark-mode") === "true") {
        document.body.classList.add("dark-mode");
    }

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("dark-mode", document.body.classList.contains("dark-mode"));
    });

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

            const bookPages = document.createElement("p");
            bookPages.textContent = `Хуудасны тоо: ${this.book.number_of_pages_median || "Тодорхойгүй"}`;

            const bookISBN = document.createElement("p");
            bookISBN.textContent = `ISBN: ${this.book.isbn ? this.book.isbn[0] : "Тодорхойгүй"}`;

            const addToCartBtn = document.createElement("button");
            addToCartBtn.textContent = "Сагсанд нэмэх";
            addToCartBtn.classList.add("add-to-cart");
            addToCartBtn.dataset.id = this.book.key;
            addToCartBtn.dataset.title = this.book.title;

            bookItem.appendChild(bookImage);
            bookItem.appendChild(bookTitle);
            bookItem.appendChild(bookAuthor);
            bookItem.appendChild(bookYear);
            bookItem.appendChild(bookPages);
            bookItem.appendChild(bookISBN);
            bookItem.appendChild(addToCartBtn);

            return bookItem;
        }
    }

    // 📌 **Open Library API-с номын мэдээлэл татах**
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

    // 📌 **Сагсны өгөгдөл хадгалах**
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem("cart")) || [];
    } catch (error) {
        console.error("Error parsing cart data:", error);
    }

    const updateCartUI = () => {
        const cartItems = document.getElementById("cart-items");
        if (cartItems) {
            cartItems.innerHTML = "";
            cart.forEach((item) => {
                const cartItem = document.createElement("div");
                cartItem.innerHTML = `<p>${item.title} сагсанд нэмэгдсэн.</p>`;
                cartItems.appendChild(cartItem);
            });
        }
    };

    updateCartUI();

    document.body.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-to-cart")) {
            const productId = event.target.getAttribute("data-id");
            const productTitle = event.target.getAttribute("data-title");

            cart.push({ id: productId, title: productTitle });
            localStorage.setItem("cart", JSON.stringify(cart));

            updateCartUI();
        }
    });
});
