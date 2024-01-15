
const cardTemplate = document.querySelector('#card-template').content;

export function createCard(card, onRemove, onLike, onImage) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const imageElement = cardElement.querySelector('.card__image');
  
  imageElement.src = card.link;
  imageElement.alt = card.name;
  cardElement.querySelector('.card__title').textContent = card.name;

  cardElement.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('card__delete-button')) {
      removeCard(cardElement);
      onRemove(evt);
    } else if (evt.target.classList.contains('card__like-button')) {
      likeCard(likeButton);
      onLike(likeButton);
    } else if (evt.target.classList.contains('card__image')) {
      onImage(card.link, card.name);
    }
  })

  return cardElement;
}

export function removeCard(card) {
  card.remove();
}

export function likeCard(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active')
}