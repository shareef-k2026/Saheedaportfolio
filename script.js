
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});




/* ===== 3D PROJECT CAROUSEL ===== */

const carousel = document.getElementById("projectCarousel");
const prevBtn = document.getElementById("prevProject");
const nextBtn = document.getElementById("nextProject");
const counter = document.getElementById("projectCounter");
const progress = document.getElementById("progressBar");

const filterButtons = document.querySelectorAll(".filter-btn");
const allProjectsBtn = document.getElementById("viewAllProjects");

const modal = document.getElementById("projectModal");
const modalMedia = document.getElementById("modalMedia");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalSoftware = document.getElementById("modalSoftware");
const closeModal = document.getElementById("closeModal");

let activeIndex = 0;
let filteredProjects = [];
let allMode = false;

const allCards = [...document.querySelectorAll(".project-card")];

function getVisibleProjects() {
    return allCards.filter(card => !card.classList.contains("hidden"));
}

function updateCarousel() {
    filteredProjects = getVisibleProjects();

    if (!filteredProjects.length) return;

    activeIndex = (activeIndex + filteredProjects.length)
        % filteredProjects.length;

    allCards.forEach(card => {
        card.classList.remove("active", "left", "right");
    });

    if (allMode) {
        filteredProjects.forEach(card => {
            card.classList.add("active");
        });
        return;
    }

    const total = filteredProjects.length;

    filteredProjects.forEach((card, index) => {
        const position = (index - activeIndex + total) % total;

        if (position === 0) {
            card.classList.add("active");
        } else if (position === 1) {
            card.classList.add("right");
        } else if (position === total - 1) {
            card.classList.add("left");
        }
    });

    const number = String(activeIndex + 1).padStart(2, "0");
    const totalNumber = String(total).padStart(2, "0");

    counter.textContent = `${number} / ${totalNumber}`;

    progress.style.width =
        `${((activeIndex + 1) / total) * 100}%`;

    prevBtn.disabled = total <= 1;
    nextBtn.disabled = total <= 1;
}

function moveNext() {
    if (allMode || filteredProjects.length <= 1) return;

    activeIndex++;
    updateCarousel();
}

function movePrevious() {
    if (allMode || filteredProjects.length <= 1) return;

    activeIndex--;
    updateCarousel();
}

nextBtn.addEventListener("click", moveNext);
prevBtn.addEventListener("click", movePrevious);

/* FILTER PROJECTS */

filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const category = button.dataset.filter;

        allCards.forEach(card => {
            const matches =
                category === "all" ||
                card.dataset.category === category;

            card.classList.toggle("hidden", !matches);
        });

        activeIndex = 0;
        allMode = false;

        carousel.classList.remove("all-mode");
        allProjectsBtn.textContent = "VIEW ALL PROJECTS ↗";

        updateCarousel();
    });
});

/* VIEW ALL PROJECTS */

allProjectsBtn.addEventListener("click", () => {

    allMode = !allMode;

    carousel.classList.toggle("all-mode", allMode);

    allProjectsBtn.textContent = allMode
        ? "BACK TO 3D VIEW ↗"
        : "VIEW ALL PROJECTS ↗";

    updateCarousel();
});

/* PROJECT DETAILS POPUP */

function openProject(card) {

    const title = card.dataset.title;
    const description = card.dataset.description;
    const software = card.dataset.software;
    const video = card.dataset.video;

    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalSoftware.textContent = software;

    modalMedia.replaceChildren();

    if (video) {
        const player = document.createElement("video");

        player.src = video;
        player.controls = true;
        player.playsInline = true;
        player.preload = "metadata";

        modalMedia.appendChild(player);
    }

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    closeModal.focus();
}

allCards.forEach(card => {
    card.querySelector(".view-project")
        .addEventListener("click", () => openProject(card));

    card.addEventListener("click", event => {
        if (event.target.closest("button")) return;

        if (card.classList.contains("active")) {
            openProject(card);
        } else if (!allMode) {
            const index = filteredProjects.indexOf(card);
            if (index !== -1) {
                activeIndex = index;
                updateCarousel();
            }
        }
    });
});

/* CLOSE POPUP */

function closeProjectModal() {
    modal.classList.remove("open");
    modalMedia.replaceChildren();
    document.body.style.overflow = "";
}

closeModal.addEventListener("click", closeProjectModal);

modal.addEventListener("click", event => {
    if (event.target === modal) {
        closeProjectModal();
    }
});

/* KEYBOARD NAVIGATION */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeProjectModal();
    }

    if (modal.classList.contains("open")) return;

    if (event.key === "ArrowRight") moveNext();
    if (event.key === "ArrowLeft") movePrevious();
});

/* INITIALIZE */

updateCarousel();
