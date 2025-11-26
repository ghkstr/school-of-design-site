document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('viewToggle');

  if (window.location.href.includes('portfolio.html')) {
    toggle.checked = true;
  }

  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      window.location.href = 'portfolio.html';
    } else {
      window.location.href = 'index.html';
    }
  });

  let editable = true;
  document.designMode = 'on';

  const overlay = document.getElementById('editOverlay');
  const toggleButton = document.getElementById('toggleEdit');

  toggleButton.addEventListener('click', () => {
    editable = !editable;
    document.designMode = editable ? 'on' : 'off';
    overlay.style.background = editable ? 'rgba(255,255,255,0.1)' : 'rgba(200,200,200,0.3)';
    toggleButton.textContent = editable ? 'ON' : 'OFF';
  });

  document.getElementById('saveHtml').addEventListener('click', () => {
    const htmlContent = '<!DOCTYPE html>' + document.documentElement.outerHTML;

    fetch('http://localhost:3000/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ html: htmlContent })
    })
    .then(response => {
      if (response.ok) {
        alert('Page saved to server!');
      } else {
        alert('Failed to save page.');
      }
    })
    .catch(error => {
      alert('Error saving page: ' + error);
    });
  });
});