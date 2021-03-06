// Some of the Code and Logic for player controls and movements were from the Crafty JS Asteroid Demo Game
// "use strict";
// Global Game Variable Object
var gameVar = {
	canvasScale: 0.6,
	canvasW: 0,
	canvasH: 0,
	score: 0,
	score2: 0,
	initalHP: 10,
	hitPoint: 0,
	hitPoint2: 0,
	//keep a count of asteroids
	asteroidCount: 0,
	enemyCount: 0,
	shipSize: 78,
	missleW: 16,
	missleH: 28,
	enemyL: 72,
	enemyS: 64,
	rockL: 150,
	rockM: 64,
	rockS: 32,
	powerUpSize: 42,
	maxAsteroids: 5,
	maxEnemies: 2,
	maxEnemySpeed: 2,
	maxAsteroidSpeed: 5,
	hitPointEnemy: 3,
	playerX: 0,
	playerY: 0,
	level: 0,
	canvasFollow: false,
	ship2_180: false,
	ship2_reverse: false,
	ship2_independent: false,
	onePlayer: true,
	twoPlayer: false,
	VSMode: false,
	VSModeHP: 25,
	firstTime: true,
	shipFW1: 'shipFW1',
	shipFW2: 'shipFW2',
	shipMLR1: 'shipMLR1',
	shipMLR2: 'shipMLR2',
	shipMLRR: 'shipMLRR',
	shipMLRI: 'shipMLRI',
	shipMF1: 'shipMF1',
	shipMF2: 'shipMF2',
	player1: 'playerOne',
	player2: 'playerTwo'
};

gameVar.gameCanvas = document.getElementById('game');
gameVar.buttonStart = document.getElementById('btnStart');
gameVar.buttonPractice = document.getElementById('btnPracticeLevel');
gameVar.buttonNewLevel = document.getElementById('btnNewLevel');
gameVar.buttonReStart1 = document.getElementById('btnReStart1');
gameVar.buttonReStart2 = document.getElementById('btnReStart2');
gameVar.modalContainer = document.getElementById('modalSplash');
gameVar.splashStart = document.getElementById('splashStart');
gameVar.screenLevel = document.getElementById('splashLevel');
gameVar.splashEnd = document.getElementById('splashEnd');
gameVar.endOutput1 = document.getElementById('endOutput1');
gameVar.endOutput2 = document.getElementById('endOutput2');
gameVar.scoreOutputL1_1 = document.getElementById('scoreL1_1');
gameVar.scoreOutputL2_1 = document.getElementById('scoreL2_1');
gameVar.scoreOutputL1_2 = document.getElementById('scoreL1_2');
gameVar.scoreOutputL2_2 = document.getElementById('scoreL2_2');
gameVar.scoreDisplay = document.getElementById('scoreL');
gameVar.scoreDisplay2 = document.getElementById('scoreL2');
gameVar.hpDisplay = document.getElementById('hitPoint');
gameVar.hpDisplay2 = document.getElementById('hitPoint2');

gameVar.canvasW = (Math.max(window.innerWidth || 0) * 0.975);
gameVar.canvasH =  (Math.max(window.innerHeight || 0) * 0.96);


// Function to update HitPoint stats
function upDateHP(playerNo, amount) {
	switch (playerNo) {
		case 1:
			gameVar.hitPoint = gameVar.hitPoint + amount;
			gameVar.hpDisplay.textContent = gameVar.hitPoint;
			break;
		case 2:
			gameVar.hitPoint2 = gameVar.hitPoint2 + amount;
			gameVar.hpDisplay2.textContent = gameVar.hitPoint2;
			break;
		default:
			break;
	}
}

// Function to update HitPoint stats
function upDateScore(playerNo, amount) {
	switch (playerNo) {
		case 1:
			gameVar.score = gameVar.score + amount;
			gameVar.scoreDisplay.textContent = gameVar.score;
			break;
		case 2:
			gameVar.score2 = gameVar.score2 + amount;
			gameVar.scoreDisplay2.textContent = gameVar.score2;
			break;
		default:
			break;
	}
}

// Function to return current HP
function returnHP(playerNo) {
	switch (playerNo) {
		case 1:
			return gameVar.hitPoint;
		case 2:
			return gameVar.hitPoint2;
		default:
			break;
	}
}

