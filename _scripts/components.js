// components in Game used

Crafty.paths({ audio: '_assets/', background: '_images/', sprites: '_images/', images: '_images/' });

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
            'map': { 'ship': [0,0]}
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
		this.collision()
		// Collision with Missile destroys asteroid
		.onHit('missile', function(e) {
			console.log('Missile Hits Aseroid');
            // Explosion scene
            Crafty.e('ExplosionSM').attr({
                x:this.x-this.w,
                y:this.y-this.h
            });
			// if hit by a missile increment the score
			gameVar.score += 1;
			gameVar.scoreDisplay.textContent = gameVar.score;
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
					exitCurrentLevel();
				}
				return;
			}

			var oldxspeed = this.xspeed;
			this.xspeed = -this.yspeed;
			this.yspeed = oldxspeed;

			gameVar.asteroidCount++;
			//split into two asteroids by creating another asteroid
			Crafty.e('Actor, '+size+', Collision, asteroid').attr({x: this._x, y: this._y});
		});
	}
});


// Enemy Large Component
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
        // Collision with ship Powers Up HP
        .onHit('ship', function(e) {
			console.log('Ship PU PowerUp');
            // if destroyed by ship collision increment the score, decrease HP
            gameVar.score += 1;
            gameVar.scoreDisplay.textContent = gameVar.score;
            gameVar.hitPoint += 5;
            gameVar.hpDisplay.textContent = gameVar.hitPoint;
			// Play Collision Audio
			Crafty.audio.play('warpout');
			this.destroy();

        });
    }
});

Crafty.c('PlayerShip', {
	init: function() {
		this.requires('Actor, Collision');
		this.attr({
			x: gameVar.playerX,
			y: gameVar.playerY,
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
		// Bind keyboard down press event to call move functions - boolean true triggers function
		.bind('KeyDown', function(e) {
			//on keydown, set the move booleans
			if(e.keyCode === Crafty.keys.RIGHT_ARROW) {
				this.move.right = true;
			} else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
				this.move.left = true;
			} else if(e.keyCode === Crafty.keys.UP_ARROW) {
				this.move.up = true;
			} else if (e.keyCode === Crafty.keys.CTRL || e.keyCode === Crafty.keys.SHIFT || e.keyCode === Crafty.keys.Z) {
				// console.log('Missile Fire');
				Crafty.audio.play('blast');

				var currentShip = this;
				//create a missile entity
				Crafty.e('Actor, missile')
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
			// End Game if HP is at 0
			// if (gameVar.hitPoint <= 0) {
			// 	this.destroy();
			// 	exitLevel();
			// }
		});
	}
});

//Second Ship To Capture
Crafty.c('Ship2', {
    init: function() {
        this.requires('Actor, Power, Collision');
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
        });
    }
});
