'use strict';

(function () {

  var COMMENT_IMAGE_WIDTH = 35;
  var COMMENT_IMAGE_HEIGHT = 35;

  var bigPicture = document.querySelector('.big-picture');
  var bigPictureClose = bigPicture.querySelector('#picture-cancel');
  var bigPictureImage = bigPicture.querySelector('.big-picture__img img');
  var bigPictureLikesCount = bigPicture.querySelector('.likes-count');
  var bigPictureCommentsCount = bigPicture.querySelector('.comments-count');
  var bigPictureComments = bigPicture.querySelector('.social__comments');
  var bigPictureCaption = bigPicture.querySelector('.social__caption');


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

  var showPreview = function (photo) {
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

    window.dialog.openModalWindow(bigPicture, [bigPictureClose]);
  };

  window.fullsize = {
    showPreview: showPreview
  };

})();
