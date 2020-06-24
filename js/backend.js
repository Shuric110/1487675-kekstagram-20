'use strict';

(function () {

  var PICTURES_DATA_URL = 'https://javascript.pages.academy/kekstagram/data';
  var PICTURE_SAVE_URL = 'https://javascript.pages.academy/kekstagram';

  var loadPicturesData = function (onLoad, onError) {
    window.http.doGetQuery(PICTURES_DATA_URL, onLoad, onError);
  };

  var savePicture = function (data, onLoad, onError) {
    window.http.doPostQuery(PICTURE_SAVE_URL, data, onLoad, onError);
  };

  window.backend = {
    loadPicturesData: loadPicturesData,
    savePicture: savePicture
  };

})();
