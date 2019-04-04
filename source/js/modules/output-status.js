// Вывод статуса ответа в DOM-элемент place

const outputStatus = (place = null, status = ``, done = () => {
  return false;
}) => {
  if (place instanceof HTMLElement) {
    place.textContent = status;

    if (status) {
      place.classList.remove(`hidden`);
      done();
    } else {
      place.classList.add(`hidden`);
    }
  }
};
