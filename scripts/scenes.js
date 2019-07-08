Crafty.scene('Game', function() {
	//Function to register collision HIT events to players from objects
	function registerPlayerHits(playerName, objectHit, hpNo, scoreNo) {
	    playerName.collision()
	    .onHit(objectHit, function(e) {
	        console.log('Hit from ' + playerName);

	        // Play Explosion Audio
	        Crafty.audio.play('explosion');
	        //destroy the missile
	        e[0].obj.destroy();
	        // Explosion Scene
	        Crafty.e('ExplosionBG').attr({
	            x:this.x-this.w,
	            y:this.y-this.h
	        });
	        // Player one looses HP and if at 0, is destroyed
	        upDateHP(hpNo, -1);
	        upDateScore(scoreNo, 1);
	        if (returnHP(hpNo) <= 0) {
	            playerName.destroy();
	            exitCurrentLevel();
	        }
	    });
	}

	// Function to register collision HIT events on game objects - non players
	function registerRockCollisions(objectToRegister, objectHit, hpNo, scoreNo, playerHit, shipCollided) {
		objectToRegister.collision()
	    // Collision with ship damages ship and destroys asteroid
	    .onHit(objectHit, function(e) {
	        console.log('Collision with ' + objectHit);
	        // Explosion scene
	        Crafty.e('ExplosionSM').attr({
	            x:this.x-this.w,
	            y:this.y-this.h
	        });
	        // Play Collision Audio
	        Crafty.audio.play('collision');
	        // if destroyed by ship collision increment the score, decrease HP
	        upDateScore(scoreNo, 1);
	        // Only applies for collision situation
	        if (shipCollided) {
	            upDateHP(hpNo, -1);
	            // End Game if HP is at 0
	            if (returnHP(hpNo) <= 0) {
	                // Explosion Scene
	                Crafty.e('ExplosionBG').attr({
	                    x:this.x-this.w,
	                    y:this.y-this.h
	                });
	                playerHit.destroy();
	                exitCurrentLevel();
	            }
	        } else {
	            e[0].obj.destroy();
	        }

	        var size;
	        //decide what size to make the asteroid
	        if(objectToRegister.has('rock_L')) {
	            objectToRegister.removeComponent('rock_L').addComponent('rock_M');
	            objectToRegister.attr({
	                w: gameVar.rockM * gameVar.canvasScale,
	                h: gameVar.rockM * gameVar.canvasScale
	            });
	            size = 'rock_M';
	        } else if(objectToRegister.has('rock_M')) {
	            objectToRegister.removeComponent('rock_M').addComponent('rock_S');
	            objectToRegister.attr({
	                w: gameVar.rockS * gameVar.canvasScale,
	                h: gameVar.rockS * gameVar.canvasScale
	            });
	            size = 'rock_S';
	        } else if(objectToRegister.has('rock_S')) {
	            //if the lowest size, delete self and decrease total Asteroid Count
	            objectToRegister.destroy();
	            gameVar.asteroidCount --;
	            // End Level if both Asteroid and Enemy count is at 0
	            if (gameVar.asteroidCount <= 0 && gameVar.enemyCount <= 0 && !gameVar.VSMode) {
	                exitCurrentLevel();
	            }
	            return;
	        }
	        var oldxspeed = objectToRegister.xspeed;
	        objectToRegister.xspeed = -this.yspeed;
	        objectToRegister.yspeed = oldxspeed;

	        gameVar.asteroidCount ++;
	        //split into two asteroids by creating another asteroid
	        var splitRock = Crafty.e('Actor, '+size+', Collision, asteroid').attr({x: this._x, y: this._y});
	        registerRockCollisions(splitRock, objectHit, hpNo, scoreNo, playerHit, shipCollided);
	    });
	}

	// Function to register collision HIT events on enemy ship objects
	function registerEnemyCollisions(objectToRegister, objectHit, hpNo, scoreNo, playerHit) {
		objectToRegister.collision()
		.onHit('missile', function(e) {
			console.log('Missile Hits Enemy');

			// Play Explosion Audio
			Crafty.audio.play('explosion');
			//destroy the missile
			e[0].obj.destroy();
			// Explosion Scene
			Crafty.e('ExplosionBG').attr({
				x:this.x-this.w,
				y:this.y-this.h
			});
			// Enemy looses HP and if at 0, is destroyed
			this.hp -= 1;
			// if destroyed by a missile increment the score
			upDateScore(1,1);

			if (this.hp <= 0) {
				this.destroy();

				// Decrease total enemy count
				gameVar.enemyCount --;
				// End Level if both Asteroid and Enemy count is at 0
				if (gameVar.asteroidCount <= 0 && gameVar.enemyCount <= 0 && !gameVar.VSMode) {
					exitCurrentLevel();
				}
				return;
			}
		})

		.onHit('shipWhite', function(e) {
			console.log('shipWhite Collision with Enemy');
			// if destroyed by ship collision increment the score, decrease HP
			upDateHP(1,-1);
			upDateScore(1,1);

			// Explosion Scene
			Crafty.e('ExplosionBG').attr({
				x:this.x-this.w,
				y:this.y-this.h
			});
			// Play Collision Audio
			Crafty.audio.play('collision');
			// Enemy looses HP and if at 0, is destroyed
			this.hp -= 1;
			if (this.hp <= 0) {
				this.destroy();
				// if destroyed increment the score
				gameVar.score += 1;
				gameVar.scoreDisplay.textContent = gameVar.score;
				// Decrease total enemy count
				gameVar.enemyCount --;
				// End Level if both Asteroid and Enemy count is at 0
				if (gameVar.asteroidCount <= 0 && gameVar.enemyCount <= 0 && !gameVar.VSMode) {
					exitCurrentLevel();
				}
			}
			// End Game if HP is at 0
			if (returnHP(1) <= 0) {
				// Explosion Scene
				Crafty.e('ExplosionBG').attr({
					x:this.x-this.w,
					y:this.y-this.h
				});
				gameVar.player1.destroy();
				exitCurrentLevel();
			}

			// Variable to determine which direction to go to bounce back from gameVar.player
			var distanceX = 0;
			var distanceY = 0;

			if (this.y>gameVar.player1.y)
			{
				distanceY = (gameVar.shipSize * gameVar.canvasScale * 1.2);
			}
			if (this.y<gameVar.player1.y)
			{
				distanceY = - (gameVar.shipSize * gameVar.canvasScale * 1.2);
			}
			if (this.x>gameVar.player1.x)
			{
				distanceX = (gameVar.shipSize * gameVar.canvasScale * 1.2);
			}
			if (this.x<gameVar.player1.x)
			{
				distanceX = - (gameVar.shipSize * gameVar.canvasScale * 1.2);
			}
			this.x = this.x + distanceX;
			this.y = this.y + distanceY;
		});

	}


	// components in Game used

	Crafty.paths({ audio: 'assets/', background: 'images/', sprites: 'images/', images: 'images/' });

	var assetsObj = {
	    'audio': {
	        'blast': 'blast.mp3',
			'collision': 'collision.mp3',
	        'explosion': 'explosion.mp3',
	        'warpout': 'warpout.mp3'
	    },
	    'images': ['space.png','galaxy.jpg'],
	    'sprites': {
	        'ship.png': {
	            'tile':  gameVar.shipSize,
	            'tileh': gameVar.shipSize,
	            'map': { 'shipWhite': [0,0]}
	        },
			'shipRed.png': {
	            'tile':  gameVar.shipSize,
	            'tileh': gameVar.shipSize,
	            'map': { 'shipRed': [0,0]}
	        },
	        'missile.png': {
	            'tile': gameVar.missleW,
	            'tileh': gameVar.missleH,
	            'map': {'missile': [0,0] }
	        },
	        'missile2.png': {
	            'tile': gameVar.missleW,
	            'tileh': gameVar.missleH,
	            'map': {'missile2': [0,0] }
	        },
	        'rock_L.png': {
	            'tile': gameVar.rockL,
	            'tileh': gameVar.rockL,
	            'map': {'rock_L': [0,0] }
	        },
	        'rock_M.png': {
	            'tile': gameVar.rockM,
	            'tileh': gameVar.rockM,
	            'map': {'rock_M': [0,0] }
	        },
	        'rock_S.png': {
	            'tile': gameVar.rockS,
	            'tileh': gameVar.rockS,
	            'map': {'rock_S': [0,0] }
	        },
	        'enemyL_g.png': {
	            'tile': gameVar.enemyL,
	            'tileh': gameVar.enemyL,
	            'map': { 'enemyL_g': [0,0]}
	        },
	        'enemyL_b.png': {
	            'tile': gameVar.enemyL,
	            'tileh': gameVar.enemyL,
	            'map': { 'enemyL_b': [0,0]}
	        },
	        'enemyS_b.png': {
	            'tile':  gameVar.enemyS,
	            'tileh':  gameVar.enemyS,
	            'map': { 'enemyS_b': [0,0]}
	        },
	        'enemyS_r.png': {
	            'tile':  gameVar.enemyS,
	            'tileh':  gameVar.enemyS,
	            'map': { 'enemyS_r': [0,0]}
	        },
			'space.png': {
	            'tile':  256,
	            'tileh':  256,
	            'map': { 'galaxy': [0,0]}
	        },
	        'starPower.png': {
	            'tile': 215,
	            'tileh': 215,
	            'map': {'starPower': [0,0]}
	        },
	        'explosion.png': {
	            'tile': 128,
	            'tileh': 128,
	            'map': {
	                'explosionL':[0,0],
	                'explosionM':[0,1],
	                'explosionS':[0,2]}
	        }
	    },
	};

	Crafty.load(assetsObj);

	// An 'Actor' is an entity that is drawn in 2D on canvas
	Crafty.c('Actor', {
	    init: function () {
	        this.requires('2D, Canvas');
			this.z = 1;
	    },
	});

	// Actor to show Animation
	Crafty.c('ActorAnimated', {
	    init: function () {
	        this.requires('Actor, SpriteAnimation');
	    },
	});

	// Image Object is just an Actor with a fixed location
	Crafty.c('ImageObject', {
	    init: function () {
			this.requires('2D, Canvas');
			this.attr({
				x: gameVar.canvasW / 4,
				y: gameVar.canvasH / 4,
				z: 0,
				w: gameVar.canvasW,
				h: gameVar.canvasH
			});

	    },
	});

	// Explosion components - 3 Sizes
	Crafty.c('ExplosionBG',{
	    init:function(){
	        this.addComponent('ActorAnimated, explosionL')
	        .reel('explodeL',600,0,0,16)

	        .animate('explodeL',1)
	        .bind('AnimationEnd',function(){
	            this.destroy();
	        });

	    }
	});

	Crafty.c('ExplosionMD',{
	    init:function(){
	        this.addComponent('ActorAnimated, explosionM')
	        .reel('explodeM',600,0,0,16)

	        .animate('explodeM',1)
	        .bind('AnimationEnd',function(){
	            this.destroy();
	        });

	    }
	});

	Crafty.c('ExplosionSM',{
	    init:function(){
	        this.addComponent('ActorAnimated, explosionS')
	        .reel('explodeS',600,0,0,16)

	        .animate('explodeS',1)
	        .bind('AnimationEnd',function(){
	            this.destroy();
	        });

	    }
	});

	//Asteroid component
	Crafty.c('Rock', {
		init: function() {
			this.requires('Actor, Collision');
			// Origin determins pivot point of the object for movement.
			this.origin('center');
			this.attr({
				// x & y are random location
				x: Crafty.math.randomInt(0, Crafty.viewport.width),
				y: Crafty.math.randomInt(0, Crafty.viewport.height),
				// xspeed and yspeed are velocity of the asteroid.
				xspeed: Crafty.math.randomInt(1, gameVar.maxAsteroidSpeed),
				yspeed: Crafty.math.randomInt(1, gameVar.maxAsteroidSpeed),
				// rspeed is the rotational speed of the spin
				rspeed: Crafty.math.randomInt(-gameVar.maxAsteroidSpeed, gameVar.maxAsteroidSpeed)
			})
			.bind('EnterFrame', function() {
				this.x += this.xspeed;
				this.y += this.yspeed;
				this.rotation += this.rspeed;

				// Determines variable to use for different rock sizes
				var rockSize;
				if (this.has('rock_L')) {
					rockSize = gameVar.rockL;
				} else if (this.has('rock_M')) {
					rockSize = gameVar.rockM;
				} else if (this.has('rock_S')) {
					rockSize = gameVar.rockS;
				}
				// Determines when to go off screen and reapear on the other side of the canvas
				if(this._x > Crafty.viewport.width) {
					this.x = -rockSize;
				}
				if(this._x < -rockSize) {
					this.x =  Crafty.viewport.width;
				}
				if(this._y > Crafty.viewport.height) {
					this.y = -rockSize;
				}
				if(this._y < -rockSize) {
					this.y = Crafty.viewport.height;
				}
			});
	        registerRockCollisions(this, 'missile', 1, 1, gameVar.player1, false);
	        registerRockCollisions(this, 'missile2', 2, 2, gameVar.player2, false);
		}
	});

	// Base Enemy Component
	Crafty.c('Enemy', {
		init: function() {
			this.requires('Actor, Collision');
			this.attr({
				// x & y are random location
				x: Crafty.math.randomInt(0, Crafty.viewport.width),
				y: Crafty.math.randomInt(0, Crafty.viewport.height),
				// xspeed and yspeed are velocity of the enemy.
				xspeed: Crafty.math.randomInt(1, gameVar.maxEnemySpeed),
				yspeed: Crafty.math.randomInt(1, gameVar.maxEnemySpeed),
			});
			this.collision()
			// Collision with Missile destroys decreases enemy HP. If at 0, destroys itself
			.onHit('missile', function(e) {
				console.log('Missile Hits Enemy');

				// Play Explosion Audio
				Crafty.audio.play('explosion');
				//destroy the missile
				e[0].obj.destroy();
	            // Explosion Scene
	            Crafty.e('ExplosionBG').attr({
	                x:this.x-this.w,
	                y:this.y-this.h
	            });
				// Enemy looses HP and if at 0, is destroyed
				this.hp -= 1;
	            // if destroyed by a missile increment the score
	            upDateScore(1,1);

				if (this.hp <= 0) {
					this.destroy();

					// Decrease total enemy count
					gameVar.enemyCount --;
					// End Level if both Asteroid and Enemy count is at 0
					if (gameVar.asteroidCount <= 0 && gameVar.enemyCount <= 0 && !gameVar.VSMode) {
						exitCurrentLevel();
					}
					return;
				}
			})
	        .onHit('missile2', function(e) {
				console.log('Missile2 Hits Enemy');

				// Play Explosion Audio
				Crafty.audio.play('explosion');
				//destroy the missile
				e[0].obj.destroy();
	            // Explosion Scene
	            Crafty.e('ExplosionBG').attr({
	                x:this.x-this.w,
	                y:this.y-this.h
	            });
				// Enemy looses HP and if at 0, is destroyed
				this.hp -= 1;
	            // if destroyed by a missile increment the score
	            upDateScore(2,1);

				if (this.hp <= 0) {
					this.destroy();

					// Decrease total enemy count
					gameVar.enemyCount --;
					// End Level if both Asteroid and Enemy count is at 0
					if (gameVar.asteroidCount <= 0 && gameVar.enemyCount <= 0 && !gameVar.VSMode) {
						exitCurrentLevel();
					}
					return;
				}
			});
		}
	});

	// Enemy Large Component
	Crafty.c('EnemyL', {
		init: function() {
			this.requires('Actor, Enemy');
			this.attr({
	            hp: gameVar.hitPointEnemy
			});
		}
	});

	// Enemy Small Component
	Crafty.c('EnemyS', {
		init: function() {
			this.requires('Actor, Enemy');
			this.attr({
				hp: 1
			});
		}
	});

	//PowerUp component
	Crafty.c('Power', {
		init: function() {
			this.requires('Actor');
			this.attr({
				// x & y are random location
				x: Crafty.math.randomInt(0, Crafty.viewport.width),
				y: Crafty.math.randomInt(0, Crafty.viewport.height),
				// xspeed and yspeed are velocity of the asteroid.
				xspeed: Crafty.math.randomInt(1, (gameVar.maxAsteroidSpeed * 1.3)),
				yspeed: Crafty.math.randomInt(1, (gameVar.maxAsteroidSpeed * 1.3)),
				// rspeed is the rotational speed of the spin
				rspeed: Crafty.math.randomInt(-gameVar.maxAsteroidSpeed, gameVar.maxAsteroidSpeed)
			})
			.bind('EnterFrame', function() {
				this.x += this.xspeed;
				this.y += this.yspeed;
				this.rotation += this.rspeed;

				// Determines when to go off screen and reapear on the other side of the canvas
				if(this._x > Crafty.viewport.width) {
					this.x = -this.w;
				}
				if(this._x < -this.w) {
					this.x =  Crafty.viewport.width;
				}
				if(this._y > Crafty.viewport.height) {
					this.y = -this.h;
				}
				if(this._y < -this.h) {
					this.y = Crafty.viewport.height;
				}
			});
		}
	});

	//Star PowerUp component
	Crafty.c('PowerUp', {
	    init: function() {
	        this.requires('Actor, Power, Collision');
			this.w = gameVar.powerUpSize;
			this.h = gameVar.powerUpSize;
	        this.collision()
	        // Collision with Missile destroys asteroid
	        .onHit('missile', function(e) {
				console.log('Missile Hits PowerUp');
	            // Explosion Scene
	            Crafty.e('ExplosionMD').attr({
	                x:this.x-this.w,
	                y:this.y-this.h
	            });
				// Play Explosion Audio
				Crafty.audio.play('explosion');
				//destroy the missile
	            e[0].obj.destroy();
				//destroy PowerUp - no benefit
				this.destroy();
	        })
	        .onHit('missile2', function(e) {
				console.log('Missile2 Hits PowerUp');
	            // Explosion Scene
	            Crafty.e('ExplosionMD').attr({
	                x:this.x-this.w,
	                y:this.y-this.h
	            });
				// Play Explosion Audio
				Crafty.audio.play('explosion');
				//destroy the missile
	            e[0].obj.destroy();
				//destroy PowerUp - no benefit
				this.destroy();
	        })
	        // Collision with ship Powers Up HP
	        .onHit('shipWhite', function(e) {
				console.log('shipWhite PU PowerUp');
	            // if destroyed by ship collision increment the score, increase HP
	            upDateScore(1,5);
	            upDateHP(1,5);

				// Play Collision Audio
				Crafty.audio.play('warpout');
				this.destroy();

	        })
	        .onHit('shipRed', function(e) {
	            if (gameVar.VSMode) {
	                console.log('ShipRed PU PowerUp');
	                upDateScore(2,5);
	                upDateHP(2,5);

	    			// Play Collision Audio
	    			Crafty.audio.play('warpout');
	    			this.destroy();
	            }
	        });
	    }
	});

	// Common Ship Elements
	Crafty.c('ShipCommon', {
		init: function() {
			this.requires('Actor, Collision');
			this.attr({
				x: gameVar.playerX,
				y: gameVar.playerY,
				// Move object is a collection of possible move property values to determine what actions are allowed and bound to keyboard action.
				move: {left: false, right: false, up: false, down: false},
				// xspeed and yspeed is used determine speed of the player object. Starts at 0 stationary
				xspeed: 0,
				yspeed: 0,
				decay: 0.94, // Variable to control rate of slow down when forward move is stopped. Higher value adds more perpetual motion. 1 value is no slow down.
			})
			// .color('blue')
	        .collision()
			// Collision with Asteroid if HP is at 0 ends game
			.onHit('missile', function(e) {
	            console.log('Missile Hit from Other Player');
			});
		}
	});

	// Function to define ship component with Fire and Warp actions
	function CreateShipFW(shipName, fireKeys, warpKeys, missilePlayer) {
	    // Player One Ship
	    Crafty.c(shipName, {
	    	init: function() {
	    		this.requires('ShipCommon');
	            // Bind keyboard down press event to call move functions - boolean true triggers function
	    		this.bind('KeyDown', function(e) {
	                if (fireKeys.includes(e.keyCode)) {
	                    // console.log('Missile Fire');
	    				Crafty.audio.play('blast');

	    				var currentShip = this;
	    				//create a missile entity
	    				Crafty.e('Actor', missilePlayer)
	    				.attr({
	    					x: this._x + (40 * gameVar.canvasScale),
	    					y: this._y + (40 * gameVar.canvasScale),
	                        w: gameVar.missleW * gameVar.canvasScale,
	            			h: gameVar.missleH * gameVar.canvasScale,
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
	    						if(this._x > (currentShip.x + (Crafty.viewport.width/2)) || this._x < (currentShip.x - (Crafty.viewport.width/2)) || this._y > (currentShip.y + (Crafty.viewport.height/2)) || this._y < (currentShip.y - (Crafty.viewport.height/2))) {
	    							this.destroy();
	    						}
	    					} else {
	    						// Boarder's are fixed.
	    						if(this._x > Crafty.viewport.width || this._x < 0 || this._y > Crafty.viewport.height || this._y < 0) {
	    							this.destroy();
	    						}
	    					}
	    				});
	                } else if (warpKeys.includes(e.keyCode)) {
	                    console.log(shipName + ' Warp Out');
	    				Crafty.audio.play('warpout');
	    				// Random X & Y - Greater Canvas Area for Warping
	    				gameVar.playerX = Crafty.viewport.width * ((Math.random() * 0.7) + 0.2);
	    				gameVar.playerY = Crafty.viewport.height * ((Math.random() * 0.7) + 0.2);

	    				// Warp player to new X & Y
	    				this.x = gameVar.playerX;
	    				this.y = gameVar.playerY;
	                }

	    		});
	    	}
	    });
	}

	CreateShipFW (gameVar.shipFW1, [Crafty.keys.NUMPAD_0, Crafty.keys.NUMPAD_1, Crafty.keys.NUMPAD_3, Crafty.keys.PERIOD, Crafty.keys.M], [Crafty.keys.COMMA, Crafty.keys.DOWN_ARROW, Crafty.keys.NUMPAD_2], 'missile');
	CreateShipFW (gameVar.shipFW2, [Crafty.keys.B, Crafty.keys.C], [Crafty.keys.V, Crafty.keys.S], 'missile2');

	// Function to define ship component with Left and Right movements
	function CreateShipMLR(shipName, shipLinkTo, moveLeft, moveRight) {
	    // Ship with Standard orientation
	    Crafty.c(shipName, {
	    	init: function() {
	    		this.requires(shipLinkTo);
	    		// Bind keyboard down press event to call move functions - boolean true triggers function
	    		this.bind('KeyDown', function(e) {
	    			//on keydown, set the move booleans
	    			if(e.keyCode === moveRight) {
	    				this.move.right = true;
	    			} else if(e.keyCode === moveLeft) {
	    				this.move.left = true;
	    			}
	    		})
	    		// Bind keyboard up press event to stop move functions - boolean false triggers stop
	    		.bind('KeyUp', function(e) {
	    			//on key up, set the move booleans to false
	    			if(e.keyCode === moveRight) {
	    				this.move.right = false;
	    			} else if(e.keyCode === moveLeft) {
	    				this.move.left = false;
	    			}
	    		})
	    		// Binds action to EnterFrame event function in Crafty.js
	    		// Combined with keyboard events, this is how the player is moved around the screen
	    		.bind('EnterFrame', function() {
	    			if(this.move.right) this.rotation += 5;
	    			if(this.move.left) this.rotation -= 5;
	    		});
	    	}
	    });
	}
	// Ship1 with Standard Left Right movement
	CreateShipMLR(gameVar.shipMLR1, gameVar.shipFW1, Crafty.keys.LEFT_ARROW, Crafty.keys.RIGHT_ARROW);
	// Ship2 with Standard Left Right movement
	CreateShipMLR(gameVar.shipMLR2, gameVar.shipFW2, Crafty.keys.A, Crafty.keys.D);
	// Ship with Reverse Turn
	CreateShipMLR(gameVar.shipMLRR, gameVar.shipFW1, Crafty.keys.RIGHT_ARROW, Crafty.keys.LEFT_ARROW);
	// Ship with Independent Turn
	CreateShipMLR(gameVar.shipMLRI, gameVar.shipFW1, Crafty.keys.A, Crafty.keys.D);

	// Function to define ship component with Forward movement
	function CreateShipMF(shipName, shipLinkTo, moveForward) {
	    Crafty.c(shipName, {
	    	init: function() {
	    		this.requires(shipLinkTo);
	    		// .color('blue')
	    		// Bind keyboard down press event to call move functions - boolean true triggers function
	    		this.bind('KeyDown', function(e) {
	    			//on keydown, set the move booleans
	    			if(e.keyCode === moveForward) {
	    				this.move.up = true;
	    			}
	    		})
	    		// Bind keyboard up press event to stop move functions - boolean false triggers stop
	    		.bind('KeyUp', function(e) {
	    			//on key up, set the move booleans to false
	    			if(e.keyCode === moveForward) {
	    				this.move.up = false;
	    			}
	    		})
	    		// Binds action to EnterFrame event function in Crafty.js
	    		// Combined with keyboard events, this is how the player is moved around the screen
	    		.bind('EnterFrame', function() {

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
	    		});
	    	}
	    });
	}

	// Player One Component
	CreateShipMF(gameVar.shipMF1, gameVar.shipMLR1, Crafty.keys.UP_ARROW);
	// Player Two Component for VS Mode
	CreateShipMF(gameVar.shipMF2, gameVar.shipMLR2, Crafty.keys.W);

	//Second Ship To Capture
	Crafty.c('Ship2', {
	    init: function() {
	        this.requires('Actor, Power, Collision');
	        this.collision()
	        // Collision with Missile destroys asteroid
	        .onHit('missile', function(e) {
				console.log('Missile Hits Ship2');
	            // Explosion Scene
	            Crafty.e('ExplosionMD').attr({
	                x:this.x-this.w,
	                y:this.y-this.h
	            });
				// Play Explosion Audio
				Crafty.audio.play('explosion');
				//destroy the missile
	            e[0].obj.destroy();
				//destroy ship2 - no benefit
				this.destroy();
	        });
	    }
	});

	console.log('Level 1 Game Called');

	var backgroundAsset = Crafty.e('ImageObject, Image')
		.image("images/star.png");

	// Variable to store initial player X & Y random position
	gameVar.playerX = Crafty.viewport.width * ((Math.random() * 0.6) + 0.2);
	gameVar.playerY = Crafty.viewport.height * ((Math.random() * 0.6) + 0.2);

	if (gameVar.VSMode) {
		// Player Entity
		gameVar.player1 = Crafty.e(gameVar.shipMF1, 'shipWhite')
			// Origin function changes the center point of move / rotation function. This allows for rotation to happen from the x / y center point of the sprite vs. the upper left point.
			.attr({
				w: gameVar.shipSize * gameVar.canvasScale,
				h: gameVar.shipSize * gameVar.canvasScale
			})
			.origin('center');
		registerPlayerHits(gameVar.player1, 'missile2', 1, 2);

		// Variable to reset X & Y random position
		gameVar.playerX = Crafty.viewport.width * ((Math.random() * 0.6) + 0.2);
		gameVar.playerY = Crafty.viewport.height * ((Math.random() * 0.6) + 0.2);
		// Player Two Entity in VS Mode
		gameVar.player2 = Crafty.e(gameVar.shipMF2, 'shipRed', 'Collision')
			// Origin function changes the center point of move / rotation function. This allows for rotation to happen from the x / y center point of the sprite vs. the upper left point.
			.attr({
				w: gameVar.shipSize * gameVar.canvasScale,
				h: gameVar.shipSize * gameVar.canvasScale
			})
			.origin('center');
		registerPlayerHits(gameVar.player2, 'missile', 2, 1);
	} else {
		// Player Entity
		gameVar.player1 = Crafty.e(gameVar.shipMF1, 'shipWhite')
			// Origin function changes the center point of move / rotation function. This allows for rotation to happen from the x / y center point of the sprite vs. the upper left point.
			.attr({
				w: gameVar.shipSize * gameVar.canvasScale,
				h: gameVar.shipSize * gameVar.canvasScale
			})
			.origin('center');
	}

	//Asteroid component
	Crafty.c('asteroid', {
        init: function() {
            this.requires('Actor, Rock');

            // Register Collisions
            registerRockCollisions(this, 'shipWhite', 1, 1, gameVar.player1, true);
			if (gameVar.VSMode) {
				registerRockCollisions(this, 'shipRed', 2, 2, gameVar.player2, true);
			}
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

	// Function to add Second Player Ship - One Player Mode ONLY
	function initShip2() {
		Crafty.e('shipRed, Ship2')
		.attr({
			w: gameVar.shipSize * gameVar.canvasScale,
			h: gameVar.shipSize * gameVar.canvasScale
		})
		.collision()
		// Collision with ship Powers Up HP
		.onHit('shipWhite', function(e) {
			console.log('shipWhite PU Ship 2');
			// if destroyed by ship collision increment the score, decrease HP
			upDateScore(1,1);

			// Play Collision Audio
			Crafty.audio.play('warpout');

			this.destroy();
			gameVar.player1.destroy();
			gameVar.player1 = Crafty.e(gameVar.shipMF1, 'shipWhite')
				.attr({
					w: gameVar.shipSize * gameVar.canvasScale,
					h: gameVar.shipSize * gameVar.canvasScale
				})
				.origin('center');
			if (gameVar.level === 2) {
				gameVar.player1.decay = 0.99;
			}
			var secondShip;
			if (gameVar.ship2_reverse) {
				secondShip = Crafty.e(gameVar.shipMLRR, 'shipRed');
			} else if (gameVar.ship2_independent) {
				secondShip = Crafty.e(gameVar.shipMLRI, 'shipRed');
			} else {
				secondShip = Crafty.e(gameVar.shipMLR1, 'shipRed');
			}
			secondShip.attr({
				w: gameVar.shipSize * gameVar.canvasScale,
				h: gameVar.shipSize * gameVar.canvasScale
			})
			.origin('center')
			.attr({
				x: gameVar.player1.x + (gameVar.shipSize * gameVar.canvasScale),
				y: gameVar.player1.y + (gameVar.shipSize * gameVar.canvasScale),

			})
			.bind('KeyDown', function(e) {
				//on keydown, set the move booleans
				if(e.keyCode === Crafty.keys.UP_ARROW) {
					this.move.up = true;
				}
			})
			.bind('KeyUp', function(e) {
				//on key up, set the move booleans to false
				if(e.keyCode === Crafty.keys.UP_ARROW) {
					this.move.up = false;
				}
			})
			.bind('EnterFrame', function() {
				//move the ship by the x and y speeds or movement vector
				if (gameVar.ship2_180) {
					this.x = gameVar.player1.x;
				} else {
					this.x = gameVar.player1.x + (gameVar.shipSize * gameVar.canvasScale);
				}
				this.y = gameVar.player1.y + (gameVar.shipSize * gameVar.canvasScale);
			});

			if (gameVar.ship2_180) {
				secondShip.rotation = 180;
			}

			if (gameVar.canvasFollow) {
				Crafty.viewport.follow(gameVar.player1, 0, 0);
			}
		});
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

	// function to fill screen with Large Enemy Ships
	function initEnemyL2(type, lower, upper) {
		if (upper < lower) {
			upper = lower;
		}
		var enemies = Crafty.math.randomInt(lower, upper);
		console.log("Initialize Enemies L: " + enemies + " " + type);
		gameVar.enemyCount += enemies;

        for(let i = 0; i < enemies; i++) {
            Crafty.e(type + ', EnemyShipL2')
			.attr({
				w: gameVar.enemyL * gameVar.canvasScale,
				h: gameVar.enemyL * gameVar.canvasScale
			});
        }
	}
	// function to fill screen with Small Enemy Ships
	function initEnemyS2(type, lower, upper) {
		if (upper < lower) {
			upper = lower;
		}
		var enemies = Crafty.math.randomInt(lower, upper);
		console.log("Initialize Enemies S: " + enemies + " " + type);
		gameVar.enemyCount += enemies;

        for(let i = 0; i < enemies; i++) {
            Crafty.e(type + ', EnemyShipS2')
			.attr({
				w: gameVar.enemyS * gameVar.canvasScale,
				h: gameVar.enemyS * gameVar.canvasScale
			});
        }
	}

	//first level has between 2 and variable # specified by the Game Settings
    initRocks(2, gameVar.maxAsteroids);
	// Decide how to ADD 2nd Ship depending on VS Mode
	if (gameVar.VSMode) {

	} else {
		// ADD Second Ship
		initShip2();
	}

	// MODS to Level 2 play
	if (gameVar.level === 2) {
		gameVar.player1.decay = 0.99;
		//Enemy component
		Crafty.c('EnemyShip', {
			init: function() {
				this.requires('Actor, Enemy, Collision');
				this.bind('EnterFrame', function() {
					// Variable to determine which direction to go to find player
					var distanceX = 0;
					var distanceY = 0;

		            if (this.y>gameVar.player1.y)
		            {
		                distanceY = -this.yspeed;
		            }
		            if (this.y<gameVar.player1.y)
		            {
		                distanceY = this.yspeed;
		            }
		            if (this.x>gameVar.player1.x)
		            {
		                distanceX = -this.xspeed;
		            }
		            if (this.x<gameVar.player1.x)
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
				.onHit('shipWhite', function(e) {
					console.log('shipWhite Collision with Enemy');
					// if destroyed by ship collision increment the score, decrease HP
					upDateHP(1,-1);
					upDateScore(1,1);

					// Explosion Scene
	                Crafty.e('ExplosionBG').attr({
	                    x:this.x-this.w,
	                    y:this.y-this.h
	                });
					// Play Collision Audio
					Crafty.audio.play('collision');
					// Enemy looses HP and if at 0, is destroyed
					this.hp -= 1;
					if (this.hp <= 0) {
						this.destroy();
						// if destroyed increment the score
						gameVar.score += 1;
						gameVar.scoreDisplay.textContent = gameVar.score;
						// Decrease total enemy count
						gameVar.enemyCount --;
						// End Level if both Asteroid and Enemy count is at 0
						if (gameVar.asteroidCount <= 0 && gameVar.enemyCount <= 0 && !gameVar.VSMode) {
							exitCurrentLevel();
						}
					}
					// End Game if HP is at 0
					if (returnHP(1) <= 0) {
						// Explosion Scene
						Crafty.e('ExplosionBG').attr({
							x:this.x-this.w,
							y:this.y-this.h
						});
						gameVar.player1.destroy();
						exitCurrentLevel();
					}

					// Variable to determine which direction to go to bounce back from gameVar.player
					var distanceX = 0;
					var distanceY = 0;

		            if (this.y>gameVar.player1.y)
		            {
		                distanceY = (gameVar.shipSize * gameVar.canvasScale * 1.2);
		            }
		            if (this.y<gameVar.player1.y)
		            {
		                distanceY = - (gameVar.shipSize * gameVar.canvasScale * 1.2);
		            }
		            if (this.x>gameVar.player1.x)
		            {
		                distanceX = (gameVar.shipSize * gameVar.canvasScale * 1.2);
		            }
		            if (this.x<gameVar.player1.x)
		            {
		                distanceX = - (gameVar.shipSize * gameVar.canvasScale * 1.2);
		            }
		            this.x = this.x + distanceX;
		            this.y = this.y + distanceY;
				})
				.onHit('shipRed', function(e) {
					if (gameVar.VSMode) {
						console.log('Ship2 Collision with Enemy');
						// if destroyed by ship collision increment the score, decrease HP
						upDateHP(2,-1);
						upDateScore(2,1);

						// Explosion Scene
		                Crafty.e('ExplosionBG').attr({
		                    x:this.x-this.w,
		                    y:this.y-this.h
		                });
						// Play Collision Audio
						Crafty.audio.play('collision');
						// Enemy looses HP and if at 0, is destroyed
						this.hp -= 1;
						if (this.hp <= 0) {
							this.destroy();
							// if destroyed increment the score
							gameVar.score2 += 1;
							gameVar.scoreDisplay.textContent = gameVar.score2;
							// Decrease total enemy count
							gameVar.enemyCount --;

						}
						// End Game if HP is at 0
						if (returnHP(2) <= 0) {
							// Explosion Scene
							Crafty.e('ExplosionBG').attr({
								x:this.x-this.w,
								y:this.y-this.h
							});
							gameVar.player2.destroy();
							exitCurrentLevel();
						}

						// Variable to determine which direction to go to bounce back from player
						var distanceX = 0;
						var distanceY = 0;

			            if (this.y>player2.y)
			            {
			                distanceY = (gameVar.shipSize * gameVar.canvasScale * 1.2);
			            }
			            if (this.y<player2.y)
			            {
			                distanceY = - (gameVar.shipSize * gameVar.canvasScale * 1.2);
			            }
			            if (this.x>player2.x)
			            {
			                distanceX = (gameVar.shipSize * gameVar.canvasScale * 1.2);
			            }
			            if (this.x<player2.x)
			            {
			                distanceX = - (gameVar.shipSize * gameVar.canvasScale * 1.2);
			            }
			            this.x = this.x + distanceX;
			            this.y = this.y + distanceY;
					}
				});
			}
		});
		//Enemy component
		Crafty.c('EnemyShip2', {
			init: function() {
				this.requires('Actor, Enemy, Collision');
				this.bind('EnterFrame', function() {
					// Variable to determine which direction to go to find player
					var distanceX = 0;
					var distanceY = 0;

		            if (this.y>player2.y)
		            {
		                distanceY = -this.yspeed;
		            }
		            if (this.y<player2.y)
		            {
		                distanceY = this.yspeed;
		            }
		            if (this.x>player2.x)
		            {
		                distanceX = -this.xspeed;
		            }
		            if (this.x<player2.x)
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
				.onHit('shipWhite', function(e) {
					console.log('shipWhite Collision with Enemy');
					// if destroyed by ship collision increment the score, decrease HP
					upDateHP(1,-1);
					upDateScore(1,1);

					// Explosion Scene
	                Crafty.e('ExplosionBG').attr({
	                    x:this.x-this.w,
	                    y:this.y-this.h
	                });
					// Play Collision Audio
					Crafty.audio.play('collision');
					// Enemy looses HP and if at 0, is destroyed
					this.hp -= 1;
					if (this.hp <= 0) {
						this.destroy();
						// if destroyed increment the score
						gameVar.score += 1;
						gameVar.scoreDisplay.textContent = gameVar.score;
						// Decrease total enemy count
						gameVar.enemyCount --;
						// End Level if both Asteroid and Enemy count is at 0
						if (gameVar.asteroidCount <= 0 && gameVar.enemyCount <= 0 && !gameVar.VSMode) {
							exitCurrentLevel();
						}
					}
					// End Game if HP is at 0
					if (returnHP(1) <= 0) {
						// Explosion Scene
						Crafty.e('ExplosionBG').attr({
							x:this.x-this.w,
							y:this.y-this.h
						});
						player.destroy();
						exitCurrentLevel();
					}

					// Variable to determine which direction to go to bounce back from player
					var distanceX = 0;
					var distanceY = 0;

		            if (this.y>player.y)
		            {
		                distanceY = (gameVar.shipSize * gameVar.canvasScale * 1.2);
		            }
		            if (this.y<player.y)
		            {
		                distanceY = - (gameVar.shipSize * gameVar.canvasScale * 1.2);
		            }
		            if (this.x>player.x)
		            {
		                distanceX = (gameVar.shipSize * gameVar.canvasScale * 1.2);
		            }
		            if (this.x<player.x)
		            {
		                distanceX = - (gameVar.shipSize * gameVar.canvasScale * 1.2);
		            }
		            this.x = this.x + distanceX;
		            this.y = this.y + distanceY;
				})
				.onHit('shipRed', function(e) {
					if (gameVar.VSMode) {
						console.log('Ship2 Collision with Enemy');
						// if destroyed by ship collision increment the score, decrease HP
						gameVar.score2 += 1;
						gameVar.scoreDisplay2.textContent = gameVar.score2;
						gameVar.hitPoint2 -= 1;
						gameVar.hpDisplay.textContent = gameVar.hitPoint2;
						// Explosion Scene
		                Crafty.e('ExplosionBG').attr({
		                    x:this.x-this.w,
		                    y:this.y-this.h
		                });
						// Play Collision Audio
						Crafty.audio.play('collision');
						// Enemy looses HP and if at 0, is destroyed
						this.hp -= 1;
						if (this.hp <= 0) {
							this.destroy();
							// if destroyed increment the score
							gameVar.score2 += 1;
							gameVar.scoreDisplay.textContent = gameVar.score2;
							// Decrease total enemy count
							gameVar.enemyCount --;

						}
						// End Game if HP is at 0
						if (gameVar.hitPoint2 <= 0) {
							// Explosion Scene
							Crafty.e('ExplosionBG').attr({
								x:this.x-this.w,
								y:this.y-this.h
							});
							player2.destroy();
							exitCurrentLevel();
						}

						// Variable to determine which direction to go to bounce back from player
						var distanceX = 0;
						var distanceY = 0;

			            if (this.y>player2.y)
			            {
			                distanceY = (gameVar.shipSize * gameVar.canvasScale * 1.2);
			            }
			            if (this.y<player2.y)
			            {
			                distanceY = - (gameVar.shipSize * gameVar.canvasScale * 1.2);
			            }
			            if (this.x>player2.x)
			            {
			                distanceX = (gameVar.shipSize * gameVar.canvasScale * 1.2);
			            }
			            if (this.x<player2.x)
			            {
			                distanceX = - (gameVar.shipSize * gameVar.canvasScale * 1.2);
			            }
			            this.x = this.x + distanceX;
			            this.y = this.y + distanceY;
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

		//Enemy Large component
		Crafty.c('EnemyShipL2', {
			init: function() {
				this.requires('Actor, EnemyShip2');
				this.attr({
		            hp: gameVar.hitPointEnemy
				});
			}
		});

		//Enemy Small component
		Crafty.c('EnemyShipS2', {
			init: function() {
				this.requires('Actor, EnemyShip2');
				this.attr({
					hp: 1
				});
			}
		});

		initEnemyL('enemyL_g', 1, gameVar.maxEnemies);
		initEnemyL('enemyL_b', 1, gameVar.maxEnemies);
		initEnemyS('enemyS_r', 1, gameVar.maxEnemies);
		initEnemyS('enemyS_b', 1, gameVar.maxEnemies);
		if (gameVar.VSMode) {
			initEnemyL2('enemyL_g', 1, gameVar.maxEnemies);
			initEnemyL2('enemyL_b', 1, gameVar.maxEnemies);
			initEnemyS2('enemyS_r', 1, gameVar.maxEnemies);
			initEnemyS2('enemyS_b', 1, gameVar.maxEnemies);
		}
	}

	Crafty.viewport.clampToEntities = false;
	// Crafty.viewport.scale(gameVar.canvasScale);
	if (gameVar.canvasFollow) {
		Crafty.viewport.follow(player, 0, 0);
	}
});
