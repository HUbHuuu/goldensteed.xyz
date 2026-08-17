const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");

menuButton.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
});

siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        siteNav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
    });
});

const imageDialog = document.querySelector("#imageDialog");
const dialogImage = imageDialog.querySelector("img");
const dialogClose = imageDialog.querySelector(".dialog-close");

document.querySelectorAll(".slide-preview").forEach((button) => {
    button.addEventListener("click", () => {
        const image = button.querySelector("img");
        dialogImage.src = image.currentSrc || image.src;
        dialogImage.alt = image.alt;
        imageDialog.showModal();
    });
});

dialogClose.addEventListener("click", () => {
    imageDialog.close();
});

imageDialog.addEventListener("click", (event) => {
    if (event.target === imageDialog) {
        imageDialog.close();
    }
});
