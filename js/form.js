'use strict';

(function () {

  var IMAGE_MIME_TYPE_PREFIX = 'image/';
  var EFFECT_NONE = 'none';
  var EFFECT_DEF = {
    'none': {filter: '', minLevel: 0, maxLevel: 0, levelUnit: ''},
    'chrome': {filter: 'grayscale', minLevel: 0, maxLevel: 1, levelUnit: ''},
    'sepia': {filter: 'sepia', minLevel: 0, maxLevel: 1, levelUnit: ''},
    'marvin': {filter: 'invert', minLevel: 0, maxLevel: 100, levelUnit: '%'},
    'phobos': {filter: 'blur', minLevel: 0, maxLevel: 3, levelUnit: 'px'},
    'heat': {filter: 'brightness', minLevel: 1, maxLevel: 3, levelUnit: ''}
  };
  var EFFECT_MAX_LEVEL = 100;
  var SCALE_CHANGE_STEP = 25;
  var SCALE_MIN_LEVEL = 25;
  var SCALE_MAX_LEVEL = 100;
  var MAX_HASHTAGS = 5;
  var MAX_HASHTAG_LENGTH = 20;
  var HASHTAG_ERROR_TOOMANY = 'Слишком много хэш-тегов (максимум - ' + MAX_HASHTAGS + ')';
  var HASHTAG_ERROR_NO = 'Ошибка в хэш-теге № ';
  var HASHTAG_ERROR_FORMAT = 'хэш-тег должен начинаться с символа # и содержать только буквы (минимум 1)';
  var HASHTAG_ERROR_TOOLONG = 'хэш-тег слишком длинный (максимум символов - ' + MAX_HASHTAG_LENGTH + ')';
  var HASHTAG_ERROR_REUSE = 'повторное использование';

  var uploadFileButton = document.querySelector('#upload-file');

  var uploadWindow = document.querySelector('.img-upload__overlay');
  var uploadWindowClose = uploadWindow.querySelector('#upload-cancel');
  var uploadWindowScaleBigger = uploadWindow.querySelector('.scale__control--bigger');
  var uploadWindowScaleSmaller = uploadWindow.querySelector('.scale__control--smaller');
  var uploadWindowScaleValue = uploadWindow.querySelector('.scale__control--value');
  var uploadWindowPreviewImage = uploadWindow.querySelector('.img-upload__preview img');
  var uploadWindowEffectsList = uploadWindow.querySelector('.effects__list');
  var uploadWindowEffectNone = uploadWindow.querySelector('#effect-none');
  var uploadWindowEffectLevel = uploadWindow.querySelector('.effect-level');
  var uploadWindowEffectLevelValue = uploadWindowEffectLevel.querySelector('.effect-level__value');
  var uploadWindowEffectLevelPin = uploadWindowEffectLevel.querySelector('.effect-level__pin');
  var uploadWindowEffectLevelDepth = uploadWindowEffectLevel.querySelector('.effect-level__depth');
  var uploadWindowForm = document.querySelector('#upload-select-image');
  var uploadWindowHashTags = uploadWindowForm.querySelector('input[name="hashtags"]');
  var uploadWindowDescription = uploadWindowForm.querySelector('textarea[name="description"]');

  var pictureScale;
  var pictureEffect;
  var isSaving = false;

  var setPictureScale = function (newPictureScale) {
    pictureScale = newPictureScale;
    uploadWindowScaleValue.value = pictureScale + '%';
    uploadWindowPreviewImage.style.transform = 'scale(' + (pictureScale / 100) + ')';
  };

  var setPictureEffect = function (newPictureEffect) {
    if (pictureEffect) {
      uploadWindowPreviewImage.classList.remove('effects__preview--' + pictureEffect);
    }
    pictureEffect = newPictureEffect;
    uploadWindowPreviewImage.classList.add('effects__preview--' + pictureEffect);
    uploadWindowEffectLevel.classList.toggle('hidden', pictureEffect === EFFECT_NONE);

    setPictureEffectLevel(EFFECT_MAX_LEVEL);
  };

  var setPictureEffectLevel = function (newPictureEffectLevel) {
    uploadWindowEffectLevelValue.value = newPictureEffectLevel;
    uploadWindowEffectLevelPin.style.left = newPictureEffectLevel + '%';
    uploadWindowEffectLevelDepth.style.width = newPictureEffectLevel + '%';

    var effectDef = EFFECT_DEF[pictureEffect];
    uploadWindowPreviewImage.style.filter = (!effectDef.filter) ? '' :
      effectDef.filter + '(' + (effectDef.minLevel + (effectDef.maxLevel - effectDef.minLevel) / EFFECT_MAX_LEVEL * newPictureEffectLevel) + effectDef.levelUnit + ')';
  };

  var onBiggerClick = function () {
    setPictureScale(pictureScale + SCALE_CHANGE_STEP < SCALE_MAX_LEVEL ? pictureScale + SCALE_CHANGE_STEP : SCALE_MAX_LEVEL);
  };

  var onSmallerClick = function () {
    setPictureScale(pictureScale - SCALE_CHANGE_STEP > SCALE_MIN_LEVEL ? pictureScale - SCALE_CHANGE_STEP : SCALE_MIN_LEVEL);
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
      var newLevel = (evtMove.clientX - baseX) * EFFECT_MAX_LEVEL / baseWidth;
      newLevel = (newLevel < 0) ? 0 : newLevel;
      newLevel = (newLevel > EFFECT_MAX_LEVEL) ? EFFECT_MAX_LEVEL : newLevel;
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
    if (!uploadWindowHashTags.value) {
      uploadWindowHashTags.setCustomValidity('');
      return;
    }

    var hashTags = uploadWindowHashTags.value.trim().split(/ +/);
    var hashTagsUsed = [];

    for (var i = 0; i < hashTags.length; i++) {
      if (i >= MAX_HASHTAGS) {
        uploadWindowHashTags.setCustomValidity(HASHTAG_ERROR_TOOMANY);
        return;
      }

      if (!hashTags[i].match(/^#[a-zа-я]+$/i)) {
        uploadWindowHashTags.setCustomValidity(HASHTAG_ERROR_NO + (i + 1) + ': ' + HASHTAG_ERROR_FORMAT);
        return;
      }

      if (hashTags[i].length > MAX_HASHTAG_LENGTH) {
        uploadWindowHashTags.setCustomValidity(HASHTAG_ERROR_NO + (i + 1) + ': ' + HASHTAG_ERROR_TOOLONG);
        return;
      }

      var hashTagLower = hashTags[i].toLowerCase();
      if (hashTagsUsed.indexOf(hashTagLower) >= 0) {
        uploadWindowHashTags.setCustomValidity(HASHTAG_ERROR_NO + (i + 1) + ': ' + HASHTAG_ERROR_REUSE);
        return;
      }
      hashTagsUsed.push(hashTagLower);
    }

    uploadWindowHashTags.value = hashTags.join(' ');
    uploadWindowHashTags.setCustomValidity('');
  };

  var onHashTagsChange = function () {
    validateHashTags();
  };

  var onSubmit = function (evt) {
    evt.preventDefault();

    if (isSaving) {
      return;
    }
    isSaving = true;

    window.backend.savePicture(new FormData(uploadWindowForm),
        function () {
          // onLoad
          isSaving = false;
          window.dialog.closeModalWindow(uploadWindow, window.dialog.ACTION_SUBMIT);
          window.dialog.showSuccessInfo();
        },
        function () {
          // onError
          isSaving = false;
          window.dialog.closeModalWindow(uploadWindow, window.dialog.ACTION_SUBMIT);
          window.dialog.showErrorInfo();
        }
    );
  };

  var setEventHandlers = function () {
    uploadWindowScaleSmaller.addEventListener('click', onSmallerClick);
    uploadWindowScaleBigger.addEventListener('click', onBiggerClick);
    uploadWindowEffectsList.addEventListener('change', onEffectChange);
    uploadWindowEffectLevelPin.addEventListener('mousedown', onEffectLevelPinMouseDown);
    uploadWindowHashTags.addEventListener('change', onHashTagsChange);
    uploadWindowForm.addEventListener('submit', onSubmit);
  };

  var unsetEventHandlers = function () {
    uploadWindowScaleSmaller.removeEventListener('click', onSmallerClick);
    uploadWindowScaleBigger.removeEventListener('click', onBiggerClick);
    uploadWindowEffectsList.removeEventListener('change', onEffectChange);
    uploadWindowEffectLevelPin.removeEventListener('mousedown', onEffectLevelPinMouseDown);
    uploadWindowHashTags.removeEventListener('change', onHashTagsChange);
    uploadWindowForm.removeEventListener('submit', onSubmit);
  };

  var open = function () {
    var file = uploadFileButton.files[0];

    if (!file.type.startsWith(IMAGE_MIME_TYPE_PREFIX)) {
      window.dialog.showErrorInfo();
      return;
    }

    var reader = new FileReader();
    reader.addEventListener('load', function (evt) {
      uploadWindowPreviewImage.src = evt.target.result;
    });
    reader.readAsDataURL(file);

    setPictureScale(100);
    setPictureEffect(EFFECT_NONE);

    setEventHandlers();

    window.dialog.openModalWindow(uploadWindow, [uploadWindowClose], function (action) {
      // closeCallback
      if (action === window.dialog.ACTION_CANCEL && (document.activeElement === uploadWindowHashTags || document.activeElement === uploadWindowDescription)) {
        return false;
      }

      unsetEventHandlers();

      uploadWindowHashTags.setCustomValidity('');
      uploadFileButton.value = '';
      uploadWindowHashTags.value = '';
      uploadWindowDescription.value = '';
      setPictureScale(100);
      uploadWindowEffectNone.checked = true;
      setPictureEffect(EFFECT_NONE);

      return true;
    });
  };


  window.form = {
    open: open
  };

})();
