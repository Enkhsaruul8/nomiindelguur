document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Fetch books from JSON
    if (document.getElementById('product-list')) {
        fetch('https://dummyjson.com/products/category/books')
            .then(response => response.json())
            .then(data => {
                const productList = document.getElementById('product-list');
                data.products.forEach(book => {
                    const bookItem = document.createElement('div');
                    bookItem.classList.add('product');
                    bookItem.innerHTML = `
                        <img src="${book.thumbnail}" alt="${book.title}" style="width:100px; height:100px;">
                        <h3>${book.title}</h3>
                        <p>${book.description}</p>
                        <p>Зохиолч: ${book.author || 'Тодорхойгүй'}</p>
                        <p>Үнэ: $${book.price}</p>
                        <p>Үнэлгээ: ${book.rating} ⭐</p>
                        <button class="add-to-cart" data-id="${book.id}">Сагсанд нэмэх</button>
                    `;
                    productList.appendChild(bookItem);
                });
            })
            .catch(error => console.error('Error fetching books:', error));
    }

    // Cart functionality
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const productId = event.target.getAttribute('data-id');
            alert(`Ном #${productId} сагсанд нэмэгдлээ!`);
        }
    });
});
