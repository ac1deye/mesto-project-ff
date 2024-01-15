import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, removeCard, likeCard } from './card.js';
import { openModal, closeModal } from './modal.js';

// DOM узлы
const cardList = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button'); 
const addButton = document.querySelector('.profile__add-button');

const popupEdit = document.querySelector('.popup_type_edit');
const popupAdd = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const editFormElement = document.forms['edit-profile'];
const nameInput = editFormElement.elements.name;
const jobInput = editFormElement.elements.description;

const addCardFormElement = document.forms['new-place'];
const cardTitleInput = addCardFormElement.elements['place-name'];
const cardLinkInput = addCardFormElement.elements['link'];

// Вывести карточки на страницу
function appendCards(cards) {
  cards.forEach((card) => {
    const cardElement = createCard(card, onCardRemove, onLikeCard, onImageClick);
    cardList.append(cardElement);
  });
}

appendCards(initialCards);

// Слушатели кнопок редактирования, добавления
editButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  
  openModal(popupEdit);
})

addButton.addEventListener('click', () => {
  openModal(popupAdd);
});

// Взаимодлействие с карточками
function onCardRemove(card) {
  // Это понадобится в будущем для интеграции с API.
}

function onLikeCard(card) {
  // Это понадобится в будущем для интеграции с API.
}

function onImageClick(imageUrl, description) {
  const imageElement = popupImage.querySelector('.popup__image');
  const descriptionElement = popupImage.querySelector('.popup__caption');

  imageElement.src = imageUrl;
  imageElement.alt = description;

  descriptionElement.textContent = description;

  openModal(popupImage);
}

// Обработка ввода данных
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closeModal(evt);
}

editFormElement.addEventListener('submit', handleEditFormSubmit); 

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  
  const card = {
    name: cardTitleInput.value,
    link: cardLinkInput.value
  }

  cardTitleInput.value = '';
  cardLinkInput.value = '';
  
  const cardElement = createCard(card, onCardRemove, onLikeCard, onImageClick);
  cardList.prepend(cardElement);
  
  closeModal(evt);
}

addCardFormElement.addEventListener('submit', handleAddCardFormSubmit);