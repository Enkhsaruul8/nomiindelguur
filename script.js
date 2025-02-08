document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Dark Mode хадгалах, унших
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
    });

    // Open Library API-с ном татах
    if (document.getElementById('product-list')) {
        fetch('https://openlibrary.org/search.json?q=programming&limit=10')
            .then(response => response.json())
            .then(data => {
                console.log("Fetched Data:", data); // Өгөгдөл зөв ирж байгаа эсэхийг шалгах

                const productList = document.getElementById('product-list');
                productList.innerHTML = '';

                if (!data.docs || data.docs.length === 0) {
                    productList.innerHTML = "<p>Одоогоор номын мэдээлэл алга байна.</p>";
                    return;
                }

                data.docs.forEach(book => {
                    const bookItem = document.createElement('div');
                    bookItem.classList.add('product');
                    bookItem.innerHTML = `
                        <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" alt="${book.title}" style="width:150px; height:200px;">
                        <h3>${book.title}</h3>
                        <p>Зохиолч: ${book.author_name ? book.author_name.join(', ') : 'Тодорхойгүй'}</p>
                        <p>Нийтлэгдсэн он: ${book.first_publish_year || 'Тодорхойгүй'}</p>
                        <p>Хуудасны тоо: ${book.number_of_pages_median || 'Тодорхойгүй'}</p>
                        <p>ISBN: ${book.isbn ? book.isbn[0] : 'Тодорхойгүй'}</p>
                        <button class="add-to-cart" data-id="${book.key}" data-title="${book.title}">Сагсанд нэмэх</button>
                    `;
                    productList.appendChild(bookItem);
                });
            })
            .catch(error => console.error('Error fetching books:', error));
    }

    // Сагсны өгөгдөл хадгалах
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (error) {
        console.error("Error parsing cart data:", error);
    }

    const updateCartUI = () => {
        const cartItems = document.getElementById('cart-items');
        if (cartItems) {
            cartItems.innerHTML = '';
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.innerHTML = `<p>${item.title} сагсанд нэмэгдсэн.</p>`;
                cartItems.appendChild(cartItem);
            });
        }
    };

    updateCartUI();

    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const productId = event.target.getAttribute('data-id');
            const productTitle = event.target.getAttribute('data-title');
            
            // Сагсанд нэмэх
            cart.push({ id: productId, title: productTitle });
            localStorage.setItem('cart', JSON.stringify(cart));

            updateCartUI();
        }
    });
});
