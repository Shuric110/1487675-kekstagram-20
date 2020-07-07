'use strict';

(function () {

  var COMMENT_IMAGE_WIDTH = 35;
  var COMMENT_IMAGE_HEIGHT = 35;
  var COMMENTS_AT_TIME = 5;

  var bigPicture = document.querySelector('.big-picture');
  var bigPictureClose = bigPicture.querySelector('#picture-cancel');
  var bigPictureImage = bigPicture.querySelector('.big-picture__img img');
  var bigPictureLikesCount = bigPicture.querySelector('.likes-count');
  var bigPictureCommentsCount = bigPicture.querySelector('.comments-count');
  var bigPictureCommentsShown = bigPicture.querySelector('.comments-shown');
  var bigPictureComments = bigPicture.querySelector('.social__comments');
  var bigPictureCaption = bigPicture.querySelector('.social__caption');
  var commentsLoaderButton = bigPicture.querySelector('.comments-loader');

  var commentsNotShown = [];
  var commentsShownCount;

  var makeCommentElement = function (comment) {
    var commentElement = document.createElement('LI');
    commentElement.className = 'social__comment';

    var commentImage = document.createElement('IMG');
    commentImage.className = 'social__picture';
    commentImage.src = comment.avatar;
    commentImage.alt = comment.name;
    commentImage.width = COMMENT_IMAGE_WIDTH;
    commentImage.height = COMMENT_IMAGE_HEIGHT;
    commentElement.appendChild(commentImage);

    var commentText = document.createElement('P');
    commentText.className = 'social__text';
    commentText.textContent = comment.message;
    commentElement.appendChild(commentText);

    return commentElement;
  };

  var clearComments = function () {
    var comments = bigPictureComments.querySelectorAll('.social__comment');
    comments.forEach(function (comment) {
      bigPictureComments.removeChild(comment);
    });
    commentsShownCount = 0;
    bigPictureCommentsShown.textContent = commentsShownCount;
  };

  var addNextComments = function () {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < COMMENTS_AT_TIME && commentsNotShown.length > 0; i++) {
      fragment.appendChild(makeCommentElement(commentsNotShown.shift()));
      commentsShownCount++;
    }
    bigPictureComments.appendChild(fragment);
    bigPictureCommentsShown.textContent = commentsShownCount;

    if (commentsNotShown.length === 0) {
      commentsLoaderButton.classList.add('hidden');
    }
  };

  var onCommentsLoaderClick = function () {
    addNextComments();
  };

  var showPreview = function (photo) {
    bigPictureImage.src = photo.url;
    bigPictureLikesCount.textContent = photo.likes;
    bigPictureCommentsCount.textContent = photo.comments.length;
    bigPictureCaption.textContent = photo.description;

    commentsNotShown = photo.comments.slice();
    clearComments();
    addNextComments();

    commentsLoaderButton.addEventListener('click', onCommentsLoaderClick);

    window.dialog.openModalWindow(bigPicture, [bigPictureClose], function () {
      // closeCallback
      commentsLoaderButton.removeEventListener('click', onCommentsLoaderClick);
      commentsNotShown = [];
      commentsLoaderButton.classList.remove('hidden');
      return true;
    });
  };

  window.preview = {
    showPreview: showPreview
  };

})();
