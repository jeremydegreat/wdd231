
document.addEventListener('DOMContentLoaded', () => {
    const lastModified = document.querySelector('#lastmodified');
    const membersContainer = document.getElementById("membersContainer");
    const gridViewBtn = document.getElementById("gridView");
    const listViewBtn = document.getElementById("listView");

    if (!membersContainer) {
        console.error('Members container not found. Add an element with id="membersContainer" in directory.html');
        return;
    }

    // Last modified
    if (lastModified) {
        lastModified.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" style="margin-right:8px; vertical-align:middle;">
                <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm1 11h4v2h-6V7h2v6z"></path>
            </svg>
            Last modified: ${document.lastModified}
        `;
    }

    let membersData = []; // store fetched members

    // Hamburger Toggle
    const hamburger = document.querySelector('.hamburger');
    const navlinks = document.querySelector('.navlinks');

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navlinks.classList.toggle('active');
        hamburger.classList.toggle('active');  /* animate hamburger icon */
    });

    // Close navlinks when clicking anywhere else on the document
    document.addEventListener('click', (e) => {
        if (navlinks.classList.contains('active') && 
            !hamburger.contains(e.target) && 
            !navlinks.contains(e.target)) {
            navlinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Close navlinks when clicking a nav link
    const navItems = document.querySelectorAll('.navlinks li a');
    navItems.forEach((item) => {
        item.addEventListener('click', () => {
            navlinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Fetch members data
    async function fetchMembers() {
        try {
            const response = await fetch('data/members.json'); // ensure this file exists
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            membersData = data.members || [];
            renderMembers();
        } catch (error) {
            console.error('Error fetching members:', error);
            membersContainer.innerHTML = '<p>Error loading members. Please try again later.</p>';
        }
    }

    // Render depending on view
    function renderMembers() {
        if (membersContainer.classList.contains('list-view')) {
            renderTable(membersData);
        } else {
            renderGrid(membersData);
        }
    }

    // Grid (cards) view
    function renderGrid(members) {
        membersContainer.innerHTML = ''; // clear container
        members.forEach((member) => {
            const card = document.createElement('div');
            card.className = 'member-card';
            card.innerHTML = `
                <img src="${member.image}" alt="${member.name}" loading="lazy">
                <h3>${member.name}</h3>
                <p>${member.address || ''}</p>
                <p>${member.phone || ''}</p>
                <a href="${member.website || '#'}" target="_blank" rel="noopener">Visit Website ➡</a>
            `;
            membersContainer.appendChild(card);
        });
    }

    // List (table) view — colored rows / header
    function renderTable(members) {
        membersContainer.innerHTML = ''; // clear container

        const table = document.createElement('table');
        table.className = 'members-table';

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Company</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Website</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        members.forEach((member) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${member.name}</td>
                <td>${member.address || ''}</td>
                <td>${member.phone || ''}</td>
                <td>${member.website ? `<a href="${member.website}" target="_blank" rel="noopener">${member.website}</a>` : ''}</td>
            `;
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        membersContainer.appendChild(table);
    }

    // Toggle view
    gridViewBtn && gridViewBtn.addEventListener('click', () => {
        membersContainer.classList.remove('list-view');
        membersContainer.classList.add('grid-view');
        gridViewBtn.classList.add('active');
        listViewBtn && listViewBtn.classList.remove('active');
        renderMembers();
    });

    listViewBtn && listViewBtn.addEventListener('click', () => {
        membersContainer.classList.remove('grid-view');
        membersContainer.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn && gridViewBtn.classList.remove('active');
        renderMembers();
    });

    // Fetch on load
    fetchMembers();

     /* ========== SELECT ELEMENTS ========== */
    const memberButtons = document.querySelectorAll(".membership-card button");
    const dialogs = document.querySelectorAll("dialog");
    const closeButtons = document.querySelectorAll(".close-dialog");


    /* ========== OPEN DIALOG ========== */
    memberButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modalName = button.getAttribute("data-modal").replace("modal", "dialog");
            const dialog = document.getElementById(modalName);

            if (dialog) {
                dialog.showModal();
            }
        });
    });


    /* ========== CLOSE MODAL WITH X BUTTON ========== */
    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const dialog = btn.closest("dialog");
            dialog.close();
        });
    });


    /* ========== CLOSE MODAL BY CLICKING OUTSIDE ========== */
    dialogs.forEach(dialog => {
        dialog.addEventListener("click", (event) => {
            const dialogRect = dialog.getBoundingClientRect();

            // If user clicks outside the content box → close the modal
            if (
                event.clientX < dialogRect.left ||
                event.clientX > dialogRect.right ||
                event.clientY < dialogRect.top ||
                event.clientY > dialogRect.bottom
            ) {
                dialog.close();
            }
        });
    });


});