// scripts/modal.js
export function openModal({ title = '', html = '' }) {
  let modal = document.getElementById('modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="modal-close">&times;</span>
        <h2 class="modal-title"></h2>
        <div class="modal-body"></div>
      </div>
    `;
    document.body.appendChild(modal);

    // Close event
    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.style.display = 'none';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  modal.querySelector('.modal-title').innerHTML = title;
  modal.querySelector('.modal-body').innerHTML = html;
  modal.style.display = 'block';
}
