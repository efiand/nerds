'use strict';
// Функция, отправляющая настройки в шаблон текущей страницы при компиляции HTML

const { functions } = require(`../store`);

functions.resolvePageData = (filename, funcs, settings) => {
  const page = funcs.returnPageName(filename);

  const config = {
    isDev: settings.isDev,
    ...settings.project,
    ...settings.layout,
    page,
    ...funcs.smartRequire(`source/data/pages/${page}.json`)
  };

  if (config.menu) {
    const currentItem = config.menu.find((item) => {
      return item.href === `${page}.html`;
    });

    if (currentItem) {
      currentItem.href = null;
    }
  }

  return config;
};
