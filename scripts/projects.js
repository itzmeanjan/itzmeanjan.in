'use strict';

window.addEventListener('DOMContentLoaded', () => {
    function handleError(e) {
        let childDiv = document.createElement('div');
        childDiv.className = 'childDiv';
        let article = document.createElement('article');
        let h1 = document.createElement('h1');
        h1.innerHTML = 'projects';
        let para = document.createElement('p');
        para.innerHTML = 'Check out my open source works <a class="simpleLink" href="https://github.com/itzmeanjan?tab=repositories" target="_blank">here</a>. Consider following me there.';
        article.appendChild(h1);
        article.appendChild(para);
        childDiv.appendChild(article);
        parentDiv.appendChild(childDiv);
    }

    let parentDiv = document.getElementById('parentDiv');
    fetch(`${window.location.href.toString()}.json`).then((data) => {
        data.json().then((dataInner) => {
            Object.keys(dataInner).map((val) => {
                let childDiv = document.createElement('div');
                childDiv.className = 'childDiv';
                let article = document.createElement('article');
                let h1 = document.createElement('h1');
                let anchor = document.createElement('a');
                anchor.href = dataInner[val].url;
                anchor.target = '_blank';
                anchor.innerHTML = val;
                anchor.className = 'simpleLink';
                h1.appendChild(anchor);
                let para = document.createElement('p');
                para.innerHTML = dataInner[val].description;
                let langTag = document.createElement('p');
                langTag.style.color = dataInner[val].langColor;
                langTag.innerHTML = `${dataInner[val].lang} | ${(new Date(dataInner[val].updated*1000)).toDateString()}`;
                article.appendChild(h1);
                article.appendChild(para);
                article.appendChild(langTag);
                childDiv.appendChild(article);
                return childDiv;
            }).forEach((elem) => { parentDiv.appendChild(elem); });
        }, handleError);
    }, handleError);
});
