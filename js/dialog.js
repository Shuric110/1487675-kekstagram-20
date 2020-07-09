'use strict';

(function () {

  var KEY_ESCAPE = 'Escape';
  var ACTION_CANCEL = 'cancel';
  var ACTION_SUBMIT = 'submit';

  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');


  var openWindow = function (wnd, wndCloseButtons, closeCallback) {
    var closeWindow = function (action) {
      if (closeCallback && !closeCallback(action)) {
        return;
      }

      wndCloseButtons.forEach(function (button) {
        button.removeEventListener('click', onCloseClick);
      });
      window.removeEventListener('keydown', onKeyDown);
      delete wnd.closeWindow;
    };

    var onKeyDown = function (evt) {
      if (evt.key === KEY_ESCAPE) {
        closeWindow(ACTION_CANCEL);
      }
    };

    var onCloseClick = function () {
      closeWindow(ACTION_CANCEL);
    };

    wndCloseButtons.forEach(function (button) {
      button.addEventListener('click', onCloseClick);
    });
    window.addEventListener('keydown', onKeyDown);
    wnd.closeWindow = closeWindow;
  };

  var openModalWindow = function (wnd, wndCloseButtons, closeCallback) {
    openWindow(wnd, wndCloseButtons, function (action) {
      if (closeCallback && !closeCallback(action)) {
        return false;
      }

      wnd.classList.add('hidden');
      document.body.classList.remove('modal-open');

      return true;
    });

    wnd.classList.remove('hidden');
    document.body.classList.add('modal-open');
  };

  var closeModalWindow = function (wnd, action) {
    if (wnd.closeWindow) {
      wnd.closeWindow(action);
    }
  };

  var showInfoWindow = function (template, closeSelectors) {
    var infoWindow = template.cloneNode(true);

    var onBackgroundClick = function (evt) {
      if (evt.target === infoWindow) {
        infoWindow.closeWindow(ACTION_CANCEL);
      }
    };

    var closeButtons = closeSelectors.map(function (selector) {
      return infoWindow.querySelector(selector);
    });

    openWindow(infoWindow, closeButtons, function () {
      // closeCallback
      infoWindow.removeEventListener('click', onBackgroundClick);
      document.body.removeChild(infoWindow);
      return true;
    });

    infoWindow.addEventListener('click', onBackgroundClick);
    document.body.appendChild(infoWindow);
  };

  var showErrorInfo = function () {
    showInfoWindow(errorTemplate, ['.error__button']);
  };

  var showSuccessInfo = function () {
    showInfoWindow(successTemplate, ['.success__button']);
  };

  window.dialog = {
    ACTION_CANCEL: ACTION_CANCEL,
    ACTION_SUBMIT: ACTION_SUBMIT,

    openModalWindow: openModalWindow,
    closeModalWindow: closeModalWindow,
    showErrorInfo: showErrorInfo,
    showSuccessInfo: showSuccessInfo
  };

})();
