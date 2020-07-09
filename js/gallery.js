'use strict';

(function () {

  var photoTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var photosContainer = document.querySelector('.pictures');

  var makePhotoElement = function (photoData) {
    var photo = photoTemplate.cloneNode(true);
    photo.querySelector('.picture__img').src = photoData.url;
    photo.querySelector('.picture__likes').textContent = photoData.likes;
    photo.querySelector('.picture__comments').textContent = photoData.comments.length;
    photo.photoData = photoData;

    return photo;
  };

  var renderPhotos = function (photos) {
    var fragment = document.createDocumentFragment();

    photos.forEach(function (photo) {
      fragment.appendChild(makePhotoElement(photo));
    });

    photosContainer.appendChild(fragment);
  };

  var clearPhotos = function () {
    var photos = photosContainer.querySelectorAll('.picture');
    photos.forEach(function (photo) {
      photosContainer.removeChild(photo);
    });
  };

  var onPhotoClick = function (evt) {
    var target = evt.target;
    while (target && target.matches && !target.matches('.picture')) {
      target = target.parentNode;
    }
    if (target && target.photoData) {
      evt.preventDefault();
      window.preview.show(target.photoData);
    }
  };


  photosContainer.addEventListener('click', onPhotoClick);

  window.gallery = {
    renderPhotos: renderPhotos,
    clearPhotos: clearPhotos
  };

})();
