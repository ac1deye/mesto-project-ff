export function openModal(popupElement) {
  popupElement.classList.add('popup_is-opened');

  const popupClose = popupElement.querySelector('.popup__close');
  popupClose.addEventListener('click', closeModal);
  
  document.addEventListener('keydown', closeOnKey);
  popupElement.addEventListener('click', closeOnClick);
}

export function closeModal(evt) {
  const popupElement = evt.target.closest('.popup');
  
  popupElement.classList.remove('popup_is-opened');
  
  const popupClose = popupElement.querySelector('.popup__close');
  popupClose.removeEventListener('click', closeModal);

  document.removeEventListener('keydown', closeOnKey);
  popupElement.removeEventListener('click', closeOnClick);
}

function closeOnClick(evt) {
  if (evt.target.classList.contains('popup_is-opened')) {
    evt.target.classList.remove('popup_is-opened');
  }
}

function closeOnKey(evt) {
  if (evt.key === 'Escape') {
    evt.currentTarget.removeEventListener('keydown', closeOnKey);

    let popup = document.querySelector('.popup_is-opened');
    if (popup) {
      popup.classList.remove('popup_is-opened');
    }
  }
}