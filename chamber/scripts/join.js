document.addEventListener("DOMContentLoaded", () => {
    // Open dialog when card button is clicked
    const modalButtons = document.querySelectorAll("button[data-modal]");

    modalButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modalId = button.getAttribute("data-modal");
            const dialog = document.getElementById(modalId);

            if (dialog) {
                dialog.showModal();
            }
        });
    });

    // Close dialog when close button is clicked
    const closeButtons = document.querySelectorAll(".close-dialog");

    closeButtons.forEach(closeBtn => {
        closeBtn.addEventListener("click", () => {
            const dialog = closeBtn.closest("dialog");
            dialog.close();
        });
    });

    // Close modal when clicking outside the dialog box
    document.querySelectorAll("dialog").forEach(dialog => {
        dialog.addEventListener("click", (e) => {
            const dialogRect = dialog.getBoundingClientRect();

            if (
                e.clientX < dialogRect.left ||
                e.clientX > dialogRect.right ||
                e.clientY < dialogRect.top ||
                e.clientY > dialogRect.bottom
            ) {
                dialog.close();
            }
        });
    });
});
