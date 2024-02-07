import { checkResponse } from "./utils";

const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-6',
  headers: {
    authorization: '6fb73fc5-4183-4547-a0dc-b05287b42d77',
    'Content-Type': 'application/json'
  }
};

export const getProfile = () => {
  return request(`/users/me`, {
    headers: {
      authorization: config.headers.authorization
    }
  });
};

export const patchProfile = (profile) => {
  return request(`/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: profile.name,
      about: profile.about
    })
  });
};

export const patchProfileAvatar = (url) => {
  return request(`/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: url
    })
  });
};

export const getCards = () => {
  return request(`/cards`, {
    headers: {
      authorization: config.headers.authorization
    }
  });
};

export const postCard = (card) => {
  return request(`/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: card.name,
      link: card.link,
    })
  });
};

export const deleteCard = (card) => {
  return request(`/cards/${card._id}`, {
    method: 'DELETE',
    headers: {
      authorization: config.headers.authorization
    }
  });
};

export const setCardLike = (card, isLiked) => {
  return request(`/cards/likes/${card._id}`, {
    method: isLiked ? 'PUT' : 'DELETE',
    headers: {
      authorization: config.headers.authorization
    }
  });
};

function request(path, options) {
  return fetch(`${config.baseUrl}${path}`, options).then(checkResponse)
}