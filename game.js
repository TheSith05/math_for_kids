/* Глобальные переменные */
let level = 1; // Текущий уровень
let example = {}; // Объект с текущим примером
let answer = ''; // Текущий ответ игрока
let codeInput = ''; // Вводимый код для сброса
let stars = parseInt(localStorage.getItem('stars')) || 0; // Количество звёзд
let correctCount = parseInt(localStorage.getItem('correctCount')) || 0; // Счётчик правильных ответов
let incorrectCount = parseInt(localStorage.getItem('incorrectCount')) || 0; // Счётчик неправильных ответов
let heroHP = parseInt(localStorage.getItem('heroHP')) || 100; // HP игрока
let enemyIndex = parseInt(localStorage.getItem('enemyIndex')) || 0; // Индекс текущего врага
let enemyHP = parseInt(localStorage.getItem('enemyHP')) || enemies[enemyIndex % 5].baseHP; // HP текущего врага

// Список врагов
const enemies = [
  { emoji: '🦇', baseHP: 20, validLevels: [1, 2, 3, 4, 5] },
  { emoji: '🐍', baseHP: 20, validLevels: [1, 2, 3, 4, 5] },
  { emoji: '🦁', baseHP: 20, validLevels: [2, 3, 4, 5] },
  { emoji: '🐉', baseHP: 20, validLevels: [2, 3, 4, 5] },
  { emoji: '👹', baseHP: 20, validLevels: [2, 3, 4, 5] }
];

// Генерация математического примера
function generateExample() {
  let num1, num2, op1, result;
  if (level === 1) {
    num1 = Math.floor(Math.random() * 10) + 1;
    op1 = Math.random() > 0.5 ? '+' : '-';
    num2 = Math.floor(Math.random() * (op1 === '-' ? num1 : 10 - num1)) + 1;
    result = op1 === '+' ? num1 + num2 : num1 - num2;
    if (result > 10) return generateExample();
    return { num1, num2, op1, result };
  }
  // Закомментировано: поддержка уровней 2–5
  
  else if (level === 2) {
    num1 = Math.floor(Math.random() * 20) + 1;
    op1 = Math.random() > 0.5 ? '+' : '-';
    num2 = Math.floor(Math.random() * (op1 === '-' ? num1 : 10)) + 1;
    result = op1 === '+' ? num1 + num2 : num1 - num2;
    if (result > 20) return generateExample();
    let decomposition = decomposeNumber(num2, op1, num1);
    return { num1, num2, op1, result, decomposition };
  } else if (level === 3) {
    num1 = Math.floor(Math.random() * 20) + 1;
    op1 = Math.random() > 0.5 ? '+' : '-';
    num2 = Math.floor(Math.random() * (op1 === '-' ? num1 : 10)) + 1;
    const tempResult = op1 === '+' ? num1 + num2 : num1 - num2;
    if (tempResult < 0) return generateExample();
    let num3 = Math.floor(Math.random() * 10) + 1;
    let op2 = Math.random() > 0.5 ? '+' : '-';
    result = op2 === '+' ? tempResult + num3 : tempResult - num3;
    if (result > 20) return generateExample();
    let decomposition = decomposeNumber(num2, op1, num1);
    return { num1, num2, num3, op1, op2, result, decomposition };
  } else if (level === 4) {
    op1 = Math.random() > 0.5 ? '+' : '-';
    if (op1 === '-') {
      num1 = Math.floor(Math.random() * 10) + 11;
      const part1 = num1 - 10;
      const part2 = Math.floor(Math.random() * (10 - part1)) + 1;
      num2 = part1 + part2;
      result = num1 - num2;
    } else {
      num1 = Math.floor(Math.random() * 9) + 1;
      const part1 = 10 - num1;
      const part2 = Math.floor(Math.random() * (10 - part1)) + 1;
      num2 = part1 + part2;
      result = num1 + num2;
    }
    if (result > 20) return generateExample();
    let decomposition = decomposeNumber(num2, op1, num1);
    if (!decomposition) return generateExample();
    return { num1, num2, op1, result, decomposition };
  } else if (level === 5) {
    op1 = Math.random() > 0.5 ? '+' : '-';
    if (op1 === '-') {
      num1 = Math.floor(Math.random() * 10) + 11;
      const part1 = num1 - 10;
      const part2 = Math.floor(Math.random() * (10 - part1)) + 1;
      num2 = part1 + part2;
      const tempResult = num1 - num2;
      let num3 = Math.floor(Math.random() * 10) + 1;
      let op2 = Math.random() > 0.5 ? '+' : '-';
      result = op2 === '+' ? tempResult + num3 : tempResult - num3;
    } else {
      num1 = Math.floor(Math.random() * 9) + 1;
      const part1 = 10 - num1;
      const part2 = Math.floor(Math.random() * (10 - part1)) + 1;
      num2 = part1 + part2;
      const tempResult = num1 + num2;
      let num3 = Math.floor(Math.random() * 10) + 1;
      let op2 = Math.random() > 0.5 ? '+' : '-';
      result = op2 === '+' ? tempResult + num3 : tempResult - num3;
    }
    if (result > 20) return generateExample();
    let decomposition = decomposeNumber(num2, op1, num1);
    if (!decomposition) return generateExample();
    return { num1, num2, op1, result, decomposition };
  }
  
  if (result < 0) return generateExample();
  return { num1, num2, op1, result };
}

