'use strict';

(function () {

  var PICTURES_DATA_URL = 'https://javascript.pages.academy/kekstagram/data';

  var loadPicturesData = function (onLoad, onError) {
    window.http.doGetQuery(PICTURES_DATA_URL, onLoad, onError);
  };

  window.backend = {
    loadPicturesData: loadPicturesData
  };

})();
