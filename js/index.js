document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");
  const closeMenuButton = document.getElementById("close-menu");
  const menuToggle = document.getElementById("menu-toggle");

  menuToggle.addEventListener("click", () => menu.classList.remove("hidden"));

  closeMenuButton.addEventListener("click", () => menu.classList.add("hidden"));

  const telInput = document.getElementById("input-telefone");
  window.intlTelInput(telInput, {
    initialCountry: 'br',
    preferredCountries: ['br'],
    separateDialCode: true,
    autoPlaceHolder: 'agressive',
    utilScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/12.1.6/js/utils.js'
  })

  document.getElementById("sendComment").addEventListener("submit", function (e) {
    e.preventDefault();

    if(!validateInputs()) return;

    const formData = new FormData(this);
    const xhr = new XMLHttpRequest();

    xhr.open("POST", "http://127.0.0.1:3000/api/comment", true);

    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE) {
        alert(xhr.responseText)
      }
    }

    xhr.send(formData)
  });

  const validateInputs = () => {
    const inputs = [
      document.getElementById("input-name"),
      document.getElementById("input-email"),
      document.getElementById("input-telefone"),
      document.getElementById("input-assunto"),
      document.getElementById("input-mensagem")
    ];

    inputs.forEach((input) => {
      if(input.value.trim() === ""){
        input.setCustomValidity("Este campo não pode estar vazio.");
        input.reportValidity();
        return false;
      }  
    });

    return true;
  };
});

