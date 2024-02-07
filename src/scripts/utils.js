export function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

export function renderLoading(isLoading, button, buttonText='Сохранить', loadingText='Сохранение...') {
  if (isLoading) {
    button.textContent = loadingText
  } else {
    button.textContent = buttonText
  }
}

export function handleSubmit(request, evt, loadingText = "Сохранение...") {
   evt.preventDefault();
 
   const submitButton = evt.submitter;
   const initialText = submitButton.textContent;
   
   renderLoading(true, submitButton, initialText, loadingText);

   request()
     .then(() => {
       evt.target.reset();
     })
     .catch(console.error)
     .finally(() => {
       renderLoading(false, submitButton, initialText);
     });
 }