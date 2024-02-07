import '../pages/index.css';
import { createCard, removeCard, likeCard } from './card.js';
import { openModal, closeModal } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import { getProfile, getCards, patchProfile, postCard, deleteCard, setCardLike, patchProfileAvatar } from './api.js';
import { handleSubmit } from './utils.js';

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input_error-description_active'
}

// DOM узлы
const cardList = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button'); 
const addButton = document.querySelector('.profile__add-button');

const popupEdit = document.querySelector('.popup_type_edit');
const popupEditAvatar = document.querySelector('.popup_type_edit-avatar');
const popupAdd = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const popupRemoveCardConfirm = document.querySelector('.popup_type_remove-card');

const profileAvatar = document.querySelector('.profile__image');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const editFormElement = document.forms['edit-profile'];
const nameInput = editFormElement.elements.name;
const jobInput = editFormElement.elements.description;

const editAvatarElement = document.forms['edit-avatar'];
const avatarLinkInput = editAvatarElement.elements['link'];

const addCardFormElement = document.forms['new-place'];
const cardTitleInput = addCardFormElement.elements['place-name'];
const cardLinkInput = addCardFormElement.elements['link'];

const imageElement = popupImage.querySelector('.popup__image');
const descriptionElement = popupImage.querySelector('.popup__caption');

const removeCardFormElement = document.forms['remove-card'];

// Переменные
let profile = {
  name: '',
  about: '',
  avatar: ''
};
let cards = null;
let cardToRemove = null;

// Вывести карточки на страницу
function appendCards(cards, profile) {
  cards.forEach((card) => {
    const cardElement = createCard(card, profile, onCardRemove, onLikeCard, onImageClick);
    cardList.append(cardElement);
  });
}

// Слушатели кнопок редактирования, добавления
editButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  
  clearValidation(editFormElement, validationConfig);

  openModal(popupEdit);
});

profileAvatar.addEventListener('click', () => {
  avatarLinkInput.value = '';

  clearValidation(popupEditAvatar, validationConfig);

  openModal(popupEditAvatar);
});

addButton.addEventListener('click', () => {
  cardTitleInput.value = '';
  cardLinkInput.value = '';

  clearValidation(addCardFormElement, validationConfig);

  openModal(popupAdd);
});

// Взаимодлействие с карточками
function onCardRemove(card, cardElement) {
  cardToRemove = {
    card,
    cardElement
  }
  openModal(popupRemoveCardConfirm);
}

function onLikeCard(card, cardElement) {
  const isLiked = !cards.find(item =>item._id === card._id)
                    .likes.some(owner => owner._id == profile._id);
  
  setCardLike(card, isLiked)
    .then(json => {
      const card = {
        _id: json._id,
        name: json.name,
        link: json.link,
        likes: json.likes,
        owner: json.owner
      }

      const index = cards.findIndex((item) => item._id === card._id);
      cards[index] = card
      
      likeCard(card, cardElement);
    })
    .catch(console.error);
}

function onImageClick(card) {
  imageElement.src = card.link;
  imageElement.alt = card.name;

  descriptionElement.textContent = card.name;

  openModal(popupImage);
}

// Обработка ввода данных
function handleEditFormSubmit(evt) {
  function makeRequest() {
    return patchProfile({name: nameInput.value, about: jobInput.value})
      .then((json) => {
        profile.name = json.name;
        profile.about = json.about;
        renderProfile(profile);
        closeModal(popupEdit);
      });
  }
  handleSubmit(makeRequest, evt);
}

function handleEditAvatarFormSubmit(evt) {
  function makeRequest() {
    return patchProfileAvatar(avatarLinkInput.value)
      .then((json) => {
        profile.avatar = json.avatar;
        renderProfile(profile);
        closeModal(popupEditAvatar);
      });
  }
  handleSubmit(makeRequest, evt);
}

function handleAddCardFormSubmit(evt) {
  function makeRequest() {
    return postCard({name: cardTitleInput.value, link: cardLinkInput.value})
      .then((json) => {
        const card = {
          _id: json._id,
          name: json.name,
          link: json.link,
          likes: json.likes,
          owner: json.owner
        }
        cards.unshift(card)

        const cardElement = createCard(card, profile, onCardRemove, onLikeCard, onImageClick);
        cardList.prepend(cardElement);

        closeModal(popupAdd);
      })
  }
  handleSubmit(makeRequest, evt);
}

function handleCardRemoveConfirmation(evt) {
  function makeRequest() {
    return deleteCard(cardToRemove.card)
      .then((res) => {
        const index = cards.findIndex((item) => item._id === cardToRemove.card._id);
        cards.splice(index, index  + 1);

        removeCard(cardToRemove.cardElement);
        cardToRemove = null;

        closeModal(popupRemoveCardConfirm);
      })
  }
  handleSubmit(makeRequest, evt, 'Удаление...');
}

editFormElement.addEventListener('submit', handleEditFormSubmit); 
editAvatarElement.addEventListener('submit', handleEditAvatarFormSubmit);
addCardFormElement.addEventListener('submit', handleAddCardFormSubmit);
removeCardFormElement.addEventListener('submit', handleCardRemoveConfirmation);

// Закрытие модалки по крестику
const closePopups = document.querySelectorAll('.popup__close');

closePopups.forEach((item) => {
   const closestPopup = item.closest('.popup')
   item.addEventListener('click', () => {
    closeModal(closestPopup);
   });
});

// Валидация форм
enableValidation(validationConfig);

//  Загрузка данных
function renderLoading(formElement, isLoading) {
  formElement.elements.button.textContent = isLoading ? 'Сохранение...' : 'Сохранить';
}

// Отображение профиля
function renderProfile(profile) {
  profileTitle.textContent = profile.name;
  profileDescription.textContent = profile.about;
  profileAvatar.style.backgroundImage=`url(${profile.avatar})`;
  editButton.style.visibility = profile._id == null ? 'hidden' : 'visible';
}

// Получение данных
function getData() {
  Promise.all([getProfile(), getCards()])
  .then((json) => {
    profile = {
      _id: json[0]._id,
      name: json[0].name,
      about: json[0].about,
      avatar: json[0].avatar
    };

    renderProfile(profile);

    cards = json[1].map((item) => {
      return {
        _id: item._id,
        name: item.name,
        link: item.link,
        likes: item.likes,
        owner: item.owner
      };
    });
    appendCards(cards, profile);
  })
  .catch(console.error);
}

getData();