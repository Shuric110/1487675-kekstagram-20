'use strict';

(function () {

  var photoPattern = document.querySelector('#picture').content.querySelector('.picture');
  var photosContainer = document.querySelector('.pictures');

  var makePhotoElement = function (photoData) {
    var photo = photoPattern.cloneNode(true);
    photo.querySelector('.picture__img').src = photoData.url;
    photo.querySelector('.picture__likes').textContent = photoData.likes;
    photo.querySelector('.picture__comments').textContent = photoData.comments.length;
    photo.photoData = photoData;

    return photo;
  };

  var renderPhotos = function (photos) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < photos.length; i++) {
      fragment.appendChild(makePhotoElement(photos[i]));
    }

    photosContainer.appendChild(fragment);
  };

  var onPhotoClick = function (evt) {
    var target = evt.target;
    while (target && target.matches && !target.matches('.picture')) {
      target = target.parentNode;
    }
    if (target && target.photoData) {
      evt.preventDefault();
      window.fullsize.showPreview(target.photoData);
    }
  };


  photosContainer.addEventListener('click', onPhotoClick);

  window.gallery = {
    renderPhotos: renderPhotos
  };

})();
