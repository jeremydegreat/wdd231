document.addEventListener("DOMContentLoaded", () => {
  const url = "https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json";
  const cards = document.getElementById("cards");

  async function getProphetData() {
    const response = await fetch(url);
    const data = await response.json();
    // console.table(data.prophets);
    displayProphets(data.prophets);
  }

  getProphetData();

  const displayProphets = (prophets) => {
    prophets.forEach((prophet) => {
      // Create elements to add to the div, cards element
      let card = document.createElement("section");
      let fullname = document.createElement("h2");
      let dob = document.createElement("p"); // date of birth
      let pob = document.createElement("p"); // place of birth
      let portrait = document.createElement("img");

      // Build the h2 content to show the prophet's full name
      fullname.textContent = `${prophet.name} ${prophet.lastname || ""}`.trim();

      // Add DOB and place of birth (with classes for styling)
      dob.className = "dob";
      pob.className = "pob";
      dob.textContent = `Date of Birth: ${prophet.birthdate || "Unknown"}`;
      pob.textContent = `Place of Birth: ${prophet.birthplace || "Unknown"}`;

      // Build the image portrait by setting all relevant attributes
      portrait.setAttribute("src", prophet.imageurl);
      portrait.setAttribute("alt", `Portrait of ${prophet.name} ${prophet.lastname || ""}`);
      portrait.setAttribute("loading", "lazy");
      portrait.setAttribute("width", "340");
      portrait.setAttribute("height", "440");

      // Append the section (card) with the created elements
      card.appendChild(fullname);
      card.appendChild(dob);
      card.appendChild(pob);
      card.appendChild(portrait);

      cards.appendChild(card);
    });
  };
});
