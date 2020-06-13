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
var KEY_ESC = 27;

var photoPattern = document.querySelector('#picture').content.querySelector('.picture');
var photosContainer = document.querySelector('.pictures');

var bigPicture = document.querySelector('.big-picture');
var bigPictureImage = bigPicture.querySelector('.big-picture__img img');
var bigPictureLikesCount = bigPicture.querySelector('.likes-count');
var bigPictureCommentsCount = bigPicture.querySelector('.comments-count');
var bigPictureComments = bigPicture.querySelector('.social__comments');
var bigPictureCaption = bigPicture.querySelector('.social__caption');

var uploadFileButton = document.querySelector('#upload-file');

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
    photo.description = 'Фотография #' + (i + 1);
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

var makeCommentElement = function (comment) {
  var commentElement = document.createElement('LI');
  commentElement.className = 'social__comment';

  var commentImage = document.createElement('IMG');
  commentImage.className = 'social__picture';
  commentImage.src = comment.avatar;
  commentImage.alt = comment.name;
  commentImage.width = 35;
  commentImage.height = 35;
  commentElement.appendChild(commentImage);

  var commentText = document.createElement('P');
  commentText.className = 'social__text';
  commentText.textContent = comment.message;
  commentElement.appendChild(commentText);

  return commentElement;
};


var showBigPicture = function (photo) {
  bigPictureImage.src = photo.url;
  bigPictureLikesCount.textContent = photo.likes;
  bigPictureCommentsCount.textContent = photo.comments.length;
  bigPictureCaption.textContent = photo.description;

  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photo.comments.length; i++) {
    fragment.appendChild(makeCommentElement(photo.comments[i]));
  }

  while (bigPictureComments.lastElementChild) {
    bigPictureComments.removeChild(bigPictureComments.lastElementChild);
  }
  bigPictureComments.appendChild(fragment);

  bigPicture.querySelector('.social__comment-count').classList.add('hidden');
  bigPicture.querySelector('.comments-loader').classList.add('hidden');

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
};


var openModalWindow = function (modalSelector, closeSelector, closeCallback) {
  var wnd = document.querySelector(modalSelector);
  var wndCloseButton = wnd.querySelector(closeSelector);

  var closeModalWindow = function () {
    if (closeCallback) {
      closeCallback();
    }

    if (wndCloseButton) {
      wndCloseButton.removeEventListener('click', onCloseClick);
    }
    window.removeEventListener('keydown', onKeyDown);

    wnd.classList.add('hidden');
    document.body.classList.remove('modal-open');
  };

  var onKeyDown = function (evt) {
    if (evt.keyCode === KEY_ESC) {
      closeModalWindow();
    }
  };

  var onCloseClick = function () {
    closeModalWindow();
  };

  if (wndCloseButton) {
    wndCloseButton.addEventListener('click', onCloseClick);
  }
  window.addEventListener('keydown', onKeyDown);

  wnd.classList.remove('hidden');
  document.body.classList.add('modal-open');
};


var mock = buildMock();
renderPhotos(mock);

// showBigPicture(mock[0]);

uploadFileButton.addEventListener('change', function () {
  var reader = new FileReader();
  reader.addEventListener('load', function (evt) {
    document.querySelector('.img-upload__preview img').src = evt.target.result;
  });
  reader.readAsDataURL(uploadFileButton.files[0]);

  openModalWindow('.img-upload__overlay', '#upload-cancel', function () {
    uploadFileButton.value = '';
  });
});
