// Some of the Code and Logic for player controls and movements were from the Crafty JS Asteroid Demo Game
// "use strict";
// Global Game Variable Object
var gameVar = {
	canvasW: 1200,
	canvasH: 900,
	canvasScale: 1,
	canvasFollow: false,
	score: 0,
	hitPoint: 10,
    //keep a count of asteroids
    asteroidCount: 0,
    enemyCount: 0,
	shipSize: 82,
	enemyL: 72,
	enemyS: 64,
	rockL: 150,
	rockM: 64,
	rockS: 32,
	maxAsteroids: 5,
	maxEnemies: 2,
	maxEnemySpeed: 2,
	maxAsteroidSpeed: 5,
	hitPointEnemy: 3
};

function setSettings() {
	gameVar.canvasW = parseInt(document.getElementById('canvasWidth').value);
	gameVar.canvasH = parseInt(document.getElementById('canvasHeight').value);
	gameVar.canvasScale = parseFloat(document.getElementById('canvasScale').value);
	gameVar.canvasFollow = document.getElementById('viewportFollow').checked;
	gameVar.maxAsteroids = parseInt(document.getElementById('maxAsteroids').value);
	gameVar.maxAsteroidSpeed = parseInt(document.getElementById('maxAsteroidSpeed').value);
	gameVar.maxEnemies = parseInt(document.getElementById('maxEnemies').value);
	gameVar.maxEnemySpeed = parseInt(document.getElementById('maxEnemySpeed').value);
	gameVar.hitPoint = parseInt(document.getElementById('hitPointPlayer').value);
	gameVar.hitPointEnemy = parseInt(document.getElementById('hitPointEnemy').value);
}

// window.onload = function gameStart() {

	var gameCanvas = document.getElementById('game');
	var buttonStart = document.getElementById('btnStart');
	var buttonNewLevel = document.getElementById('btnNewLevel');
	var buttonReStart1 = document.getElementById('btnReStart1');
	var buttonReStart2 = document.getElementById('btnReStart2');
	var modalContainer = document.getElementById('modalSplash');
	var splashStart = document.getElementById('splashStart');
	var screenLevel = document.getElementById('splashLevel');
	var splashEnd = document.getElementById('splashEnd');
	var endOutput1 = document.getElementById('endOutput1');
	var endOutput2 = document.getElementById('endOutput2');
	var scoreOutput1 = document.getElementById('score1');
	var scoreOutput2 = document.getElementById('score2');
	var scoreDisplay = document.getElementById('score');
	var hpDisplay = document.getElementById('hitPoint');
	hpDisplay.textContent = gameVar.hitPoint; 

	function addControls () {
	    buttonStart.addEventListener('click', newGame, false);
	    buttonReStart1.addEventListener('click', newGame, false);
		buttonReStart2.addEventListener('click', newLevel, false);
	    buttonNewLevel.addEventListener('click', newLevel, false);
	}

	function removeControls() {
	    buttonStart.removeEventListener('click', newGame, false);
	    buttonReStart1.removeEventListener('click', newGame, false);
		buttonReStart2.removeEventListener('click', newLevel, false);
	    buttonNewLevel.removeEventListener('click', newLevel, false);
	}

	// Function to start New Game and Reinitialize all parameters
	function newGame() {
		removeControls();
		modalContainer.style.opacity = '0';
		gameCanvas.style.pointerEvents = 'auto';

		// Reset all game stats
		gameVar.score = 0;
		gameVar.asteroidCount = 0;
		gameVar.enemyCount = 0;
		gameVar.hitPoint = parseInt(document.getElementById('hitPointPlayer').value);

		Crafty.init(gameVar.canvasW, gameVar.canvasH, gameCanvas);
		// Start Level 1 game scene
	    Crafty.scene('firstGame');
	}

	// Function to start second game level
	function newLevel() {
		removeControls();
	    modalContainer.style.opacity = '0';
		gameCanvas.style.pointerEvents = 'auto';

		// Reset all game stats
		gameVar.score = 0;
		gameVar.asteroidCount = 0;
		gameVar.enemyCount = 0;
		gameVar.hitPoint = parseInt(document.getElementById('hitPointPlayer').value);

	    Crafty.init(gameVar.canvasW, gameVar.canvasH, gameCanvas);

	    // Start Level 2 game scene
	    Crafty.scene('secondGame');
	}

	// Function to exit game screen
	function exitLevel() {
		// Set score for display for Level 1
		scoreOutput1.textContent = gameVar.score;
		// Set message for display if WON or lOST
		if (gameVar.hitPoint <=0) {
			endOutput1.textContent = "You LOST. You need more practice";
		} else {
			endOutput1.textContent = "You WON. Try playing on a harder setting.";
		}
		splashStart.style.display = 'none';
		screenLevel.style.display = 'block';
		splashEnd.style.display = 'none';
		modalContainer.style.opacity = '1';
		gameCanvas.style.pointerEvents = 'none';

	    addControls();
	}

	// Function to exit game screen
	function exitGame() {
		// Set score for display for Level 2
		scoreOutput2.textContent = gameVar.score;
		// Set message for display if WON or lOST
		if (gameVar.hitPoint <=0) {
			endOutput2.textContent = "You LOST. You need more practice";
		} else {
			endOutput2.textContent = "You WON. Try playing on a harder setting.";
		}
	    splashStart.style.display = 'none';
		screenLevel.style.display = 'none';
		splashEnd.style.display = 'block';
		modalContainer.style.opacity = '1';
		gameCanvas.style.pointerEvents = 'none';

	    addControls();
	}

	// window.onload = setSettings();
	window.onload = addControls();
	// addControls();

// };
