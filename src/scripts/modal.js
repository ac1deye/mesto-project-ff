export function openModal(popupElement) {
  popupElement.classList.add('popup_is-opened');
  
  document.addEventListener('keydown', closeOnKey);
  popupElement.addEventListener('click', closeOnClick);
}

export function closeModal(popupElement) {
  popupElement.classList.remove('popup_is-opened');
  
  document.removeEventListener('keydown', closeOnKey);
  popupElement.removeEventListener('click', closeOnClick);
}

function closeOnClick(evt) {
  if (evt.target.classList.contains('popup')) {
    closeModal(evt.target);
  }
}

function closeOnKey(evt) {
  if (evt.key === 'Escape') {
    const popup = document.querySelector('.popup_is-opened');
    if (popup) {
      closeModal(popup);
    }
  }
}