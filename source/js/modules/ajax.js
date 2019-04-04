const ajax = (payload) => {
  const xhr = new XMLHttpRequest();
  const done = payload.done || (() => {
    return false;
  });

  xhr.addEventListener(`load`, () => {
    let error = ``;

    if (xhr.status === 200) {
      payload.callback(xhr.response);
    }
    else {
      error = `Ошибка ${xhr.status}: ${state.responseCodesToMessages[xhr.status] || xhr.statusText}`;
    }

    outputStatus(payload.statusPlace || null, error, done);
  });

  xhr.addEventListener(`error`, () => {
    outputStatus(payload.statusPlace || null, `Произошла ошибка соединения.`, done);
  });

  xhr.addEventListener(`timeout`, () => {
    outputStatus(payload.statusPlace || null, `Запрос не успел выполниться за ` + xhr.timeout + `мс.`, done);
  });

  xhr.open(payload.data ? `POST` : `GET`, payload.url || window.location.href);
  xhr.responseType = `json`;

  // Без таймаута в IE происходит InvalidStateError
  setTimeout(() => {
    xhr.send(payload.data || null);
  }, 33);
};
