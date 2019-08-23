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
            Object.keys(dataInnner).map((elem) => {
                let childDiv = document.createElement('div');
                childDiv.className = 'childDiv';
                let article = document.createElement('article');
                let h1 = document.createElement('h1');
                let anchor = document.createElement('a');
                anchor.href = `${window.location.href.toString()}/${elem}`;
                // anchor.target = '_blank';
                anchor.innerHTML = dataInnner[elem].title;
                anchor.className = 'simpleLink';
                h1.appendChild(anchor);
                let para = document.createElement('p');
                para.innerHTML = `${dataInnner[elem].content} ...`;
                let author = document.createElement('p');
                author.style.color = 'tomato';
                author.innerHTML = `${dataInnner[elem].author} | ${(new Date(dataInnner[elem].created * 1000).toDateString())}`;
                article.appendChild(h1);
                article.appendChild(para);
                article.appendChild(author);
                childDiv.appendChild(article);
                return childDiv;
            }).forEach((e) => {
                parentDiv.appendChild(e);
            });
        }, handleError);
    }, handleError);
});
