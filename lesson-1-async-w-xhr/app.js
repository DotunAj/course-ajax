(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        const unsplashRequest = new XMLHttpRequest();
        const nytimesRequest = new XMLHttpRequest();
        //unsplash Request handling
        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.onload = addImage;
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID ee01ed7207770809a2fc3e156719e82185237cb0f20ad87398a058cccb876c2c');
        unsplashRequest.send();

        //nytimes Request handling
        nytimesRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=1199efddd1c74eaca0d6f9cff9a80985`);
        nytimesRequest.onload = addArticles;
        nytimesRequest.send();
    });

    function addImage(){
        let htmlContent = '';
        const data = JSON.parse(this.responseText);
        const selectedImage = data.results[0]
        if(data && data.results && data.results[0]) {
            htmlContent = `
            <figure>
                <img src="${selectedImage.urls.regular}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${selectedImage.user.name}</figcaption>
            </figure>
            `
        }else{
            htmlContent = `<div class="error-no-image">No Image Found</div>`
        }
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticles(){
        let htmlContent = '';
        const data = JSON.parse(this.responseText);
        const articles = data.response.docs;
        if(data && data.response && data.response.docs && data.response.docs.length > 1 ){
            htmlContent=`
            <ul>
                ${articles.map(article => {
                    return `
                    <li class="article">
                        <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                        <p>${article.snippet}</p>
                    </li>`
                }).join(' ')}
            </ul`
        }else{
            htmlContent = `<div class="error-no-articles">No article found</div>`
        }
        responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }
})();
