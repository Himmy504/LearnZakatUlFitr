/* ===================================================================
   ZAKAT AL-FITR — INTERACTIVE LEARNING JOURNEY
   All Interactive Features
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================
  // 1. PARTICLES (Hero Background)
  // =========================================================
  const particleContainer = document.getElementById('heroParticles');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 6 + 's';
    p.style.animationDuration = (4 + Math.random() * 4) + 's';
    p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
    particleContainer.appendChild(p);
  }

  // =========================================================
  // 2. SCROLL REVEAL (IntersectionObserver)
  // =========================================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // =========================================================
  // 3. PROGRESS BAR (tracks scroll / chapter visibility)
  // =========================================================
  const chapters = document.querySelectorAll('.chapter');
  const progressFill = document.getElementById('progressBarFill');
  const progressLabel = document.getElementById('progressLabel');
  const totalSections = chapters.length; // 7 chapters + quiz = 8

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = Math.min(100, Math.round((scrollTop / docHeight) * 100));
    progressFill.style.width = pct + '%';
    progressLabel.textContent = pct + '% Complete';

    if (scrollTop > 100) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // =========================================================
  // 4. START JOURNEY BUTTON
  // =========================================================
  document.getElementById('startJourney').addEventListener('click', () => {
    document.getElementById('chapter1').scrollIntoView({ behavior: 'smooth' });
  });

  // =========================================================
  // 5. FLIP CARDS (Chapter 2)
  // =========================================================
  document.querySelectorAll('.flip-card').forEach(card => {
    function toggle() { card.classList.toggle('flipped'); }
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });

  // =========================================================
  // 6. DECISION TREE (Chapter 3)
  // =========================================================
  const dtContainer = document.getElementById('decisionTree');

  function showStep(stepId) {
    dtContainer.querySelectorAll('.dt-question, .dt-result').forEach(el => el.classList.remove('active'));
    const target = dtContainer.querySelector(`[data-step="${stepId}"]`);
    if (target) target.classList.add('active');
  }

  dtContainer.querySelectorAll('.dt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showStep(btn.dataset.next);
    });
  });

  dtContainer.querySelectorAll('.dt-restart').forEach(btn => {
    btn.addEventListener('click', () => {
      showStep('1');
    });
  });

  // =========================================================
  // 7. TIMELINE (Chapter 4)
  // =========================================================
  document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      // close all
      document.querySelectorAll('.timeline-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // =========================================================
  // 8. CALCULATOR (Chapter 5)
  // =========================================================
  const foodButtons = document.querySelectorAll('.food-btn');
  const peopleCountEl = document.getElementById('peopleCount');
  const calcTotal = document.getElementById('calcTotal');
  const calcBreakdown = document.getElementById('calcBreakdown');
  let selectedFood = { name: 'Rice', weight: 3.0, emoji: '🍚' };
  let peopleCount = 1;

  function updateCalc() {
    const total = (selectedFood.weight * peopleCount).toFixed(1);
    calcTotal.textContent = `${total} kg of ${selectedFood.name}`;
    calcBreakdown.textContent = `${peopleCount} person${peopleCount > 1 ? 's' : ''} × ${selectedFood.weight} kg per saa'`;
  }

  foodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      foodButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedFood = {
        name: btn.dataset.food.charAt(0).toUpperCase() + btn.dataset.food.slice(1),
        weight: parseFloat(btn.dataset.weight),
        emoji: btn.textContent.trim().split(' ')[0]
      };
      updateCalc();
    });
  });

  document.getElementById('increasePeople').addEventListener('click', () => {
    peopleCount = Math.min(30, peopleCount + 1);
    peopleCountEl.textContent = peopleCount;
    updateCalc();
  });

  document.getElementById('decreasePeople').addEventListener('click', () => {
    peopleCount = Math.max(1, peopleCount - 1);
    peopleCountEl.textContent = peopleCount;
    updateCalc();
  });

  // =========================================================
  // 9. DRAG & DROP GAME (Chapter 6)
  // =========================================================
  const dndItems = document.getElementById('dndItems');
  const validZone = document.getElementById('validZone').querySelector('.zone-items');
  const invalidZone = document.getElementById('invalidZone').querySelector('.zone-items');
  const dndScoreEl = document.getElementById('dndScoreText');
  const dndResetBtn = document.getElementById('dndReset');
  let dndCorrect = 0;
  let dndTotal = 0;
  const totalDndItems = document.querySelectorAll('.dnd-item').length;

  // Drag events
  let draggedItem = null;

  document.querySelectorAll('.dnd-item').forEach(item => {
    item.addEventListener('dragstart', (e) => {
      draggedItem = item;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    item.addEventListener('dragend', () => {
      if (draggedItem) draggedItem.classList.remove('dragging');
      draggedItem = null;
    });

    // Touch support
    let touchStartX, touchStartY;
    item.addEventListener('touchstart', (e) => {
      draggedItem = item;
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    }, { passive: true });

    item.addEventListener('touchend', (e) => {
      if (!draggedItem) return;
      const touch = e.changedTouches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const zone = target?.closest('.dnd-zone');
      if (zone) {
        handleDrop(draggedItem, zone);
      }
      draggedItem = null;
    });
  });

  [document.getElementById('validZone'), document.getElementById('invalidZone')].forEach(zone => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      if (draggedItem) {
        handleDrop(draggedItem, zone);
      }
    });
  });

  function handleDrop(item, zone) {
    const isValid = item.dataset.valid === 'true';
    const droppedInValid = zone.id === 'validZone';
    const correct = (isValid && droppedInValid) || (!isValid && !droppedInValid);

    dndTotal++;
    if (correct) {
      dndCorrect++;
      item.classList.add('correct');
    } else {
      item.classList.add('incorrect');
    }

    item.draggable = false;
    item.style.cursor = 'default';

    // Move to correct zone regardless
    const zoneItems = zone.querySelector('.zone-items');
    if (!zoneItems) {
      zone.querySelector('.zone-items') || zone.appendChild(item);
    }
    (correct ? zone.querySelector('.zone-items') : (isValid ? validZone : invalidZone)).appendChild(item);

    // Remove incorrect styling after a moment and move to correct zone
    if (!correct) {
      setTimeout(() => {
        item.classList.remove('incorrect');
        item.classList.add('correct');
        const correctZone = isValid ? validZone : invalidZone;
        correctZone.appendChild(item);
      }, 800);
    }

    // Check if all items sorted
    if (dndTotal === totalDndItems) {
      dndScoreEl.textContent = `🎉 Score: ${dndCorrect} / ${totalDndItems} correct!`;
      dndScoreEl.parentElement.classList.add('complete');
      dndResetBtn.style.display = 'inline-flex';
    } else {
      dndScoreEl.textContent = `${dndTotal} / ${totalDndItems} items sorted...`;
    }
  }

  // Reset DnD game
  dndResetBtn.addEventListener('click', () => {
    dndCorrect = 0;
    dndTotal = 0;
    dndScoreEl.textContent = 'Sort all items to see your score!';
    dndScoreEl.parentElement.classList.remove('complete');
    dndResetBtn.style.display = 'none';

    // Move all items back
    document.querySelectorAll('.dnd-item').forEach(item => {
      item.classList.remove('correct', 'incorrect');
      item.draggable = true;
      item.style.cursor = 'grab';
      dndItems.appendChild(item);
    });

    // Shuffle items
    const items = Array.from(dndItems.children);
    items.sort(() => Math.random() - 0.5);
    items.forEach(item => dndItems.appendChild(item));
  });

  // =========================================================
  // 10. QUIZ ENGINE
  // =========================================================
  const quizQuestions = [
    {
      q: "What does 'Zakat al-Fitr' literally refer to?",
      options: [
        "Charity given at the time of Hajj",
        "Charity connected to breaking the fast of Ramadan",
        "Charity given on one's birthday",
        "Annual wealth tax"
      ],
      correct: 1,
      explanation: "Zakat al-Fitr is connected to 'fitr' (breaking the fast) because the occasion of breaking the fast is why this zakah becomes obligatory."
    },
    {
      q: "What are the TWO main purposes of Zakat al-Fitr?",
      options: [
        "Building mosques and paying teachers",
        "Purifying the fasting person and feeding the poor",
        "Celebrating Eid and buying new clothes",
        "Paying off debts and helping travelers"
      ],
      correct: 1,
      explanation: "Ibn 'Abbaas reported that the Prophet ﷺ made it obligatory as a means of purifying the fasting person from idle talk and foul language, and to feed the poor."
    },
    {
      q: "Is Zakat al-Fitr obligatory (fard)?",
      options: [
        "No, it is only recommended (mustahabb)",
        "It depends on how much wealth you have",
        "Yes, it is fard based on hadith and scholarly consensus",
        "Only for people who missed days of fasting"
      ],
      correct: 2,
      explanation: "The correct view is that it is fard (obligatory), as the Prophet ﷺ 'made Zakat al-Fitr obligatory' and there is scholarly consensus (ijmaa')."
    },
    {
      q: "When does Zakat al-Fitr become obligatory?",
      options: [
        "On the first day of Ramadan",
        "When the sun sets on the last day of Ramadan",
        "On the 15th of Ramadan",
        "On the day after Eid"
      ],
      correct: 1,
      explanation: "Zakat al-Fitr becomes obligatory when the sun sets on the last day of Ramadan (the night before Eid)."
    },
    {
      q: "What is the BEST time to give Zakat al-Fitr?",
      options: [
        "After the Eid prayer",
        "Any time during Ramadan",
        "On the morning of Eid, BEFORE the Eid prayer",
        "A week before Eid"
      ],
      correct: 2,
      explanation: "The most preferable time is on the day of Eid before Salaat al-Eid. The Prophet ﷺ 'commanded that it should be given before the people went out to pray.'"
    },
    {
      q: "How much should be given per person?",
      options: [
        "Whatever you can afford",
        "10% of your wealth",
        "One saa' of food (approximately 3 kg of rice)",
        "One gold coin"
      ],
      correct: 2,
      explanation: "The amount is one saa' of food per person. A saa' is approximately 3 kg of rice, though the weight varies by food type."
    },
    {
      q: "Can Zakat al-Fitr be given as cash/money?",
      options: [
        "Yes, cash is always better",
        "No — the Prophet ﷺ specified it must be food",
        "Only if the amount exceeds $100",
        "Yes, but only in developing countries"
      ],
      correct: 1,
      explanation: "It must be given in the form of food as the Prophet ﷺ clearly specified. Islam wants it given openly as staple food, and the Sahaabah gave it as food."
    },
    {
      q: "Which of these is NOT a valid item for Zakat al-Fitr?",
      options: [
        "Rice",
        "Dates",
        "Meat",
        "Barley"
      ],
      correct: 2,
      explanation: "Meat, fish, eggs, and figs are not acceptable as Zakat al-Fitr. It must be staple grains/foods on which zakah is paid at the one-tenth rate."
    },
    {
      q: "Wakee' ibn al-Jarraah compared Zakat al-Fitr to what?",
      options: [
        "A pillar of Islam",
        "The two prostrations of sahw (forgetfulness) in prayer",
        "The five daily prayers",
        "Hajj rituals"
      ],
      correct: 1,
      explanation: "'Zakat al-Fitr for Ramadan is like the two sajdahs of sahw for prayer. It makes up for any shortcomings in the fast as the prostrations make up for shortcomings in prayer.'"
    },
    {
      q: "What happens if you delay Zakat al-Fitr until AFTER the Eid prayer?",
      options: [
        "Nothing, you can give it anytime",
        "It becomes just a regular charity (sadaqah), not accepted as zakah",
        "You have to give double",
        "It is still accepted as Zakat al-Fitr"
      ],
      correct: 1,
      explanation: "The Prophet ﷺ said: 'Whoever pays it before the prayer, it is an accepted zakah, and whoever pays it after the prayer, it is just a kind of charity (sadaqah).'"
    }
  ];

  let currentQuestion = 0;
  let score = 0;
  let answered = false;

  const questionText = document.getElementById('questionText');
  const quizOptions = document.getElementById('quizOptions');
  const quizFeedback = document.getElementById('quizFeedback');
  const quizNext = document.getElementById('quizNext');
  const quizProgressFill = document.getElementById('quizProgressFill');
  const quizProgressText = document.getElementById('quizProgressText');
  const quizContainer = document.getElementById('quizContainer');
  const quizResult = document.getElementById('quizResult');

  function loadQuestion() {
    answered = false;
    const q = quizQuestions[currentQuestion];
    questionText.textContent = q.q;
    quizOptions.innerHTML = '';
    quizFeedback.className = 'quiz-feedback';
    quizFeedback.style.display = 'none';
    quizNext.style.display = 'none';

    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.innerHTML = `<span class="option-letter">${letters[i]}</span><span>${opt}</span>`;
      btn.addEventListener('click', () => handleAnswer(i, btn));
      quizOptions.appendChild(btn);
    });

    quizProgressText.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
    quizProgressFill.style.width = ((currentQuestion) / quizQuestions.length * 100) + '%';
  }

  function handleAnswer(index, btn) {
    if (answered) return;
    answered = true;

    const q = quizQuestions[currentQuestion];
    const allBtns = quizOptions.querySelectorAll('.quiz-option');

    allBtns.forEach(b => b.classList.add('disabled'));

    if (index === q.correct) {
      score++;
      btn.classList.add('correct');
      quizFeedback.className = 'quiz-feedback show correct-fb';
      quizFeedback.textContent = '✅ Correct! ' + q.explanation;
    } else {
      btn.classList.add('incorrect');
      allBtns[q.correct].classList.add('correct');
      quizFeedback.className = 'quiz-feedback show incorrect-fb';
      quizFeedback.textContent = '❌ Not quite. ' + q.explanation;
    }

    if (currentQuestion < quizQuestions.length - 1) {
      quizNext.textContent = 'Next Question →';
    } else {
      quizNext.textContent = 'See Results 🏆';
    }
    quizNext.style.display = 'inline-flex';
  }

  quizNext.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
      loadQuestion();
    } else {
      showResults();
    }
  });

  function showResults() {
    quizContainer.style.display = 'none';
    quizResult.style.display = 'block';
    quizResult.scrollIntoView({ behavior: 'smooth', block: 'center' });

    document.getElementById('certScore').textContent = score;

    const pct = score / quizQuestions.length;
    let message, badge;

    if (pct === 1) {
      message = "Perfect score! Ma sha Allah — you've mastered the knowledge of Zakat al-Fitr!";
      badge = "🌟🏆🌟";
    } else if (pct >= 0.8) {
      message = "Excellent work! You have a strong understanding of Zakat al-Fitr. Keep learning!";
      badge = "🏆";
    } else if (pct >= 0.6) {
      message = "Good effort! Review the chapters above to strengthen your knowledge.";
      badge = "📚";
    } else {
      message = "Keep learning! Go through the chapters again and retake the quiz. You've got this!";
      badge = "💪";
    }

    document.getElementById('certMessage').textContent = message;
    document.getElementById('certBadge').textContent = badge;

    // Animate score count
    const scoreEl = document.getElementById('certScore');
    let count = 0;
    const interval = setInterval(() => {
      count++;
      scoreEl.textContent = count;
      if (count >= score) clearInterval(interval);
    }, 120);
  }

  // Retake quiz
  document.getElementById('retakeQuiz').addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    quizContainer.style.display = 'block';
    quizResult.style.display = 'none';
    loadQuestion();
    quizContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // Back to top
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Initialize quiz
  loadQuestion();

  // =========================================================
  // 11. SHUFFLE DND ITEMS ON LOAD
  // =========================================================
  const dndItemsContainer = document.getElementById('dndItems');
  const allDndItems = Array.from(dndItemsContainer.children);
  allDndItems.sort(() => Math.random() - 0.5);
  allDndItems.forEach(item => dndItemsContainer.appendChild(item));

});
