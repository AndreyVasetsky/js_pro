"use strict";

const products = [
    {photo: 'img/item1.jpg', name: 'Mango People T-shirt', price: 52.00 },
    {photo: 'img/item2.jpg', name: 'Mango People T-shirt', price: 52.00 },
    {photo: 'img/item3.jpg', name: 'Mango People T-shirt', price: 52.00 },
    {photo: 'img/item4.jpg', name: 'Mango People T-shirt', price: 52.00 },
    {photo: 'img/item5.jpg', name: 'Mango People T-shirt', price: 52.00 },
    {photo: 'img/item6.jpg', name: 'Mango People T-shirt', price: 52.00 },
    {photo: 'img/item7.jpg', name: 'Mango People T-shirt', price: 52.00 },
    {photo: 'img/item8.jpg', name: 'Mango People T-shirt', price: 52.00 },
];

// перезаписываем html блоку с классом .products
const renderProductList = items => {
    document.querySelector('.products').innerHTML = items.map(renderProductItem).join('');
};

// возвращаем строку содержащую html, созданную на основе переданного нам объекта
const renderProductItem = ({photo, name, price}) => `
    <div class="product">
        <div class="product__photo-container">
            <a class="product__photo" href="single-page.html">
                <img class="product__img" src="${photo}" alt="">
            </a>
        </div>
        <div class="product__info">
            <p class="product__name">${name}</p>
            <div class="product__d flex_jc-sb">
                <p class="product__price">$${price}</p>
                <p class="product__rating">
                    <i class="fas fa-star product__i-rate"></i>
                    <i class="fas fa-star product__i-rate"></i>
                    <i class="fas fa-star product__i-rate"></i>
                    <i class="fas fa-star product__i-rate"></i>
                    <i class="far fa-star product__i-rate"></i>
                </p>
            </div>
        </div>
        <div class="product__modal">
            <a class="product__add" href="#">Add to Cart</a>
        </div>
    </div>
`;

renderProductList(products);