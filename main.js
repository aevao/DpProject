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