// Закомментировано: разложение числа для уровней 2+

function decomposeNumber(num, op1, num1) {
  if (num <= 1) return null;
  if (op1 === '-') {
    const part1 = num1 - 10;
    if (part1 <= 0 || part1 >= num) return null;
    const part2 = num - part1;
    if (part2 <= 0) return null;
    return [part1, part2];
  } else if (op1 === '+') {
    const part1 = 10 - num1;
    if (part1 <= 0 || part1 >= num || num1 + num < 10) return null;
    const part2 = num - part1;
    if (part2 <= 0) return null;
    return [part1, part2];
  }
  return null;
}


// Обновление отображения примера
function updateExample() {
  example = generateExample();
  const exampleDiv = document.getElementById('example');
  exampleDiv.innerHTML = `${example.num1} ${example.op1} ${example.num2} = ?`;
  // Закомментировано: отображение разложения для уровней 2+
  
  if (level >= 2 && example.decomposition) {
    exampleDiv.innerHTML += `
      <div class="flex justify-center mt-2">
        <div class="flex flex-col items-center">
          <svg id="brace" width="100" height="50" viewBox="0 0 100 50" class="mt-0" style="position: absolute; transform: scale(1.2);">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color: #ff6b6b; stop-opacity: 1" />
                <stop offset="100%" style="stop-color: #ffcc00; stop-opacity: 1" />
              </linearGradient>
            </defs>
            <polyline points="30,40 50,17 70,40" fill="none" stroke="url(#grad)" stroke-width="4" filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.3))" />
          </svg>
          <span id="decomp1" class="text-xl font-bold decomp" style="position: absolute;">${example.decomposition[0]}</span>
          <span id="decomp2" class="text-xl font-bold decomp" style="position: absolute;">${example.decomposition[1]}</span>
        </div>
      </div>
    `;
    positionBrace();
    gsap.fromTo('#brace', { scaleY: 0, opacity: 0 }, { scaleY: 1.2, opacity: 1, duration: 0.5, ease: 'bounce' });
    gsap.fromTo('.decomp', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.3 });
  }
  
  gsap.set('#cat', { clearProps: 'all' }); // Сбрасываем анимации кота
}

// Закомментировано: позиционирование "усов" для разложения

function positionBrace() {
  if (level === 1 || !example.decomposition) return;
  const num2 = document.getElementById('num2');
  const exampleDiv = document.getElementById('example');
  const brace = document.getElementById('brace');
  const decomp1 = document.getElementById('decomp1');
  const decomp2 = document.getElementById('decomp2');
  const num2Rect = num2.getBoundingClientRect();
  const exampleRect = exampleDiv.getBoundingClientRect();
  const svgWidth = 120;
  const exampleLeft = (window.innerWidth - exampleRect.width) / 2;
  const num2CenterX = num2Rect.left + num2Rect.width;
  const adjustment = num2.textContent.length > 1 && window.innerWidth < 640 ? -7 : num2.textContent.length > 1 ? -5 : 0;
  const svgLeft = num2CenterX + adjustment - svgWidth / 2;
  brace.style.left = `${svgLeft}px`;
  const num2Top = num2Rect.top;
  const desiredTop = num2Top + 50;
  brace.style.top = `${desiredTop - 20.4}px`;
  const braceRect = brace.getBoundingClientRect();
  decomp1.style.left = `${braceRect.left + 30}px`;
  decomp2.style.left = `${braceRect.left + 78}px`;
  decomp1.style.top = `${braceRect.top + 48}px`;
  decomp2.style.top = `${braceRect.top + 48}px`;
}


