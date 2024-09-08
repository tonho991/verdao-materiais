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


});

document.getElementById("sendComment").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  formData.append("telefone", document.getElementById("input-telefone").value)

  try {
    const response = await fetch("http://127.0.0.1:3000/api/comment", {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      const result = await response.text();
      alert(result);
    } else {
      alert('Erro ao enviar o comentário');
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Ocorreu um erro ao enviar o comentário.");
  }

});

