'use strict';
// Диспетчер подключений для сборки javascript-кода из фрагментов с помощью gulp-include

(() => {
  // Пользовательские данные
  //=require ../data/state.js

  // Плагины общего назначения
  const functions = {};
  //=require ../../gulpfile.js/functions/**/*.both.js

  // Клиентские модули
  //=require modules/**/*.js

  // Классы компонентов
  //=require ../components/**/*.js
})();
