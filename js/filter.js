'use strict';

(function () {
  var RANDOM_PHOTO_COUNT = 10;

  var filterControl = document.querySelector('.img-filters');

  var currentFilterButton = filterControl.querySelector('.img-filters__button--active');
  var filterCallback;

  var filterDefinitions = {
    'filter-default': function (photos) {
      return photos;
    },
    'filter-random': function (photos) {
      var tempPhotos = photos.slice();
      var result = [];
      for (var i = 0; i < RANDOM_PHOTO_COUNT; i++) {
        result.push(window.util.peekRandomElement(tempPhotos));
      }
      return result;
    },
    'filter-discussed': function (photos) {
      return photos.slice().sort(function (a, b) {
        return b.comments.length - a.comments.length;
      });
    }
  };

  var onFilterClick = function (evt) {
    if (evt.target.matches('.img-filters__button')) {
      if (evt.target !== currentFilterButton) {
        currentFilterButton.classList.remove('img-filters__button--active');
        currentFilterButton = evt.target;
        currentFilterButton.classList.add('img-filters__button--active');
      }
      if (filterCallback) {
        filterCallback(filterDefinitions[currentFilterButton.id]);
      }
    }
  };

  var showFilter = function (cb) {
    filterCallback = window.debounce(cb);
    filterControl.classList.remove('img-filters--inactive');
    filterControl.addEventListener('click', onFilterClick);
  };

  window.filter = {
    showFilter: showFilter
  };

})();
