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

    
   
    

    const text =  `
    Olá ${getGreetings()}! Meu nome é ${$("#input-name").val()}.
    
    Meu email é *${$("#input-email").val()}*.

    Gostaria de falar com o departamendo de *${$("#input-department").val()}* sobre o assunto *${$("#input-assunto").val()}*.

    *Mensagem*: 
    
    ${$("#input-mensagem").val()}
    `

     const url = `https://api.whatsapp.com/send?phone=5565993403335&text=${text}`

     window.location.href = url;
     
     $(".loading").hide();

  });
});


