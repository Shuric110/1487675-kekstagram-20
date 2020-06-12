'use strict';

var MOCK_LENGTH = 25;
var MOCK_LIKES_MIN = 15;
var MOCK_LIKES_MAX = 200;
var MOCK_MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var MOCK_NAMES = ['Артём', 'Елена', 'Михаил', 'Ольга', 'Алексей', 'Джеймс', 'Хелен', 'Кекс'];

var photoPattern = document.querySelector('#picture').content.querySelector('.picture');
var photosContainer = document.querySelector('.pictures');


var randomInteger = function (min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
};

var peekRandomElement = function (array) {
  var i = randomInteger(0, array.length - 1);
  var result = array[i];
  array.splice(i, 1);
  return result;
};

var buildComments = function () {
  var comments = [];
  var commentsCount = 1;
  var messages = MOCK_MESSAGES.slice();
  var names = MOCK_NAMES.slice();

  if (Math.random() < 0.3) {
    commentsCount++;
    if (Math.random() < 0.3) {
      commentsCount++;
    }
  }

  for (var i = 0; i < commentsCount; i++) {
    var comment = {};
    comment.avatar = 'img/avatar-' + randomInteger(1, 6) + '.svg';
    comment.message = peekRandomElement(messages);
    comment.name = peekRandomElement(names);

    comments.push(comment);
  }

  return comments;
};

var buildMock = function () {
  var mock = [];
  var photoNumbers = [];

  for (var i = 1; i <= MOCK_LENGTH; i++) {
    photoNumbers.push(i);
  }

  for (i = 0; i < MOCK_LENGTH; i++) {
    var photo = {};
    photo.url = 'photos/' + peekRandomElement(photoNumbers) + '.jpg';
    photo.description = '';
    photo.likes = randomInteger(MOCK_LIKES_MIN, MOCK_LIKES_MAX);
    photo.comments = buildComments();

    mock.push(photo);
  }

  return mock;
};


var makePhotoElement = function (photo) {
  var photoElement = photoPattern.cloneNode(true);
  photoElement.querySelector('.picture__img').src = photo.url;
  photoElement.querySelector('.picture__likes').textContent = photo.likes;
  photoElement.querySelector('.picture__comments').textContent = photo.comments.length;

  return photoElement;
};

var renderPhotos = function (photos) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(makePhotoElement(photos[i]));
  }

  photosContainer.appendChild(fragment);
};


var mock = buildMock();
renderPhotos(mock);
