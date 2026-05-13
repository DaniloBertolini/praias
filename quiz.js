// ===== Quiz Data — Perguntas Principais =====
const mainQuestions = [
  {
    question: "Qual praia é uma das mais famosas e movimentadas da cidade?",
    options: ["Praia do Capri", "Praia da Enseada", "Praia do Molhe"],
    answer: 1
  },
  {
    question: "Qual praia é bastante procurada por surfistas por causa das ondas?",
    options: ["Praia do Ervino", "Praia do Forte", "Praia de Ubatuba"],
    answer: 0
  },
  {
    question: "Qual praia é conhecida por ter águas mais calmas e tranquilas?",
    options: ["Praia do Capri", "Praia do Ervino", "Praia do Molhe"],
    answer: 0
  },
  {
    question: "Qual praia fica mais próxima do centro histórico de São Francisco do Sul?",
    options: ["Praia do Forte", "Praia da Saudade", "Praia da Enseada"],
    answer: 1
  },
  {
    question: "Qual praia é famosa por sua longa faixa de areia?",
    options: ["Praia do Forte", "Praia do Ervino", "Praia do Capri"],
    answer: 1
  },
  {
    question: "Em qual praia existe um famoso molhe usado para caminhadas e pesca?",
    options: ["Praia da Saudade", "Praia do Molhe", "Praia de Ubatuba"],
    answer: 1
  },
  {
    question: "Qual praia costuma ter bastante estrutura turística, com bares e restaurantes?",
    options: ["Praia da Enseada", "Praia do Forte", "Praia do Capri"],
    answer: 0
  },
  {
    question: 'Qual praia é conhecida pelo apelido "Prainha"?',
    options: ["Praia da Saudade", "Praia do Ervino", "Praia do Molhe"],
    answer: 0
  },
  {
    question: "Qual praia costuma ser mais tranquila e frequentada por famílias?",
    options: ["Praia do Capri", "Praia do Molhe", "Praia do Ervino"],
    answer: 0
  },
  {
    question: "Qual praia é muito usada para pesca artesanal?",
    options: ["Praia do Ervino", "Praia da Enseada", "Praia de Ubatuba"],
    answer: 2
  }
];

// ===== Perguntas Extras (Bônus) =====
const bonusQuestions = [
  {
    question: "Qual praia é conhecida por ter a maior faixa de areia da cidade?",
    options: ["Praia Grande", "Praia do Capri", "Praia da Saudade"],
    answer: 0
  },
  {
    question: "Qual praia faz parte do Balneário de Paulas e possui águas mais calmas?",
    options: ["Praia do Salão", "Praia do Ervino", "Praia do Molhe"],
    answer: 0
  },
  {
    question: "Qual praia é conhecida pela marina e prática de esportes náuticos?",
    options: ["Praia da Figueira", "Praia do Forte", "Praia Grande"],
    answer: 0
  },
  {
    question: "Qual praia fica próxima ao porto e é uma das mais perto do centro histórico?",
    options: ["Praia dos Ingleses", "Praia de Ubatuba", "Praia da Enseada"],
    answer: 0
  },
  {
    question: "Qual praia é conhecida pela comunidade pesqueira e frutos do mar?",
    options: ["Praia do Calixto", "Praia de Itaguaçu", "Praia do Capri"],
    answer: 1
  }
];

const letters = ['a', 'b', 'c'];

// ===== State =====
let activeQuestions = mainQuestions;
let currentQuestion = 0;
let score = 0;
let answered = false;
let isBonus = false;
let mainScore = 0; // saves main quiz score

// ===== DOM Elements =====
const greetingEl = document.getElementById('quiz-greeting');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const questionNumber = document.getElementById('question-number');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const btnNext = document.getElementById('btn-next');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const bonusBadge = document.getElementById('bonus-badge');

// ===== Init =====
function init() {
  const nome = localStorage.getItem('nomeUsuario') || 'Jogador';
  greetingEl.textContent = `Olá, ${nome}! 👋`;

  loadQuestion();

  btnNext.addEventListener('click', nextQuestion);
  document.getElementById('btn-restart').addEventListener('click', restartQuiz);
  document.getElementById('btn-home').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
  document.getElementById('btn-bonus').addEventListener('click', startBonus);
}