// Позиционирование врага и игрока относительно клавиатуры
function positionCharacters() {
  const keyboard = document.getElementById('input-buttons');
  const enemy = document.getElementById('enemy');
  const player = document.getElementById('player');
  const keyboardRect = keyboard.getBoundingClientRect();
  const offsetY = window.innerWidth < 640 ? 80 : 60; // Меньше отступ на смартфонах
  const offsetX = window.innerWidth < 640 ? 16 : 32; // 1rem на смартфоне, 2rem на десктопе
  enemy.style.top = `${keyboardRect.top - offsetY}px`;
  player.style.top = `${keyboardRect.top - offsetY}px`;
  enemy.style.left = `${keyboardRect.left + offsetX}px`;
  player.style.left = `${keyboardRect.right - offsetX - player.offsetWidth}px`;
}

// Отображение урона
function showDamage(damage, isCrit) {
  const damageText = document.createElement('div');
  damageText.className = `absolute text-2xl font-bold ${isCrit ? 'text-yellow-500' : 'text-blue-500'}`;
  damageText.textContent = `-${damage}`;
  damageText.style.left = '60px';
  damageText.style.top = '40px';
  document.getElementById('enemy').appendChild(damageText);
  gsap.to(damageText, {
    y: -50,
    opacity: 0,
    duration: 0.8,
    ease: 'power1.out',
    onComplete: () => damageText.remove()
  });
}

// Обновление отображения врага
function updateEnemy() {
  const cycle = Math.floor(enemyIndex / 5);
  const enemy = enemies[enemyIndex % 5];
  enemyHP = parseInt(localStorage.getItem('enemyHP')) || Math.round(enemy.baseHP * (1 + 0.1 * cycle));
  localStorage.setItem('enemyHP', enemyHP);
  document.getElementById('enemy-emoji').textContent = enemy.emoji;
  document.getElementById('enemy-hp').style.width = `${(enemyHP / (enemy.baseHP * (1 + 0.1 * cycle))) * 100}%`;
  gsap.fromTo('#enemy', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'bounce' });
  positionCharacters();
}

// Обновление полос HP и проверка состояния игры
function updateHP() {
  document.getElementById('hero-hp').style.width = `${heroHP}%`;
  const currentEnemy = enemies[enemyIndex % 5];
  document.getElementById('enemy-hp').style.width = `${(enemyHP / (currentEnemy.baseHP * (1 + 0.1 * Math.floor(enemyIndex / 5)))) * 100}%`;
  if (enemyHP <= 0) {
    stars += (enemyIndex % 5 === 4) ? 30 : 20;
    if (enemyIndex % 5 === 4) {
      heroHP = 100;
      document.getElementById('hero-hp').style.width = '100%';
      gsap.to('#player', { backgroundColor: '#22C55E', duration: 0.3, repeat: 1, yoyo: true });
    }
    enemyIndex++;
    localStorage.setItem('enemyIndex', enemyIndex);
    localStorage.setItem('stars', stars);
    localStorage.setItem('enemyHP', enemies[enemyIndex % 5].baseHP); // Сбрасываем HP для нового врага
    document.getElementById('star-count').textContent = `⭐ ${stars}`;
    document.getElementById('star-total').textContent = stars;
    gsap.to('#enemy', {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        updateEnemy();
        positionCharacters();
      }
    });
    gsap.to('#star-count', { scale: 1.5, duration: 0.5, yoyo: true, repeat: 1 });
  }
  if (heroHP <= 0) {
    stars = 0;
    correctCount = 0;
    incorrectCount = 0;
    heroHP = 100;
    enemyIndex = 0;
    enemyHP = enemies[0].baseHP;
    localStorage.setItem('stars', stars);
    localStorage.setItem('correctCount', correctCount);
    localStorage.setItem('incorrectCount', incorrectCount);
    localStorage.setItem('heroHP', heroHP);
    localStorage.setItem('enemyIndex', enemyIndex);
    localStorage.setItem('enemyHP', enemyHP);
    document.getElementById('star-count').textContent = `⭐ 0`;
    document.getElementById('correct-count').textContent = '0';
    document.getElementById('incorrect-count').textContent = '0';
    document.getElementById('star-total').textContent = '0';
    document.getElementById('hero-hp').style.width = '100%';
    gsap.set('#cat', { clearProps: 'all' }); // Сбрасываем анимации кота
    updateEnemy();
    positionCharacters();
    document.getElementById('game-over-modal').classList.remove('hidden');
  }
}

