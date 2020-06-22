'use strict';

(function () {

  var MOCK_LENGTH = 25;
  var MOCK_LIKES_MIN = 15;
  var MOCK_LIKES_MAX = 200;
  var MOCK_COMMENTS_MIN = 1;
  var MOCK_COMMENTS_MAX = 4;
  var MOCK_MESSAGES = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  var MOCK_NAMES = ['Артём', 'Елена', 'Михаил', 'Ольга', 'Алексей', 'Джеймс', 'Хелен', 'Кекс'];


  var buildComments = function () {
    var messages = MOCK_MESSAGES.slice();
    var names = MOCK_NAMES.slice();
    var comments = [];

    for (var i = MOCK_COMMENTS_MIN; i < MOCK_COMMENTS_MAX; i++) {
      var comment = {};
      comment.avatar = 'img/avatar-' + window.util.getRandomInteger(1, 6) + '.svg';
      comment.message = window.util.peekRandomElement(messages);
      comment.name = window.util.peekRandomElement(names);

      comments.push(comment);

      if (Math.random() < 0.5) {
        break;
      }
    }

    return comments;
  };

  var buildPicturesMock = function () {
    var mock = [];
    var photoNumbers = [];

    for (var i = 1; i <= MOCK_LENGTH; i++) {
      photoNumbers.push(i);
    }

    for (i = 0; i < MOCK_LENGTH; i++) {
      var photo = {};
      photo.url = 'photos/' + window.util.peekRandomElement(photoNumbers) + '.jpg';
      photo.description = 'Фотография #' + (i + 1);
      photo.likes = window.util.getRandomInteger(MOCK_LIKES_MIN, MOCK_LIKES_MAX);
      photo.comments = buildComments();

      mock.push(photo);
    }

    return mock;
  };

  window.mock = {
    buildPicturesMock: buildPicturesMock
  };

})();
