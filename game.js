const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");
const DEGREE = Math.PI / 180;
let frames = 0;
let score = 0;

const sprite = new Image();
sprite.src = "img/sprite.png";

const state = {
  current: 0,
  getReady: 0,
  game: 1,
  over: 2
}

//control the game state
cvs.addEventListener("click", function (evt) {
  switch (state.current) {
    case state.getReady:
      state.current = state.game;
      break;
    case state.game:
      bird.flap();
      break;
    case state.over:
      state.current = state.getReady;
      break;

  }
});

const bg = {
  sX: 0,
  sY: 0,
  w: 275,
  h: 226,
  x: 0,
  y: cvs.height - 226,

  draw: function () {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
  }
}

const fg = {
  sX: 276,
  sY: 0,
  w: 224,
  h: 112,
  x: 0,
  y: cvs.height - 112,

  dx : 2,


  draw : function(){
      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
  },

  update: function() {
    if (state.current == state.game) {
      this.x = (this.x - this.dx) % (this.w / 2);
    }
  }
}


const bird = {
  x: 50,
  y: 150,
  w: 34,
  h: 26,
  speed: 0,
  rotation: 0,
  gravity: 0.25,
  jump: 4.6,
  frame: 0,
  radius : 12,



  animation: [
    { sX: 276, sY: 112 },
    { sX: 276, sY: 139 },
    { sX: 276, sY: 164 },
    { sX: 276, sY: 139 }
  ],



  draw: function () {
    let bird = this.animation[this.frame];

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, -this.w / 2, -this.h / 2, this.w, this.h);

    ctx.restore();
  },

  update: function () {

    this.period = state.current == state.getReady ? 10 : 5;
    this.frame += frames % this.period == 0 ? 1 : 0;
    this.frame = this.frame % this.animation.length;

    if (state.current == state.getReady) {
      this.y = 150; //reset the bird position
      this.rotation = 0 * DEGREE;

    } else {
      this.speed += this.gravity;
      this.y += this.speed;
      if (this.y + this.h / 2 >= cvs.height - fg.h) {
        this.y = cvs.height - fg.h - this.h / 2;
        if (state.current == state.game) {
          state.current = state.over;
        }
      }

      // if speed is greater than jump, it means the bird is falling
      if (this.speed >= this.jump) {
        this.rotation = 90 * DEGREE;
        this.frame = 1;
      }
      else {
        this.rotation = -25 * DEGREE;
      }
    }


  },

  flap: function () {

    this.speed = -this.jump;
  },
}

const pipes = {
  position: [],
  bottom: { sX: 502, sY: 0 },
  top: { sX: 553, sY: 0 },
  w: 53,
  h: 400,
  gap: 85,
  maxYPos: -150,
  dx: 2,

  draw: function () {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];

      let topY = p.y;
      let bottomY = p.y + this.h + this.gap;

      //top pipe
      ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topY, this.w, this.h);

      //bottom pipe
      ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomY, this.w, this.h);
    }
  },
  update: function () {
    if (state.current != state.game) return;
    if(frames%100 == 0){
      this.position.push({
        x: cvs.width,
        y: Math.floor(this.maxYPos * (Math.random() + 1))
      });
    }

    for(let i = 0; i < this.position.length; i++){
      let p = this.position[i];

      let bottomPipeY = p.y + this.h + this.gap;
      let topPipeY = p.x;

      if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && (bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h)) {
        state.current = state.over;
      }
      if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && (bird.y + bird.radius > bottomPipeY && bird.y - bird.radius < bottomPipeY + this.h)) {
        state.current = state.over;
      }

      p.x -= this.dx;

      if(p.x + this.w <= 0){
        this.position.shift();
        //score.value++;
      }
    }

  },

}


// get ready
const getReady = {
  sX: 0,
  sY: 228,
  w: 173,
  h: 152,
  x: cvs.width / 2 - 173 / 2,
  y: 80,

  draw: function () {
    if (state.current === state.getReady) {
      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    }
  }
}

const gameOver = {
  sX: 175,
  sY: 228,
  w: 225,
  h: 202,
  x: cvs.width / 2 - 225 / 2,
  y: 90,

  draw: function () {
    if (state.current === state.over) {
      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    }
  }
}

function draw() {
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  bg.draw();
  pipes.draw();
  fg.draw();
  bird.draw();
  getReady.draw();
  gameOver.draw();
}


function update() {
  bird.update();
  fg.update();
  pipes.update();
  //nam1e.update();
}

function loop() {
  update();
  draw();
  frames++;
  requestAnimationFrame(loop);
}

loop();



// const name1 = {
//   sX: 276,
//   sY: 112,
//   w: 34,
//   h: 26,
//   x: 0,
//   y: 0,
//   draw: function () {
//       ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.y);
//   }
// }

