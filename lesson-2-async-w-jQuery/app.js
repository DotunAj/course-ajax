/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        //unsplash Request handling
        $.ajax({
                url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
                headers: {Authorization: 'Client-ID ee01ed7207770809a2fc3e156719e82185237cb0f20ad87398a058cccb876c2c'}
        }).done(addImage);

        //nytimes Request handling
        $.ajax({
                url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=1199efddd1c74eaca0d6f9cff9a80985`,
        }).done(addArticles);

    });

    function addImage(images){
        let htmlContent = '';
        const selectedImage = images.results[0]
        if(images && images.results && images.results[0]) {
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

    function addArticles(articless){
        let htmlContent = '';
        const articles = articless.response.docs;
        if(articless && articless.response && articless.response.docs && articless.response.docs.length > 1 ){
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
