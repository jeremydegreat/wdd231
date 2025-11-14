document.addEventListener('DOMContentLoaded', () => {
    const lastModified = document.querySelector('#lastmodified');
    const membersContainer = document.getElementById("membersContainer");
    const gridViewBtn = document.getElementById("gridView");
    const listViewBtn = document.getElementById("listView");

    // Last modified
    lastModified.textContent = `Last modified: ${document.lastModified}`;

    // Fetch members data
    async function fetchMembers() {
        try {
            const response = await fetch('data/members.json'); // ensure this file exists
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            displayMembers(data.members);
        } catch (error) {
            console.error('Error fetching members:', error);
            membersContainer.innerHTML = '<p>Error loading members. Please try again later.</p>';
        }
    }

    // Display members in grid/list
    function displayMembers(members) {
        membersContainer.innerHTML = ''; // clear container
        members.forEach((member) => {
            const card = document.createElement('div');
            card.className = 'member-card';
            card.innerHTML = `
                <img src="${member.image}" alt="${member.name}" loading="lazy">
                <h3>${member.name}</h3>
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <a href="${member.website}" target="_blank">Visit Website</a>
            `;
            membersContainer.appendChild(card);
        });
    }

    // Toggle view
    gridViewBtn.addEventListener('click', () => {
        membersContainer.className = 'grid-view';
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    });

    listViewBtn.addEventListener('click', () => {
        membersContainer.className = 'list-view';
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    });

    // Fetch on load
    fetchMembers();
});