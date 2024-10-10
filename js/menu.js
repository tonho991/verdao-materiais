document.addEventListener("DOMContentLoaded", () => {
    const menu = document.getElementById("menu");
    const closeMenuButton = document.getElementById("close-menu");
    const menuToggle = document.getElementById("menu-toggle");
  
    menuToggle.addEventListener("click", () => menu.classList.remove("hidden"));
  
    closeMenuButton.addEventListener("click", () => menu.classList.add("hidden"));
   
    setInterval(function () {  
        let fab = document.getElementById("fab");
        if(!fab) return;
        
        fab.style.animation = 'none'; 
        fab.offsetHeight;          
        fab.style.animation = "notify 0.4s ease-in-out"; 
        
    }, 3000);
});