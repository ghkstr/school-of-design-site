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

    const uploadSection = document.getElementById('upload-section');
    const isEditMode = localStorage.getItem('editMode') === 'true';

    function updateEditModeUI() {
      if (isEditMode) {
        uploadSection.style.display = 'block';
      } else {
        uploadSection.style.display = 'none';
      }
    }

    async function loadLocalImages() {
      const imageFolder = './images/';

      try {
        const res = await fetch('/images-list', { cache: 'no-store' });
        const imageNames = await res.json();

        const container = document.getElementById('portfolio');
        container.innerHTML = '';

        window.pckry = new Packery(container, {
          itemSelector: 'div',
          gutter: 16
        });

        imageNames.forEach(name => {
          const wrapper = document.createElement('div');
          wrapper.classList.add('grid-item');
          const img = document.createElement('img');
          img.src = imageFolder + name;
          img.alt = 'portfolio item';
          wrapper.appendChild(img);
          container.appendChild(wrapper);
          window.pckry.appended(wrapper);
        });

        setTimeout(() => window.pckry.layout(), 100);

        window.addEventListener('resize', () => {
          if (window.pckry) {
            window.pckry.layout();
          }
        });
      } catch (error) {
        console.error('Fout bij ophalen van afbeeldingenlijst:', error);
      }
    }

    function uploadImages() {
      const files = document.getElementById('uploadInput').files;
      if (!files.length) return alert("Geen bestanden geselecteerd.");

      const formData = new FormData();
      [...files].forEach(file => {
        formData.append("images", file);
      });

      fetch('/upload', {
        method: 'POST',
        body: formData
      })
      .then(res => {
        if (res.ok) {
          alert("Afbeeldingen succesvol geüpload!");
          window.location.reload(); // pagina verversen zodat nieuwe zichtbaar zijn
        } else {
          alert("Fout bij uploaden.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Er ging iets mis tijdens het uploaden.");
      });
    }

    function saveChanges() {
      alert("Opslaan is alleen mogelijk met backend. In de toekomst kan dit lokaal.");
    }

    function toggleEditMode() {
      const current = localStorage.getItem('editMode') === 'true';
      localStorage.setItem('editMode', !current);
      location.reload();
    }

    // Toon geselecteerde bestanden onder uploadInput
    document.getElementById('uploadInput').addEventListener('change', function() {
      const fileList = document.getElementById('fileList');
      const files = [...this.files];
      if (files.length === 0) {
        fileList.textContent = 'Geen bestanden geselecteerd.';
      } else {
        fileList.innerHTML = files.map(f => `📎 ${f.name}`).join('<br>');
      }
    });

    // Roep updateEditModeUI aan nadat deze is gedefinieerd
    updateEditModeUI();


document.addEventListener('click', function (e) {
  if (e.target.tagName === 'IMG' && e.target.closest('.image-grid')) {
    const src = e.target.src;
    const overlay = document.querySelector('.lightbox-overlay');
    const bigImg = document.getElementById('lightbox-img');

    bigImg.src = src;
    overlay.classList.add('show');

    // Remove hidden class from all images first
    const portfolio = document.querySelector('.image-grid');
    const imgs = portfolio.querySelectorAll('img');

    // Use requestAnimationFrame to batch DOM updates
    requestAnimationFrame(() => {
      imgs.forEach(img => img.classList.remove('active', 'hidden'));
      e.target.classList.add('active', 'hidden');
      portfolio.classList.add('monochrome');
      portfolio.style.setProperty('--monochrome-hue', '150deg'); // Default green (00AA84)
    });

    overlay.addEventListener('click', () => {
      overlay.classList.remove('show');
      portfolio.classList.remove('monochrome');
      portfolio.style.removeProperty('--monochrome-hue');
      imgs.forEach(img => {
        img.classList.remove('active', 'hidden');
      });
    }, { once: true });
  }
});
  
// Laad lokale afbeeldingen alleen als DOMContentLoaded helemaal aan het einde, om dubbele fetch te voorkomen
window.addEventListener('DOMContentLoaded', function() {
  loadLocalImages();
});