// ===== Load Question =====
function loadQuestion() {
  answered = false;
  btnNext.disabled = true;

  const q = activeQuestions[currentQuestion];

  // Update progress
  const total = activeQuestions.length;
  const progress = ((currentQuestion + 1) / total) * 100;
  progressBar.style.width = progress + '%';

  if (isBonus) {
    progressText.textContent = `Extra ${currentQuestion + 1} de ${total}`;
  } else {
    progressText.textContent = `Pergunta ${currentQuestion + 1} de ${total}`;
  }

  // Update question number display (continues numbering in bonus)
  const displayNum = isBonus ? currentQuestion + 11 : currentQuestion + 1;
  questionNumber.textContent = displayNum;
  questionText.textContent = q.question;

  // Show/hide bonus badge
  if (bonusBadge) {
    bonusBadge.classList.toggle('hidden', !isBonus);
  }

  // Animate question
  const questionArea = document.getElementById('question-area');
  questionArea.classList.remove('question-enter');
  void questionArea.offsetWidth;
  questionArea.classList.add('question-enter');

  // Build options
  optionsContainer.innerHTML = '';
  q.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.className = 'option option-enter';
    btn.innerHTML = `
      <span class="option-letter">${letters[index]}</span>
      <span class="option-label">${option}</span>
    `;
    btn.addEventListener('click', () => selectOption(index));
    optionsContainer.appendChild(btn);
  });

  // Update next button text for last question
  const btnText = btnNext.querySelector('.btn-text');
  if (currentQuestion === activeQuestions.length - 1) {
    btnText.textContent = 'Ver Resultado';
    btnNext.querySelector('.btn-arrow').textContent = '🏆';
  } else {
    btnText.textContent = 'Próxima';
    btnNext.querySelector('.btn-arrow').textContent = '→';
  }
}

// ===== Select Option =====
function selectOption(selected) {
  if (answered) return;
  answered = true;

  const q = activeQuestions[currentQuestion];
  const allOptions = optionsContainer.querySelectorAll('.option');

  allOptions.forEach((opt, i) => {
    opt.classList.add('option--disabled');
    if (i === q.answer) {
      opt.classList.add('option--correct');
    }
    if (i === selected && selected !== q.answer) {
      opt.classList.add('option--wrong');
    }
  });

  if (selected === q.answer) {
    score++;
  }

  btnNext.disabled = false;
}

// ===== Next Question =====
function nextQuestion() {
  currentQuestion++;

  if (currentQuestion >= activeQuestions.length) {
    showResult();
  } else {
    loadQuestion();
  }
}

