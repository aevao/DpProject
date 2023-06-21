console.log(1234);

const API = "http://161.35.23.244:8080//api/v1/products/";

let search = document.querySelector(".Nav-search_inp");
console.log(search);
let searchVal = "";

let categoryValue = "";

let checks1 = ''

let products = document.querySelector(".products");
render();
async function render() {
  let addProduct = await fetch(
    `${API}?search=${searchVal}&_limit=3&${
      categoryValue ? `category_id=${categoryValue}` : ""
    }`
  ).then((res) => res.json());
  

  products.innerHTML = "";
  // отрисовка карточек, где на каждый объект, рендерится одна карточка
  addProduct.forEach((item) => {
    checkProductCart(item.id)
    let checks = checkProductCart(item.id)
    if(checks === true) {
      checks1 = 'green'
    }else{
      checks1 = ''
    }
    products.innerHTML += `
    <div class = 'product_card'>

    <img alt="Ссылка на фотографию неверна" src = ${item.image} class = 'product-image'/>
    <p class = 'product-title'>${item.title}</p>
    <div class = "cart">
    <p class = 'product-price'>Price: ${item.price}$ </p>
    <button class="cart_btn" style="background-color:${checks1};" onclick="addToCart(${item.id}) "><img src="./img/cart.png" alt="" class="cart_icon"></button>
    </div>
    </div>
    `;
  });
  // render()
  
}


 let renderCart= () => {
  render()
}
// FILTER
// функция для фильтрации по категориям
function fetchByParams(value) {
  // помещаем в categoryValue выбранную категорию
  categoryValue = value;
  // вызов функции для отрисовки с учетом categoryValue
  render();
}
// FILTER

// SEARCH
search.addEventListener("input", () => {
  searchVal = search.value;
  render();
});
// SEARCH

// Cart

let cartBtn = document.querySelector(".nav-cart");

async function addToCart(id) {
  let objToEdit = await fetch(`${API}/${id}`).then((res) => res.json());
  if (!localStorage.getItem("data")) {
    localStorage.setItem("data", "[]");
  }
  
  let data = JSON.parse(localStorage.getItem("data"));
  
  data.push(objToEdit);
  localStorage.setItem("data", JSON.stringify(data));
  render()
}

const checkProductCart = (id) => {
  let cart = JSON.parse(localStorage.getItem("data"));
  if (cart) {
    let newCart = cart.filter((elem) => elem.id === id);
    return newCart.length > 0 ? true : false;
  }
  
};


// ! Burger Menu
let burgerBtn = document.querySelector('.burger-btn')
let burgerDesc = document.querySelector('.burger_desc')
let closeBurger = document.querySelector('.close_burger')

burgerBtn.addEventListener('click', () => {
  burgerDesc.style.display = 'block'
})

closeBurger.addEventListener('click', () => {
  burgerDesc.style.display = 'none'
})

// ! Burger Menu

const slider = document.querySelector(".slider");
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;

slider.addEventListener("mousedown", dragStart);
slider.addEventListener("touchstart", dragStart);
slider.addEventListener("mouseup", dragEnd);
slider.addEventListener("touchend", dragEnd);
slider.addEventListener("mousemove", drag);
slider.addEventListener("touchmove", drag);

function dragStart(event) {
  event.preventDefault();
  if (event.type === "touchstart") {
    startPos = event.touches[0].clientX;
  } else {
    startPos = event.clientX;
    slider.style.cursor = "grabbing";
  }
  isDragging = true;
  animationID = requestAnimationFrame(animation);
}

function drag(event) {
  if (isDragging) {
    let currentPosition = 0;
    if (event.type === "touchmove") {
      currentPosition = event.touches[0].clientX;
    } else {
      currentPosition = event.clientX;
    }
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}

function dragEnd() {
  cancelAnimationFrame(animationID);
  isDragging = false;
  const movedBy = currentTranslate - prevTranslate;
  if (movedBy < -100) {
    // Прокрутка вправо
    currentTranslate = prevTranslate - 300;
  } else if (movedBy > 100) {
    // Прокрутка влево
    currentTranslate = prevTranslate + 300;
  }
  setPositionByIndex();
}

function animation() {
  setSliderPosition();
  if (isDragging) {
    requestAnimationFrame(animation);
  }
}

function setSliderPosition() {
  slider.style.transform = `translateX(${currentTranslate}px)`;
}

function setPositionByIndex() {
  if (currentTranslate > 0) {
    currentTranslate = 0;
  } else if (currentTranslate < -(slider.children.length - 1) * 300) {
    currentTranslate = -(slider.children.length - 1) * 300;
  }
  setSliderPosition();
  prevTranslate = currentTranslate;
}
