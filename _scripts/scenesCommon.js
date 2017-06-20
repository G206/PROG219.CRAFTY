Crafty.scene('common', function() {
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

    //first level has between 2 and variable # specified by the Game Settings
    initRocks(2, gameVar.maxAsteroids);

});
