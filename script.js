'use strict'
const canvas = document.getElementById("game");
//平面的な2次元コンテキストを扱う-D描画宣言-canvas専用
const context = canvas.getContext("2d");

const keywords = [
  ".unshift()","string","undefined","class","const",
  "console.log()",".join()","let",".splice()","else",
  "else if","object","for","function","if",".toLowerCase()",
  "in",".toUpperCase()","boolean","!==","return","===",
  "switch","||","false","true","typeof",".push()","&&","null",
  ".length",".pop()",".shift()","Math.random()","math.floor()",
  ".innerText",".textContent","<input>"
];

let currentWord;
let typedWord = "";
let fallingWordY = 0;//落下中の文字のy座標(pixel)
let speed = 1.2;//[pixel/frame]
let stacked = [];//積み上がるwordを格納する
let gameOver = false;
const lineHeight = 30;

// ランダム単語を選ぶ
function randomWord(){
  return keywords[Math.floor(Math.random()*keywords.length)];
}

// 新しい単語を落とす準備
function selectWord(){
  currentWord = randomWord();
  typedWord = "";
  fallingWordY = 0;
}


// 積み上がった単語を描く
function drawStack(){
  context.font = "24px monospace";
  context.textAlign = "center";

  for(let i = 0; i < stacked.length; i++){
    const word = stacked[i];

    // 下から積み上げるY座標
    const stackWordY = canvas.height - lineHeight * (i + 1);

    context.fillStyle = "orange";
    context.fillText(word, canvas.width / 2, stackWordY);
  }
}

// 落ちてくる単語を描く
function drawFalling(){
  context.font = "24px monospace";
  context.textAlign = "center";

  for(let i = 0; i < currentWord.length; i++){
    const char = currentWord[i];
    const fallingWordX = canvas.width/2 - (currentWord.length*8) + i*16;

    if(i < typedWord.length){
      context.fillStyle = "lightblue"; // 正解した文字　みやすい色
    } else {
      context.fillStyle = "white";
    }

    //左下基準でx,y位置に文字を描画する
    context.fillText(char,fallingWordX,fallingWordY);
  }
}

// ゲーム画面を更新(1フレーム（1枚の絵)を１回実行される)
function update(){
  if(gameOver) return;

  //2次元描画コンテキストをクリアにする
  context.clearRect(0,0,canvas.width,canvas.height);

  //1フレーム分 y座標を更新する
  fallingWordY = fallingWordY + (speed * 1);

  //bottomから何px分積み上がっているか
  let stackHeight = stacked.length * lineHeight;

  //fontの基準位置が左下だから 行の高さ分引く
  let bottomLimit = canvas.height - stackHeight - lineHeight;

  // 床に着いたら積む
  if(fallingWordY >= bottomLimit){
    stacked.push(currentWord);

    // 積み上げすぎでゲームオーバー
    if(stacked.length * lineHeight >= canvas.height){
      gameOver = true;
      alert("Game Over\nScore: " + score);
      return;
    }

    selectWord();
  }

  drawStack();
  drawFalling();

  //1フレーム（1枚の絵)を１秒間に60回pdateを呼ぶ)
  requestAnimationFrame(update);
}

// キー入力処理ーkeydownが起きるたびに、この関数を1回実行
document.addEventListener("keydown", (event) => {

// ゲームオーバーなら何もしない
if (gameOver) return;

  // 押されたキーの文字を取得
  const keyName = event.key;
  console.log(currentWord);//undefinedバグ
//押されたキーが、typedWordに入る予定の文字と同じなら追加
if (keyName === currentWord[typedWord.length]) {
    typedWord = typedWord + keyName;

    if (typedWord === currentWord) {
      score+=10;
      document.getElementById("score").textContent = "Score: " + score;
      selectWord();
    }
  }
});


const startButton = document.getElementById("start-btn");

startButton.addEventListener("click", () => {
  startGame();
});

function startGame(){
  score = 0;
  stacked = [];
  gameOver = false;


  document.getElementById("score").textContent = "Score: 0";

  selectWord();
  update();
}
