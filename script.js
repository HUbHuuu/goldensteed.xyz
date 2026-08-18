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
const formResponse = document.querySelector("#formResponse");
const formResponseText = formResponse.querySelector("p");

inquiryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!inquiryForm.reportValidity()) {
        return;
    }

    const data = new FormData(inquiryForm);
    const endpoint = inquiryForm.dataset.endpoint;
    const submitButton = inquiryForm.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    formResponse.hidden = true;
    formNote.textContent = "Submitting your inquiry...";

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(data),
        });

        if (!response.ok) {
            throw new Error("Cloud submission failed");
        }

        inquiryForm.reset();
        formResponseText.textContent = "Thank you. Your inquiry has been submitted successfully.";
        formResponse.hidden = false;
        formNote.textContent = "Our team will review your message and contact you soon.";
        formResponse.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch {
        formResponseText.textContent = "We could not submit your inquiry. Please try again in a moment or contact szqj@golden-steed.com.cn.";
        formResponse.hidden = false;
        formNote.textContent = "Submission failed.";
        formResponse.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } finally {
        submitButton.disabled = false;
    }
});
