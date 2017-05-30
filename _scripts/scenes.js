Crafty.scene('firstGame', function() {
    console.log("firstGame Scene Started");
    // Background - Space
    Crafty.background("url('_images/space.png')");

    //score display
    var score = Crafty.e('2D, DOM, Text')
        .text('Score: 0')
        .attr({x: Crafty.viewport.width - 100, y: Crafty.viewport.height - 50, w: 200, h:50})
        .css({color: 'grey'});
    //Hit Point display
    var hitPoint = Crafty.e('2D, DOM, Text')
        .text('Hit Point: 10')
        .attr({x: Crafty.viewport.width - 100, y: Crafty.viewport.height - 25, w: 200, h:50})
        .css({color: 'red'});

    var player = Crafty.e('Actor, ship, Collision')
        .attr({
            x:Crafty.viewport.width * ((Math.random() * 0.6) + 0.2),
            y:Crafty.viewport.height * ((Math.random() * 0.6) + 0.2),
            // w:20,
            // h:40,
            // Move object is a collection of possible move property values to determine what actions are allowed and bound to keyboard action.
            move: {left: false, right: false, up: false, down: false},
            // xspeed and yspeed is used determine speed of the player object. Starts at 0 stationary
            xspeed: 0,
            yspeed: 0,
            decay: 0.95, // Variable to control rate of slow down when forward move is stopped. Higher value adds more perpetual motion. 1 value is no slow down.
            score: 0,
            hp: 10      // Hit Point counter
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
                console.log('Blast');

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
                        if(this._x > Crafty.viewport.width || this._x < 0 || this._y > Crafty.viewport.height || this._y < 0) {
                            this.destroy();
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

            //if ship goes out of bounds, put him back
            if(this._x > Crafty.viewport.width) {
                this.x = -64;
            }
            if(this._x < -64) {
                this.x =  Crafty.viewport.width;
            }
            if(this._y > Crafty.viewport.height) {
                this.y = -64;
            }
            if(this._y < -64) {
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
            this.requires('Actor, Collision');
            // Origin determins pivot point of the object for movement.
            this.origin('center');
            this.attr({
                // x & y are random location
                x: Crafty.math.randomInt(0, Crafty.viewport.width),
                y: Crafty.math.randomInt(0, Crafty.viewport.height),
                // xspeed and yspeed are velocity of the asteroid.
                xspeed: Crafty.math.randomInt(1, 5),
                yspeed: Crafty.math.randomInt(1, 5),
                // rspeed is the rotational speed of the spin
                rspeed: Crafty.math.randomInt(-5, 5)
            })
            .bind('EnterFrame', function() {
                this.x += this.xspeed;
                this.y += this.yspeed;
                this.rotation += this.rspeed;

                if(this._x > Crafty.viewport.width) {
                    this.x = -64;
                }
                if(this._x < -64) {
                    this.x =  Crafty.viewport.width;
                }
                if(this._y > Crafty.viewport.height) {
                    this.y = -64;
                }
                if(this._y < -64) {
                    this.y = Crafty.viewport.height;
                }
            }).collision()
            // Collision with Missile destroys asteroid
            .onHit('missile', function(e) {
                // if hit by a missile increment the score
                player.score += 1;
                score.text('Score: '+player.score);
                e[0].obj.destroy(); //destroy the missile

                var size;
                //decide what size to make the asteroid
                if(this.has('rock_L')) {
                    this.removeComponent('rock_L').addComponent('rock_M');
                    size = 'rock_M';
                } else if(this.has('rock_M')) {
                    this.removeComponent('rock_M').addComponent('rock_S');
                    size = 'rock_S';
                } else if(this.has('rock_S')) { //if the lowest size, delete self
                    gameVar.asteroidCount--;
                    this.destroy();
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
                // if destroyed by ship collision increment the score, decrease HP
                player.score += 1;
                score.text('Score: '+player.score);
                player.hp -= 1;
                hitPoint.text('HitPoint: '+ player.hp);

                // End Game if HP is at 0
                if (player.hp <= 0) {
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
                } else if(this.has('rock_S')) { //if the lowest size, delete self
                    gameVar.asteroidCount--;
                    this.destroy();
                    return;
                }

                var oldxspeed = this.xspeed;
                this.xspeed = -this.yspeed;
                this.yspeed = oldxspeed;

                gameVar.asteroidCount++;
                //split into two asteroids by creating another asteroid
                Crafty.e('2D, Canvas, '+size+', Collision, asteroid').attr({x: this._x, y: this._y});
            });
        }
    });


    //function to fill the screen with asteroids by a random amount
    function initRocks(lower, upper) {
        var rocks = Crafty.math.randomInt(lower, upper);
        gameVar.asteroidCount = rocks;
        gameVar.lastCount = rocks;

        for(var i = 0; i < rocks; i++) {
            Crafty.e('rock_L, asteroid');
        }
    }
    //first level has between 1 and 5 asteroids
    initRocks(1, 5);
});
