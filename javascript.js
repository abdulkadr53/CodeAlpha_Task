let slideIndex = 1;
const modal = document.getElementById("myModal");
const slides = document.getElementsByClassName("mySlides");
const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");
let isModalOpen = false;
let lastFocusedElement = null;
let filterTimeout = null;

function openModal(n = slideIndex) {
  slideIndex = n;
  modal.style.display = "block";
  document.body.style.overflow = "hidden";
  isModalOpen = true;
  showSlides(slideIndex);
  trapFocus(modal);
}

function closeModal() {
  modal.style.display = "none";
  document.body.style.overflow = "";
  isModalOpen = false;
  releaseFocus();
}

function showSlides(n) {
  if (!slides.length) return;

  if (n > slides.length) slideIndex = 1;
  else if (n < 1) slideIndex = slides.length;
  else slideIndex = n;

  Array.from(slides).forEach(slide => {
    slide.classList.remove("active-slide");
  });

  slides[slideIndex - 1].classList.add("active-slide");
}

function plusSlides(n) {
  showSlides(slideIndex + n);
}

function currentSlide(n) {
  showSlides(n);
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (button.classList.contains("active")) return;

    clearTimeout(filterTimeout);
    document.querySelector(".filter-btn.active").classList.remove("active");
    button.classList.add("active");

    const filter = button.getAttribute("data-filter");

    galleryItems.forEach(item => {
      const category = item.getAttribute("data-category");

      if (filter === "all" || category === filter) {
        item.classList.remove("hide");
        item.style.display = "block";
        requestAnimationFrame(() => {
          item.style.opacity = "1";
          item.style.transform = "scale(1)";
        });
      } else {
        item.style.opacity = "0";
        item.style.transform = "scale(0.9)";
        filterTimeout = setTimeout(() => {
          item.style.display = "none";
          item.classList.add("hide");
        }, 300);
      }
    });
  });
});

// Close modal if click outside content
window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// Keyboard navigation and accessibility
window.addEventListener("keydown", (e) => {
  if (!isModalOpen) return;

  switch (e.key) {
    case "Escape":
      closeModal();
      break;
    case "ArrowLeft":
      plusSlides(-1);
      break;
    case "ArrowRight":
      plusSlides(1);
      break;
    case "Tab":
      maintainFocusTrap(e, modal);
      break;
  }
});

// Trap focus inside modal
function trapFocus(element) {
  lastFocusedElement = document.activeElement;
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length) {
    focusableElements[0].focus();
  } else {
    element.setAttribute("tabindex", "-1");
    element.focus();
  }
}

// Release focus to last active element
function releaseFocus() {
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

// Keep focus within modal (Shift+Tab loop)
function maintainFocusTrap(e, element) {
  const focusableElements = Array.from(
    element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  );

  const firstElem = focusableElements[0];
  const lastElem = focusableElements[focusableElements.length - 1];

  if (e.shiftKey && document.activeElement === firstElem) {
    e.preventDefault();
    lastElem.focus();
  } else if (!e.shiftKey && document.activeElement === lastElem) {
    e.preventDefault();
    firstElem.focus();
  }
}


