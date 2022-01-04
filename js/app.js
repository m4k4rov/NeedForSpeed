const score=document.querySelector('.score'),
    start=document.querySelector('.start'),
    gameArea=document.querySelector('.gameArea'),
    uu = document.querySelector('.uu');
    car = document.createElement('div');
car.classList.add('car');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
  KeyW: false,
  KeyA: false,
  KeyS: false,
  KeyD: false
};

const setting = {
  start: false,
  score: 0,
  speed: 2,
  traffic: 2
}

let timerId;

isMobile = {
  Android: function() {
      return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};

function getQuantityElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1;
}

function startGame () {
  start.classList.add('hidden');
  setting.speed = 2;
  gameArea.innerHTML = '';
  car.style.left = 'calc(50% - 30px)';
  car.style.top = 'auto';
  car.style.bottom = '10px';
  for (let i = 0; i < getQuantityElements(100); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = (i * 100) + 'px';
    line.y = i * 100;
    gameArea.appendChild(line);
  }

  for (let i = 0; i < getQuantityElements(125 * setting.traffic); i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -125 * setting.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 60)) + 'px';
    enemy.style.top = enemy.y + 'px';
    gameArea.appendChild(enemy);
  }
  setting.score = 0;
  setting.start = true;
  gameArea.appendChild(car);
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  timerId = setInterval(() => {setting.speed++; if (setting.speed >= 20) clearInterval(timerId);}, 10000);
  if (isMobile.any()) {
    window.addEventListener('deviceorientation', function(e) {
      if ((e.gamma * 5) < (gameArea.offsetWidth / 2 - car.offsetWidth / 2 - 1) && (e.gamma * 5) > -(gameArea.offsetWidth / 2 - car.offsetWidth / 2 - 1)) {
        setting.x = Math.round((gameArea.offsetWidth / 2 - car.offsetWidth / 2) + (e.gamma * 5));
      }
      if ((e.beta * 9) > - (gameArea.offsetHeight / 2 - 10) && (e.beta * 9) < (gameArea.offsetHeight / 2 - car.offsetHeight )) {
        setting.y=Math.round((gameArea.offsetHeight / 2 - car.offsetHeight / 2) + (e.beta * 9));
      }
    });
  }
  requestAnimationFrame(playGame);
}

function playGame () {
  if (setting.start) {
    setting.score += setting.speed;
    score.textContent = 'Score: ' + setting.score;
    moveRoad();
    moveEnemy();
    if (keys.KeyA && setting.x > 0) {
      setting.x-=setting.speed>5 ? 5 : setting.speed;
    }
    if (keys.KeyD && setting.x < gameArea.offsetWidth - car.offsetWidth) {
      setting.x+=setting.speed>5 ? 5 : setting.speed;
    }
    if (keys.KeyS && setting.y < gameArea.offsetHeight - car.offsetHeight - 10) {
      setting.y+=setting.speed>5 ? 5 : setting.speed;
    }
    if (keys.KeyW && setting.y > 10) {
      setting.y-=setting.speed>5 ? 5 : setting.speed;
    }

    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';

    requestAnimationFrame(playGame);
  }
}

function startRun (e) {
  e.preventDefault();
  if (Object.keys(keys).includes(e.code)) keys[e.code] = true;
}

function stopRun (e) {
  e.preventDefault();
  if (Object.keys(keys).includes(e.code)) keys[e.code] = false;
}

function moveRoad () {
  let lines = document.querySelectorAll('.line');
  lines.forEach(item => {
    item.y += setting.speed;
    item.style.top = item.y + 'px';
    if (item.y >= document.documentElement.clientHeight) {
      item.y = -100;
    }
  })
}

function moveEnemy () {
  let enemy = document.querySelectorAll('.enemy');
  enemy.forEach(item => {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();
    if (carRect.top <= (enemyRect.bottom - 10) && carRect.right >= (enemyRect.left + 5) && carRect.left <= (enemyRect.right - 5) && carRect.bottom >= (enemyRect.top + 10)) {
      setting.start = false;
      start.classList.remove('hidden');
      start.style.top = score.offsetHeight + 'px';
      clearInterval(timerId);
    }
    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';
    if (item.y >= document.documentElement.clientHeight) {
      item.y = -(188 * setting.traffic);
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 60)) + 'px';
    }
  })
}
