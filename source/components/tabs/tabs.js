class Tabs {
  constructor(element) {
    this.list = element.querySelector(`.tabs__list`);
    this.items = element.querySelectorAll(`.tabs__item`);
    this.controlsBLock = element.querySelector(`.tabs__controls`);
    this.controls = this.controlsBLock.querySelectorAll(`.tabs__control`);

    this.setInitials();
    this.setListeners();
  }

  setInitials() {
    this.controlsBLock.classList.remove(`hidden`);
    this.controls[0].setAttribute(`disabled`, true);

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].style.position = `absolute`;

      if (i > 0) {
        // Чтобы при инициализации не показывались все сразу, потому что скрытие анимировано
        this.items[i].classList.add(`hidden`, true);
        setTimeout(() => {
          this.items[i].classList.remove(`hidden`);
        }, 33);

        this.items[i].classList.add(`tabs__item--hidden`);
      }
    }

    this.setParentHeight(0);
  }

  setListeners() {
    this.controlsBLock.addEventListener(`click`, (evt) => {
      const currentIndex = getNodeIndex(this.controls, evt.target);
      if (currentIndex > -1) {
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].classList.add(`tabs__item--hidden`);
          this.controls[i].removeAttribute(`disabled`);
        }

        this.items[currentIndex].classList.remove(`tabs__item--hidden`);
        this.controls[currentIndex].setAttribute(`disabled`, true);

        this.setParentHeight(currentIndex);
      }

      evt.target.blur();
    });
  }

  // Устанавливаем высоту родителя абсолютных элементов по высоте текущего
  setParentHeight(childIndex) {
    this.list.style.height = `${this.items[childIndex].offsetHeight}px`;
  }
}

applyClass(`.tabs`, Tabs);
