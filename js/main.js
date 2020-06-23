'use strict';

(function () {

  var uploadFileButton = document.querySelector('#upload-file');

  var onUploadChange = function () {
    window.uploadwnd.openUploadWindow();
  };


  // var picturesMock = window.mock.buildPicturesMock();
  // window.gallery.renderPhotos(picturesMock);

  window.backend.loadPicturesData(
      function (data) {
        // onLoad
        window.gallery.renderPhotos(data);
      },
      function () {
        // onError
      }
  );

  uploadFileButton.addEventListener('change', onUploadChange);
})();
