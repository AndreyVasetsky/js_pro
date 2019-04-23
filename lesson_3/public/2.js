// ----------------------------------------------

// Добавьте в соответствующие классы методы:
//  добавления товара в корзину,
//  удаления товара из корзины и
//  получения списка товаров корзины.

// ----------------------------------------------
const $cart = document.querySelector('#cart');
const $goods = document.querySelector('#goods');
// ----------------------------------------------

$cart.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove')) {
        cart.remove(e.target);
    }
});

$goods.addEventListener('click', (e) => {
    if (e.target.classList.contains('add')) {
        const id = e.target.dataset.id;
        cart.add(id);
    }
});

// ----------------------------------------------


class Cart {
    constructor() {
        this.items = [];
    }

    // добавление товара в корзину
    add(id) {
        fetch(`/products/${id}`)
            .then((response) => response.json())
            .then((item) => {

                let itemName = item.name;
                let itemPrice = item.price;

                fetch('/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: itemName,
                        price: itemPrice
                    }),
                })
                .then((response) => response.json())
                .then((item) => {
                    $cart.innerHTML += `<li>${item.name}: ${item.price} <button class="remove" data-id="${item.id}">x</button></li>`;
                })
            });
    }

    // удаление товара из корзины
    remove(el) {
        const id = el.dataset.id;

        fetch(`/cart/${id}`, {
            method: 'DELETE'
        }).then(() => {
            $cart.removeChild(el.parentElement);
        });
    }

    // получение списка товаров корзины
    fetchItems() {
        fetch('/cart')
            .then((response) => response.json())
            .then((items) => {
                    $cart.innerHTML = items.map((item) => `<li>${item.name}: ${item.price} <button class="remove" data-id="${item.id}">x</button></li>`).join('');
            });
    }
}


// создать 1 товар
class Item {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    //метод для создания разметки
    render() {
        return `<div>
                    <h4>${this.name}</h4>
                    <span>${this.price}</span>
                    <button class="add" data-id="${this.id}">add to cart</button>
                </div>`
    }
}

// создать список товаров
class ItemsList {
    constructor() {
        this.items = [];
    }

    // метод, который запрашивает .json с товарами
    // затем генерирует из него список товаров
    // (создает объекты класса Item)
    // и записывает их в массив items класса ItemsList
    fetchItems() {
        return sendRequest(`/products`)
            .then(
                (items) => {this.items = items.map(item => new Item(item.id, item.name, item.price));}
            );
    }

    render() {
        return this.items.map(item => item.render()).join('');
    }
}

// создадим экземпляр класса списка товаров
const items = new ItemsList();

// вызываем метод fetchItems у созданного экземпляра
// этот метод отработает и после этого мы сгенерируем
// и заменим html содержимое блока с классом goods
items.fetchItems().then(
    () => {
        $goods.innerHTML = items.render();
    }
);

const cart = new Cart();
cart.fetchItems();


// функция для отправки ajax запросов
function sendRequest(url) {
    return fetch(url).then((response) => response.json());
}