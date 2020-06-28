'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  window.debounce = function (cb) {
    var isLocked = false;
    var needExecute = false;
    var parameters;

    return function () {
      parameters = arguments;
      if (isLocked) {
        needExecute = true;
        return;
      }
      cb.apply(null, parameters);

      var makeTimeout = function () {
        window.setTimeout(function () {
          if (needExecute) {
            cb.apply(null, parameters);
            needExecute = false;
            makeTimeout();
          } else {
            isLocked = false;
          }
        }, DEBOUNCE_INTERVAL);
      };

      isLocked = true;
      makeTimeout();
    };
  };

})();
