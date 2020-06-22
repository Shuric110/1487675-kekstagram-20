'use strict';

(function () {

  var uploadFileButton = document.querySelector('#upload-file');

  var onUploadChange = function () {
    window.uploadwnd.openUploadWindow();
  };


  var picturesMock = window.mock.buildPicturesMock();
  window.gallery.renderPhotos(picturesMock);

  uploadFileButton.addEventListener('change', onUploadChange);
})();
