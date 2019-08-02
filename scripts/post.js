'use strict';


window.addEventListener('DOMContentLoaded', () => {
    function handleError(e) {
        let childDiv = document.createElement('div');
        childDiv.className = 'childDiv';
        childDiv.style.backgroundColor = 'darkslategrey';
        let article = document.createElement('article');
        let h1 = document.createElement('h1');
        h1.innerHTML = '&#x1f974';
        h1.style.fontSize = '5vmin';
        h1.style.marginLeft = '40vw';
        h1.title = 'Something went wrong !!!';
        h1.addEventListener('mouseenter', (ev) => {
            h1.innerHTML = '&#x1f92b';
            h1.style.fontSize = '8vmin';
        });
        h1.addEventListener('mouseleave', (ev) => {
            h1.innerHTML = '&#x1f974';
            h1.style.fontSize = '6vmin';
        });
        article.appendChild(h1);
        childDiv.appendChild(article);
        parentDiv.appendChild(childDiv);
    }

    let parentDiv = document.getElementById('parentDiv');
    fetch(`${window.location.href.toString()}.json`).then((data) => {
        data.json().then((dataInner) => {
            let childDiv = document.createElement('div');
            childDiv.className = 'childDiv';
            let article = document.createElement('article');
            let h1 = document.createElement('h1');
            h1.innerHTML = dataInner.title;
            let author = document.createElement('p');
            author.style.color = 'tomato';
            author.style.marginLeft = '2vmax';
            author.innerHTML = `${dataInner.author} | ${(new Date(dataInner.created * 1000)).toDateString()}`;
            let content = document.createElement('p');
            content.style.marginTop = '4vmax';
            content.innerHTML = dataInner.content.join(" ");
            article.appendChild(h1);
            article.appendChild(author);
            article.appendChild(content);
            childDiv.appendChild(article);
            parentDiv.appendChild(childDiv);
        }, handleError);
    }, handleError);
});
