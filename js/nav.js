const toggleBtn = document.querySelector('.navbar-toggler');

toggleBtn.addEventListener("click", handleToggle);

function handleToggle(evt) {
  const parentNode = evt.target.closest('.container-fluid');
  const navbarNav = parentNode.querySelector('.collapse');
  navbarNav.classList.toggle('show')
  console.log(navbarNav);
}