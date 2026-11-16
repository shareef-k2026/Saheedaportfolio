// ================================
// EMAILJS SETTINGS (fill these in once)
// ================================
const OWNER_EMAIL = "faathisaee961@gmail.com";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

const emailJsConfigured =
    window.emailjs &&
    ![EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID]
        .some(value => value.startsWith("YOUR_"));

if (emailJsConfigured) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}


// ================================
// MOBILE NAVIGATION
// ================================
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

function setMenu(open) {
    navLinks.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.innerHTML = open
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
}

menuBtn.addEventListener("click", () => {
    setMenu(!navLinks.classList.contains("open"));
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => setMenu(false));
});


// ================================
// ACTIVE NAV LINK ON SCROLL
// ================================
const navAnchors = [...navLinks.querySelectorAll("a")];
const sections = navAnchors
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navAnchors.forEach(a => {
                a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
            });
        });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(section => navObserver.observe(section));
}


// ================================
// PROJECT FILTER + CAROUSEL
// ================================
const projectTrack = document.getElementById("projectTrack");
const projectCards = [...document.querySelectorAll(".project-card")];
const filterButtons = document.querySelectorAll(".filter-btn");
const prevProject = document.getElementById("prevProject");
const nextProject = document.getElementById("nextProject");

let currentProjectIndex = 0;
let filteredProjects = [...projectCards];

function getVisibleCount() {
    if (window.innerWidth <= 500) return 1;
    if (window.innerWidth <= 1000) return 2;
    return 3;
}

function updateCarousel() {
    const visibleCount = getVisibleCount();
    const gap = parseFloat(getComputedStyle(projectTrack).columnGap) || 0;

    // Measure a VISIBLE card (hidden cards report width 0).
    const cardWidth = filteredProjects[0]?.getBoundingClientRect().width || 0;
    const maxIndex = Math.max(0, filteredProjects.length - visibleCount);

    currentProjectIndex = Math.min(currentProjectIndex, maxIndex);

    const offset = currentProjectIndex * (cardWidth + gap);
    projectTrack.style.transform = `translateX(-${offset}px)`;

    prevProject.disabled = currentProjectIndex === 0;
    nextProject.disabled = currentProjectIndex >= maxIndex;
    prevProject.style.opacity = prevProject.disabled ? ".4" : "1";
    nextProject.style.opacity = nextProject.disabled ? ".4" : "1";
}

function showProjects(category) {
    filteredProjects = projectCards.filter(card =>
        category === "all" || card.dataset.category === category
    );

    projectCards.forEach(card => {
        card.hidden = !filteredProjects.includes(card);
    });

    // Keep filtered cards first in the track.
    filteredProjects.forEach(card => projectTrack.appendChild(card));

    currentProjectIndex = 0;
    updateCarousel();
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        showProjects(button.dataset.filter);
    });
});

prevProject.addEventListener("click", () => {
    currentProjectIndex = Math.max(0, currentProjectIndex - 1);
    updateCarousel();
});

nextProject.addEventListener("click", () => {
    currentProjectIndex += 1;
    updateCarousel();
});

window.addEventListener("resize", updateCarousel);

// Swipe support
let touchStartX = 0;

projectTrack.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

projectTrack.addEventListener("touchend", event => {
    const difference = touchStartX - event.changedTouches[0].screenX;
    if (Math.abs(difference) < 45) return;
    (difference > 0 ? nextProject : prevProject).click();
}, { passive: true });


// ================================
// PROJECT PREVIEW MODAL
// ================================
const projectModal = document.getElementById("projectModal");
const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalVideo = document.getElementById("modalVideo");
const modalMessage = document.getElementById("modalMessage");

let lastFocused = null;

function resetVideo() {
    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.load();
}

function openProject(card) {
    lastFocused = document.activeElement;

    modalTitle.textContent = card.dataset.title;
    modalDescription.textContent = card.dataset.description;

    resetVideo();

    const videoPath = card.dataset.video;

    if (videoPath) {
        modalVideo.src = videoPath;
        modalVideo.hidden = false;
        modalMessage.hidden = true;
        modalVideo.load();
    } else {
        modalVideo.hidden = true;
        modalMessage.hidden = false;
        modalMessage.textContent = "Add a video file for this project to preview it here.";
    }

    projectModal.classList.add("active");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    closeModal.focus();
}

