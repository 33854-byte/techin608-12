//intro Canvas

//=======================
// เริ่มสร้างเกม
//=======================

//ตั้งค่าหน้าจอเกม

let board;
let boardWidth = 800;
let boardHeight = 300;
let context;
let bgImg;

//=======================
// ตั้งค่าตัวละคร
//=======================

let playerWidth = 85;
let playerHeight = 85;
let playerX = 50;
let playerY = boardHeight - playerHeight;

let playerImg;

let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight,
}

let gameOver = false;
let score = 0;
let time = 0;
let obstacleTimer;
let life = 3;
let bgm = new Audio("bgm.mp3");
let jumpSound = new Audio("jump.mp3");
let hitSound = new Audio("hit.mp3");

//=======================
// สร้างอุปสรรค
//=======================

let boxImgs = [];
let boxWidth = 40;
let boxHeight = 80;
let boxX = 700;
let boxY = boardHeight - boxHeight;

// setting อุปสรรค์
let boxesArray = [];
let boxSpeed = -5;

//Gravity & Velocity

let velocityY = 0;
let gravity = 0.25;

//=======================
// กำหนดเหตุการณ์เริ่มต้นเกม
//=======================

window.onload = function () {

    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //player
    playerImg = new Image();
    playerImg.src = "pg.66.png";

    // พื้นหลัง
    bgImg = new Image();
    bgImg.src = "pg88.jpg";


    playerImg.onload = function () {
        context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    }

    //เพลงพื้นหลัง
    bgm.loop = true;
    bgm.volume = 0.5;
    bgm.play();

    requestAnimationFrame(update);

    //request animation
    requestAnimationFrame(update);

    //ดักจับการกระโดด
    document.addEventListener("keydown", movePlayer);

    //สร้าง box
    let img1 = new Image();
    img1.src = "police.png";

    let img2 = new Image();
    img2.src = "kuy99.png";


    boxImgs.push(img1);
    boxImgs.push(img2);
    


    randomBox();

}

   function randomBox() {

    if(gameOver){
        return;
    }

    createBox();

    let randomTime = Math.floor(Math.random() * 2000) + 1000;

    obstacleTimer = setTimeout(randomBox, randomTime);

    
}

//=======================
// Update
//=======================

function update() {

    requestAnimationFrame(update);

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // วาดพื้นหลัง
    context.drawImage(bgImg, 0, 0, boardWidth, boardHeight);


    velocityY += gravity;
    player.y = Math.min(player.y + velocityY, playerY);

    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    //Box
    for (let i = 0; i < boxesArray.length; i++) {

        let box = boxesArray[i];

        box.x += boxSpeed;

        context.drawImage(box.img, box.x, box.y, box.width, box.height);

    
        if (onCollision(player, box)) {

    hitSound.currentTime = 0;
    hitSound.play();

    life--;

    boxesArray.splice(i,1);

    player.y = playerY;
    velocityY = 0;

    if (life <= 0) {

        gameOver = true;

        clearTimeout(obstacleTimer);

        context.font = "bold 40px Arial";
        context.textAlign = "center";
        context.fillText("Game Over!", boardWidth / 2, 120);

        context.font = "bold 25px Arial";
        context.fillText("Final Score : " + score, boardWidth / 2, 170);

        return;
    }
 }
    }

    //คะแนน
   
    score++;
    context.font = "bold 20px Arial";
    context.textAlign = "left";
    context.fillText("Score : " + score, 0, 30);

    //3 ชีวิต
    context.font = "bold 20px Arial";
    context.textAlign = "left";
    context.fillText("Life : " + life, 0, 60);
    

    //จับเวลา
    time += 1 / 60;

    context.font = "normal bold 20px Arial";
    context.textAlign = "right";
    context.fillText("Time : " + time.toFixed(2), 790, 30);

    if (time >= 60) {

    gameOver = true;

    bgm.pause();

    clearTimeout(obstacleTimer);

    context.font = "bold 40px Arial";
    context.textAlign = "center";
    context.fillText("Time Up!", boardWidth / 2, 120);

    context.font = "bold 25px Arial";
    context.fillText("Final Score : " + score, boardWidth / 2, 170);

    return;
}

    

}

//=======================
// กระโดด
//=======================

function movePlayer(e) {

    bgm.play();

    if (gameOver) {
        return;
    }

    if (e.code == "Space" && player.y == playerY) {

    jumpSound.currentTime = 0;
    jumpSound.play();

    velocityY = -10;
 }

}
//=======================
// สร้างอุปสรรค
//=======================

function createBox() {

    if (gameOver) {
        return;
    }

    let randomImg = boxImgs[Math.floor(Math.random() * boxImgs.length)];

    let box = {
        img: randomImg,
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHeight
    };

    boxesArray.push(box);

    if (boxesArray.length > 5) {
        boxesArray.shift();
    }
}
    

    boxesArray.push(box);

    if(boxesArray.length > 5) {
        boxesArray.shift();
    }


function onCollision(obj1, obj2) {
    return obj1.x < (obj2.x + obj2.width) &&
           (obj1.x + obj1.width) > obj2.x && //ชนกันในแนวนอน
           obj1.y < (obj2.y + obj2.height) &&
           (obj1.y + obj1.height) > obj2.y; //ชนกันในแนวตั้ง
}

function restartGame() {

    if (life <= 0) {
        alert("เล่นลาบมาก");
        return;
    }

    location.reload();
}