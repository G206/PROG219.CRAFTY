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
        'missile.png': {
            'tile': 16,
            'tileh': 28,
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
        }
    },
};

Crafty.load(assetsObj);

// An 'Actor' is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
    init: function () {
        this.requires('2D, Canvas');
    },
});

// A Star is just an Actor with a certain color
Crafty.c('Star', {
    init: function () {
        this.requires('Actor, Color, Solid')
          .color('rgb(192, 192, 192)');
    },
});

//Asteroid component
Crafty.c('Rock', {
	init: function() {
		this.requires('Actor');
		// Origin determins pivot point of the object for movement.
		this.origin('center');
		this.attr({
			// x & y are random location
			x: Crafty.math.randomInt(0, Crafty.viewport.width),
			y: Crafty.math.randomInt(0, Crafty.viewport.height),
			// xspeed and yspeed are velocity of the asteroid.
			xspeed: Crafty.math.randomInt(1, gameVar.asteroidMaxSpeed),
			yspeed: Crafty.math.randomInt(1, gameVar.asteroidMaxSpeed),
			// rspeed is the rotational speed of the spin
			rspeed: Crafty.math.randomInt(-gameVar.asteroidMaxSpeed, gameVar.asteroidMaxSpeed)
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
	}
});

// Enemy Component
Crafty.c('Enemy', {
	init: function() {
		this.requires('Actor, Collision');
		// Origin determins pivot point of the object for movement.
		this.origin('center');
		this.attr({
			// x & y are random location
			x: Crafty.math.randomInt(0, Crafty.viewport.width),
			y: Crafty.math.randomInt(0, Crafty.viewport.height),
			// xspeed and yspeed are velocity of the enemy.
			xspeed: Crafty.math.randomInt(1, 5),
			yspeed: Crafty.math.randomInt(1, 5)
		})
		.bind('EnterFrame', function() {
			var enemyRotation = Crafty.math.randomInt(-1, 1);
			this.x += this.xspeed;
			this.y += this.yspeed;
			this.rotation += enemyRotation * 5;

			// Determines variable to use for different rock sizes
			var enemySize;
			if (this.has('rock_L')) {
				enemySize = gameVar.rockL;
			} else if (this.has('rock_M')) {
				enemySize = gameVar.rockM;
			} else if (this.has('rock_S')) {
				enemySize = gameVar.rockS;
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
	}
});

// Crafty.c('playerShip', {
//     init: function(){
//         // Origin function changes the center point of move / rotation function. This allows for rotation to happen from the x / y center point of the sprite vs. the upper left point.
//         this.requires('Actor, ship, Controls');
//         this.origin('center');
//         this.attr({
//             x:Crafty.viewport.width * ((Math.random() * 0.6) + 0.2),
//             y:Crafty.viewport.height * ((Math.random() * 0.6) + 0.2),
//             // w:20,
//             // h:40,
//             // Move object is a collection of possible move property values to determine what actions are allowed and bound to keyboard action.
//             move: {left: false, right: false, up: false, down: false},
//             // xspeed and yspeed is used determine speed of the player object. Starts at 0 stationary
//             xspeed: 0,
//             yspeed: 0,
//             decay: 0.95, // Variable to control rate of slow down when forward move is stopped. Higher value adds more perpetual motion. 1 value is no slow down.
//             score: 0,
//             hp: 10      // Hit Point counter
//         })
//         // .color('blue')
//         // Bind keyboard down press event to call move functions - boolean true triggers function
//         .bind('KeyDown', function(e) {
//             //on keydown, set the move booleans
//             if(e.keyCode === Crafty.keys.RIGHT_ARROW) {
//                 this.move.right = true;
//             } else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
//                 this.move.left = true;
//             } else if(e.keyCode === Crafty.keys.UP_ARROW) {
//                 this.move.up = true;
//             } else if (e.keyCode === Crafty.keys.SPACE) {
//                 console.log('Blast');
//
//                 //create a missile entity
//                 Crafty.e('2D, Canvas, missile')
//                     .attr({
//                         x: this._x + 40,
//                         y: this._y + 40,
//                         // w: 15,
//                         // h: 15,
//                         rotation: this._rotation,
//                         // Speed of the missile - BOTH X & Y needs to match
//                         xspeed: 15 * Math.sin(this._rotation / 57.3),
//                         yspeed: 15 * Math.cos(this._rotation / 57.3)
//                     })
//                     // .color('rgb(255, 0, 0)')
//                     // Binds action to EnterFrame event function in Crafty.js
//                     .bind('EnterFrame', function() {
//                         this.x += this.xspeed;
//                         this.y -= this.yspeed;
//
//                         //destroy if it goes out of bounds
//                         if(this._x > Crafty.viewport.width || this._x < 0 || this._y > Crafty.viewport.height || this._y < 0) {
//                             this.destroy();
//                         }
//                     });
//             }
//         })
//         // Bind keyboard up press event to stop move functions - boolean false triggers stop
//         .bind('KeyUp', function(e) {
//             //on key up, set the move booleans to false
//             if(e.keyCode === Crafty.keys.RIGHT_ARROW) {
//                 this.move.right = false;
//             } else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
//                 this.move.left = false;
//             } else if(e.keyCode === Crafty.keys.UP_ARROW) {
//                 this.move.up = false;
//             }
//         })
//         // Binds action to EnterFrame event function in Crafty.js
//         // Combined with keyboard events, this is how the player is moved around the screen
//         .bind('EnterFrame', function() {
//             if(this.move.right) this.rotation += 5;
//             if(this.move.left) this.rotation -= 5;
//
//             //acceleration and movement vector
//             var vx = Math.sin(this._rotation * Math.PI / 180) * 0.3,
//                 vy = Math.cos(this._rotation * Math.PI / 180) * 0.3;
//
//             //if the move up is true, increment the y/xspeeds
//             if(this.move.up) {
//                 this.yspeed -= vy;
//                 this.xspeed += vx;
//             } else {
//                 //if released, slow down the ship
//                 this.xspeed *= this.decay;
//                 this.yspeed *= this.decay;
//             }
//
//             //move the ship by the x and y speeds or movement vector
//             this.x += this.xspeed;
//             this.y += this.yspeed;
//
//             //if ship goes out of bounds, put him back
//             if(this._x > Crafty.viewport.width) {
//                 this.x = -64;
//             }
//             if(this._x < -64) {
//                 this.x =  Crafty.viewport.width;
//             }
//             if(this._y > Crafty.viewport.height) {
//                 this.y = -64;
//             }
//             if(this._y < -64) {
//                 this.y = Crafty.viewport.height;
//             }
//         });
//     }
// });
