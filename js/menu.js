document.addEventListener("DOMContentLoaded", () => {
    const menu = document.getElementById("menu");
    const closeMenuButton = document.getElementById("close-menu");
    const menuToggle = document.getElementById("menu-toggle");
    const fab = document.getElementById("fab");

    // Alternar visibilidade do menu
    menuToggle.addEventListener("click", () => menu.classList.remove("hidden"));
    closeMenuButton.addEventListener("click", () => menu.classList.add("hidden"));

    // Animação de notificação do FAB
    if (fab) {
        setInterval(() => {
            fab.style.animation = "none";
            fab.offsetHeight; 
            fab.style.animation = "notify 0.4s ease-in-out";
        }, 3000);
    }
});


/* Mostrar/Esconder a parte do toolbar onde fica os links */
$(window).scroll(() => {
    const toolbarLinks = $("#toolbar-links");
    if ($(window).scrollTop() !== 0) {
        toolbarLinks.hide();
    } else {
        toolbarLinks.show();
    }
});

/* Parte de verificação da URL, obtendo se a requisição vem do APP na query from. */
if (document.referrer.includes("from=app")) {
    const currentUrl = new URL(window.location.href);
    if (!currentUrl.searchParams.has("from")) {
        currentUrl.searchParams.append("from", "app");
        window.location.href = currentUrl.toString();
    }
}

try {
    const searchParams = new URLSearchParams(window.location.search);
    const from = searchParams.get("from") || "web";

    if (from === "app") {
        $(".main").removeClass("mt-40").addClass("mt-10");
        $("#header").hide();
    }
} catch (error) {
    console.error("Error processing URL parameters:", error);
}
