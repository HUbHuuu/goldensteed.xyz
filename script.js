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

const inquiryForm = document.querySelector("#inquiryForm");
const formNote = document.querySelector("#formNote");

inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!inquiryForm.reportValidity()) {
        return;
    }

    const data = new FormData(inquiryForm);
    const value = (name) => String(data.get(name) || "").trim();
    const subjectName = value("company") || value("name");
    const subject = `Golden Steed website inquiry - ${subjectName}`;
    const body = [
        "New inquiry from goldensteed.xyz",
        "",
        `Name: ${value("name")}`,
        `Email: ${value("email")}`,
        `Phone / WhatsApp: ${value("phone") || "-"}`,
        `Company: ${value("company") || "-"}`,
        `Country / Region: ${value("country") || "-"}`,
        `Product Interest: ${value("interest") || "-"}`,
        "",
        "Message:",
        value("message"),
    ].join("\n");

    const mailto = new URL("mailto:szqj@golden-steed.com.cn");
    mailto.searchParams.set("subject", subject);
    mailto.searchParams.set("body", body);
    window.location.href = mailto.toString();

    formNote.textContent = "Your email app should open with the inquiry prepared. Please send the email to complete your message.";
});
