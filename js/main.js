'use strict';

(function () {

  var uploadFileButton = document.querySelector('#upload-file');

  var photoData;

  var onUploadChange = function () {
    window.uploadwnd.openUploadWindow();
  };


  var onFilterChange = function (filterFunction) {
    window.gallery.clearPhotos();
    window.gallery.renderPhotos(filterFunction(photoData));
  };


  window.backend.loadPicturesData(
      function (data) {
        // onLoad
        photoData = data;
        window.gallery.renderPhotos(photoData);
        window.filter.showFilter(onFilterChange);
      },
      function () {
        // onError
      }
  );

  uploadFileButton.addEventListener('change', onUploadChange);
})();
