const signupForm = document.querySelector('#signup');
console.log(signupForm);
const nameInput = document.querySelector('#name');
const surnameInput = document.querySelector('#surname');
const greetingContainer = document.querySelector('#greetingContainer');

signupForm.addEventListener('submit', handleSignup);

function handleSignup(evt) {
  evt.preventDefault();

  const nameInputValue = nameInput.value;
  const surnameInputValue = surnameInput.value;
  const loggedUser = {
    name: nameInputValue,
    surname: surnameInputValue
  }

  localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
  document.location.reload();
}

if (localStorage.getItem("loggedUser")) {
  const loggedUserData = JSON.parse(localStorage.getItem("loggedUser"));
  const { name, surname } = loggedUserData;

  const greetingMsg = `Welcome ${name} to your `;
  greetingContainer.insertAdjacentText("afterbegin", greetingMsg)
}