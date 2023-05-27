/*Retorna os produtos e constroi o html com os valores*/
window.onload = () => {
    retrieve_products();
    retrieve_categories();
    window.document.getElementById('filter-button').addEventListener('click', filter_by_category)
    window.document.getElementById('remove-button').addEventListener('click', remove_filter)
    window.document.getElementById('search').addEventListener('input', search_items)
    window.document.getElementById('btn-search').addEventListener('click', search_items)
}

function retrieve_products() {
    fetch('http://diwserver.vps.webdock.cloud:8765/products')
        .then(res => res.json())
        .then(data => {
            productCards = '';
            mostViewedProducts = '';
            for (let i = 0; i < data.products.length; i++) {
                let produto = data.products[i];

                productCards +=
                    `<div class="p-card card col-lg-3 col-md-4 col-xs-12">
                        <img src=${produto.image} alt="">
                        <a class="d-block" href="detalhe.html?id=${produto.id}/">Detalhes do Produto</a>
                        <p class="category">${produto.category}</p>
                        <p class="book-tag">${produto.title}</p>
                        <p class="price-tag">R$:${produto.price}</p>
                    </div>`
                
                mostViewedProducts += `
                    <div class="destaque">
                        <img src="${produto.image}" alt="">
                        <a href="detalhe.html?id=${produto.id}">Descrição</a>
                        <p>$:${produto.price}</p>
					</div>`
            }
            document.getElementById('most-viewed-container').innerHTML = mostViewedProducts;
            document.getElementById('row1').innerHTML = productCards;
        });
}

/*Filtra os produtos pela categoria, desabilitando os botoes quando necessario*/
function filter_by_category() {
    window.document.getElementById('remove-button').style.display = 'inline-block';
    searchButton = window.document.getElementById('filter-button');
    searchButton.disabled = true;
    searchButton.style.opacity = 0.3;

    categoryCombo = window.document.getElementById('select-category');
    categoryCombo.disabled = true;

    var selectedCategory = categoryCombo.value;
    
    fetch(`http://diwserver.vps.webdock.cloud:8765/products/category/${selectedCategory}`)
    .then(res => res.json())
    .then(data => {
        productCards = '';
        mostViewedProducts = '';
        for (let i = 0; i < data.products.length; i++) {
            let produto = data.products[i];

            productCards +=
                `<div class="p-card card col-lg-3 col-md-4 col-xs-12">
                    <img src=${produto.image} alt="">
                    <a class="d-block" href="detalhe.html?id=${produto.id}/">Detalhes do Produto</a>
                    <p class="category">${produto.category}</p>
                    <p class="book-tag">${produto.title}</p>
                    <p class="price-tag">R$:${produto.price}</p>
                </div>`
            
            mostViewedProducts += `
                <div class="destaque">
                    <img src="${produto.image}" alt="">
                    <a href="detalhe.html?id=${produto.id}">Descrição</a>
                    <p>$:${produto.price}</p>
                </div>`
        }
        document.getElementById('most-viewed-container').innerHTML = mostViewedProducts;
        document.getElementById('row1').innerHTML = productCards;
    });
}

/*Remove todos os filtros de categoria*/
function remove_filter() {
    var product_cards = window.document.getElementsByClassName('card');
    window.document.getElementById('select-category').disabled = false;
    retrieve_products();
}

/*Retorna todas as categorias e constroi html com os valores*/
function retrieve_categories() {
    window.document.getElementById('remove-button').style.display = 'none';
    fetch('http://diwserver.vps.webdock.cloud:8765/products/categories')
        .then(res => res.json())
        .then(categorias => {
            select_category = window.document.getElementById('select-category');
            for (let i = 0; i < categorias.length; i++) {
                option = new Option(categorias[i], categorias[i]);
                select_category.options.add(option);
            }
        })
}

/*busca os itens, tanto pelo botao de pesquisa no header quanto em cada letra digitada do input*/
function search_items() {
    var product_cards = window.document.getElementsByClassName('card');
    var input_search = window.document.getElementById('search').value;
  
    fetch(`http://diwserver.vps.webdock.cloud:8765/products/search?query=${input_search}`)
    .then(res => res.json())
    .then(data => {
        productCards = '';
        for (let i = 0; i < data.length; i++) {
            let produto = data[i];

            productCards +=
                `<div class="p-card card col-lg-3 col-md-4 col-xs-12">
                    <img src=${produto.image} alt="">
                    <a class="d-block" href="detalhe.html?id=${produto.id}/">Detalhes do Produto</a>
                    <p class="category">${produto.category}</p>
                    <p class="book-tag">${produto.title}</p>
                    <p class="price-tag">R$:${produto.price}</p>
                </div>`
        }
        document.getElementById('row1').innerHTML = productCards;
    });
}