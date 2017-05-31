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
	// 'background': {
	// 	'space': 'space.png',
	// 	'galaxy': 'galaxy.jpg'
	// },
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
        },
		'space.png': {
            'tile':  256,
            'tileh':  256,
            'map': { 'galaxy': [0,0]}
        }
    },
};

Crafty.load(assetsObj);

// An 'Actor' is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
    init: function () {
        this.requires('2D, Canvas');
		this.z = 1;
    },
});

// A Star is just an Actor with a certain color
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
	}
});

// Enemy Component
Crafty.c('Enemy', {
	init: function() {
		this.requires('Actor');
		// Origin determins pivot point of the object for movement.
		this.origin('center');
		this.attr({
			// x & y are random location
			x: Crafty.math.randomInt(0, Crafty.viewport.width),
			y: Crafty.math.randomInt(0, Crafty.viewport.height),
			// xspeed and yspeed are velocity of the enemy.
			xspeed: Crafty.math.randomInt(1, gameVar.maxEnemySpeed),
			yspeed: Crafty.math.randomInt(1, gameVar.maxEnemySpeed)
		})
		.bind('EnterFrame', function() {
			var enemyRotation = Crafty.math.randomInt(0, 2);
			this.x += this.xspeed;
			this.y += this.yspeed;
			this.rotation += enemyRotation * 5;

			// Determines variable to use for different rock sizes
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
	}
});
