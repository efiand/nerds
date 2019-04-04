class Range {
  constructor(element) {
    this.block = element.querySelector(`.range__block`);
    this.progress = this.block.querySelector(`.range__progress`);
    this.controlMin = this.block.querySelector(`.range__control-min`);
    this.controlMax = this.block.querySelector(`.range__control-max`);
    this.inputMin = element.querySelector(`.range__input-min`);
    this.inputMax = element.querySelector(`.range__input-max`);

    this.step = +this.inputMin.step;

    // Поправка на левый отступ от контейнера
    this.initialLeft = getStyle(this.controlMin, `left`);

    // Минимально допустимая разница крайнего значения одного инпута
    // и текущего значения другого, чтобы они не соприкасались
    this.safeDistance = getStyle(this.controlMin, `width`, `:before`);
    this.safeValue = this.safeDistance * this.step;

    this.setInitials();
    this.setListeners();
  }

  setInitials() {
    this.block.classList.remove(`hidden`);

    this.refresh();
  }

  setListeners() {
    this.inputMin.addEventListener(`change`, (evt) => {
      this.changeHandler(evt.target);
    });

    this.inputMax.addEventListener(`change`, (evt) => {
      this.changeHandler(evt.target);
    });

    this.setControlListeners(this.controlMin);
    this.setControlListeners(this.controlMax);
  }

  setControlListeners(control) {
    control.addEventListener(`keydown`, (evt) => {
      this.controlKeyHandler(evt);
    });
    control.addEventListener(`mousedown`, (evt) => {
      this.moveHandler(evt);
    });
    control.addEventListener(`touchstart`, (evt) => {
      this.moveHandler(evt);
    });
  }

  controlKeyHandler(evt) {
    const field = (evt.target === this.controlMin) ? this.inputMin : this.inputMax;

    if (evt.keyCode === 37 || evt.keyCode === 40) {
      // Стрелка влево или вниз
      evt.preventDefault();

      if (field.value > +field.min) {
        field.value = +field.value - this.step;
      }
    } else if (evt.keyCode === 38 || evt.keyCode === 39) {
      // Стрелка вправо или вверх
      evt.preventDefault();

      if (field.value < +field.max) {
        field.value = +field.value + this.step;
      }
    }

    this.refresh(evt.target);
  }

  // Перемещение элемента
  moveHandler(startEvent) {
    startEvent.preventDefault();

    // Целевой элемент определяется способом взаимодействия
    const target = startEvent.currentTarget || startEvent.changedTouches[0];
    const targetField = (target === this.controlMin) ? this.inputMin : this.inputMax;

    let startX = startEvent.clientX;

    // Перемещение
    const processHandler = (moveEvent) => {
      const x = moveEvent.changedTouches ? moveEvent.changedTouches[0].clientX : moveEvent.clientX;

      const difference = startX - x;
      let left = target.offsetLeft - difference;
      startX = x;

      let minLeft = this.initialLeft;
      let maxLeft = getStyle(this.controlMax, `left`) - this.safeDistance;
      if (target === this.controlMax) {
        minLeft = getStyle(this.controlMin, `left`) + this.safeDistance;
        maxLeft = +this.inputMax.max / this.step + this.safeDistance;
      }

      if (left < minLeft) {
        left = minLeft;
      } else if (left > maxLeft) {
        left = maxLeft;
      }

      target.style.left = `${left}px`;
      targetField.value = (left - this.initialLeft) * this.step;
      this.setLimits(targetField);

      const finalLeft = (target === this.controlMin) ? left : getStyle(this.controlMin, `left`);
      const finalRight = (target === this.controlMax) ? left : getStyle(this.controlMax, `left`);
      this.progress.style.left = `${finalLeft}px`;
      this.progress.style.width = `${finalRight - finalLeft}px`;
    };

    // Завершение перемещения
    const endHandler = (endEvent) => {
      endEvent.preventDefault();

      document.removeEventListener(`touchmove`, processHandler);
      document.removeEventListener(`touchend`, endHandler);
      document.removeEventListener(`mousemove`, processHandler);
      document.removeEventListener(`mouseup`, endHandler);
    };

    const touchOptions = {
      passive: false
    };

    // Добавление обработчиков перемещения мышью либо тачем
    if (startEvent.changedTouches) {
      document.addEventListener(`touchmove`, processHandler, touchOptions);
      document.addEventListener(`touchend`, endHandler, touchOptions);
    } else {
      document.addEventListener(`mousemove`, processHandler);
      document.addEventListener(`mouseup`, endHandler);
    }
  }

  changeHandler(target, importValue = 0) {
    let value = +target.value + importValue;
    let min = +target.min;
    let max = +target.max;

    if (target === this.inputMin) {
      max = +this.inputMax.value - this.safeValue;
    } else {
      min = +this.inputMin.value + this.safeValue;
    }

    if (value > max) {
      value = max;
    } else if (value < min) {
      value = min;
    } else {
      value = Math.floor(value / this.step) * this.step || this.step;
    }

    target.value = value;

    this.refresh(target);
  }

  refresh(target = null) {
    const left = this.inputMin.value / this.step + this.initialLeft;
    const width = (this.inputMax.value - this.inputMin.value) / this.step;

    this.progress.style.width = `${width}px`;
    this.progress.style.left = `${left}px`;

    this.controlMin.style.left = `${left}px`;
    this.controlMax.style.left = `${left + width}px`;

    if (target) {
      this.setLimits(target);
    }
  }

  setLimits(target) {
    // Изменяем крайние значения инпутов, чтобы они не соприкасались
    if (target === this.inputMin || target === this.controlMin) {
      this.inputMin.max = +this.inputMax.value - this.safeValue;
    } else {
      this.inputMax.min = +this.inputMin.value + this.safeValue;
    }
  }
}

applyClass(`.range`, Range);
