/*Pagando o id passado pela URl como parametro e chamada ao metodo de construir o html*/
window.onload = () => {
    let param = new URLSearchParams(window.location.search);
    let productId = param.get("id");
    fillDetails(productId)
}

/*Construindo o html com os detalhes obtidos a partir da requisicao do produto*/
function fillDetails(productId){
    url = `http://diwserver.vps.webdock.cloud:8765/products/${productId}`
    fetch(url)
    .then(res => res.json())
    .then(produto => {

        rating_icons = ''
        integerRate = Math.round(produto.rating.rate);
        for(let i = 0; i < integerRate; i++){
            rating_icons += '<i style="color: yellow" class="fa-solid fa-star"></i>'
        }

        for(let i = 0; i < 5 -  integerRate; i++){
            rating_icons += '<i class="fa-regular fa-star"></i>'
        }

        product_detail = 
        `<div>
            <img src=${produto.image} alt="imagem do produto">
        </div>
        <div>
            <h5>${produto.title}</h5>
            <p><b>Product Description: </b>${produto.description}</p>
            <p><b>Product Rate: </b>${produto.rating.rate} ${rating_icons} (${produto.rating.count})</p>
            <p><b>Product Price: </b>$ ${produto.price}</p>
            <p><b>Product Category: </b>${produto.category}</p>
        </div>`

        document.getElementById('detalhe_produto').innerHTML = product_detail;
    })
}