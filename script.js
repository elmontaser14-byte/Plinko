const gameBoard = document.getElementById('game-board');
const playButton = document.getElementById('play-button');
const resultMessage = document.getElementById('result-message');

const boardRows = 8;
const boardColumns = 7;
const prizes = [100, 50, 10, 5, 10, 50, 100];

function drawBoard() {
    gameBoard.style.gridTemplateColumns = repeat(${boardColumns}, 1fr);
    gameBoard.innerHTML = '';

    for (let i = 0; i < (boardRows - 1) * boardColumns; i++) {
        const peg = document.createElement('div');
        peg.className = 'peg';
        gameBoard.appendChild(peg);
    }

    prizes.forEach(prize => {
        const prizeDiv = document.createElement('div');
        prizeDiv.className = 'prize';
        prizeDiv.textContent = ${prize};
        gameBoard.appendChild(prizeDiv);
    });
}

function simulateGame() {
    playButton.disabled = true;
    resultMessage.textContent = 'الكرة تسقط...';

    let ballPosition = Math.floor(boardColumns / 2);

    const interval = setInterval(() => {
        const direction = Math.random() < 0.5 ? -1 : 1;
        ballPosition += direction;

        if (ballPosition < 0) ballPosition = 0;
        if (ballPosition >= boardColumns) ballPosition = boardColumns - 1;

        clearInterval(interval);
        const finalPrize = prizes[ballPosition];
        resultMessage.textContent = لقد فزت بـ ${finalPrize} نقطة!;

        playButton.disabled = false;

        if (window.Telegram && Telegram.WebApp) {
            const result = {
                game: 'plinko',
                prize: finalPrize,
                timestamp: new Date().toISOString()
            };
            Telegram.WebApp.sendData(JSON.stringify(result));
        }
    }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
    drawBoard();
    playButton.addEventListener('click', simulateGame);
    
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.ready();
        Telegram.WebApp.MainButton.setText('اغلاق').show().onClick(() => Telegram.WebApp.close());
    }
});
