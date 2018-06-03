// Recopied from my Git Repo primary JS file v1.0.0

Crafty.scene('Game', function() {
	console.log('Level 1 Game Called');
    // Background - Space
    // Crafty.background("url('_images/space.png')");

	var backgroundAsset = Crafty.e('ImageObject, Image')
		.image("_images/star.png");

	// Variable to store initial player X & Y random position
	gameVar.playerX = Crafty.viewport.width * ((Math.random() * 0.6) + 0.2);
	gameVar.playerY = Crafty.viewport.height * ((Math.random() * 0.6) + 0.2);
	var player;

	if (gameVar.VSMode) {
		// Player Entity
		player = Crafty.e('PlayerShip, ship, Collision')
			// Origin function changes the center point of move / rotation function. This allows for rotation to happen from the x / y center point of the sprite vs. the upper left point.
			.attr({
				w: gameVar.shipSize * gameVar.canvasScale,
				h: gameVar.shipSize * gameVar.canvasScale
			})
			.origin('center')
			.collision()
			.onHit('missile2', function(e) {
				console.log('Hit from Player 2');

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
				gameVar.hitPoint -= 1;
				gameVar.hpDisplay.textContent = gameVar.hitPoint;
				gameVar.score2 += 1;
	            gameVar.scoreDisplay2.textContent = gameVar.score2;
				if (gameVar.hitPoint <= 0) {
					player.destroy();
					exitCurrentLevel();
				}
			});

		// Variable to reset X & Y random position
		gameVar.playerX = Crafty.viewport.width * ((Math.random() * 0.6) + 0.2);
		gameVar.playerY = Crafty.viewport.height * ((Math.random() * 0.6) + 0.2);
		// Player Two Entity in VS Mode
		var player2 = Crafty.e('PlayerTwo, shipRed, Collision')
			// Origin function changes the center point of move / rotation function. This allows for rotation to happen from the x / y center point of the sprite vs. the upper left point.
			.attr({
				w: gameVar.shipSize * gameVar.canvasScale,
				h: gameVar.shipSize * gameVar.canvasScale
			})
			.origin('center')
			.collision()
			.onHit('missile', function(e) {
				console.log('Hit from Player 1');

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
				gameVar.hitPoint2 -= 1;
				gameVar.hpDisplay2.textContent = gameVar.hitPoint2;
				gameVar.score += 1;
				gameVar.scoreDisplay.textContent = gameVar.score;
				if (gameVar.hitPoint2 <= 0) {
					player2.destroy();
					exitCurrentLevel();
				}
			});
	} else {
		// Player Entity
		player = Crafty.e('PlayerShip, ship')
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
            this.requires('Actor, Rock, Collision');
			this.collision()
            // Collision with ship damages ship and destroys asteroid
            .onHit('ship', function(e) {
				console.log('Ship Collision at Asteroid Level');
				// Explosion scene
				Crafty.e('ExplosionSM').attr({
					x:this.x-this.w,
					y:this.y-this.h
				});
				// Play Collision Audio
				Crafty.audio.play('collision');
				// if destroyed by ship collision increment the score, decrease HP
				gameVar.score += 1;
				gameVar.scoreDisplay.textContent = gameVar.score;
				gameVar.hitPoint -= 1;
				gameVar.hpDisplay.textContent = gameVar.hitPoint;

				// End Game if HP is at 0
				if (gameVar.hitPoint <= 0) {
					// Explosion Scene
					Crafty.e('ExplosionBG').attr({
						x:this.x-this.w,
						y:this.y-this.h
					});
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
	                if (gameVar.asteroidCount <= 0 && gameVar.enemyCount <= 0 && !gameVar.VSMode) {
	                    exitCurrentLevel();
	                }
                    return;
                }
                var oldxspeed = this.xspeed;
                this.xspeed = -this.yspeed;
                this.yspeed = oldxspeed;

                gameVar.asteroidCount ++;
                //split into two asteroids by creating another asteroid
                Crafty.e('Actor, '+size+', Collision, asteroid').attr({x: this._x, y: this._y});
            })
			.onHit('shipRed', function(e) {
				if (gameVar.VSMode) {
					console.log('Ship2 Collision at Asteroid Level');
					// Explosion scene
					Crafty.e('ExplosionSM').attr({
						x:this.x-this.w,
						y:this.y-this.h
					});
					// Play Collision Audio
					Crafty.audio.play('collision');
					// if destroyed by ship collision increment the score, decrease HP
					gameVar.score2 += 1;
					gameVar.scoreDisplay2.textContent = gameVar.score2;
					gameVar.hitPoint2 -= 1;
					gameVar.hpDisplay2.textContent = gameVar.hitPoint2;

					// End Game if HP is at 0
					if (gameVar.hitPoin2t <= 0) {
						// Explosion Scene
						Crafty.e('ExplosionBG').attr({
							x:this.x-this.w,
							y:this.y-this.h
						});
						player2.destroy();
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
		                if (gameVar.asteroidCount <= 0 && gameVar.enemyCount <= 0 && !gameVar.VSMode) {
		                    exitCurrentLevel();
		                }
	                    return;
	                }
	                var oldxspeed = this.xspeed;
	                this.xspeed = -this.yspeed;
	                this.yspeed = oldxspeed;

	                gameVar.asteroidCount ++;
	                //split into two asteroids by creating another asteroid
	                Crafty.e('Actor, '+size+', Collision, asteroid').attr({x: this._x, y: this._y});
				}
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

	// Function to add Second Player Ship - One Player Mode ONLY
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
			if (gameVar.level === 2) {
				player.decay = 0.99;
			}
			var secondShip;
			if (gameVar.ship2_reverse) {
				secondShip = Crafty.e('ShipStaticR, shipRed');
			} else if (gameVar.ship2_independent) {
				secondShip = Crafty.e('ShipStaticI, shipRed');
			} else {
				secondShip = Crafty.e('ShipStatic, shipRed');
			}
			secondShip.attr({
				w: gameVar.shipSize * gameVar.canvasScale,
				h: gameVar.shipSize * gameVar.canvasScale
			})
			.origin('center')
			.attr({
				x: player.x + (gameVar.shipSize * gameVar.canvasScale),
				y: player.y + (gameVar.shipSize * gameVar.canvasScale),

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
					this.x = player.x;
				} else {
					this.x = player.x + (gameVar.shipSize * gameVar.canvasScale);
				}
				this.y = player.y + (gameVar.shipSize * gameVar.canvasScale);
			});

			if (gameVar.ship2_180) {
				secondShip.rotation = 180;
			}

			if (gameVar.canvasFollow) {
				Crafty.viewport.follow(player, 0, 0);
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
		player.decay = 0.99;
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
					if (gameVar.hitPoint <= 0) {
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
				.onHit('ship', function(e) {
					console.log('Ship Collision with Enemy');
					// if destroyed by ship collision increment the score, decrease HP
					gameVar.score += 1;
					gameVar.scoreDisplay.textContent = gameVar.score;
					gameVar.hitPoint -= 1;
					gameVar.hpDisplay.textContent = gameVar.hitPoint;
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
					if (gameVar.hitPoint <= 0) {
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
