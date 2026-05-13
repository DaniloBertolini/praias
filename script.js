// === DOM Elements ===
const inputNome = document.getElementById('nome');
const btnComecar = document.getElementById('btn-comecar');

// === Enable/disable button based on input ===
inputNome.addEventListener('input', () => {
  const nome = inputNome.value.trim();
  btnComecar.disabled = nome.length === 0;
});

// === Handle Enter key ===
inputNome.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !btnComecar.disabled) {
    btnComecar.click();
  }
});

// === Navigate to quiz page ===
btnComecar.addEventListener('click', () => {
  const nome = inputNome.value.trim();
  if (nome) {
    // Save name to localStorage so the quiz page can use it
    localStorage.setItem('nomeUsuario', nome);
    window.location.href = 'quiz.html';
  }
});
