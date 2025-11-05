document.addEventListener("DOMContentLoaded", function() {
    const dateElement = document.getElementById("currentyear");
    

    // Set year
    const now = new Date();
    dateElement.textContent = now.toLocaleDateString('en-US', {
        year: 'numeric'
    });

    // Set last modified date
    document.getElementById("lastmodified").innerHTML = `Last Modified: ${document.lastModified}`;
    
});