// ===== Show Result =====
function showResult() {
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  // Hide bonus badge on result
  if (bonusBadge) bonusBadge.classList.add('hidden');

  const nome = localStorage.getItem('nomeUsuario') || 'Jogador';
  const total = activeQuestions.length;
  const percentage = (score / total) * 100;

  const resultIcon = document.getElementById('result-icon');
  const resultTitle = document.getElementById('result-title');
  const resultName = document.getElementById('result-name');
  const resultMessage = document.getElementById('result-message');
  const scoreTotal = document.getElementById('score-total');
  const btnBonus = document.getElementById('btn-bonus');

  resultName.textContent = nome;
  scoreTotal.textContent = `/${total}`;

  if (isBonus) {
    // Bonus result
    btnBonus.classList.add('hidden');

    if (percentage === 100) {
      resultIcon.textContent = '👑';
      resultTitle.textContent = 'Mestre das Praias!';
      resultMessage.textContent = 'Incrível! Você acertou TODAS as perguntas extras! Você é o maior especialista em praias de São Francisco do Sul! 🏆🎉';
    } else if (percentage >= 60) {
      resultIcon.textContent = '🌟';
      resultTitle.textContent = 'Impressionante!';
      resultMessage.textContent = 'Você mandou muito bem nas questões extras! Conhecimento avançado sobre as praias! 🌊';
    } else {
      resultIcon.textContent = '💪';
      resultTitle.textContent = 'Boa tentativa!';
      resultMessage.textContent = 'As perguntas extras são difíceis mesmo! Que tal explorar mais as praias e tentar de novo? 🏖️';
    }
  } else {
    // Main quiz result
    mainScore = score;

    // Show bonus button if score >= 9
    if (score >= 9) {
      btnBonus.classList.remove('hidden');
    } else {
      btnBonus.classList.add('hidden');
    }

    if (percentage === 100) {
      resultIcon.textContent = '👑';
      resultTitle.textContent = 'Perfeito!';
      resultMessage.textContent = 'Você é um verdadeiro conhecedor das praias de São Francisco do Sul! Nota máxima! 🎉';
    } else if (percentage >= 90) {
      resultIcon.textContent = '🏆';
      resultTitle.textContent = 'Incrível!';
      resultMessage.textContent = 'Você arrasou! Conhece muito bem as praias da cidade! 🌊';
    } else if (percentage >= 70) {
      resultIcon.textContent = '🏆';
      resultTitle.textContent = 'Muito bem!';
      resultMessage.textContent = 'Você conhece bem as praias da cidade! Continue explorando! 🌊';
    } else if (percentage >= 50) {
      resultIcon.textContent = '⭐';
      resultTitle.textContent = 'Bom trabalho!';
      resultMessage.textContent = 'Você sabe bastante, mas ainda tem praias para descobrir! 🏖️';
    } else {
      resultIcon.textContent = '🌊';
      resultTitle.textContent = 'Continue tentando!';
      resultMessage.textContent = 'Que tal visitar as praias e tentar novamente? Será uma ótima aventura! 🐚';
    }
  }

  // Animate score ring
  const scoreValue = document.getElementById('score-value');
  const ringFill = document.getElementById('score-ring-fill');
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / total) * circumference;

  let count = 0;
  scoreValue.textContent = '0';

  setTimeout(() => {
    ringFill.style.strokeDashoffset = offset;

    if (percentage >= 70) {
      ringFill.style.stroke = '#22c55e';
      ringFill.style.filter = 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))';
    } else if (percentage >= 50) {
      ringFill.style.stroke = '#ff9a56';
      ringFill.style.filter = 'drop-shadow(0 0 8px rgba(255, 154, 86, 0.4))';
    } else {
      ringFill.style.stroke = '#ff6b6b';
      ringFill.style.filter = 'drop-shadow(0 0 8px rgba(255, 107, 107, 0.4))';
    }
  }, 300);

  const countInterval = setInterval(() => {
    count++;
    scoreValue.textContent = count;
    if (count >= score) {
      clearInterval(countInterval);
    }
  }, 120);
}

// ===== Start Bonus Round =====
function startBonus() {
  isBonus = true;
  activeQuestions = bonusQuestions;
  currentQuestion = 0;
  score = 0;
  answered = false;

  // Update greeting for bonus
  const nome = localStorage.getItem('nomeUsuario') || 'Jogador';
  greetingEl.textContent = `Rodada Bônus, ${nome}! 🏆`;

  // Update progress bar color for bonus
  progressBar.classList.add('progress-bar--bonus');

  resultScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');

  // Reset ring
  document.getElementById('score-ring-fill').style.strokeDashoffset = 326.73;

  loadQuestion();
}

// ===== Restart (full reset) =====
function restartQuiz() {
  isBonus = false;
  activeQuestions = mainQuestions;
  currentQuestion = 0;
  score = 0;
  mainScore = 0;
  answered = false;

  const nome = localStorage.getItem('nomeUsuario') || 'Jogador';
  greetingEl.textContent = `Olá, ${nome}! 👋`;

  progressBar.classList.remove('progress-bar--bonus');

  resultScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');

  // Reset ring
  document.getElementById('score-ring-fill').style.strokeDashoffset = 326.73;

  loadQuestion();
}

// ===== Start =====
init();
