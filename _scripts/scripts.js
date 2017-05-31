// Some of the Code and Logic for player controls and movements were from the Crafty JS Asteroid Demo Game
// "use strict";
// Global Game Variable Object
var gameVar = {
	canvasW: 900,
	canvasH: 900,
	canvasScale: 1,
	canvasFollow: false,
	score: 0,
	hitPoint: 10,
    //keep a count of asteroids
    asteroidCount: 0,
    lastCount: 0,
	shipSize: 82,
	enemyL: 72,
	enemyS: 64,
	rockL: 150,
	rockM: 64,
	rockS: 32,
	maxAsteroids: 3,
	maxEnemies: 1,
	maxEnemySpeed: 5,
	maxAsteroidSpeed: 5,
	hitPointEnemy: 3
};

var theGame = document.getElementById('game');

function setSettings() {
	gameVar.canvasW = parseInt(document.getElementById('canvasWidth').value);
	gameVar.canvasH = parseInt(document.getElementById('canvasHeight').value);
	gameVar.canvasScale = parseInt(document.getElementById('canvasScale').value);
	gameVar.canvasFollow = document.getElementById('viewportFollow').checked;
	gameVar.maxAsteroids = parseInt(document.getElementById('maxAsteroids').value);
	gameVar.maxAsteroidSpeed = parseInt(document.getElementById('maxAsteroidSpeed').value);
	gameVar.maxEnemies = parseInt(document.getElementById('maxEnemies').value);
	gameVar.maxEnemySpeed = parseInt(document.getElementById('maxEnemySpeed').value);
	gameVar.hitPoint = parseInt(document.getElementById('hitPointPlayer').value);
	gameVar.hitPointEnemy = parseInt(document.getElementById('hitPointEnemy').value);
}

// window.onload = function gameStart() {
	// HTML Element variables
	// var buttonStart = $("btnStart");
	// var buttonReStart = $("btnReStart");
	// var modalContainer = $("modalSplash");
	// var splashStart = $("splashStart");
	// var splashEnd = $("splashEnd");
	// var theGame = $("game");

	var buttonStart = document.getElementById('btnStart');
	var buttonNewLevel = document.getElementById('btnNewLevel');
	var buttonReStart = document.getElementById('btnReStart');
	var modalContainer = document.getElementById('modalSplash');
	var splashStart = document.getElementById('splashStart');
	var screenLevel = document.getElementById('splashLevel');
	var splashEnd = document.getElementById('splashEnd');


	// buttonStart.click(function () {
	//     // modalContainer.css("opacity", "0");
	// 	// theGame.css("pointerEvents", "auto");
	//
	//     Crafty.enterScene("firstGame");
	// });
	//
	// buttonReStart.click(function () {
	//     // modalContainer.css("opacity", "0");
	// 	// theGame.css("pointerEvents", "auto");
	//
	// });

	function addControls () {
	    // buttonStart.addEventListener('click', startGame, false);
	    buttonStart.addEventListener('click', newLevel, false);
	    buttonReStart.addEventListener('click', newGame, false);
	    buttonNewLevel.addEventListener('click', newLevel, false);
	}

	function removeControls() {
	    // buttonStart.removeEventListener('click', startGame, false);
	    buttonStart.removeEventListener('click', newLevel, false);
	    buttonReStart.removeEventListener('click', newGame, false);
	    buttonNewLevel.removeEventListener('click', newLevel, false);
	}
	function startGame() {
		// splashStart.style.display = 'none';
		// theGame.style.display = 'flex';
		// modalContainer.style.display = 'none';
		modalContainer.style.opacity = '0';
		theGame.style.pointerEvents = 'auto';

	    removeControls();
	    //Initialize Game Canvas
	    Crafty.init(gameVar.canvasW, gameVar.canvasH, document.getElementById('game'));
	    Crafty.scene('firstGame');
	}

	// Function to start New Game and Reinitialize all parameters
	function newGame() {
		// splashEnd.style.display = 'none';
		// theGame.style.display = 'flex';
		modalContainer.style.opacity = '0';
		theGame.style.pointerEvents = 'auto';

		console.log("newGame fuction completed");

	    removeControls();
		Crafty.init(gameVar.canvasW, gameVar.canvasH, document.getElementById('game'));
	    Crafty.scene('firstGame');
	}

	// Function to start second game level
	function newLevel() {
	    modalContainer.style.opacity = '0';
		theGame.style.pointerEvents = 'auto';

	    removeControls();
	    Crafty.init(gameVar.canvasW, gameVar.canvasH, document.getElementById('game'));

	    // Start second game scene
	    Crafty.scene('secondGame');
	}

	// Function to exit game screen
	function exitLevel() {
	    splashStart.style.display = 'none';
		screenLevel.style.display = 'block';
		modalContainer.style.opacity = '1';
		theGame.style.pointerEvents = 'none';

	    addControls();
	}

	// Function to exit game screen
	function exitGame() {
	    splashStart.style.display = 'none';
		splashEnd.style.display = 'block';
		modalContainer.style.opacity = '1';
		theGame.style.pointerEvents = 'none';

	    addControls();
	}

	window.onload = addControls();
	// addControls();

// };
