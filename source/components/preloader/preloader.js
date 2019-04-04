class Preloader {
  constructor(element) {
    this.element = element;

    this.setInitials();
  }

  setInitials() {
    const self = this;

    functions.showPreloader = () => {
      self.element.classList.remove(`hidden`);
    };
    functions.hidePreloader = () => {
      self.element.classList.add(`hidden`);
    };
  }
}

applyClass(`.preloader`, Preloader);