// Обновление разметки кнопок уровней
function updateButtonLayout() {
  const container = document.getElementById('level-buttons');
  const buttons = container.querySelectorAll('button');
  const containerWidth = container.getBoundingClientRect().width;
  const buttonWidth = buttons[0].getBoundingClientRect().width;
  const gap = 16;
  const maxButtonsPerRow = Math.floor((containerWidth + gap) / (buttonWidth + gap));
  container.classList.remove('grid-cols-1', 'grid-cols-2', 'grid-cols-4', 'grid-cols-5');
  buttons.forEach(btn => btn.classList.remove('col-span-2', 'col-span-1'));
  if (buttons.length === 5) {
    if (window.innerWidth < 640) {
      container.classList.add('grid-cols-2');
      buttons[4].classList.add('col-span-2');
    } else {
      container.classList.add('grid-cols-5');
    }
  }
}

// Инициализация игры
function initializeGame() {
  document.getElementById('star-count').textContent = `⭐ ${stars}`;
  document.getElementById('correct-count').textContent = correctCount;
  document.getElementById('incorrect-count').textContent = incorrectCount;
  document.getElementById('star-total').textContent = stars;
  document.getElementById('hero-hp').style.width = `${heroHP}%`;
  updateEnemy();
  updateExample();
  updateButtonLayout();
  positionCharacters();
  gsap.set('#cat', { clearProps: 'all' }); // Сбрасываем анимации кота

  // Обработчики событий
  document.getElementById('faq-button').addEventListener('click', () => {
    document.getElementById('faq-modal').classList.toggle('hidden');
  });
  document.getElementById('faq-close').addEventListener('click', () => {
    document.getElementById('faq-modal').classList.add('hidden');
  });
  document.getElementById('restart-game').addEventListener('click', () => {
    document.getElementById('game-over-modal').classList.add('hidden');
    answer = '';
    codeInput = '';
    document.getElementById('answer').textContent = 'Ответ: ';
    document.getElementById('cat').textContent = '😺';
    gsap.set('#cat', { clearProps: 'all' }); // Сбрасываем анимации кота
    updateExample();
    updateEnemy();
    positionCharacters();
  });

  document.getElementById('input-buttons').addEventListener('click', (event) => {
    if (event.target.tagName !== 'BUTTON') return;
    const value = event.target.textContent;
    if (value === 'Ввод') {
      if (codeInput === '250989') {
        localStorage.clear();
        stars = 0;
        correctCount = 0;
        incorrectCount = 0;
        heroHP = 100;
        enemyIndex = 0;
        enemyHP = enemies[0].baseHP;
        level = 1;
        document.getElementById('star-count').textContent = `⭐ 0`;
        document.getElementById('correct-count').textContent = '0';
        document.getElementById('incorrect-count').textContent = '0';
        document.getElementById('star-total').textContent = '0';
        document.getElementById('hero-hp').style.width = '100%';
        document.getElementById('cat').textContent = '😺';
        gsap.to('#cat', { scale: 1.5, rotation: 360, duration: 1, ease: 'elastic', onComplete: () => gsap.set('#cat', { clearProps: 'all' }) });
        document.querySelectorAll('#level-buttons button').forEach(btn => {
          btn.classList.remove('bg-blue-600');
          btn.classList.add('bg-blue-400');
        });
        document.querySelector('#level-buttons button[data-level="1"]').classList.add('bg-blue-600');
        localStorage.setItem('stars', stars);
        localStorage.setItem('correctCount', correctCount);
        localStorage.setItem('incorrectCount', incorrectCount);
        localStorage.setItem('heroHP', heroHP);
        localStorage.setItem('enemyIndex', enemyIndex);
        localStorage.setItem('enemyHP', enemyHP);
        updateEnemy();
        updateExample();
        positionCharacters();
      } else if (!isNaN(parseInt(answer)) && parseInt(answer) === example.result) {
        document.getElementById('cat').textContent = '😸';
        gsap.to('#cat', { y: -30, scale: 1.2, duration: 0.5, yoyo: true, repeat: 1, onComplete: () => gsap.set('#cat', { clearProps: 'all' }) });
        stars += 5;
        correctCount++;
        const isCrit = correctCount % 5 === 0;
        const damage = isCrit ? level * 4 : level * 2;
        const currentEnemy = enemies[enemyIndex % 5];
        if (currentEnemy.validLevels.includes(level)) {
          enemyHP -= damage;
          localStorage.setItem('enemyHP', enemyHP);
          if (isCrit) {
            gsap.to('#enemy', {
              x: 10,
              duration: 0.1,
              repeat: 7,
              yoyo: true,
              backgroundColor: '#EF4444',
              onComplete: () => gsap.set('#enemy', { backgroundColor: 'transparent' })
            });
          } else {
            gsap.to('#enemy', { x: 5, duration: 0.1, repeat: 5, yoyo: true });
          }
          showDamage(damage, isCrit);
        } else {
          gsap.to('#enemy', { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 });
        }
        localStorage.setItem('stars', stars);
        localStorage.setItem('correctCount', correctCount);
        document.getElementById('star-count').textContent = `⭐ ${stars}`;
        document.getElementById('correct-count').textContent = correctCount;
        document.getElementById('star-total').textContent = stars;
        gsap.to('#star-count', { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 });
        updateHP();
        setTimeout(() => {
          document.getElementById('cat').textContent = '😺';
          answer = '';
          codeInput = '';
          document.getElementById('answer').textContent = 'Ответ: ';
          gsap.set('#cat', { clearProps: 'all' }); // Сбрасываем анимации кота
          updateExample();
        }, 1000);
      } else {
        document.getElementById('cat').textContent = codeInput.length >= 6 ? '🤔' : '😿';
        gsap.to('#cat', { x: -15, rotation: 5, duration: 0.2, yoyo: true, repeat: 3, onComplete: () => gsap.set('#cat', { clearProps: 'all' }) });
        stars = Math.max(0, stars - 1);
        incorrectCount++;
        heroHP -= 5;
        localStorage.setItem('stars', stars);
        localStorage.setItem('incorrectCount', incorrectCount);
        localStorage.setItem('heroHP', heroHP);
        document.getElementById('star-count').textContent = `⭐ ${stars}`;
        document.getElementById('incorrect-count').textContent = incorrectCount;
        document.getElementById('star-total').textContent = stars;
        updateHP();
        setTimeout(() => {
          document.getElementById('cat').textContent = '😺';
          answer = '';
          codeInput = '';
          document.getElementById('answer').textContent = 'Ответ: ';
          gsap.set('#cat', { clearProps: 'all' }); // Сбрасываем анимации кота
        }, 1000);
      }
    } else if (value === 'Очистить') {
      answer = '';
      codeInput = '';
      document.getElementById('answer').textContent = 'Ответ: ';
    } else {
      answer += value;
      codeInput += value;
      document.getElementById('answer').textContent = `Ответ: ${answer}`;
    }
  });

  document.getElementById('level-buttons').addEventListener('click', (event) => {
    if (event.target.tagName !== 'BUTTON') return;
    level = parseInt(event.target.dataset.level);
    document.querySelectorAll('#level-buttons button').forEach(btn => {
      btn.classList.remove('bg-blue-600');
      btn.classList.add('bg-blue-400');
    });
    event.target.classList.remove('bg-blue-400');
    event.target.classList.add('bg-blue-600');
    answer = '';
    codeInput = '';
    document.getElementById('answer').textContent = 'Ответ: ';
    updateExample();
    positionCharacters();
  });
}
