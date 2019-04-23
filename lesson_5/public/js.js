const API_URL = 'http://localhost:3000';

const app = new Vue({
    el: '#app',
    data: {
        items: [],
        filteredItems: [],
        searchQuery: '',
        isVisibleCart: false,
        cart: [],
    },
    mounted() {
        // запрашиваем товары
        // записываем результат в 2 массива
        // (чтобы во время "фильтра" не делать повторных запросов,
        // а пробегаться по первому массиву и менять второй)
        fetch(`${API_URL}/products`)
            .then(response => response.json())
            .then((items) => {
                this.items = items;
                this.filteredItems = items;
            });
        // запрашиваем нашу корзину
        // записываем ответ в массив cart
        fetch(`${API_URL}/cart`)
            .then(response => response.json())
            .then((items) => {
                this.cart = items;
                if (this.cart.length > 0) {
                    this.isVisibleCart = true;
                }
            });
    },
    computed: {
        // постоянно пересчитываемая сумма корзины
        total() {
            return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        }
    },
    methods: {
        // удаление товара из корзины
        handleDeleteClick(item) {
            if (item.quantity > 1) {
                fetch(`${API_URL}/cart/${item.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({quantity: item.quantity - 1}),
                })
                    .then((response) => response.json())
                    .then((item) => {
                        const itemIdx = this.cart.findIndex((entry) => entry.id === item.id);
                        // рабочая строка кода вместо написанной далее
                        // ее следует заменить на написанную вместо нее
                        // при возникновении проблем
                        // this.cart[itemIdx].quantity = item.quantity;
                        Vue.set(this.cart, itemIdx, item);
                    });
            } else {
                fetch(`${API_URL}/cart/${item.id}`, {
                    method: 'DELETE',
                })
                    .then(() => {
                        this.cart = this.cart.filter((cartItem) => cartItem.id !== item.id);
                        if (this.cart.length === 0) {
                            this.isVisibleCart = false;
                        }
                    });
            }
        },
        // поиск по списку товаров
        handleSearchClick() {
            const regexp = new RegExp(this.searchQuery, 'i');
            this.filteredItems = this.items.filter((item) => regexp.test(item.name));
        },
        // покупка товра
        handleBuyClick(item) {
            if (this.isVisibleCart === false) {this.isVisibleCart = true;}

            const cartItem = this.cart.find((entry) => entry.id === item.id);
            if (cartItem) {
                // товар в корзине уже есть, нужно увеличить количество
                fetch(`${API_URL}/cart/${item.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({quantity: cartItem.quantity + 1}),
                })
                    .then((response) => response.json())
                    .then((item) => {
                        const itemIdx = this.cart.findIndex((entry) => entry.id === item.id);
                        Vue.set(this.cart, itemIdx, item);
                    });
            } else {
                // товара в корзине еще нет, нужно добавить
                fetch(`${API_URL}/cart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({...item, quantity: 1})
                })
                    .then((response) => response.json())
                    .then((item) => {
                        this.cart.push(item);
                    });
            }
        }
    }
});