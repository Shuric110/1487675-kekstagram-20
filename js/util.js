'use strict';

(function () {

  var getRandomInteger = function (min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  var peekRandomElement = function (array) {
    var i = getRandomInteger(0, array.length - 1);
    var result = array[i];
    array.splice(i, 1);
    return result;
  };


  window.util = {
    getRandomInteger: getRandomInteger,
    peekRandomElement: peekRandomElement
  };

})();
