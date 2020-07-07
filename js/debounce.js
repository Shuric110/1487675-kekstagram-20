'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  window.debounce = function (cb) {
    var isLocked = false;
    var needExecute = false;
    var currentParameters;

    var makeTimeout = function () {
      window.setTimeout(function () {
        if (needExecute) {
          cb.apply(null, currentParameters);
          needExecute = false;
          makeTimeout();
        } else {
          isLocked = false;
        }
      }, DEBOUNCE_INTERVAL);
    };

    return function () {
      currentParameters = arguments;
      if (isLocked) {
        needExecute = true;
        return;
      }
      cb.apply(null, currentParameters);

      isLocked = true;
      makeTimeout();
    };
  };

})();
