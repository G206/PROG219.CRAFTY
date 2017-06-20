// "use strict";

Crafty.defineScene('secondGame', function() {
	console.log('Level 2 Game Called');
	// Background - Space
    // Crafty.background("url('_images/galaxy.jpg') no-repeat center");
	// gameCanvas.style.backgroundSize = "cover";
	var backgroundAsset = Crafty.e('ImageObject, Image')
		.image("_images/star.png");

	Crafty.viewport.clampToEntities = false;
	// Crafty.viewport.scale(gameVar.canvasScale);
	if (gameVar.canvasFollow) {
		Crafty.viewport.follow(player, 0, 0);
	}

	// Variable to store initial player X & Y random position
	gameVar.playerX = Crafty.viewport.width * ((Math.random() * 0.6) + 0.2);
	gameVar.playerY = Crafty.viewport.height * ((Math.random() * 0.6) + 0.2);

	// Player Entity
	var player = Crafty.e('PlayerShip, ship')
		// Origin function changes the center point of move / rotation function. This allows for rotation to happen from the x / y center point of the sprite vs. the upper left point.
		.attr({
			w: gameVar.shipSize * gameVar.canvasScale,
			h: gameVar.shipSize * gameVar.canvasScale
		})
		.origin('center')
		.bind('KeyDown', function(e) {
			// Function for WARP Key
    		if (e.keyCode === Crafty.keys.SPACE) {
				console.log('Warp Out');
				Crafty.audio.play('warpout');
				// Random X & Y - Greater Canvas Area for Warping
				gameVar.playerX = Crafty.viewport.width * ((Math.random() * 0.7) + 0.2);
				gameVar.playerY = Crafty.viewport.height * ((Math.random() * 0.7) + 0.2);

				// Warp player to new X & Y
				this.x = gameVar.playerX;
				this.y = gameVar.playerY;
			}
    	});

		//Asteroid component
	    Crafty.c('asteroid', {
	        init: function() {
	            this.requires('Actor, Rock, Collision');
	            this.collision()
	            // Collision with ship damages ship and destroys asteroid
	            .onHit('ship', function(e) {
					console.log('Ship Collision at Asteroid Level');

					// Play Collision Audio
					Crafty.audio.play('collision');
					// if destroyed by ship collision increment the score, decrease HP
					gameVar.score += 1;
					gameVar.scoreDisplay.textContent = gameVar.score;
					gameVar.hitPoint -= 1;
					gameVar.hpDisplay.textContent = gameVar.hitPoint;

					// End Game if HP is at 0
					if (gameVar.hitPoint <= 0) {
						player.destroy();
						exitCurrentLevel();
					}

	                var size;
					//decide what size to make the asteroid
	                if(this.has('rock_L')) {
	                    this.removeComponent('rock_L').addComponent('rock_M');
						this.attr({
							w: gameVar.rockM * gameVar.canvasScale,
							h: gameVar.rockM * gameVar.canvasScale
						});
	                    size = 'rock_M';
	                } else if(this.has('rock_M')) {
	                    this.removeComponent('rock_M').addComponent('rock_S');
						this.attr({
							w: gameVar.rockS * gameVar.canvasScale,
							h: gameVar.rockS * gameVar.canvasScale
						});
	                    size = 'rock_S';
	                } else if(this.has('rock_S')) {
						//if the lowest size, delete self and decrease total Asteroid Count
	                    this.destroy();
						gameVar.asteroidCount --;
						// End Level if both Asteroid and Enemy count is at 0
		                if (gameVar.asteroidCount <= 0 && gameVar.enemyCount <= 0) {
		                    exitCurrentLevel();
		                }
	                    return;
	                }
	                var oldxspeed = this.xspeed;
	                this.xspeed = -this.yspeed;
	                this.yspeed = oldxspeed;

	                gameVar.asteroidCount ++;
	                //split into two asteroids by creating another asteroid
	                Crafty.e('2D, Canvas, '+size+', Collision, asteroid').attr({x: this._x, y: this._y});
	            });
	        }
	    });

	//Enemy component
	Crafty.c('EnemyShip', {
		init: function() {
			this.requires('Actor, Enemy, Collision');
			this.bind('EnterFrame', function() {
				// Variable to determine which direction to go to find player
				var distanceX = 0;
				var distanceY = 0;

	            if (this.y>player.y)
	            {
	                distanceY = -this.yspeed;
	            }
	            if (this.y<player.y)
	            {
	                distanceY = this.yspeed;
	            }
	            if (this.x>player.x)
	            {
	                distanceX = -this.xspeed;
	            }
	            if (this.x<player.x)
	            {
	                distanceX = +this.xspeed;
	            }
	            this.x = this.x + distanceX;
	            this.y = this.y + distanceY;

				// Determines variable to use for different ship sizes
				var enemySize;
				if (this.has('enemyL_g') || this.has('enemyL_b')) {
					enemySize = gameVar.enemyL;
				} else if (this.has('enemyS_b') || this.has('enemyS_r')) {
					enemySize = gameVar.enemyS;
				}
				// Determines when to go off screen and reapear on the other side of the canvas
				if(this._x > Crafty.viewport.width) {
					this.x = -enemySize;
				}
				if(this._x < -enemySize) {
					this.x =  Crafty.viewport.width;
				}
				if(this._y > Crafty.viewport.height) {
					this.y = -enemySize;
				}
				if(this._y < -enemySize) {
					this.y = Crafty.viewport.height;
				}
			});
			this.collision()
			// Collision with ship damages ship and decreases enemy HP. If at 0, destroys itself
			.onHit('ship', function(e) {
				console.log('Ship Collision with Enemy');
				// if destroyed by ship collision increment the score, decrease HP
				gameVar.score += 1;
				gameVar.scoreDisplay.textContent = gameVar.score;
				gameVar.hitPoint -= 1;
				gameVar.hpDisplay.textContent = gameVar.hitPoint;
				// Play Collision Audio
				Crafty.audio.play('collision');
				// Enemy looses HP and if at 0, is destroyed
				this.hp -= 1;
				if (this.hp <= 0) {
					this.destroy();
					// if destroyed by a missile increment the score
					gameVar.score += 1;
					gameVar.scoreDisplay.textContent = gameVar.score;
					// Decrease total enemy count
					gameVar.enemyCount --;
					// End Level if both Asteroid and Enemy count is at 0
					if (gameVar.asteroidCount <= 0 && gameVar.enemyCount <= 0) {
						exitCurrentLevel();
					}
				}
				// End Game if HP is at 0
				if (gameVar.hitPoint <= 0) {
					player.destroy();
					exitCurrentLevel();
				}
			});
		}
	});

	//Enemy Large component
	Crafty.c('EnemyShipL', {
		init: function() {
			this.requires('Actor, EnemyShip');
			this.attr({
	            hp: gameVar.hitPointEnemy
			});
		}
	});

	//Enemy Small component
	Crafty.c('EnemyShipS', {
		init: function() {
			this.requires('Actor, EnemyShip');
			this.attr({
				hp: 1
			});
		}
	});

    //function to fill the screen with asteroids & PowerUps by a random amount
    function initRocks(lower, upper) {
		if (upper < lower) {
			upper = lower;
		}
        var rocks = Crafty.math.randomInt(lower, upper);
		console.log("Initialize Asteroids: " + rocks);
        gameVar.asteroidCount = rocks;

		for(let i = 0; i < rocks; i++) {
            Crafty.e('rock_L, asteroid')
			.attr({
				w: gameVar.rockL * gameVar.canvasScale,
				h: gameVar.rockL * gameVar.canvasScale
			});
        }
		for(let i = 0; i < Math.floor(rocks/3); i++) {
            Crafty.e('starPower, PowerUp')
			.attr({
				w: gameVar.powerUpSize * gameVar.canvasScale,
				h: gameVar.powerUpSize * gameVar.canvasScale
			});
        }
    }

	// function to fill screen with Large Enemy Ships
	function initEnemyL(type, lower, upper) {
		if (upper < lower) {
			upper = lower;
		}
		var enemies = Crafty.math.randomInt(lower, upper);
		console.log("Initialize Enemies L: " + enemies + " " + type);
		gameVar.enemyCount += enemies;

        for(let i = 0; i < enemies; i++) {
            Crafty.e(type + ', EnemyShipL')
			.attr({
				w: gameVar.enemyL * gameVar.canvasScale,
				h: gameVar.enemyL * gameVar.canvasScale
			});
        }
	}
	// function to fill screen with Small Enemy Ships
	function initEnemyS(type, lower, upper) {
		if (upper < lower) {
			upper = lower;
		}
		var enemies = Crafty.math.randomInt(lower, upper);
		console.log("Initialize Enemies S: " + enemies + " " + type);
		gameVar.enemyCount += enemies;

        for(let i = 0; i < enemies; i++) {
            Crafty.e(type + ', EnemyShipS')
			.attr({
				w: gameVar.enemyS * gameVar.canvasScale,
				h: gameVar.enemyS * gameVar.canvasScale
			});
        }
	}

	// Function to add Second Player Ship
	function initShip2() {
		Crafty.e('shipRed, Ship2')
		.attr({
			w: gameVar.shipSize * gameVar.canvasScale,
			h: gameVar.shipSize * gameVar.canvasScale
		})
		.collision()
		// Collision with ship Powers Up HP
		.onHit('ship', function(e) {
			console.log('Ship PU Ship 2');
			// if destroyed by ship collision increment the score, decrease HP
			gameVar.score += 1;
			gameVar.scoreDisplay.textContent = gameVar.score;

			// Play Collision Audio
			Crafty.audio.play('warpout');

			this.destroy();
			player.destroy();
			player = Crafty.e('PlayerShip, ship')
				.attr({
					w: gameVar.shipSize * gameVar.canvasScale,
					h: gameVar.shipSize * gameVar.canvasScale
				})
				.origin('center');
			var secondShip = Crafty.e('PlayerShip, shipRed')
				.attr({
					w: gameVar.shipSize * gameVar.canvasScale,
					h: gameVar.shipSize * gameVar.canvasScale
				})
				.origin('center')
				.attr({
					// x & y are set to player location
					x: player.x + (gameVar.shipSize * gameVar.canvasScale),
					y: player.y + (gameVar.shipSize * gameVar.canvasScale)
				});
			if (gameVar.canvasFollow) {
				Crafty.viewport.follow(player, 0, 0);
			}
		});
	}

	//Second level has between 1 or 2 and variable # specified by the Game Settings
    initRocks(2, gameVar.maxAsteroids);
	initEnemyL('enemyL_g', 1, gameVar.maxEnemies);
	initEnemyL('enemyL_b', 1, gameVar.maxEnemies);
	initEnemyS('enemyS_r', 1, gameVar.maxEnemies);
	initEnemyS('enemyS_b', 1, gameVar.maxEnemies);
	// ADD Second Ship
	initShip2();

});
