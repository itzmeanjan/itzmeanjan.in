'use strict';

window.addEventListener('DOMContentLoaded', () => {
    function handleError(e) {
        let childDiv = document.createElement('div');
        childDiv.className = 'childDiv';
        let article = document.createElement('article');
        let h1 = document.createElement('h1');
        h1.innerHTML = 'Coming soon ...';
        article.appendChild(h1);
        childDiv.appendChild(article);
        parentDiv.appendChild(childDiv);
    }

    let parentDiv = document.getElementById('parentDiv');
    fetch(`${window.location.href.toString()}.json`).then((data) => {
        data.json().then((dataInnner) => {
            // to be filled soon ...
        }, handleError);
    }, handleError);
});
