"use strict";

class Cart {
    constructor() {}
    add() {}
    remove() {}
    render() {}
}

class Item {
    constructor(photo, name, price) {
        this.photo = photo;
        this.name = name;
        this.price = price;
    }

    render() {
        return `
            <li class="drop-basket__li">
                <img class="drop-basket__photo" src="${this.photo}" alt="${this.name}">
                <div class="drop-basket__li-text">
                    <h4 class="drop-basket__name">${this.name}</h4>
                    <p class="drop-basket__rating">
                        <i class="fas fa-star drop-basket__i-rate"></i>
                        <i class="fas fa-star drop-basket__i-rate"></i>
                        <i class="fas fa-star drop-basket__i-rate"></i>
                        <i class="fas fa-star drop-basket__i-rate"></i>
                        <i class="fas fa-star drop-basket__i-rate"></i>
                    </p>
                    <p class="drop-basket__info">
                        <span class="drop-basket__amount">1</span> x <span
                            class="drop-basket__price">$${this.price}</span>
                    </p>
                </div>
                <a href="#" class="drop-basket__close">
                    <i class="fas fa-times-circle drop-basket__i-close"></i>
                </a>
            </li>
        `
    }
}

class ItemsList {
    constructor() {
        this.items = this.items.map(item => new Item(item.photo, item.name, item.price));
    }

    fetchItems() {}

    render() {
        let result = '<ul class="drop-basket__ul">';
        result += this.items.map(item => item.render()).join('');
        result += '</ul>';

        return result;
    }


}

