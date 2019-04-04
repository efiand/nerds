// Исходные данные для клиентского скрипта

const state = {
  // Параметры Яндекс.карты
  yandexMap: {
    mapOptions: {
      center: [59.93912, 30.3215],
      zoom: 17,
      controls: []
    },
    placemarkCoords: [
      59.9391,
      30.32145
    ],
    placemarkOptions: {
      iconLayout: `default#image`,
      iconImageHref: `img/map-marker.png`,
      iconShadow: false,
      iconImageSize: [231, 190],
      iconImageOffset: [105, -124]
    }
  },

  // Сообщения для серверных кодов
  responseCodesToMessages: {
    400: `Неверный запрос.`,
    403: `Доступ запрещён!`,
    404: `Ничего не найдено…`,
    500: `Ошибка сервера.`
  }
};
