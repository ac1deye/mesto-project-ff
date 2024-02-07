const cardTemplate = document.querySelector('#card-template').content;

export function createCard(card, profile, onRemove, onLike, onImage) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const imageElement = cardElement.querySelector('.card__image');
  const likeCounter = cardElement.querySelector('.card__like-count');

  imageElement.src = card.link;
  imageElement.alt = card.name;
  cardElement.querySelector('.card__title').textContent = card.name;

  cardElement.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('card__delete-button')) {
      onRemove(card, cardElement);
    } else if (evt.target.classList.contains('card__like-button')) {
      onLike(card, cardElement);
    } else if (evt.target.classList.contains('card__image')) {
      onImage(card);
    }
  })

  likeCounter.textContent = card.likes?.length;

  if (card.owner._id !== profile._id) {
    deleteButton.remove();
  }

  if (card.likes.some(owner => owner._id == profile._id)) {
    likeCard(card, cardElement);
  }

  return cardElement;
}

export function removeCard(cardElement) {
  cardElement.remove();
}

export function likeCard(card, cardElement) {
  const likeButton = cardElement.querySelector('.card__like-button');
  likeButton.classList.toggle('card__like-button_is-active')

  const likeCounter = cardElement.querySelector('.card__like-count');
  likeCounter.textContent = card.likes?.length;
}