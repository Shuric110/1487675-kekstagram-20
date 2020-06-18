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
var EFFECT_DEF = {
  none: {filter: '', minLevel: 0, maxLevel: 0, levelUnit: ''},
  chrome: {filter: 'grayscale', minLevel: 0, maxLevel: 1, levelUnit: ''},
  sepia: {filter: 'sepia', minLevel: 0, maxLevel: 1, levelUnit: ''},
  marvin: {filter: 'invert', minLevel: 0, maxLevel: 100, levelUnit: '%'},
  phobos: {filter: 'blur', minLevel: 0, maxLevel: 3, levelUnit: 'px'},
  heat: {filter: 'brightness', minLevel: 1, maxLevel: 3, levelUnit: ''}
};
var MAX_HASHTAGS = 5;
var MAX_HASHTAG_LENGTH = 20;

var photoPattern = document.querySelector('#picture').content.querySelector('.picture');
var photosContainer = document.querySelector('.pictures');

var bigPicture = document.querySelector('.big-picture');
var bigPictureClose = bigPicture.querySelector('#picture-cancel');
var bigPictureImage = bigPicture.querySelector('.big-picture__img img');
var bigPictureLikesCount = bigPicture.querySelector('.likes-count');
var bigPictureCommentsCount = bigPicture.querySelector('.comments-count');
var bigPictureComments = bigPicture.querySelector('.social__comments');
var bigPictureCaption = bigPicture.querySelector('.social__caption');

var uploadFileButton = document.querySelector('#upload-file');
var editWindow = document.querySelector('.img-upload__overlay');
var editWindowClose = editWindow.querySelector('#upload-cancel');
var editWindowScaleBigger = editWindow.querySelector('.scale__control--bigger');
var editWindowScaleSmaller = editWindow.querySelector('.scale__control--smaller');
var editWindowScaleValue = editWindow.querySelector('.scale__control--value');
var editWindowPreviewImage = editWindow.querySelector('.img-upload__preview img');
var editWindowEffectsList = editWindow.querySelector('.effects__list');
var editWindowEffectNone = editWindow.querySelector('#effect-none');
var editWindowEffectLevel = editWindow.querySelector('.effect-level');
var editWindowEffectLevelValue = editWindowEffectLevel.querySelector('.effect-level__value');
var editWindowEffectLevelPin = editWindowEffectLevel.querySelector('.effect-level__pin');
var editWindowEffectLevelDepth = editWindowEffectLevel.querySelector('.effect-level__depth');
var editWindowForm = document.querySelector('#upload-select-image');
var editWindowHashTags = editWindowForm.querySelector('input[name="hashtags"]');
var editWindowDescription = editWindowForm.querySelector('textarea[name="description"]');

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
  photoElement.photoData = photo;

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

  var oldComments = bigPictureComments.querySelectorAll('.social__comment');
  for (i = 0; i < oldComments.length; i++) {
    bigPictureComments.removeChild(oldComments[i]);
  }

  bigPictureComments.appendChild(fragment);

  bigPicture.querySelector('.social__comment-count').classList.add('hidden');
  bigPicture.querySelector('.comments-loader').classList.add('hidden');

  openModalWindow(bigPicture, [bigPictureClose]);
};

var onPhotoClick = function (evt) {
  var target = evt.target;
  while (target && target.matches && !target.matches('.picture')) {
    target = target.parentNode;
  }
  if (target && target.photoData) {
    evt.preventDefault();
    showBigPicture(target.photoData);
  }
};


