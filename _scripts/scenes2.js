// "use strict";

Crafty.defineScene('secondGame', function() {
	// Background - Space
    // Crafty.background("url('_images/galaxy.jpg') no-repeat center");
	// theGame.style.backgroundSize = "cover";
	var backgroundAsset = Crafty.e('ImageObject, Image')
		.image("_images/star.png");

	// Variable to store initial player X & Y random position
	var playerX = Crafty.viewport.width * ((Math.random() * 0.6) + 0.2);
	var playerY = Crafty.viewport.height * ((Math.random() * 0.6) + 0.2);

    //score display
    var score = Crafty.e('2D, DOM, Text')
        .text('Score: 0')
        .attr({x: Crafty.viewport.width - 125, y: Crafty.viewport.height - 50, w: 200, h:50})
        .textColor('gold')
		.textFont({
			size: '1.25em',
			weight: 'bold',
			family: 'Rockwell'
		});
    //Hit Point display
    var hitPoint = Crafty.e('2D, DOM, Text')
        .text('Hit Point: 10')
        .attr({x: Crafty.viewport.width - 125, y: Crafty.viewport.height - 25, w: 200, h:50})
        .textColor('red')
		.textFont({
			size: '1.25em',
			weight: 'bold',
			family: 'Rockwell'
		});

    var player = Crafty.e('Actor, ship, Collision')
        .attr({
            x:playerX,
    		y:playerY,
    		// w:20,
    		// h:40,
            // Move object is a collection of possible move property values to determine what actions are allowed and bound to keyboard action.
    		move: {left: false, right: false, up: false, down: false},
            // xspeed and yspeed is used determine speed of the player object. Starts at 0 stationary
    		xspeed: 0,
    		yspeed: 0,
    		decay: 0.99, // Variable to control rate of slow down when forward move is stopped. Higher value adds more perpetual motion. 1 value is no slow down.
    	})
        // .color('blue')
        // Origin function changes the center point of move / rotation function. This allows for rotation to happen from the x / y center point of the sprite vs. the upper left point.
        .origin('center')
        // Bind keyboard down press event to call move functions - boolean true triggers function
        .bind('KeyDown', function(e) {
    		//on keydown, set the move booleans
    		if(e.keyCode === Crafty.keys.RIGHT_ARROW) {
    			this.move.right = true;
    		} else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
    			this.move.left = true;
    		} else if(e.keyCode === Crafty.keys.UP_ARROW) {
    			this.move.up = true;
    		} else if (e.keyCode === Crafty.keys.SPACE) {
    			console.log('Missile Fire');
				Crafty.audio.play('blast');

    			//create a missile entity
    			Crafty.e('2D, Canvas, missile')
				.attr({
					x: this._x + 40,
					y: this._y + 40,
					// w: 15,
					// h: 15,
					rotation: this._rotation,
                    // Speed of the missile - BOTH X & Y needs to match
					xspeed: 15 * Math.sin(this._rotation / 57.3),
					yspeed: 15 * Math.cos(this._rotation / 57.3)
				})
				// .color('rgb(255, 0, 0)')
				// Binds action to EnterFrame event function in Crafty.js
				.bind('EnterFrame', function() {
					this.x += this.xspeed;
					this.y -= this.yspeed;

					//destroy if it goes out of bounds
					if (gameVar.canvasFollow) {
						// This takes into account if the viewport Followme option is tured on. Viewport border changes with player movement. Missile will self destroy with constant border change.
						if(this._x > (player.x + (Crafty.viewport.width/2)) || this._x < (player.x - (Crafty.viewport.width/2)) || this._y > (player.y + (Crafty.viewport.height/2)) || this._y < (player.y - (Crafty.viewport.height/2))) {
    						this.destroy();
    					}
					} else {
						// Boarder's are fixed.
						if(this._x > Crafty.viewport.width || this._x < 0 || this._y > Crafty.viewport.height || this._y < 0) {
							this.destroy();
						}
					}
				});
			// Function for WARP Key
    		} else if (e.keyCode === Crafty.keys.W) {
				console.log('Warp Out');
				Crafty.audio.play('warpout');
				// Random X & Y - Greater Canvas Area for Warping
				playerX = Crafty.viewport.width * ((Math.random() * 0.7) + 0.2);
				playerY = Crafty.viewport.height * ((Math.random() * 0.7) + 0.2);

				// Warp player to new X & Y
				this.x = playerX;
				this.y = playerY;
			}
    	})
    	// Bind keyboard up press event to stop move functions - boolean false triggers stop
    	.bind('KeyUp', function(e) {
    		//on key up, set the move booleans to false
    		if(e.keyCode === Crafty.keys.RIGHT_ARROW) {
    			this.move.right = false;
    		} else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
    			this.move.left = false;
    		} else if(e.keyCode === Crafty.keys.UP_ARROW) {
    			this.move.up = false;
    		}
    	})
    	// Binds action to EnterFrame event function in Crafty.js
    	// Combined with keyboard events, this is how the player is moved around the screen
    	.bind('EnterFrame', function() {
    		if(this.move.right) this.rotation += 5;
    		if(this.move.left) this.rotation -= 5;

    		//acceleration and movement vector
    		var vx = Math.sin(this._rotation * Math.PI / 180) * 0.3,
    			vy = Math.cos(this._rotation * Math.PI / 180) * 0.3;

    		//if the move up is true, increment the y/xspeeds
    		if(this.move.up) {
    			this.yspeed -= vy;
    			this.xspeed += vx;
    		} else {
    			//if released, slow down the ship
    			this.xspeed *= this.decay;
    			this.yspeed *= this.decay;
    		}

    		//move the ship by the x and y speeds or movement vector
    		this.x += this.xspeed;
    		this.y += this.yspeed;
			// Crafty.viewport.centerOn(this,200);

    		//if ship goes out of bounds, put him back
    		if(this._x > Crafty.viewport.width) {
    			this.x = -gameVar.shipSize;
    		}
    		if(this._x < -gameVar.shipSize) {
    			this.x =  Crafty.viewport.width;
    		}
    		if(this._y > Crafty.viewport.height) {
    			this.y = -gameVar.shipSize;
    		}
    		if(this._y < -gameVar.shipSize) {
    			this.y = Crafty.viewport.height;
    		}
    	})
        .collision()
        // Collision with Asteroid if HP is at 0 ends game
        .onHit('asteroid', function() {
            console.log("Ship Collision at Ship Level");
        });

    //Asteroid component
    Crafty.c('asteroid', {
        init: function() {
            this.requires('Actor, Rock, Collision');
            this.collision()
            // Collision with Missile destroys asteroid
            .onHit('missile', function(e) {
				console.log('Missile Hits Aseroid');
                // if hit by a missile increment the score
                gameVar.score += 1;
                score.text('Score: '+ gameVar.score);
				// Play Explosion Audio
				Crafty.audio.play('explosion');
				//destroy the missile
                e[0].obj.destroy();

                var size;
                //decide what size to make the asteroid
                if(this.has('rock_L')) {
                    this.removeComponent('rock_L').addComponent('rock_M');
                    size = 'rock_M';
                } else if(this.has('rock_M')) {
                    this.removeComponent('rock_M').addComponent('rock_S');
                    size = 'rock_S';
                } else if(this.has('rock_S')) {
					//if the lowest size, delete self and decrease total Asteroid Count
                    this.destroy();
					gameVar.asteroidCount --;
					// End Level if both Asteroid and Enemy count is at 0
	                if (gameVar.asteroidCount <= 0 && gameVar.enemyCount <= 0) {
	                    exitGame();
	                }
                    return;
                }

                var oldxspeed = this.xspeed;
                this.xspeed = -this.yspeed;
                this.yspeed = oldxspeed;

                gameVar.asteroidCount++;
                //split into two asteroids by creating another asteroid
                Crafty.e('2D, Canvas, '+size+', Collision, asteroid').attr({x: this._x, y: this._y});
            })
            // Collision with ship damages ship and destroys asteroid
            .onHit('ship', function(e) {
				console.log('Ship Collision');
                // if destroyed by ship collision increment the score, decrease HP
                gameVar.score += 1;
                score.text('Score: '+ gameVar.score);
                gameVar.hitPoint -= 1;
                hitPoint.text('HitPoint: '+ gameVar.hitPoint);
				// Play Collision Audio
				Crafty.audio.play('collision');

                // End Game if HP is at 0
                if (gameVar.hitPoint <= 0) {
                    exitGame();
                }

                var size;
                //decide what size to make the asteroid
                if(this.has('rock_L')) {
                    this.removeComponent('rock_L').addComponent('rock_M');
                    size = 'rock_M';
                } else if(this.has('rock_M')) {
                    this.removeComponent('rock_M').addComponent('rock_S');
                    size = 'rock_S';
                } else if(this.has('rock_S')) {
					//if the lowest size, delete self and decrease total Asteroid Count
                    this.destroy();
					gameVar.asteroidCount --;
					// End Level if both Asteroid and Enemy count is at 0
	                if (gameVar.asteroidCount <= 0 && gameVar.enemyCount <= 0) {
	                    exitGame();
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
			// Collision with Missile destroys decreases enemy HP. If at 0, destroys itself
			.onHit('missile', function(e) {
				console.log('Missile Hits Enemy');
				// if hit by a missile increment the score
				gameVar.score += 1;
				score.text('Score: '+ gameVar.score);
				// Play Explosion Audio
				Crafty.audio.play('explosion');
				//destroy the missile
				e[0].obj.destroy();
				// Enemy looses HP and if at 0, is destroyed
				this.hp -= 1;
				if (this.hp <= 0) {
					this.destroy();
					// Decrease total enemy count
					gameVar.enemyCount --;
					// End Level if both Asteroid and Enemy count is at 0
					if (gameVar.asteroidCount <= 0 && gameVar.enemyCount <= 0) {
						exitGame();
					}
					return;
				}
			})
			// Collision with ship damages ship and decreases enemy HP. If at 0, destroys itself
			.onHit('ship', function(e) {
				console.log('Ship Collision with Enemy');
				// if destroyed by ship collision increment the score, decrease HP
				gameVar.score += 1;
				score.text('Score: '+ gameVar.score);
				gameVar.hitPoint -= 1;
				hitPoint.text('HitPoint: '+ gameVar.hitPoint);
				// Play Collision Audio
				Crafty.audio.play('collision');
				// Enemy looses HP and if at 0, is destroyed
				this.hp -= 1;
				if (this.hp <= 0) {
					this.destroy();
					// Decrease total enemy count
					gameVar.enemyCount --;
					// End Level if both Asteroid and Enemy count is at 0
					if (gameVar.asteroidCount <= 0 && gameVar.enemyCount <= 0) {
						exitGame();
					}
				}
				// End Game if HP is at 0
				if (gameVar.hitPoint <= 0) {
					exitGame();
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

    //function to fill the screen with asteroids by a random amount
    function initRocks(lower, upper) {
        var rocks = Crafty.math.randomInt(lower, upper);
		console.log("Initialize Asteroids: " + rocks);
        gameVar.asteroidCount = rocks;

        for(var i = 0; i < rocks; i++) {
            Crafty.e('rock_L, asteroid');
        }
    }
	// function to fill screen with Large Enemy Ships
	function initEnemyL(type, lower, upper) {
		var enemies = Crafty.math.randomInt(lower, upper);
		console.log("Initialize Enemies L: " + enemies + " " + type);
		gameVar.enemyCount += enemies;

        for(var i = 0; i < enemies; i++) {
            Crafty.e(type + ', EnemyShipL');
        }
	}
	// function to fill screen with Small Enemy Ships
	function initEnemyS(type, lower, upper) {
		var enemies = Crafty.math.randomInt(lower, upper);
		console.log("Initialize Enemies S: " + enemies + " " + type);
		gameVar.enemyCount += enemies;

        for(var i = 0; i < enemies; i++) {
            Crafty.e(type + ', EnemyShipS');
        }
	}
    //first level has between 1 and variable # specified by the Game Settings
    initRocks(1, gameVar.maxAsteroids);
	initEnemyL('enemyL_g', 1, gameVar.maxEnemies);
	initEnemyL('enemyL_b', 1, gameVar.maxEnemies);
	initEnemyS('enemyS_r', 1, gameVar.maxEnemies);
	initEnemyS('enemyS_b', 1, gameVar.maxEnemies);

	Crafty.viewport.clampToEntities = false;
	Crafty.viewport.scale(gameVar.canvasScale);
	if (gameVar.canvasFollow) {
		Crafty.viewport.follow(player, 0, 0);
	}

	// var canvas = document.querySelector('canvas');
	// var ctx = canvas.getContext('2d');
	// var img = document.getElementById('galaxyBackground');
	// ctx.drawImage(img, 0, 0, gameVar.canvasW, gameVar.canvasH);

});
