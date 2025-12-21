// Imposta l'altezza del background fisso uguale all'altezza della finestra
function setBgHeight() {
  const vh = window.innerHeight;
  const bg = document.getElementById('bg-fixed');
  if (bg) {
    bg.style.height = vh + 'px';
  }
}

// Esegui al caricamento della pagina
window.addEventListener('load', setBgHeight);
// Aggiorna quando la finestra viene ridimensionata
window.addEventListener('resize', setBgHeight);