function hideProjectModal() {
    projectModal.classList.remove("active");
    projectModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    resetVideo();
    if (lastFocused) lastFocused.focus();
}

document.querySelectorAll(".view-project").forEach(button => {
    button.addEventListener("click", () => openProject(button.closest(".project-card")));
});

closeModal.addEventListener("click", hideProjectModal);
modalOverlay.addEventListener("click", hideProjectModal);

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && projectModal.classList.contains("active")) {
        hideProjectModal();
    }
});


// ================================
// SCROLL REVEAL ANIMATION
// ================================
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(element => revealObserver.observe(element));
} else {
    revealElements.forEach(element => element.classList.add("visible"));
}


// ================================
// CONTACT FORM (EmailJS)
// ================================
const contactForm = document.getElementById("contactForm");
const sendBtn = document.getElementById("sendBtn");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", async event => {
    event.preventDefault();

    // No EmailJS keys? Open Gmail with the message already filled in.
    if (!emailJsConfigured) {
        const data = new FormData(contactForm);
        const body =
            `${data.get("message")}\n\n--\nName: ${data.get("from_name")}\n` +
            `Email: ${data.get("reply_to")}\nPhone: ${data.get("phone") || "-"}`;

        const params = new URLSearchParams({
            to: OWNER_EMAIL,
            su: data.get("subject"),
            body
        });

        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {
            // Opens the Gmail / default mail app on phones.
            location.href = `mailto:${OWNER_EMAIL}` +
                `?subject=${encodeURIComponent(data.get("subject"))}` +
                `&body=${encodeURIComponent(body)}`;
        } else {
            // Opens Gmail compose in a new tab on desktop.
            window.open(`https://mail.google.com/mail/?view=cm&fs=1&${params}`, "_blank", "noopener");
        }

        formStatus.textContent = "Gmail opened — just press Send there to deliver your message.";
        contactForm.reset();
        return;
    }

    const buttonText = sendBtn.querySelector("span");

    sendBtn.disabled = true;
    buttonText.textContent = "Sending...";
    formStatus.textContent = "";

    try {
        await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm);
        formStatus.textContent = "✓ Your message was sent successfully!";
        contactForm.reset();
    } catch (error) {
        console.error("EmailJS error:", error);
        formStatus.textContent = "Sorry, your message could not be sent. Please try again.";
    } finally {
        sendBtn.disabled = false;
        buttonText.textContent = "Send Message";
    }
});


// ================================
// THEME TOGGLE (remembers choice)
// ================================
const themeBtn = document.getElementById("themeBtn");

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeBtn.innerHTML = theme === "light"
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
}

let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) {}
applyTheme(savedTheme || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));

themeBtn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
});


// ================================
// TYPING EFFECT
// ================================
const typedEl = document.getElementById("typed");
const words = JSON.parse(typedEl.dataset.words);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
    let w = 0, c = words[0].length, deleting = true;
    (function type() {
        const word = words[w];
        typedEl.textContent = word.slice(0, c);
        let delay = deleting ? 45 : 90;

        if (!deleting && c === word.length) { deleting = true; delay = 1600; }
        else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
        else { c += deleting ? -1 : 1; }

        setTimeout(type, delay);
    })();
}


// ================================
// SCROLL PROGRESS + BACK TO TOP
// ================================
const progress = document.getElementById("scrollProgress");
const toTop = document.getElementById("toTop");

function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
    toTop.classList.toggle("show", scrollY > 600);
}

addEventListener("scroll", onScroll, { passive: true });
onScroll();
toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));


// ================================
// CURSOR GLOW
// ================================
const glow = document.getElementById("cursorGlow");

addEventListener("pointermove", e => {
    glow.style.opacity = "1";
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
}, { passive: true });


// ================================
// ANIMATED COUNTERS
// ================================
const counters = document.querySelectorAll("[data-count]");

function runCounter(el) {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || "";
    const start = performance.now();
    const duration = 1400;

    (function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + suffix;
        if (t < 1) requestAnimationFrame(tick);
    })(start);
}

if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { runCounter(entry.target); obs.unobserve(entry.target); }
        });
    }, { threshold: 0.6 });
    counters.forEach(el => counterObserver.observe(el));
} else {
    counters.forEach(el => { el.textContent = el.dataset.count + (el.dataset.suffix || ""); });
}


// ================================
// INITIALIZE
// ================================
showProjects("all");