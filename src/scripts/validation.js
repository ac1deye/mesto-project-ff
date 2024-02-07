export function enableValidation(validationConfig) {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));
  
  formList.forEach((formElement) => {
    setEventListeners({
      formElement,
      inputSelector: validationConfig.inputSelector,
      submitButtonSelector: validationConfig.submitButtonSelector,
      inactiveButtonClass: validationConfig.inactiveButtonClass,
      inputErrorClass: validationConfig.inputErrorClass,
      errorClass: validationConfig.errorClass
    });
  });
}

export function clearValidation(formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);
  
  inputList.forEach((inputElement) => {
    hideInputError({
      formElement,
      inputElement,
      inputErrorClass: validationConfig.inputErrorClass,
      errorClass: validationConfig.errorClass
    });
  });

  toggleButtonState({
    inputList,
    buttonElement,
    inactiveButtonClass: validationConfig.inactiveButtonClass
  });
}

function setEventListeners({
  formElement,
  inputSelector,
  submitButtonSelector,
  inactiveButtonClass,
  inputErrorClass,
  errorClass
}) {
  const inputList = Array.from(formElement.querySelectorAll(inputSelector));
  const buttonElement = formElement.querySelector(submitButtonSelector);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      checkInputValidity({
        formElement,
        inputElement,
        inputErrorClass,
        errorClass
      });
      toggleButtonState({
        inputList,
        buttonElement,
        inactiveButtonClass
      });
    });
  });
};

function checkInputValidity({
  formElement,
  inputElement,
  inputErrorClass,
  errorClass
}) {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    showInputError({
      formElement,
      inputElement,
      errorMessage: inputElement.validationMessage,
      inputErrorClass,
      errorClass
    });
  } else {
    hideInputError({
      formElement,
      inputElement,
      inputErrorClass,
      errorClass
    });
  }
};

function showInputError({
  formElement,
  inputElement,
  errorMessage,
  inputErrorClass,
  errorClass
}) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(errorClass);
};

function hideInputError({
  formElement,
  inputElement,
  inputErrorClass,
  errorClass
}) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(inputErrorClass);
  errorElement.classList.remove(errorClass);
  errorElement.textContent = '';
};

function toggleButtonState({
  inputList,
  buttonElement,
  inactiveButtonClass
}) {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(inactiveButtonClass);
  } else {
    buttonElement.classList.remove(inactiveButtonClass);
  }
}

function hasInvalidInput (inputList) {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
}