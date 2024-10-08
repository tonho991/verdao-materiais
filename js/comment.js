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

jQuery(function ($) {
  $("#input-telefone").mask("(99) 9999-99999");

  $("#sendComment").on("submit", async function (e) {
    e.preventDefault();
    $(".loading").show();
    const formData = new FormData(this);

    formData.append("telefone", $("#input-telefone").val());
    formData.append("department", $("#department").val() || "Outro")

    try {
      const response = await fetch("https://api-verdao-materiais.vercel.app/comment", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const result = await response.text();
        alert(result);
        $(".loading").hide();
      } else {
        alert('Erro ao enviar o comentário');
        $(".loading").hide();
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Ocorreu um erro ao enviar o comentário.");
      $(".loading").hide();
    }
  })
})


