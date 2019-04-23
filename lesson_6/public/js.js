const API_URL = 'http://localhost:3000';

Vue.component('cart', {
    props: ['item'],
    data() {
        return {
            cart: [],
            isVisibleCart: false,
        }
    },
    mounted() {
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
    methods: {
        // удаление товара из корзины
        removeFromCart(item) {
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

    },
    computed: {
        // постоянно пересчитываемая сумма корзины
        total() {
            return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        }
    },
    watch: {
        item() {
            if (!this.item.name) {
                return;
            }

            if (this.isVisibleCart === false) {
                this.isVisibleCart = true;
            }

            const cartItem = this.cart.find((entry) => entry.id === this.item.id);

            if (cartItem) {
                // товар в корзине уже есть, нужно увеличить количество
                fetch(`${API_URL}/cart/${this.item.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({quantity: cartItem.quantity + 1}),
                })
                    .then((response) => response.json())
                    .then((item) => {
                        const itemIdx = this.cart.findIndex((entry) => entry.id === this.item.id);
                        this.cart[itemIdx].quantity = item.quantity;
                        this.$emit('cart-has-changed');
                        // Vue.set(this.cart, itemIdx, item);
                    });
            } else {
                // товара в корзине еще нет, нужно добавить
                fetch(`${API_URL}/cart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({...this.item, quantity: 1})
                })
                    .then((response) => response.json())
                    .then((item) => {
                        this.cart.push(item);
                        this.$emit('cart-has-changed');
                    });
            }


        }

    },
    template: `<div class="cart" v-if="isVisibleCart">
                    <h3>Корзина</h3>
                    <ul>
                        <li v-for="item in cart">{{item.name}} ({{item.quantity}})
                            <button @click="removeFromCart(item)">x</button>
                        </li>
                    </ul>
                    <div>Общая стоимость: {{total}}</div>
               </div>`
});


Vue.component('search', {
    data() {
        return {
            searchQuery: ''
        }
    },
    methods: {
        handleSearchClick() {
            this.$emit('new-search', this.searchQuery);
        }
    },
    template: `<div>
                    <input type="text" v-model="searchQuery"/>
                    <button @click="handleSearchClick">Поиск</button>
               </div>`,

});

Vue.component('product-list', {
    props: ['query'],
    data() {
        return {
            products: []
        };
    },
    mounted() {
        // запрашиваем товары
        fetch(`${API_URL}/products`)
            .then(response => response.json())
            .then((items) => {
                this.products = items;
            });
    },
    methods: {
        handleAddToCart(item) {
            this.$emit('add-to-cart', item);
        }
    },
    computed: {
        filteredItems() {
            if (this.query) {
                const regexp = new RegExp(this.query, 'i');
                return this.products.filter((item) => regexp.test(item.name));
            } else {
                return this.products;
            }
        }
    },
    template: `<div class="products">
                   <product v-for="item in filteredItems" :product="item" @add-to-cart="handleAddToCart"></product>
               </div>`

});

Vue.component('product', {
    props: ['product'],
    methods: {
        handleBuyClick(item) {
            this.$emit('add-to-cart', item);
        }
    },
    template: `<div class="product">
                   <h3>{{ product.name }}</h3>
                   <p>{{ product.price }} руб.</p>
                   <button @click="handleBuyClick(product)">AddToCart</button>
               </div>`
});

const app = new Vue({
    el: '#app',
    data: {
        itemToAdd: {},
        searchQuery: ''
    },
    methods: {
        handleAddToCart(item) {
            this.itemToAdd = item;
        },
        handleChangeCart() {
            this.itemToAdd = {};
        },
        handleSearchClick(data) {
            this.searchQuery = data;

        }
    },
});



