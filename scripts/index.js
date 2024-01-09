// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// DOM узлы
const cardList = document.querySelector('.places__list');

// Функция создания карточки
function createCard(card, onRemove) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardElement.querySelector('.card__image').src = card.link;
  cardElement.querySelector('.card__image').alt = card.name;
  cardElement.querySelector('.card__title').textContent = card.name;

  deleteButton.addEventListener('click', onRemove);
  
  return cardElement;
}

// Функция удаления карточки
function removeCard(event) {
  const card = event.target.closest('.card');
  card.remove();
}

// Вывести карточки на страницу
function appendCards(cards) {
  cards.forEach((card) => {
    const cardElement = createCard(card, removeCard);

    cardList.append(cardElement);
  });
}

appendCards(initialCards);