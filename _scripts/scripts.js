// Some of the Code and Logic for player controls and movements were from the Crafty JS Asteroid Demo Game
// "use strict";
// Global Game Variable Object
var gameVar = {
	canvasScale: 0.6,
	canvasW: 0,
	canvasH: 0,
	canvasFollow: false,
	score: 0,
	initalHP: 100,
	hitPoint: 0,
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
	level: 0
};

gameVar.gameCanvas = document.getElementById('game');
gameVar.buttonStart = document.getElementById('btnStart');
gameVar.buttonNewLevel = document.getElementById('btnNewLevel');
gameVar.buttonReStart1 = document.getElementById('btnReStart1');
gameVar.buttonReStart2 = document.getElementById('btnReStart2');
gameVar.modalContainer = document.getElementById('modalSplash');
gameVar.splashStart = document.getElementById('splashStart');
gameVar.screenLevel = document.getElementById('splashLevel');
gameVar.splashEnd = document.getElementById('splashEnd');
gameVar.endOutput1 = document.getElementById('endOutput1');
gameVar.endOutput2 = document.getElementById('endOutput2');
gameVar.scoreOutput1 = document.getElementById('score1');
gameVar.scoreOutput2 = document.getElementById('score2');
gameVar.scoreDisplay = document.getElementById('score');
gameVar.hpDisplay = document.getElementById('hitPoint');

gameVar.hitPoint = gameVar.initalHP;
gameVar.hpDisplay.textContent = gameVar.hitPoint;

gameVar.canvasW = (Math.max(window.innerWidth || 0) * 0.975);
gameVar.canvasH =  (Math.max(window.innerHeight || 0) * 0.975);

function setSettings() {
	if (document.getElementById('canvasWidth').value === '') {
		gameVar.canvasW = Math.max(window.innerWidth || 0);
	} else {
		gameVar.canvasW = parseInt(document.getElementById('canvasWidth').value);
	}
	if (document.getElementById('canvasHeight').value === '') {
		gameVar.canvasH = Math.max(window.innerHeight || 0);
	} else {
		gameVar.canvasH = parseInt(document.getElementById('canvasHeight').value);
	}

	gameVar.canvasScale = parseFloat(document.getElementById('canvasScale').value);
	gameVar.canvasFollow = document.getElementById('viewportFollow').checked;
	gameVar.maxAsteroids = parseInt(document.getElementById('maxAsteroids').value);
	gameVar.maxAsteroidSpeed = parseInt(document.getElementById('maxAsteroidSpeed').value);
	gameVar.maxEnemies = parseInt(document.getElementById('maxEnemies').value);
	gameVar.maxEnemySpeed = parseInt(document.getElementById('maxEnemySpeed').value);
	gameVar.initalHP = parseInt(document.getElementById('hitPointPlayer').value);
	gameVar.hitPoint = gameVar.initalHP;
	gameVar.hpDisplay.textContent = gameVar.hitPoint;
	gameVar.hitPointEnemy = parseInt(document.getElementById('hitPointEnemy').value);
}

function addControls () {
    gameVar.buttonStart.addEventListener('click', newGame, false);
    gameVar.buttonReStart1.addEventListener('click', newGame, false);
	gameVar.buttonReStart2.addEventListener('click', newLevel, false);
    gameVar.buttonNewLevel.addEventListener('click', newLevel, false);
}

function removeControls() {
    gameVar.buttonStart.removeEventListener('click', newGame, false);
    gameVar.buttonReStart1.removeEventListener('click', newGame, false);
	gameVar.buttonReStart2.removeEventListener('click', newLevel, false);
    gameVar.buttonNewLevel.removeEventListener('click', newLevel, false);
}

// Function to start New Game and Reinitialize all parameters
function newGame() {
	removeControls();
	gameVar.modalContainer.style.opacity = '0';
	gameVar.gameCanvas.style.pointerEvents = 'auto';

	// Reset all game stats
	gameVar.score = 0;
	gameVar.asteroidCount = 0;
	gameVar.enemyCount = 0;
	gameVar.hitPoint = gameVar.initalHP;
	gameVar.level = 1;
	console.log("Canvas W: " + gameVar.canvasW );
	console.log("Canvas H: " + gameVar.canvasH );
	Crafty.init(gameVar.canvasW, gameVar.canvasH, gameVar.gameCanvas);
	// Start Level 1 game scene
	Crafty.scene('firstGame');
}

// Function to start second game level
function newLevel() {
	removeControls();
	gameVar.modalContainer.style.opacity = '0';
	gameVar.gameCanvas.style.pointerEvents = 'auto';

	// Reset all game stats
	gameVar.score = 0;
	gameVar.asteroidCount = 0;
	gameVar.enemyCount = 0;
	gameVar.hitPoint = gameVar.initalHP;
	gameVar.level = 2;

	Crafty.init(gameVar.canvasW, gameVar.canvasH, gameVar.gameCanvas);

	// Start Level 2 game scene
	Crafty.scene('secondGame');
}

// Function to exit game screen
function exitLevel() {
	// Set score for display for Level 1
	gameVar.scoreOutput1.textContent = gameVar.score;
	// Set message for display if WON or lOST
	if (gameVar.hitPoint <=0) {
		gameVar.endOutput1.textContent = "You LOST. You need more practice";
	} else {
		gameVar.endOutput1.textContent = "You WON. Try playing on a harder setting.";
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
	gameVar.scoreOutput2.textContent = gameVar.score;
	// Set message for display if WON or lOST
	if (gameVar.hitPoint <=0) {
		gameVar.endOutput2.textContent = "You LOST. You need more practice";
	} else {
		gameVar.endOutput2.textContent = "You WON. Try playing on a harder setting.";
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
