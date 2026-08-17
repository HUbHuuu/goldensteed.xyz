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
const formResponseActions = formResponse.querySelector(".form-response-actions");
const mailtoLink = document.querySelector("#mailtoLink");
const copyInquiry = document.querySelector("#copyInquiry");
let latestInquiryText = "";

const buildInquiryMessage = (data) => {
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

    return { subject, body };
};

const showEmailFallback = (subject, body) => {
    const mailto = new URL("mailto:szqj@golden-steed.com.cn");
    mailto.searchParams.set("subject", subject);
    mailto.searchParams.set("body", body);
    const mailtoHref = mailto.toString();
    latestInquiryText = `${subject}\n\n${body}`;
    mailtoLink.href = mailtoHref;
    copyInquiry.textContent = "Copy Message";
    formResponseText.textContent = "The cloud submission service is not reachable yet. Please send the prepared email, or copy the message below.";
    formResponseActions.hidden = false;
    formResponse.hidden = false;
    formNote.textContent = "Email fallback is ready.";
    formResponse.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

inquiryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!inquiryForm.reportValidity()) {
        return;
    }

    const data = new FormData(inquiryForm);
    const { subject, body } = buildInquiryMessage(data);
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
        formResponseActions.hidden = true;
        formResponse.hidden = false;
        formNote.textContent = "Our team will review your message and contact you soon.";
        formResponse.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch {
        showEmailFallback(subject, body);
    } finally {
        submitButton.disabled = false;
    }
});

copyInquiry.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(latestInquiryText);
        copyInquiry.textContent = "Copied";
    } catch {
        copyInquiry.textContent = "Copy unavailable";
    }
});
