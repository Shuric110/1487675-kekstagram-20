'use strict';

(function () {

  var KEY_ESCAPE = 'Escape';
  var ACTION_CANCEL = 'cancel';

  var openModalWindow = function (wnd, wndCloseButtons, closeCallback) {
    var closeModalWindow = function (action) {
      if (closeCallback && !closeCallback(action)) {
        return;
      }

      for (var i = 0; i < wndCloseButtons.length; i++) {
        wndCloseButtons[i].removeEventListener('click', onCloseClick);
      }
      window.removeEventListener('keydown', onKeyDown);

      wnd.classList.add('hidden');
      document.body.classList.remove('modal-open');
    };

    var onKeyDown = function (evt) {
      if (evt.key === KEY_ESCAPE) {
        closeModalWindow(ACTION_CANCEL);
      }
    };

    var onCloseClick = function () {
      closeModalWindow(ACTION_CANCEL);
    };

    for (var i = 0; i < wndCloseButtons.length; i++) {
      wndCloseButtons[i].addEventListener('click', onCloseClick);
    }
    window.addEventListener('keydown', onKeyDown);

    wnd.classList.remove('hidden');
    document.body.classList.add('modal-open');
  };

  window.dialog = {
    ACTION_CANCEL: ACTION_CANCEL,
    openModalWindow: openModalWindow
  };

})();