function setMode() {
	gameVar.onePlayer = document.getElementById('1P').checked;
	gameVar.twoPlayer = document.getElementById('2P').checked;
	if (gameVar.twoPlayer) {
		gameVar.VSMode = true;
		gameVar.initalHP = gameVar.VSModeHP;
	}
	gameVar.hitPoint = gameVar.initalHP;
	gameVar.hitPoint2 = gameVar.initalHP;
	gameVar.hpDisplay.textContent = gameVar.hitPoint;
	gameVar.hpDisplay2.textContent = gameVar.hitPoint2;
}

function setSettings() {
	if (document.getElementById('canvasWidth').value === '') {
		gameVar.canvasW = (Math.max(window.innerWidth || 0) * 0.975);
	} else {
		gameVar.canvasW = parseInt(document.getElementById('canvasWidth').value);
	}
	if (document.getElementById('canvasHeight').value === '') {
		gameVar.canvasH = (Math.max(window.innerHeight || 0) * 0.95);
	} else {
		gameVar.canvasH = parseInt(document.getElementById('canvasHeight').value);
	}

	gameVar.canvasScale = parseFloat(document.getElementById('canvasScale').value);
	// Verify if VS Mode before changing settings
	if (gameVar.firstTime) {
		setMode();
	}
	if (!gameVar.VSMode) {
		gameVar.canvasFollow = document.getElementById('viewportFollow').checked;
		gameVar.ship2_180 = document.getElementById('ship2_180').checked;
		gameVar.ship2_reverse = document.getElementById('ship2_reverse').checked;
		gameVar.ship2_independent = document.getElementById('ship2_independent').checked;
	}

	gameVar.maxAsteroids = parseInt(document.getElementById('maxAsteroids').value);
	gameVar.maxAsteroidSpeed = parseInt(document.getElementById('maxAsteroidSpeed').value);
	gameVar.maxEnemies = parseInt(document.getElementById('maxEnemies').value);
	gameVar.maxEnemySpeed = parseInt(document.getElementById('maxEnemySpeed').value);
	gameVar.initalHP = parseInt(document.getElementById('hitPointPlayer').value);
	gameVar.VSModeHP = gameVar.initalHP;
	gameVar.hitPoint = gameVar.initalHP;
	gameVar.hitPoint2 = gameVar.initalHP;
	gameVar.hpDisplay.textContent = gameVar.hitPoint;
	gameVar.hitPointEnemy = parseInt(document.getElementById('hitPointEnemy').value);
}

function addControls () {
    gameVar.buttonStart.addEventListener('click', gameLevel1, false);
    gameVar.buttonPractice.addEventListener('click', gameLevel1, false);
	gameVar.buttonReStart1.addEventListener('click', gameLevel1, false);
	gameVar.buttonReStart2.addEventListener('click', gameLevel2, false);
    gameVar.buttonNewLevel.addEventListener('click', gameLevel2, false);
}

function removeControls() {
    gameVar.buttonStart.removeEventListener('click', gameLevel1, false);
    gameVar.buttonPractice.removeEventListener('click', gameLevel1, false);
	gameVar.buttonReStart1.removeEventListener('click', gameLevel1, false);
	gameVar.buttonReStart2.removeEventListener('click', gameLevel2, false);
    gameVar.buttonNewLevel.removeEventListener('click', gameLevel2, false);
}

// Function to reset game variables
function resetGame() {
	gameVar.modalContainer.style.opacity = '0';
	gameVar.gameCanvas.style.pointerEvents = 'auto';

	// Reset all game stats
	if (gameVar.VSMode) {
		gameVar.score2 = 0;
		gameVar.scoreDisplay2.textContent = gameVar.score2;
		gameVar.hitPoint2 = gameVar.initalHP;
		gameVar.hpDisplay2.textContent = gameVar.hitPoint2;
	}
	gameVar.score = 0;
	gameVar.scoreDisplay.textContent = gameVar.score;
	gameVar.hitPoint = gameVar.initalHP;
	gameVar.hpDisplay.textContent = gameVar.hitPoint;
	gameVar.asteroidCount = 0;
	gameVar.enemyCount = 0;
}
// Function to start New Game and Reinitialize all parameters
function gameLevel1() {
	if (gameVar.firstTime) {
		gameVar.firstTime = false;
		setMode();
	}

	removeControls();
	resetGame();
	gameVar.level = 1;
	Crafty.init(gameVar.canvasW, gameVar.canvasH, gameVar.gameCanvas);
	// Start Level 1 game scene
	Crafty.scene('Game');
}

