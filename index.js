var filtrado = false;

/*Fazendo as operações/setando funções importantes ao carregar a página*/
window.onload = () => {
    //preencher a paginação inicial
    fill_pages()

    //colocar todas as categorias na caixa de seleção de categorias
    retrieve_categories();

    //forçando o carregamento dos dados da primeira página (solução ruim)
    retrieve_products(1);

    //Vinculando funções aos eventos
    window.document.getElementById('filter-button').addEventListener('click', filter_by_category)
    window.document.getElementById('remove-button').addEventListener('click', remove_filter)
    window.document.getElementById('search').addEventListener('input', search_items)
    window.document.getElementById('btn-search').addEventListener('click', search_items)
    window.document.getElementById('combo-paginas').addEventListener('change', () => {
        var comboPaginas = document.getElementById('combo-paginas').value;
        if (!filtrado) {
            retrieve_products(comboPaginas);
        } else {
            load_filtered_elements(comboPaginas);
        }
    })
}

//Removendo as opções da paginação quando necessário
function removeOptions(combo) {
    //enquanto a caixa de selecao tiver opcoes, remove cada opcao, uma por uma
    while (combo.options.length > 0) {
        combo.remove(0);
    }
}

//Jeito simples e meio feio de fazer um loading
function loading(done) {
    //basicamente adequacoes de estilo para carregando e já carregado
    if (done) {
        document.body.style.opacity = .5;
        document.getElementById('loading').style.display = "flex";
    } else {
        document.body.style.opacity = 1;
        document.getElementById('loading').style.display = "none";
    }
}

//função bem ruim pra pegar a quantidade de páginas totais da requisicao geral e jogar na comboBox
function fill_pages() {
    //seleciona a combo de paginas e adiciona elas a caixa de selecao de pagina
    comboPaginas = document.getElementById('combo-paginas');
    fetch(`https://diwserver.vps.webdock.cloud/products?page=1&page_itens=9`)
        .then(res => res.json())
        .then(data => {
            for (let i = 1; i <= data.total_pages; i++) {
                option = new Option(`Página ${i}`, i);
                comboPaginas.options.add(option);
            }
        comboPaginas.selectedIndex = 0;  
        });
}

//retornar todos os produtos de forma paginada
function retrieve_products(page) {
    //Indica que a paginacao deve fazer a requisicao para a consulta mais geral
    filtrado = false;

    //Pesquisando todos os produtos na API e montando o HTML
    fetch(`https://diwserver.vps.webdock.cloud/products?page=${page}&page_items=9`)
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

            //Retirando a informacao de loading quando a requisicao estiver completa;
            loading(false);
        });
    /*Como a requisicao é assincrona, mesmo colocando isso aqui depois, o loading ira acabar, pois dentro do fetch
    ha o loading(false) que deve ser executado um pouquinho de tempo depois, dado o tempinho que demora pra requisição retornar.
    Em suma, enquanto a requisicao nao retornar os dados e o html não for montado, mantem o loading, pois isso aqui pode ser
    executado enquanto a requisicao ainda acontece*/
    loading(true);
}

/*Filtra os produtos pela categoria de forma paginada, desabilitando os botoes quando necessario*/
function filter_by_category(page) {
    //indica pro evento de paginacao que agora as paginas sao dessa requisicao e nao pra mais geral
    filtrado = true;

    //Adequacoes de estilo, como desabilitar o proprio botao de filtro e habilitar o botao de remover o filtro
    window.document.getElementById('remove-button').style.display = 'inline-block';
    searchButton = window.document.getElementById('filter-button');
    searchButton.disabled = true;
    searchButton.style.opacity = 0.3;

    //desabilitando a caixa de seleção
    categoryCombo = window.document.getElementById('select-category');
    categoryCombo.disabled = true;

    comboPaginas = document.getElementById('combo-paginas');
    removeOptions(comboPaginas);
    load_filtered_elements(1);
}

function load_filtered_elements(page){
    //pegando a categoria selecionada e passando pra requisicao a API p/ montar o HTML
    var selectedCategory = window.document.getElementById('select-category').value;
    fetch(`https://diwserver.vps.webdock.cloud/products/category/${selectedCategory}?page=${page}&page_items=9`)
        .then(res => res.json())
        .then(data => {
            //removendo todas as opcoes de paginacao ja existentes na combo e 
            //adicionado as paginas somente dessa requisicao
            comboPaginas = document.getElementById('combo-paginas');

            if (comboPaginas.options.length == 0) {
                for (let i = 1; i <= data.total_pages; i++) {
                    option = new Option(`Página ${i}`, i);
                    comboPaginas.options.add(option);
                }
            }

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
            loading(false)
        });
    loading(true);
}

/*Remove todos os filtros de categoria*/
function remove_filter() {
    //botão de filtro e caixa de seleção ficam habilitados novamnete ao remover o filtro
    searchButton = window.document.getElementById('filter-button');
    window.document.getElementById('select-category').disabled = false;

    //volta a preencher as páginas com a quantidade de páginas da requisição mais geral, que retorna todos os produtos
    fill_pages();

    //retorna todos os produtos novamente
    retrieve_products(1);

    //explicita pro usuario que o filtro foi removido
    alert('Filtro removido');

    //botão de remover não aparece mais depois da operação de remoção do filtro estiver ok
    window.document.getElementById('remove-button').style.display = 'none';
    searchButton.disabled = false;
    searchButton.style.opacity = 1;
}

/*Retorna todas as categorias e constroi html com os valores*/
function retrieve_categories() {
    //Botao de remover fica invisivel pela primeira vez que as categorias sao carregadas
    window.document.getElementById('remove-button').style.display = 'none';

    //realiza a requisicao assincrona a API e monta as opções com as categorias
    fetch('https://diwserver.vps.webdock.cloud/products/categories')
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
    
    //Valor digitado pelo usuario no campo de pesquisa
    let input_search = window.document.getElementById('search').value;

    //Div contendo as opcoes de paginacao
    let container_paginacao = document.getElementById('container-paginacao');

    //Desabilita a paginacao se tiver algo digitado no campo, pois todos os resultados sao retornados em uma so pagina
    if (input_search.length > 0) {
        container_paginacao.style.display = 'none';
        window.document.getElementById('remove-button').style.display = 'none';
        searchButton.disabled = false;
        searchButton.style.opacity = 1;
    } else {
        container_paginacao.style.display = 'flex';
    }

    //realizando a requisicao assincrona a API para buscar por nome e montando o html
    fetch(`https://diwserver.vps.webdock.cloud/products/search?query=${input_search}`)
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