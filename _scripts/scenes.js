Crafty.scene('firstGame', function() {
	console.log('Level 1 Game Called');
    // Background - Space
    // Crafty.background("url('_images/space.png')");

	var backgroundAsset = Crafty.e('ImageObject, Image')
		.image("_images/star.png");

	// Variable to store initial player X & Y random position
	gameVar.playerX = Crafty.viewport.width * ((Math.random() * 0.6) + 0.2);
	gameVar.playerY = Crafty.viewport.height * ((Math.random() * 0.6) + 0.2);

	// Player Entity
	var player = Crafty.e('PlayerShip, ship')
		// Origin function changes the center point of move / rotation function. This allows for rotation to happen from the x / y center point of the sprite vs. the upper left point.
		.origin('center');

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
				scoreDisplay.textContent = gameVar.score;
				gameVar.hitPoint -= 1;
				hpDisplay.textContent = gameVar.hitPoint;

				// End Game if HP is at 0
				if (gameVar.hitPoint <= 0) {
					player.destroy();
					exitCurrentLevel();
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

    //function to fill the screen with asteroids & PowerUps by a random amount
    function initRocks(lower, upper) {
		if (upper < lower) {
			upper = lower;
		}
        var rocks = Crafty.math.randomInt(lower, upper);
		console.log("Initialize Asteroids: " + rocks);
        gameVar.asteroidCount = rocks;

        for(let i = 0; i < rocks; i++) {
            Crafty.e('rock_L, asteroid');
        }

		for(let i = 0; i < Math.floor(rocks/3); i++) {
            Crafty.e('starPower, PowerUp');
        }
    }

	// Function to add Second Player Ship
	function initShip2() {
		Crafty.e('shipRed, Ship2')
		.collision()
        // Collision with ship Powers Up HP
        .onHit('ship', function(e) {
			console.log('Ship PU Ship 2');
            // if destroyed by ship collision increment the score, decrease HP
            gameVar.score += 1;
            scoreDisplay.textContent = gameVar.score;

			// Play Collision Audio
			Crafty.audio.play('warpout');

			this.destroy();
			player.destroy();
			player = Crafty.e('PlayerShip, ship')
				.origin('center');
			var secondShip = Crafty.e('PlayerShip, shipRed')
				.origin('center')
				.attr({
					// x & y are set to player location
					x: player.x + gameVar.shipSize,
					y: player.y + gameVar.shipSize
				});
			if (gameVar.canvasFollow) {
				Crafty.viewport.follow(player, 0, 0);
			}
        });
	}

	Crafty.viewport.clampToEntities = false;
	Crafty.viewport.scale(gameVar.canvasScale);
	if (gameVar.canvasFollow) {
		Crafty.viewport.follow(player, 0, 0);
	}

	//first level has between 2 and variable # specified by the Game Settings
    initRocks(2, gameVar.maxAsteroids);
	// ADD Second Ship
	initShip2();

});
