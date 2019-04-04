class YandexMap {
  constructor(element) {
    this.canvas = element.querySelector(`.yandex-map__canvas`);
    this.fallbackImg = element.querySelector(`.yandex-map__fallback-img`);

    this.placemarkOptions = [
      state.yandexMap.placemarkCoords,
      {
        hintContent: element.querySelector(`.yandex-map__hint`).textContent
      },
      state.yandexMap.placemarkOptions
    ];

    this.setInitials();
  }

  setInitials() {
    window.ymaps.ready(() => {
      const map = new window.ymaps.Map(this.canvas.id, state.yandexMap.mapOptions);

      map.geoObjects.add(new window.ymaps.Placemark(...this.placemarkOptions));
      map.behaviors.disable(`scrollZoom`);

      this.fallbackImg.classList.add(`yandex-map__fallback-img--ready`);
    });
  }
}

applyClass(`.yandex-map`, YandexMap);
