// 1 - переделать sendRequest, чтобы она использовала Promises

const $button = document.querySelector('#button');
const $phones = document.querySelector('#phones');

function sendRequest(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url); // настройка запроса
        xhr.send();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject();
                }
            }
        }
    });
}

$button.addEventListener('click', () => {
    sendRequest('/phones.json')
        .then((items) => {
            $phones.innerHTML = items.map((item) => `<li>${item.name}: ${item.phone}</li>`).join('');
        });
});



