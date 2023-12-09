let MAX = 30000; // 생성입자 많을수록 글자 부셔져도 계속 재생됨 
let MIN_BORDER = 1;
let MAX_BORDER = 1;

let BG_COLOR = [255, 255, 255];
let FG_COLOR = [255, 255, 255];
let BORDER_COLOR = [214, 214, 214];
let T_COLOR = [255,23,23];
let W_COLOR = [255,255,255];
let B_COLOR = [0,0,0];

let particles;
let list;
let count;
let words = [];

function setup() {
  colorMode(RGB, 255, 255, 255);
  createCanvas(windowWidth, windowHeight);
  background(BG_COLOR);
  frameRate(30);
  noStroke();
  
  textFont("Nanum Myeongjo");
  textSize(105);
  fill(0);
  
  textAlign(CENTER, CENTER);
  
  // 각 단어의 초기 위치 설정
  words.push({ text: '거의모든', x:300, y:180 });
  words.push({ text: '시월의몸', x:740, y:350 });
  words.push({ text: '503', x:1300, y:244 });
  words.push({ text: '통로', x:400, y:500 });
  words.push({ text: '물질성을 포기한 몸과 문장이 사라진 글', x:700, y:770 });
  words.push({ text: 'what mitchi did', x:1200, y:550 });

  // 단어 출력
  for (let k = 0; k < words.length; k++) {
    text(words[k].text, words[k].x, words[k].y);
  }

  count = 0;
  list = new Array(width * height);
  loadPixels();

  for (let y = 0; y <= height - 1; y++) {
    for (let x = 0; x <= width - 1; x++) {
      let pb = get(x, y);
      if (red(pb) < 5) {
        list[y * width + x] = 0;
      } else {
        list[y * width + x] = 1;
      }
    }
  }
  updatePixels();

  particles = [];
}

function draw() {
  // 이전 단어 위치 초기화
  for (let k = 0; k < words.length; k++) {
    fill(BG_COLOR);
    text(words[k].text, words[k].x, words[k].y);
  }

  if (count < MAX) {
    let i = 0;
    while (i < 3) {
      let axis = createVector(int(random(100, width - 100)), int(random(100, height - 100)));
      if (list[int(axis.y * width + axis.x)] == 0) {
        particles.push(new Particle(axis.x, axis.y));
        i++;
        count++;
      }
    }
  }
  background(B_COLOR);

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.update(mouseX, mouseY);
    fill(W_COLOR); // 테두리색깔 
    p.display();
  }

  for (let j = 0; j < particles.length; j++) {
    let p = particles[j];
    p.update(mouseX, mouseY);
    fill(B_COLOR); // 글자 전경색 검정배경에 투명하게 하려면 검정으로 채워야함
    p.display2();
  }

  // 단어 업데이트 및 출력
  for (let k = 0; k < words.length; k++) {
    words[k].x += random(0,0); // 단어 위치를 약간씩 랜덤하게 이동
    words[k].y += random(0,0);
    text(words[k].text, words[k].x, words[k].y);
  }
  
  //words[k].x += random(-2, 2); // 단어 위치를 약간씩 랜덤하게 이동
    //words[k].y += random(-2, 2);

  //filter(BLUR, 0.01); // 블러값
}

function mousePressed() {
  for (let k = 0; k < words.length; k++) {
    let word = words[k];
    let wordWidth = textWidth(word.text);
    let wordHeight = textAscent() + textDescent();

    if (
      mouseX > word.x - wordWidth / 2 &&
      mouseX < word.x + wordWidth / 2 &&
      mouseY > word.y - wordHeight / 2 &&
      mouseY < word.y + wordHeight / 2
    ) {
      openLink(word.text);
    }
  }
}


function openLink(word) {
  if (word === '거의모든') {
    window.open('https://transparent-typo-1.glitch.me/'); 
  } else if (word === '시월의몸') {
    window.open('https://transparent-typo-2.glitch.me/'); 
  } else if (word === '물질성을 포기한 몸과 문장이 사라진 글') {
    window.open('https://transparent-typo-3.glitch.me/'); 
  } else if (word === '통로') {
    window.open('https://transparent-typo-4.glitch.me/'); 
  } else if (word === 'what mitchi did') {
    window.open('https://transparent-typo-5.glitch.me/'); 
  } else if (word === '503') {
    window.open('https://transparent-typo-6.glitch.me/'); 
  }
}

function mouseOverEffect() {
  for (let i = 0; i < particles.length; i++) {
    particles[i].scatter();
  }
}

function mouseOutEffect() {
  for (let i = 0; i < particles.length; i++) {
    particles[i].returnToOriginal();
  }
}

function mouseOver() {
  mouseOverEffect();
}

function mouseOut() {
  mouseOutEffect();
}


class Particle {
  constructor(x, y) {
    this.originalX = x;
    this.originalY = y;
    this.location = createVector(x, y);
    this.velocity = createVector(random(1/3), random(1/5));
    this.scale = random(0.1, 0.4); //생성입자크기
    this.radius = int(this.scale * 45);
    this.border = MIN_BORDER + 0.5;
    this.incBorder = 0.001;
    this.type = int(random(3));
  }

  update(mouseX, mouseY) {
    this.location.add(this.velocity);
    this.handleBoundary();
    this.handleCollision();
    this.handleMouseEffect(mouseX, mouseY);
  }

  handleBoundary() {
    if (this.location.x < 0 || this.location.x > width) {
      this.velocity.x *= -1;
    }
    if (this.location.y < 0 || this.location.y > height) {
      this.velocity.y *= -1;
    }
  }

  handleCollision() {
    if (
      list[int(this.location.y) * width + int(this.location.x + this.velocity.x)] == 1 ||
      list[int(this.location.y) * width + int(this.location.x - this.velocity.x)] == 1
    ) {
      this.velocity.x *= -1;
    }
    if (
      list[int(this.location.y + this.velocity.y) * width + int(this.location.x)] == 1 ||
      list[int(this.location.y - this.velocity.y) * width + int(this.location.x)] == 1
    ) {
      this.velocity.y *= -1;
    }
  }

  handleMouseEffect(mouseX, mouseY) {
    let d = dist(mouseX, mouseY, this.location.x, this.location.y);
    if (d < 50) {
      this.scatter();
    }
  }

  scatter() {
  // 방향 벡터를 랜덤하게 생성하는 대신, 현재 위치에서 마우스 위치로 향하는 벡터를 이용합니다.
  let mouseDirection = createVector(mouseX - this.location.x, mouseY - this.location.y);
  
  // 벡터의 크기를 줄여서 느리게 이동하도록 합니다.
  mouseDirection.mult(0.04);
  
  // 현재 위치에 방향을 더합니다.
  this.location.add(mouseDirection);
}

  returnToOriginal() {
    let direction = createVector(this.originalX - this.location.x, this.originalY - this.location.y);
    this.location.add(direction.mult(0.05)); // 조절 가능한 속도 값
  }

  display() {
    if (this.type === 0) {
      ellipse(this.location.x, this.location.y, this.radius, this.radius);
    } else {
      this.updateBorder();
      ellipse(this.location.x, this.location.y, this.radius + this.border, this.radius + this.border);
    }
  }

  display2() {
    if (this.type === 0) {
      this.updateBorder();
      ellipse(this.location.x, this.location.y, this.radius - this.border, this.radius - this.border);
    } else {
      ellipse(this.location.x, this.location.y, this.radius, this.radius);
    }
  }

  updateBorder() {
    if (this.border < MIN_BORDER || this.border > MAX_BORDER) {
      this.incBorder *= -0.5;
    }
    this.border += this.incBorder;
  }
}