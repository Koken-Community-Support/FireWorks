/* minifyOnSave, checkOutputFileAlreadyExists: false, checkAlreadyMinifiedFile: false, filenamePattern: $1.min.$2 */
/*! Fireworks fireworks.js
 *  Copyright  (c) 2015-2017 Bjarne Varoystrand - bjarne ○ kokensupport • com
 *  License: GPL
 *  @author Alfons Nilsson (https://aaserver.net)
 *  @author Bjarne Varoystrand (@black_skorpio)
 *  @version 1.1.0
 *  @description Fireworks for Koken, based on the original work of Alfins Nilsson
 *  http://varoystrand.se | http://kokensupport.com
**/
var canvasID	= "fireworks";
var textWrapp	= "fw_center";
var yearID		= "year";
var footWrap	= "fw_foot";

var devHost		= 'oxygen.local';
var deBugState	= 0;
var demoState	= 1;
var debugHash	= 'fireworksDebug';
var demoHash	= 'fireworksDemo';

var currentTime	= new Date();
var currentYear	= currentTime.getFullYear();
var NewYear		= currentTime.getFullYear() + 1;
var startDate	= new Date( startValue + '/' + currentYear ); // MM/DD/YYYY
var endDate		= new Date( endValue + '/' + NewYear );

var dateCheck	= currentTime > startDate && currentTime < endDate;
var debugCheck	= deBugState == 1 || ( location.hostname == devHost || location.hash == '#'+debugHash );
var demoCheck	= demoState == 1 && ( location.hash == '#'+demoHash );

var FwFooter		= document.getElementById( footWrap );
var FireworkText	= document.getElementById( textWrapp );
var FireworkCanvas	= document.getElementById( canvasID );

/* Only run once per session
   https://sharepoint.stackexchange.com/a/218571 */
var FireworksKey	= "KokenFireWorks";
var FireworksValue	= NewYear + '.'+ location.hostname;

function theBroom() {
	if( FwFooter !=null ) FwFooter.remove();
	if( FireworkText !=null ) FireworkText.remove();
	if( FireworkCanvas !=null ) FireworkCanvas.remove();
	if ( debugCheck ) console.log('cleaning');
};

if ( debugCheck ) {
	if ( dateCheck ) {
		console.log( currentTime + ' is in range ' + startDate + ' and ' + endDate );
	} else {
		console.log( currentTime + ' is not between ' + startDate + ' and ' + endDate );
	}
	if ( demoCheck ) console.log('Koken Fireworks is in demo mode');
}

if ( demoCheck || dateCheck && sessionStorage.getItem( FireworksKey ) !== FireworksValue ) {
	var gc = new GameCanvas( canvasID );

	var year;
	var yearCounter = 0;

	var gravity = 0.15;
	var fireworks = [new Firework()];
	var particles = [];
	var fireworkInterval;

	setInterval(function() {
		fireworkInterval = fireworks.push(new Firework());
	}, fireworksTime);

	window.onfocus = function() {
		fireworks = [];
		particles = [];
	}

	function start() {
		year = document.getElementById( yearID );
		year.innerHTML = "0";
	}

	function loop() {
		rect(0, 0, width, height, canvasBkgrd);

		for (var i = 0; i < fireworks.length; i++) {
			fireworks[i].update();
		}
		for (var i = 0; i < particles.length; i++) {
			particles[i].update();
		}

		year.innerHTML = Math.ceil(yearCounter);
		yearCounter += (NewYear - yearCounter) / 20;
	}

	function Firework() {
		var _this = this;
		this.x = Math.random() * width;
		this.y = height;
		this.vy = -(Math.random() * 5 + 10);
		this.color = "hsl(" + Math.random() * 360 + ", 100%, 50%)";

		this.update = function() {
			this.y += this.vy;
			this.vy += gravity;

			if (Math.abs(this.vy) <= 0.1) {
				for (var i = 0; i < 360; i++) {
					particles.push(new Particle(this.x, this.y, i, Math.random() * 5));
				}
				fireworks.splice(fireworks.indexOf(this), 1);
			}

			circle(this.x, this.y, 3, this.color);
		}

		function Particle(x, y, dir, power) {
			this.x = x;
			this.y = y;
			this.dir = dir;
			this.power = power;
			this.vx = Math.cos(this.dir * Math.PI / 180) * this.power;
			this.vy = Math.sin(this.dir * Math.PI / 180) * this.power;
			this.health = 100;
			this.hsl = _this.color.replace(/[^\d,]/g, '').split(',');

			this.update = function() {
				this.x += this.vx;
				this.y += this.vy;
				this.vx *= 0.98;
				this.vy *= 0.98;
				this.vy += gravity;

				this.health--;
				if (this.health <= 0)
					particles.splice(particles.indexOf(this), 1);

				rect(this.x - 2, this.y - 2, 4, 4, "hsla(" + this.hsl[0] + "," + this.hsl[1] + "%," + this.hsl[2] + "%," + this.health / 100 + ")");
				//circle(this.x, this.y, 2, "hsla(" + this.hsl[0] + "," + this.hsl[1] + "%," + this.hsl[2] + "%," + this.health / 100 + ")");
			}
		}
	}

	/* Fade out the whole thing
	  Stolen from:
	  https://stackoverflow.com/questions/29017379/how-to-make-fadeout-effect-with-pure-javascript*/
	setTimeout(function() {
		function fadeOutEffect() {
			var fadeEffect = setInterval(function () {
				if (!FireworkCanvas.style.opacity) {
					FireworkCanvas.style.opacity = 1;
					FireworkText.style.opacity = 1;
				}
				if (FireworkCanvas.style.opacity > 0) {
					FireworkCanvas.style.opacity -= 0.1;
					FireworkText.style.opacity -= 0.1;
					if (FireworkCanvas.style.opacity == 0) {
						theBroom();
					}
				} else {
					clearInterval(fadeEffect);
				}
			}, fadeTime);
		};
		fadeOutEffect();
		sessionStorage.setItem( FireworksKey, FireworksValue );
	}, waitTime);
} else {
	theBroom();
}
