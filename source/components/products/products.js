class Products {
  constructor(element) {
    this.pageButtons = element.querySelectorAll(`.pagination__button:not(.pagination__button--next)`);
    this.nextButton = element.querySelector(`.pagination__button--next`);
    this.list = element.querySelector(`.products__list`);
    this.template = this.list.querySelector(`li`).cloneNode(true);

    // Куда выводить ошибки сервера
    this.errorPlace = element.querySelector(`.products__error`);

    this.index = 1;

    this.setListeners();
  }

  setListeners() {
    for (let i = 0; i < this.pageButtons.length; i++) {
      this.pageButtons[i].addEventListener(`click`, (evt) => {
        evt.preventDefault();

        this.clickHandler(evt);
      });
    }

    this.nextButton.addEventListener(`click`, (evt) => {
      evt.preventDefault();

      const targetIndex = (this.index === this.pageButtons.length) ? 0 : this.index;
      this.pageButtons[targetIndex].click();
    });
  }

  clickHandler(evt) {
    for (let i = 0; i < this.pageButtons.length; i++) {
      if (this.pageButtons[i] === evt.currentTarget) {
        if (this.pageButtons[i].href) {
          this.pageButtons[i].removeAttribute(`href`);
          this.index = i + 1;

          functions.showPreloader();
          this.ajaxHandler();
        }
      } else {
        this.pageButtons[i].setAttribute(`href`, `#`);
      }
    }
  }

  ajaxHandler() {
    const self = this;

    ajax({
      url: `app/products.json`,
      statusPlace: self.errorPlace,
      callback(response) {
        self.listBuilder(response);
      },
      done() {
        functions.hidePreloader();
      }
    });
  }

  listBuilder(response) {
    const self = this;

    // IE 11
    if (typeof response === `string`) {
      response = JSON.parse(response);
    }
    const payload = response.slice((self.index - 1) * 6, self.index * 6);

    self.list.innerHTML = ``;
    scrollToHash(`#products`, 10);

    // Фейковая задержка для демонстрации работы прелоадера
    setTimeout(() => {
      for (let i = 0; i < payload.length; i++) {
        const item = payload[i];
        const element = self.template.cloneNode(true);

        const webp = element.querySelector(`source`);
        if (webp) {
          webp.setAttribute(`srcset`, item.img);
        }

        const img = element.querySelector(`.product__img`);
        img.setAttribute(`src`, item.img);
        img.setAttribute(`alt`, item.name);

        const headerLink = element.querySelector(`.product__link`);
        const header = headerLink.querySelector(`.product__name`);
        headerLink.href = item.href;
        header.innerHTML = item.name;

        element.querySelector(`.product__description`).innerHTML = item.description;
        element.querySelector(`.product__button`).href = item.url;

        self.list.insertAdjacentElement(`beforeend`, element);
      }

      functions.hidePreloader();
    }, 1000);
  }
}

applyClass(`.products`, Products);
