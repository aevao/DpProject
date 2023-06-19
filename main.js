console.log(1234);



const API = 'http://161.35.23.244:8080//api/v1/products/'



let search = document.querySelector('.Nav-search_inp')
console.log(search)
let searchVal = "";

// pagination
let curentPage = 1;
let pageTotalCount = 1;
let paginationList = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

// pagination

let categoryValue = ''

let products = document.querySelector(".products");
render();
async function render() {
  // отправка запроса для получения продуктов с сервера&_limit=3&${
      // categoryValue ? `category=${categoryValue}`
  let addProduct = await fetch(`${API}?search=${searchVal}&_page=${curentPage}&_limit=3&${
    categoryValue ? `category_id=${categoryValue}` : ""}`).then((res) => res.json());
  console.log(addProduct);
  // отрисовка кнопок пагинации
  drawPaginationButtons();

  products.innerHTML = "";
  // отрисовка карточек, где на каждый объект в post, рендерится одна карточка
  addProduct.forEach((item) => {
    products.innerHTML += `
    <div class = 'product_card'>

    <img alt="Ссылка на фотографию неверна" src = ${item.image} class = 'product-image'/>
    <p class = 'product-title'>${item.title}</p>
    <div class = "cart">
    <p class = 'product-price'>Price: ${item.price}$ </p>
    <button class="cart_btn"><img src="./img/cart.png" alt="" class="cart_icon"></button>
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
search.addEventListener("input", ()=>{
  searchVal = search.value;
  render()
})
// SEARCH

// PAGINATION
// функция для отрисовки кнопок пагинации
function drawPaginationButtons() {
  // стягиваем все продукты для того, чтобы расчитать общее количество страниц, которое будет в пагинации
  fetch(`${API}?search=${searchVal}`)
  .then((res)=> res.json())
  .then((data)=> {
    // pageTotalCount - общее кол-во страниц
    pageTotalCount = Math.ceil(data.length/3);
    paginationList.innerHTML = "" // очистка, чтобы не дублировалось
    // отрисовка кнопок пагинации. Если текущая страница, то есть currentPage совпадает с какой либо из отрисованных(i), то ей присваивается класс active для того, чтобы понимать на какой странице находится пользователь
    for(let i =1; i<=pageTotalCount; i++){
      if(curentPage==i){
        let page =document.createElement('li')
      
        page.innerHTML = `<li class="page-item active"><a onclick = "changePage(${i})" class="page-link page-number" href="#">${i}</a></li> `
        paginationList.append(page);
      }
      else{
        let page =document.createElement('li')
      
        page.innerHTML = `<li class="page-item "><a onclick = "changePage(${i})" class="page-link page-number" href="#">${i}</a></li> `
        paginationList.append(page);
      }
    }

    // проверки на то, находится ли пользователь на первой или последней странице. Если на первой, то кнопка для перехода на предыдующую страницу недоступна. Если на последней, то недоступна кнопка для перехода на следующую страницу
    if(curentPage===1){
      prev.classList.add('disabled');
    }
    else{
      prev.classList.remove("disabled")
    }
    if(curentPage === pageTotalCount){
      next.classList.add('disabled')
    }
    else{
      next.classList.remove("disabled")
    }
  })
}

// слушатель событий для кнопки перехода на предыдущую страницу
prev.addEventListener('click',()=>{
  // проверка на то, что пользователь не находится на первой странице
  if(curentPage<=1){
    return
  }
  // если пользователь не находится не на первой странице, то уменьшаем на currentPage на 1
  curentPage--
  // вызов функции render с учетом currentPage
  render();
})

// слушатель событий для кнопки перехода на следущую страницу

next.addEventListener('click',()=>{
  // проверка на то, что пользователь не находится на последней странице

  if(curentPage>=pageTotalCount){
    return
  }
  curentPage++
  render();
})

// слушатель событий для нумерованных кнопок пагинации
// document.addEventListener('click',(e)=>{
//   if(e.target.classList.contains('page-number')){
//       currentPage = e.target.innerText;
//       render()
//   }
// });

// функция для перехода на конкретную страницу
function changePage(pageNumber) {
  curentPage = pageNumber;
  render()
}











































const slider = document.querySelector('.slider');
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;

slider.addEventListener('mousedown', dragStart);
slider.addEventListener('touchstart', dragStart);
slider.addEventListener('mouseup', dragEnd);
slider.addEventListener('touchend', dragEnd);
slider.addEventListener('mousemove', drag);
slider.addEventListener('touchmove', drag);

function dragStart(event) {
  event.preventDefault();
  if (event.type === 'touchstart') {
    startPos = event.touches[0].clientX;
  } else {
    startPos = event.clientX;
    slider.style.cursor = 'grabbing';
  }
  isDragging = true;
  animationID = requestAnimationFrame(animation);
}

function drag(event) {
  if (isDragging) {
    let currentPosition = 0;
    if (event.type === 'touchmove') {
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
