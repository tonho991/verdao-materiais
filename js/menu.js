document.addEventListener("DOMContentLoaded", () => {
    const menu = document.getElementById("menu");
    const closeMenuButton = document.getElementById("close-menu");
    const menuToggle = document.getElementById("menu-toggle");

    menuToggle.addEventListener("click", () => menu.classList.remove("hidden"));

    closeMenuButton.addEventListener("click", () => menu.classList.add("hidden"));

    setInterval(function () {
        let fab = document.getElementById("fab");
        if (!fab) return;

        fab.style.animation = 'none';
        fab.offsetHeight;
        fab.style.animation = "notify 0.4s ease-in-out";

    }, 3000);
});



$(window).scroll(function (event) {
    var st = $(this).scrollTop();
    if (st > 400) {
        $("#toolbar-links").hide();
    } else {
        $("#toolbar-links").show();
    }
});

if (document.referrer.includes("from=app")) {
    var currentUrl = window.location.href;
    var newParam = 'from=app';
    if (!currentUrl.includes(newParam)) {

        if (currentUrl.indexOf('?') > -1) {
            if (currentUrl.indexOf('from=') === -1) {
                window.location.href = currentUrl + '&' + newParam;
            }
        } else {
            window.location.href = currentUrl + '?' + newParam;
        }
    }
}

try {
    let searchParams = new URLSearchParams(window.location.search);

    let from = searchParams.get("from") || "web";


    if (from && from === "app") {
        $(".main").removeClass("mt-40")
    }

} catch (e) { }