// Function to start second game level
function gameLevel2() {
	removeControls();
	resetGame();
	gameVar.level = 2;
	Crafty.init(gameVar.canvasW, gameVar.canvasH, gameVar.gameCanvas);
	// Start Level 2 game scene
	Crafty.scene('Game');
}

// Function to exit game screen
function exitLevel() {
	// Set score for display for Level 1
	gameVar.scoreOutputL1_1.textContent = gameVar.score;
	gameVar.scoreOutputL1_2.textContent = gameVar.score2;
	// Set message for display if WON or lOST
	if (gameVar.VSMode) {
		if (gameVar.score > gameVar.score2) {
			if (gameVar.hitPoint > gameVar.hitPoint2) {
				gameVar.endOutput1.textContent = "Player 1 WON!";
			} else {
				gameVar.endOutput1.textContent = "Player 2 WON since Player 1 DIED!";
			}
		} else if (gameVar.score < gameVar.score2) {
			if (gameVar.hitPoint < gameVar.hitPoint2) {
				gameVar.endOutput1.textContent = "Player 2 WON!";
			} else {
				gameVar.endOutput1.textContent = "Player 1 WON since Player 2 DIED!";
			}
		} else {
			if (gameVar.hitPoint > gameVar.hitPoint2) {
				gameVar.endOutput1.textContent = "Player 1 WON since Player 2 DIED!";
			} else {
				gameVar.endOutput1.textContent = "Player 2 WON since Player 1 DIED!";
			}
		}
	} else {
		if (gameVar.hitPoint <=0) {
			gameVar.endOutput1.textContent = "You LOST. You need more practice";
		} else {
			gameVar.endOutput1.textContent = "You WON. Try playing on a harder setting.";
		}
	}

	gameVar.splashStart.style.display = 'none';
	gameVar.screenLevel.style.display = 'block';
	gameVar.splashEnd.style.display = 'none';
	gameVar.modalContainer.style.opacity = '1';
	gameVar.gameCanvas.style.pointerEvents = 'none';

    addControls();
}

// Function to exit game screen
function exitGame() {
	// Set score for display for Level 2
	gameVar.scoreOutputL2_1.textContent = gameVar.score;
	gameVar.scoreOutputL2_2.textContent = gameVar.score2;

	// Set message for display if WON or lOST
	if (gameVar.VSMode) {
		if (gameVar.score > gameVar.score2) {
			if (gameVar.hitPoint > gameVar.hitPoint2) {
				gameVar.endOutput2.textContent = "Player 1 WON!";
			} else {
				gameVar.endOutput2.textContent = "Player 2 WON since Player 1 DIED!";
			}
		} else if (gameVar.score < gameVar.score2) {
			if (gameVar.hitPoint < gameVar.hitPoint2) {
				gameVar.endOutput2.textContent = "Player 2 WON!";
			} else {
				gameVar.endOutput2.textContent = "Player 1 WON since Player 2 DIED!";
			}
		} else {
			if (gameVar.hitPoint > gameVar.hitPoint2) {
				gameVar.endOutput2.textContent = "Player 1 WON since Player 2 DIED!";
			} else {
				gameVar.endOutput2.textContent = "Player 2 WON since Player 1 DIED!";
			}
		}
	} else {
		if (gameVar.hitPoint <=0) {
			gameVar.endOutput2.textContent = "You LOST. You need more practice";
		} else {
			gameVar.endOutput2.textContent = "You WON. Try playing on a harder setting.";
		}
	}
	gameVar.splashStart.style.display = 'none';
	gameVar.screenLevel.style.display = 'none';
	gameVar.splashEnd.style.display = 'block';
	gameVar.modalContainer.style.opacity = '1';
	gameVar.gameCanvas.style.pointerEvents = 'none';

addControls();
}

// Function to exit current game level based on which level you're in
function exitCurrentLevel() {
	switch (gameVar.level) {
		case 1:
			exitLevel();
			break;
		case 2:
			exitGame();
			break;
		default:
			break;
	}
}

window.onload = addControls();
