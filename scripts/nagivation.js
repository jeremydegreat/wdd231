document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.querySelector(".navbar");

  if (!hamburger || !navMenu) return;

  // Toggle menu on click
  hamburger.addEventListener("click", function (e) {
    e.stopPropagation();
    const isExpanded = hamburger.getAttribute("aria-expanded") === "true";

    // Toggle aria and classes
    hamburger.setAttribute("aria-expanded", String(!isExpanded));
    navMenu.classList.toggle("show");
    hamburger.textContent = isExpanded ? "☰" : "✖"; // Change icon
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    const isClickInside =
      navMenu.contains(event.target) || hamburger.contains(event.target);

    if (!isClickInside && navMenu.classList.contains("show")) {
      navMenu.classList.remove("show");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.textContent = "☰"; // Reset to hamburger
    }
  });
});
