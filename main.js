console.log(1234);

const API = "http://161.35.23.244:8080//api/v1/products/";

let search = document.querySelector(".Nav-search_inp");
console.log(search);
let searchVal = "";

let categoryValue = "";

let products = document.querySelector(".products");
render();
async function render() {
  let a = await fetch("http://161.35.23.244:8080/api/v1/products/");
  let b = await a.json();
  console.log(b);
  // отправка запроса для получения продуктов с сервера&_limit=3&${
  // categoryValue ? `category=${categoryValue}`
  let addProduct = await fetch(
    `${API}?search=${searchVal}&_limit=3&${
      categoryValue ? `category_id=${categoryValue}` : ""
    }`
  ).then((res) => res.json());
  console.log(addProduct);

  products.innerHTML = "";
  // отрисовка карточек, где на каждый объект в post, рендерится одна карточка
  addProduct.forEach((item) => {
    products.innerHTML += `
    <div class = 'product_card'>

    <img alt="Ссылка на фотографию неверна" src = ${item.image} class = 'product-image'/>
    <p class = 'product-title'>${item.title}</p>
    <div class = "cart">
    <p class = 'product-price'>Price: ${item.price}$ </p>
    <button class="cart_btn" onclick="editProduct(${item.id})"><img src="./img/cart.png" alt="" class="cart_icon"></button>
    </div>
    </div>
    `;
  });
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

async function editProduct(id) {
  // стягиваем редактируемый продукт
  let objToEdit = await fetch(`${API}/${id}`).then((res) => res.json());
  console.log(objToEdit);
  localStorage.setItem("data", JSON.stringify(objToEdit));
}

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
