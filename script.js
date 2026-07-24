const pages = document.querySelectorAll(".page");

function showPage(id) {
    pages.forEach(page => {
        page.style.display = "none";
    });

    const activePage = document.getElementById(id);

    if (activePage) {
        activePage.style.display = "flex";
    }
}

// Home page se start karo
showPage("home");

// Sab buttons ko listen karo
document.querySelectorAll("[data-page]").forEach(button => {

    button.addEventListener("click", () => {

        const target = button.getAttribute("data-page");

        showPage(target);

    });

});
