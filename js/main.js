'use strict';

(function () {

  var uploadFileButton = document.querySelector('#upload-file');

  var photoData;

  var onUploadChange = function () {
    window.form.open();
  };


  var onFilterChange = function (cbFilterFunction) {
    window.gallery.clearPhotos();
    window.gallery.renderPhotos(cbFilterFunction(photoData));
  };


  window.backend.loadPicturesData(
      function (data) {
        // onLoad
        photoData = data;
        window.gallery.renderPhotos(photoData);
        window.filter.show(onFilterChange);
      }
  );

  uploadFileButton.addEventListener('change', onUploadChange);
})();