var openModalWindow = function (wnd, wndCloseButtons, closeCallback) {
  var closeModalWindow = function () {
    if (closeCallback && !closeCallback()) {
      return;
    }

    for (var i = 0; i < wndCloseButtons.length; i++) {
      wndCloseButtons[i].removeEventListener('click', onCloseClick);
    }
    window.removeEventListener('keydown', onKeyDown);

    wnd.classList.add('hidden');
    document.body.classList.remove('modal-open');
  };

  var onKeyDown = function (evt) {
    if (evt.key === 'Escape') {
      closeModalWindow();
    }
  };

  var onCloseClick = function () {
    closeModalWindow();
  };

  for (var i = 0; i < wndCloseButtons.length; i++) {
    wndCloseButtons[i].addEventListener('click', onCloseClick);
  }
  window.addEventListener('keydown', onKeyDown);

  wnd.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

var openEditWindow = function () {
  var pictureScale;
  var pictureEffect;

  var setPictureScale = function (newPictureScale) {
    pictureScale = newPictureScale;
    editWindowScaleValue.value = pictureScale + '%';
    editWindowPreviewImage.style.transform = 'scale(' + (pictureScale / 100) + ')';
  };

  var setPictureEffect = function (newPictureEffect) {
    if (pictureEffect) {
      editWindowPreviewImage.classList.remove('effects__preview--' + pictureEffect);
    }
    pictureEffect = newPictureEffect;
    editWindowPreviewImage.classList.add('effects__preview--' + pictureEffect);
    editWindowEffectLevel.classList.toggle('hidden', pictureEffect === 'none');

    setPictureEffectLevel(100);
  };

  var setPictureEffectLevel = function (newPictureEffectLevel) {
    editWindowEffectLevelValue.value = newPictureEffectLevel;
    editWindowEffectLevelPin.style.left = newPictureEffectLevel + '%';
    editWindowEffectLevelDepth.style.width = newPictureEffectLevel + '%';

    var effectDef = EFFECT_DEF[pictureEffect];
    editWindowPreviewImage.style.filter = (!effectDef.filter) ? '' :
      effectDef.filter + '(' + (effectDef.minLevel + (effectDef.maxLevel - effectDef.minLevel) / 100 * newPictureEffectLevel) + effectDef.levelUnit + ')';
  };

  var onBiggerClick = function () {
    if (pictureScale < 100) {
      setPictureScale(pictureScale + 25);
    }
  };

  var onSmallerClick = function () {
    if (pictureScale > 25) {
      setPictureScale(pictureScale - 25);
    }
  };

  var onEffectChange = function (evt) {
    if (evt.target && evt.target.matches('input[name="effect"]')) {
      setPictureEffect(evt.target.value);
    }
  };

  var onEffectLevelPinMouseDown = function (evt) {
    evt.preventDefault();
    var baseWidth = evt.target.parentNode.offsetWidth;
    var baseX = evt.clientX - evt.target.offsetLeft;

    var onEffectLevelPinMouseMove = function (evtMove) {
      evtMove.preventDefault();
      var newLevel = (evtMove.clientX - baseX) * 100 / baseWidth;
      newLevel = (newLevel < 0) ? 0 : newLevel;
      newLevel = (newLevel > 100) ? 100 : newLevel;
      newLevel = Math.round(newLevel);
      setPictureEffectLevel(newLevel);
    };

    var onEffectLevelPinMouseUp = function () {
      document.removeEventListener('mousemove', onEffectLevelPinMouseMove);
      document.removeEventListener('mouseup', onEffectLevelPinMouseUp);
    };

    document.addEventListener('mousemove', onEffectLevelPinMouseMove);
    document.addEventListener('mouseup', onEffectLevelPinMouseUp);
  };

  var validateHashTags = function () {
    var hashTags = editWindowHashTags.value.trim().split(/ +/);
    var hashTagsUsed = [];

    for (var i = 0; i < hashTags.length; i++) {
      if (i >= MAX_HASHTAGS) {
        editWindowHashTags.setCustomValidity('Слишком много хэш-тегов (максимум - ' + MAX_HASHTAGS + ')');
        return false;
      }

      if (!hashTags[i].match(/^#[a-zа-я]+$/i)) {
        editWindowHashTags.setCustomValidity('Ошибка в хэш-теге № ' + (i + 1) + ': хэш-тег должен начинаться с символа # и содердать только буквы');
        return false;
      }

      if (hashTags[i].length > MAX_HASHTAG_LENGTH) {
        editWindowHashTags.setCustomValidity('Ошибка в хэш-теге № ' + (i + 1) + ': хэш-тег слишком длинный (максимум символов - ' + MAX_HASHTAG_LENGTH + ')');
        return false;
      }

      var hashTagLower = hashTags[i].toLowerCase();
      if (hashTagsUsed.indexOf(hashTagLower) >= 0) {
        editWindowHashTags.setCustomValidity('Ошибка в хэш-теге № ' + (i + 1) + ': повторное использование');
        return false;
      }
      hashTagsUsed.push(hashTagLower);
    }

    editWindowHashTags.setCustomValidity('');
    return true;
  };

  var onHashTagsChange = function () {
    validateHashTags();
  };

  var reader = new FileReader();
  reader.addEventListener('load', function (evt) {
    editWindowPreviewImage.src = evt.target.result;
  });
  reader.readAsDataURL(uploadFileButton.files[0]);

  setPictureScale(100);
  editWindowEffectNone.checked = true;
  setPictureEffect('none');

  editWindowScaleSmaller.addEventListener('click', onSmallerClick);
  editWindowScaleBigger.addEventListener('click', onBiggerClick);
  editWindowEffectsList.addEventListener('change', onEffectChange);
  editWindowEffectLevelPin.addEventListener('mousedown', onEffectLevelPinMouseDown);
  editWindowHashTags.addEventListener('change', onHashTagsChange);

  openModalWindow(editWindow, [editWindowClose], function () {
    // closeCallback
    if (document.activeElement === editWindowHashTags || document.activeElement === editWindowDescription) {
      return false;
    }

    editWindowScaleSmaller.removeEventListener('click', onSmallerClick);
    editWindowScaleBigger.removeEventListener('click', onBiggerClick);
    editWindowEffectsList.removeEventListener('change', onEffectChange);
    editWindowEffectLevelPin.removeEventListener('mousedown', onEffectLevelPinMouseDown);
    editWindowHashTags.removeEventListener('change', onHashTagsChange);
    uploadFileButton.value = '';
    if (pictureEffect) {
      editWindowPreviewImage.classList.remove('effects__preview--' + pictureEffect);
    }

    return true;
  });
};

var onUploadChange = function () {
  openEditWindow();
};


var mock = buildMock();
renderPhotos(mock);

photosContainer.addEventListener('click', onPhotoClick);
uploadFileButton.addEventListener('change', onUploadChange);
