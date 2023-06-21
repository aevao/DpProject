let desc = document.querySelector('.cart-items')
let total = document.querySelector('.total')


let totalSum = 0 
render()
function render () {
    const cart =  JSON.parse(localStorage.getItem("data"));
    desc.innerHTML = ''
    cart.forEach((item) => {
        desc.innerHTML += ` <li class="item">
        <img class="item_img" src=${item.image} alt="Product 1">
        <h3 class="item_title">${item.title}</h3>
        <div>
        <p class="item_price">Цена: ${item.price}$</p>
        <button class="delete" onclick="deleteCartProduct(${item.id})">Delete</button>      
        </div>
        </li>`
        
    });
}

totalPrice()
function totalPrice () {
    let data = JSON.parse(localStorage.getItem("data"));
    for(let i = 0 ; i < data.length; i++) {
        
        totalSum += data[i].price
    }
    render()
}


console.log(totalSum);
total.innerHTML = ` Общая Сумма ${totalSum} $`


const cartCleaner = () => {
    localStorage.removeItem("data");
    render()
  };


  const deleteCartProduct = (id) => {
    let cart = JSON.parse(localStorage.getItem("data"));
    cart = cart.filter((elem) => elem.id !== id);
    localStorage.setItem("data", JSON.stringify(cart));
    totalPrice()
    render()

    
  };