// ==============================
// SHARDEX FF SKILLS
// Premium Navigation Script
// ==============================

const pages = document.querySelectorAll(".page");

/**
 * Show a page by ID
 */
function showPage(pageId) {

    pages.forEach(page => {
        page.classList.remove("active");
    });

    const targetPage = document.getElementById(pageId);

    if (targetPage) {
        targetPage.classList.add("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}

// Make function available to HTML onclick
window.showPage = showPage;

// Ensure Home page is shown on first load
document.addEventListener("DOMContentLoaded", () => {
    showPage("home");
});

// Optional: Keyboard shortcuts
document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {
        showPage("home");
    }

});
