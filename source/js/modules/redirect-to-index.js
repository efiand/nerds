// Редирект на index.html в корне папки

const url = window.location.href;
if (url[url.length - 1] === `/`) {
  window.location.href = url + `index.html`;
}
