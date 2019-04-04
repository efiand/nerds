'use strict'; // Диспетчер подключений для сборки javascript-кода из фрагментов с помощью gulp-include
function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
(function() {
  // Пользовательские данные
  // Исходные данные для клиентского скрипта
  var state = {
    // Параметры Яндекс.карты
    yandexMap: {
      mapOptions: {
        center: [59.93912, 30.3215],
        zoom: 17,
        controls: []
      },
      placemarkCoords: [59.9391, 30.32145],
      placemarkOptions: {
        iconLayout: "default#image",
        iconImageHref: "img/map-marker.png",
        iconShadow: false,
        iconImageSize: [231, 190],
        iconImageOffset: [105, -124]
      }
    },
    // Сообщения для серверных кодов
    responseCodesToMessages: {
      400: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0437\u0430\u043F\u0440\u043E\u0441.",
      403: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u043F\u0440\u0435\u0449\u0451\u043D!",
      404: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E\u2026",
      500: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430."
    }
  }; // Плагины общего назначения
  var functions = {};
  functions.kebabToCamel = function(string) {
    return string.replace(/\-([a-z]{1})/g, function(matches, pattern) {
      return pattern.toUpperCase();
    });
  }; // Клиентские модули
  // Применение класса к набору DOM-элементов
  var applyClass = function applyClass(selector, Class) {
    var nodeList = document.querySelectorAll(selector);
    for (var i = 0; i < nodeList.length; i++) {
      new Class(nodeList[i]);
    }
  }; // Получение path для event.target
  var getTargetPath = function getTargetPath(target) {
    var path = [];
    while (target) {
      path.push(target);
      target = target.parentElement;
    }
    return path;
  };
  var scrollToHash = function scrollToHash(hash) {
    var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var offset = window.pageYOffset;
    var distance = document.querySelector(hash).getBoundingClientRect().top;
    var start = null;
    var step = function step(time) {
      start = start || time;
      var progress = time - start;
      var scrollPos = Math.min(offset + progress * speed, offset + distance);
      if (distance < 0) {
        scrollPos = Math.max(offset - progress * speed, offset + distance);
      }
      window.scrollTo(0, scrollPos);
      if (scrollPos !== offset + distance) {
        requestAnimationFrame(step);
      } else {
        location.hash = hash;
      }
    };
    requestAnimationFrame(step);
  }; // Плавная прокрутка к якорю по url на старте
  setTimeout(function() {
    if (location.hash) {
      scrollToHash(location.hash, 3);
    }
  }, 100);
  var ajax = function ajax(payload) {
    var xhr = new XMLHttpRequest();
    var done = payload.done || function() {
      return false;
    };
    xhr.addEventListener("load", function() {
      var error = "";
      if (xhr.status === 200) {
        payload.callback(xhr.response);
      } else {
        error = "\u041E\u0448\u0438\u0431\u043A\u0430 ".concat(xhr.status, ": ").concat(state.responseCodesToMessages[xhr.status] || xhr.statusText);
      }
      outputStatus(payload.statusPlace || null, error, done);
    });
    xhr.addEventListener("error", function() {
      outputStatus(payload.statusPlace || null, "\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u044F.", done);
    });
    xhr.addEventListener("timeout", function() {
      outputStatus(payload.statusPlace || null, "\u0417\u0430\u043F\u0440\u043E\u0441 \u043D\u0435 \u0443\u0441\u043F\u0435\u043B \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C\u0441\u044F \u0437\u0430 " + xhr.timeout + "\u043C\u0441.", done);
    });
    xhr.open(payload.data ? "POST" : "GET", payload.url || window.location.href);
    xhr.responseType = "json"; // Без таймаута в IE происходит InvalidStateError
    setTimeout(function() {
      xhr.send(payload.data || null);
    }, 33);
  }; // Проверка наличия localStorage
  var isStorageSupport = true;
  try {
    localStorage.getItem("test");
  } catch (error) {
    isStorageSupport = false;
  } // Индекс DOM-узла в указанной коллекции
  var getNodeIndex = function getNodeIndex(collection, node) {
    for (var i = 0; i < collection.length; i++) {
      if (collection[i] === node) {
        return i;
      }
    }
    return -1;
  }; // Получение заданного стиля
  var getStyle = function getStyle(node, property) {
    var pseudo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    return parseInt(getComputedStyle(node, pseudo)[property], 10);
  };
  var HashLinks =
    /*#__PURE__*/
    function() {
      function HashLinks(element) {
        _classCallCheck(this, HashLinks);
        this.element = element;
        this.hash = element.href.replace(/[^#]*(.*)/, "$1");
        this.setListeners();
      }
      _createClass(HashLinks, [{
        key: "setListeners",
        value: function setListeners() {
          var _this = this;
          this.element.addEventListener("click", function(evt) {
            evt.preventDefault();
            if (_this.hash !== "#") {
              scrollToHash(_this.hash, 3);
            }
          });
        }
      }]);
      return HashLinks;
    }();
  applyClass("a[href^=\"#\"]", HashLinks); // Вывод статуса ответа в DOM-элемент place
  var outputStatus = function outputStatus() {
    var place = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var done = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function() {
      return false;
    };
    if (place instanceof HTMLElement) {
      place.textContent = status;
      if (status) {
        place.classList.remove("hidden");
        done();
      } else {
        place.classList.add("hidden");
      }
    }
  }; // Редирект на index.html в корне папки
  var url = window.location.href;
  if (url[url.length - 1] === "/") {
    window.location.href = url + "index.html";
  } // Узнаем ширину полосы прокрутки
  // Создадим элемент с прокруткой
  var div = document.createElement("div");
  div.style.overflowY = "scroll";
  div.style.width = "50px";
  div.style.height = "50px";
  div.style.visibility = "hidden";
  document.body.appendChild(div);
  var scrollWidth = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div); // Классы компонентов
  var Field =
    /*#__PURE__*/
    function() {
      function Field(element) {
        _classCallCheck(this, Field);
        this.element = element;
        this.isStored = isStorageSupport && element.classList.contains("field--stored");
        this.setInitials();
        this.setListeners();
      }
      _createClass(Field, [{
        key: "setInitials",
        value: function setInitials() {
          // Получение значения из хранилища браузера
          if (this.isStored) {
            this.element.value = localStorage.getItem(this.element.name);
          }
        }
      }, {
        key: "setListeners",
        value: function setListeners() {
          var _this2 = this;
          this.element.addEventListener("input", function() {
            _this2.inputHandler();
          });
        }
      }, {
        key: "inputHandler",
        value: function inputHandler() {
          var input = this.element;
          if (this.isStored && (input.validity.valid || !input.value)) {
            localStorage.setItem(input.name, input.value);
          }
        }
      }]);
      return Field;
    }();
  applyClass(".field", Field);
  var Button =
    /*#__PURE__*/
    function() {
      function Button(element) {
        _classCallCheck(this, Button);
        this.element = element;
        this.setInitials();
      }
      _createClass(Button, [{
        key: "setInitials",
        value: function setInitials() {
          // Отменяем скрытие кнопок, ненужных без js
          this.element.classList.remove("hidden");
        }
      }]);
      return Button;
    }();
  applyClass(".button", Button);
  var Modal =
    /*#__PURE__*/
    function() {
      function Modal(element) {
        _classCallCheck(this, Modal);
        this.element = element;
        this.id = element.getAttribute("id");
        this.inner = element.querySelector(".modal__inner");
        this.openers = document.querySelectorAll("[data-open=\"".concat(this.id, "\"]"));
        this.closer = element.querySelector(".modal__closer");
        this.offset = 0; // Первый элемент модального блока, способный поймать фокус
        this.firstFocusable = element.querySelector("input, textarea, a, button, [tabindex]"); // Есть ли в модальном блоке форма с поддержкой сообщения об ошибке:
        this.siteErrorSender = element.querySelector(".field--site-error-place");
        this.setInitials();
        this.setListeners();
      }
      _createClass(Modal, [{
        key: "setInitials",
        value: function setInitials() {
          this.element.classList.add("modal--js");
          this.overflowHandler();
        }
      }, {
        key: "setListeners",
        value: function setListeners() {
          var _this3 = this;
          for (var i = 0; i < this.openers.length; i++) {
            this.openers[i].addEventListener("click", function(evt) {
              _this3.openHandler(evt);
            });
          } // Если внутри форма с поддержкой отправки ошибок - открытие по Ctrl + Enter
          if (this.siteErrorSender) {
            document.addEventListener("keydown", function(evt) {
              if (!document.body.classList.contains("modal-mode") && evt.keyCode === 13 && evt.ctrlKey) {
                _this3.openHandler(evt);
              }
            });
          }
          this.closer.addEventListener("click", function(evt) {
            _this3.closeHandler(evt);
          }); // Закрытие модального окна по Esc
          document.addEventListener("keydown", function(evt) {
            if (evt.keyCode === 27) {
              _this3.closeHandler(evt);
            }
          });
          window.addEventListener("resize", function() {
            _this3.overflowHandler();
          }); // Защита модального блока от потери фокуса
          document.addEventListener("focus", function(evt) {
            if (_this3.element.classList.contains("modal--target")) {
              var path = evt.path || getTargetPath(evt.target);
              if (path.indexOf(_this3.element) === -1) {
                _this3.firstFocusable.focus();
              }
            }
          }, true);
        }
      }, {
        key: "overflowHandler",
        value: function overflowHandler() {
          if (this.inner.clientHeight > window.innerHeight) {
            this.inner.classList.add("modal__inner--overflowed");
          } else {
            this.inner.classList.remove("modal__inner--overflowed");
          }
        }
      }, {
        key: "openHandler",
        value: function openHandler(evt) {
          evt.preventDefault();
          this.offset = window.pageYOffset;
          this.element.classList.add("modal--target");
          document.body.classList.add("modal-mode");
          document.body.style.width = "calc(100% - ".concat(scrollWidth, "px)");
          document.body.style.top = "-".concat(this.offset, "px");
          if (!evt.keyCode) {
            evt.target.blur();
          }
        }
      }, {
        key: "closeHandler",
        value: function closeHandler(evt) {
          evt.preventDefault();
          this.element.classList.remove("modal--target");
          this.inner.classList.remove("form--invalid-detect");
          document.body.classList.remove("modal-mode");
          document.body.style.width = "100%";
          window.scrollTo(0, this.offset);
        }
      }]);
      return Modal;
    }();
  applyClass(".modal", Modal);
  var Post =
    /*#__PURE__*/
    function() {
      function Post(element) {
        _classCallCheck(this, Post);
        this.element = element;
        this.opener = document.querySelector("[data-open=\"".concat(element.parentElement.id, "\"]"));
        this.submit = element.querySelector(".post__submit");
        this.fields = element.querySelectorAll(".field");
        this.messageField = element.querySelector(".field--message"); // Обрабатывает ли форма отправку сообщения об ошибке
        this.isSiteErrorSend = this.messageField.classList.contains("field--site-error-place");
        this.setInitials();
        this.setListeners();
      }
      _createClass(Post, [{
        key: "setInitials",
        value: function setInitials() {
          // Чтобы до сабмита красные поля не смущали пользователей
          this.element.classList.remove("post--invalid-detect");
        }
      }, {
        key: "setListeners",
        value: function setListeners() {
          var _this4 = this;
          this.submit.addEventListener("click", function() {
            _this4.submitHandler();
          });
          if (this.opener) {
            this.opener.addEventListener("click", function() {
              _this4.openHandler();
            });
            if (this.isSiteErrorSend) {
              document.addEventListener("keydown", function(evt) {
                if (evt.keyCode === 13 && evt.ctrlKey) {
                  _this4.openHandler();
                }
              });
            }
          } // Отправка формы по Ctrl + Enter из поля текстового ввода
          this.messageField.addEventListener("keydown", function(evt) {
            if (evt.keyCode === 13 && evt.ctrlKey) {
              evt.preventDefault();
              _this4.submit.click();
            }
          });
        }
      }, {
        key: "openHandler",
        value: function openHandler() {
          var _this5 = this;
          setTimeout(function() {
            _this5.setFocus();
          }, 0);
          if (this.isSiteErrorSend) {
            var selection = window.getSelection().toString();
            if (selection) {
              this.messageField.value = "\u0422\u0435\u043A\u0441\u0442 \u043E\u0448\u0438\u0431\u043A\u0438:\n".concat(selection, "\n\n\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u043A \u043E\u0448\u0438\u0431\u043A\u0435:\n");
            }
          }
        } // Фокусируемся на первом незаполненном элементе
      }, {
        key: "setFocus",
        value: function setFocus() {
          var focusedIndex = -1;
          for (var i = 0; i < this.fields.length; i++) {
            if (!this.fields[i].value) {
              focusedIndex = i;
              break;
            }
          }
          if (focusedIndex < 0) {
            focusedIndex = this.fields.length - 1;
          }
          this.fields[focusedIndex].focus();
        }
      }, {
        key: "submitHandler",
        value: function submitHandler() {
          // Чтобы после первого сабмита красные поля появлялись
          this.element.classList.add("post--invalid-detect");
        }
      }]);
      return Post;
    }();
  applyClass(".post", Post);
  var Preloader =
    /*#__PURE__*/
    function() {
      function Preloader(element) {
        _classCallCheck(this, Preloader);
        this.element = element;
        this.setInitials();
      }
      _createClass(Preloader, [{
        key: "setInitials",
        value: function setInitials() {
          var self = this;
          functions.showPreloader = function() {
            self.element.classList.remove("hidden");
          };
          functions.hidePreloader = function() {
            self.element.classList.add("hidden");
          };
        }
      }]);
      return Preloader;
    }();
  applyClass(".preloader", Preloader);
  var Products =
    /*#__PURE__*/
    function() {
      function Products(element) {
        _classCallCheck(this, Products);
        this.pageButtons = element.querySelectorAll(".pagination__button:not(.pagination__button--next)");
        this.nextButton = element.querySelector(".pagination__button--next");
        this.list = element.querySelector(".products__list");
        this.template = this.list.querySelector("li").cloneNode(true); // Куда выводить ошибки сервера
        this.errorPlace = element.querySelector(".products__error");
        this.index = 1;
        this.setListeners();
      }
      _createClass(Products, [{
        key: "setListeners",
        value: function setListeners() {
          var _this6 = this;
          for (var i = 0; i < this.pageButtons.length; i++) {
            this.pageButtons[i].addEventListener("click", function(evt) {
              evt.preventDefault();
              _this6.clickHandler(evt);
            });
          }
          this.nextButton.addEventListener("click", function(evt) {
            evt.preventDefault();
            var targetIndex = _this6.index === _this6.pageButtons.length ? 0 : _this6.index;
            _this6.pageButtons[targetIndex].click();
          });
        }
      }, {
        key: "clickHandler",
        value: function clickHandler(evt) {
          for (var i = 0; i < this.pageButtons.length; i++) {
            if (this.pageButtons[i] === evt.currentTarget) {
              if (this.pageButtons[i].href) {
                this.pageButtons[i].removeAttribute("href");
                this.index = i + 1;
                functions.showPreloader();
                this.ajaxHandler();
              }
            } else {
              this.pageButtons[i].setAttribute("href", "#");
            }
          }
        }
      }, {
        key: "ajaxHandler",
        value: function ajaxHandler() {
          var self = this;
          ajax({
            url: "app/products.json",
            statusPlace: this.errorPlace,
            callback: function callback(response) {
              self.listBuilder(response);
            },
            done: function done() {
              functions.hidePreloader();
            }
          });
        }
      }, {
        key: "listBuilder",
        value: function listBuilder(response) {
          var self = this; // IE 11
          if (typeof response === "string") {
            response = JSON.parse(response);
          }
          var payload = response.slice((self.index - 1) * 6, self.index * 6);
          self.list.innerHTML = "";
          scrollToHash("#products", 10); // Фейковая задержка для демонстрации работы прелоадера
          setTimeout(function() {
            for (var i = 0; i < payload.length; i++) {
              var item = payload[i];
              var element = self.template.cloneNode(true);
              var webp = element.querySelector("source");
              if (webp) {
                webp.setAttribute("srcset", item.img);
              }
              var img = element.querySelector(".product__img");
              img.setAttribute("src", item.img);
              img.setAttribute("alt", item.name);
              var headerLink = element.querySelector(".product__link");
              var header = headerLink.querySelector(".product__name");
              headerLink.href = item.href;
              header.textContent = item.name;
              element.querySelector(".product__description").textContent = item.description;
              element.querySelector(".product__button").href = item.url;
              self.list.insertAdjacentElement("beforeend", element);
            }
            functions.hidePreloader();
          }, 1000);
        }
      }]);
      return Products;
    }();
  applyClass(".products", Products);
  var Range =
    /*#__PURE__*/
    function() {
      function Range(element) {
        _classCallCheck(this, Range);
        this.block = element.querySelector(".range__block");
        this.progress = this.block.querySelector(".range__progress");
        this.controlMin = this.block.querySelector(".range__control-min");
        this.controlMax = this.block.querySelector(".range__control-max");
        this.inputMin = element.querySelector(".range__input-min");
        this.inputMax = element.querySelector(".range__input-max");
        this.step = +this.inputMin.step; // Поправка на левый отступ от контейнера
        this.initialLeft = getStyle(this.controlMin, "left"); // Минимально допустимая разница крайнего значения одного инпута
        // и текущего значения другого, чтобы они не соприкасались
        this.safeDistance = getStyle(this.controlMin, "width", ":before");
        this.safeValue = this.safeDistance * this.step;
        this.setInitials();
        this.setListeners();
      }
      _createClass(Range, [{
        key: "setInitials",
        value: function setInitials() {
          this.block.classList.remove("hidden");
          this.refresh();
        }
      }, {
        key: "setListeners",
        value: function setListeners() {
          var _this7 = this;
          this.inputMin.addEventListener("change", function(evt) {
            _this7.changeHandler(evt.target);
          });
          this.inputMax.addEventListener("change", function(evt) {
            _this7.changeHandler(evt.target);
          });
          this.setControlListeners(this.controlMin);
          this.setControlListeners(this.controlMax);
        }
      }, {
        key: "setControlListeners",
        value: function setControlListeners(control) {
          var _this8 = this;
          control.addEventListener("keydown", function(evt) {
            _this8.controlKeyHandler(evt);
          });
          control.addEventListener("mousedown", function(evt) {
            _this8.moveHandler(evt);
          });
          control.addEventListener("touchstart", function(evt) {
            _this8.moveHandler(evt);
          });
        }
      }, {
        key: "controlKeyHandler",
        value: function controlKeyHandler(evt) {
          var field = evt.target === this.controlMin ? this.inputMin : this.inputMax;
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
        } // Перемещение элемента
      }, {
        key: "moveHandler",
        value: function moveHandler(startEvent) {
          var _this9 = this;
          startEvent.preventDefault(); // Целевой элемент определяется способом взаимодействия
          var target = startEvent.currentTarget || startEvent.changedTouches[0];
          var targetField = target === this.controlMin ? this.inputMin : this.inputMax;
          var startX = startEvent.clientX; // Перемещение
          var processHandler = function processHandler(moveEvent) {
            var x = moveEvent.changedTouches ? moveEvent.changedTouches[0].clientX : moveEvent.clientX;
            var difference = startX - x;
            var left = target.offsetLeft - difference;
            startX = x;
            var minLeft = _this9.initialLeft;
            var maxLeft = getStyle(_this9.controlMax, "left") - _this9.safeDistance;
            if (target === _this9.controlMax) {
              minLeft = getStyle(_this9.controlMin, "left") + _this9.safeDistance;
              maxLeft = +_this9.inputMax.max / _this9.step + _this9.safeDistance;
            }
            if (left < minLeft) {
              left = minLeft;
            } else if (left > maxLeft) {
              left = maxLeft;
            }
            target.style.left = "".concat(left, "px");
            targetField.value = (left - _this9.initialLeft) * _this9.step;
            _this9.setLimits(targetField);
            var finalLeft = target === _this9.controlMin ? left : getStyle(_this9.controlMin, "left");
            var finalRight = target === _this9.controlMax ? left : getStyle(_this9.controlMax, "left");
            _this9.progress.style.left = "".concat(finalLeft, "px");
            _this9.progress.style.width = "".concat(finalRight - finalLeft, "px");
          }; // Завершение перемещения
          var endHandler = function endHandler(endEvent) {
            endEvent.preventDefault();
            document.removeEventListener("touchmove", processHandler);
            document.removeEventListener("touchend", endHandler);
            document.removeEventListener("mousemove", processHandler);
            document.removeEventListener("mouseup", endHandler);
          };
          var touchOptions = {
            passive: false
          }; // Добавление обработчиков перемещения мышью либо тачем
          if (startEvent.changedTouches) {
            document.addEventListener("touchmove", processHandler, touchOptions);
            document.addEventListener("touchend", endHandler, touchOptions);
          } else {
            document.addEventListener("mousemove", processHandler);
            document.addEventListener("mouseup", endHandler);
          }
        }
      }, {
        key: "changeHandler",
        value: function changeHandler(target) {
          var importValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
          var value = +target.value + importValue;
          var min = +target.min;
          var max = +target.max;
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
      }, {
        key: "refresh",
        value: function refresh() {
          var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
          var left = this.inputMin.value / this.step + this.initialLeft;
          var width = (this.inputMax.value - this.inputMin.value) / this.step;
          this.progress.style.width = "".concat(width, "px");
          this.progress.style.left = "".concat(left, "px");
          this.controlMin.style.left = "".concat(left, "px");
          this.controlMax.style.left = "".concat(left + width, "px");
          if (target) {
            this.setLimits(target);
          }
        }
      }, {
        key: "setLimits",
        value: function setLimits(target) {
          // Изменяем крайние значения инпутов, чтобы они не соприкасались
          if (target === this.inputMin || target === this.controlMin) {
            this.inputMin.max = +this.inputMax.value - this.safeValue;
          } else {
            this.inputMax.min = +this.inputMin.value + this.safeValue;
          }
        }
      }]);
      return Range;
    }();
  applyClass(".range", Range);
  var Tabs =
    /*#__PURE__*/
    function() {
      function Tabs(element) {
        _classCallCheck(this, Tabs);
        this.list = element.querySelector(".tabs__list");
        this.items = element.querySelectorAll(".tabs__item");
        this.controlsBLock = element.querySelector(".tabs__controls");
        this.controls = this.controlsBLock.querySelectorAll(".tabs__control");
        this.setInitials();
        this.setListeners();
      }
      _createClass(Tabs, [{
        key: "setInitials",
        value: function setInitials() {
          var _this10 = this;
          this.controlsBLock.classList.remove("hidden");
          this.controls[0].setAttribute("disabled", true);
          var _loop = function _loop(i) {
            _this10.items[i].style.position = "absolute";
            if (i > 0) {
              // Чтобы при инициализации не показывались все сразу, потому что скрытие анимировано
              _this10.items[i].classList.add("hidden", true);
              setTimeout(function() {
                _this10.items[i].classList.remove("hidden");
              }, 33);
              _this10.items[i].classList.add("tabs__item--hidden");
            }
          };
          for (var i = 0; i < this.items.length; i++) {
            _loop(i);
          }
          this.setParentHeight(0);
        }
      }, {
        key: "setListeners",
        value: function setListeners() {
          var _this11 = this;
          this.controlsBLock.addEventListener("click", function(evt) {
            var currentIndex = getNodeIndex(_this11.controls, evt.target);
            if (currentIndex > -1) {
              for (var i = 0; i < _this11.items.length; i++) {
                _this11.items[i].classList.add("tabs__item--hidden");
                _this11.controls[i].removeAttribute("disabled");
              }
              _this11.items[currentIndex].classList.remove("tabs__item--hidden");
              _this11.controls[currentIndex].setAttribute("disabled", true);
              _this11.setParentHeight(currentIndex);
            }
            evt.target.blur();
          });
        } // Устанавливаем высоту родителя абсолютных элементов по высоте текущего
      }, {
        key: "setParentHeight",
        value: function setParentHeight(childIndex) {
          this.list.style.height = "".concat(this.items[childIndex].offsetHeight, "px");
        }
      }]);
      return Tabs;
    }();
  applyClass(".tabs", Tabs);
  var YandexMap =
    /*#__PURE__*/
    function() {
      function YandexMap(element) {
        _classCallCheck(this, YandexMap);
        this.canvas = element.querySelector(".yandex-map__canvas");
        this.fallbackImg = element.querySelector(".yandex-map__fallback-img");
        this.placemarkOptions = [state.yandexMap.placemarkCoords, {
          hintContent: element.querySelector(".yandex-map__hint").textContent
        }, state.yandexMap.placemarkOptions];
        this.setInitials();
      }
      _createClass(YandexMap, [{
        key: "setInitials",
        value: function setInitials() {
          var _this12 = this;
          window.ymaps.ready(function() {
            var map = new window.ymaps.Map(_this12.canvas.id, state.yandexMap.mapOptions);
            map.geoObjects.add(_construct(window.ymaps.Placemark, _toConsumableArray(_this12.placemarkOptions)));
            map.behaviors.disable("scrollZoom");
            _this12.fallbackImg.classList.add("yandex-map__fallback-img--ready");
          });
        }
      }]);
      return YandexMap;
    }();
  applyClass(".yandex-map", YandexMap);
})();
