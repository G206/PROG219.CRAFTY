Crafty.scene('firstGame', function() {
	console.log('Level 1 Game Called');
    // Background - Space
    // Crafty.background("url('_images/space.png')");

	var backgroundAsset = Crafty.e('ImageObject, Image')
		.image("_images/star.png");

	// Variable to store initial player X & Y random position
	var playerX = Crafty.viewport.width * ((Math.random() * 0.6) + 0.2);
	var playerY = Crafty.viewport.height * ((Math.random() * 0.6) + 0.2);

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
    		decay: 0.93, // Variable to control rate of slow down when forward move is stopped. Higher value adds more perpetual motion. 1 value is no slow down.
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
    		} else if (e.keyCode === Crafty.keys.CTRL || e.keyCode === Crafty.keys.SHIFT) {
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
                scoreDisplay.textContent = gameVar.score;
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
	                    exitLevel();
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
                scoreDisplay.textContent = gameVar.score;
                gameVar.hitPoint -= 1;
                hpDisplay.textContent = gameVar.hitPoint;
				// Play Collision Audio
				Crafty.audio.play('collision');

                // End Game if HP is at 0
                if (gameVar.hitPoint <= 0) {
					player.destroy();
                    exitLevel();
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
	                    exitLevel();
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

    //function to fill the screen with asteroids by a random amount
    function initRocks(lower, upper) {
		if (upper < lower) {
			upper = lower;
		}
        var rocks = Crafty.math.randomInt(lower, upper);
		console.log("Initialize Asteroids: " + rocks);
        gameVar.asteroidCount = rocks;

        for(var i = 0; i < rocks; i++) {
            Crafty.e('rock_L, asteroid');
        }
    }
    //first level has between 2 and variable # specified by the Game Settings
    initRocks(2, gameVar.maxAsteroids);


	Crafty.viewport.clampToEntities = false;
	Crafty.viewport.scale(gameVar.canvasScale);
	if (gameVar.canvasFollow) {
		Crafty.viewport.follow(player, 0, 0);
	}
});
