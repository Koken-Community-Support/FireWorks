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
var demoHost	= 'demo.kokensupport.com';
var demoState	= 0;
var debugHash	= 'fireworksDebug';
var demoHash	= 'fireworksDemo';

var currentTime	= new Date();
var currentYear	= currentTime.getFullYear();
if ( spanYear == 1 ) {
	var NewYear		= currentTime.getFullYear() + 1;
} else {
	var NewYear		= currentTime.getFullYear();
}
var startDate	= new Date( startValue + '/' + currentYear ); // MM/DD/YYYY
var endDate		= new Date( endValue + '/' + NewYear );

var dateCheck	= currentTime > startDate && currentTime < endDate;
var debugCheck	= deBugState == 1 || ( location.hostname == devHost || location.hash == '#'+debugHash );
var demoCheck	= ( demoState == 1 || location.hash == '#'+demoHash ) || location.hostname == demoHost;

var FwFooter		= document.getElementById( footWrap );
var FireworkText	= document.getElementById( textWrapp );
var FireworkCanvas	= document.getElementById( canvasID );

/* Only run once per session
   https://sharepoint.stackexchange.com/a/218571 */
var FireworksKey	= "KokenFireWorks";
var FireworksValue	= NewYear + '.'+ location.hostname;
var storageCheck = sessionStorage.getItem( FireworksKey ) !== FireworksValue;

function theBroom() {
	if( FwFooter !=null ) FwFooter.remove();
	if( FireworkText !=null ) FireworkText.remove();
	if( FireworkCanvas !=null ) FireworkCanvas.remove();
	if ( debugCheck ) console.info('Cleaning up after the Fireworks');
};

if ( debugCheck ) {
	function deBugger() {
		var _csl			= console;
		var consoleHeader	= 'font:1.5em sans-serif; color:orange;';
		var consoleBody		= 'font:1 sans-serif;';
		var consoleOkClr	= 'color:green;';
		var consoleNopeClr	= 'color:red;';
		var consoleDivider	= '\n--------------------------------------------------\n\n';

		_csl.debug('%c-=- Koken Fireworks is in debug mode -=-', consoleHeader );

		if ( dateCheck ) {
			_csl.debug('%c' + currentTime + ' is in range ' + startDate + ' and ' + endDate, consoleBody + consoleOkClr, consoleDivider );
		} else {
			_csl.debug('%c' + currentTime + ' is not between ' + startDate + ' and ' + endDate, consoleBody + consoleNopeClr, consoleDivider );
		}

		if ( demoCheck ) _csl.debug('%c-=- Koken Fireworks is in demo mode -=-', consoleHeader );

		_csl.debug('%c-=- The Element ID\'s -=-', consoleHeader );
		_csl.debug('canvasID: #' + canvasID + '\n' +
		'textWrapp: #' + textWrapp + '\n' +
		'yearID: #' + yearID + '\n' +
		'footWrap: #' + footWrap +
		consoleDivider );

		_csl.debug('%c-=- Debug info -=-', consoleHeader );
		_csl.debug('devHost: ' + devHost + '\n' +
		'deBugState: ' + deBugState + '\n' +
		'debugHash: #' + debugHash + '\n' +
		'demoState: ' + demoState + '\n' +
		'demoHost: ' + demoHost + '\n' +
		'demoHash: #' + demoHash +
		consoleDivider);

		_csl.debug('%c-=- Checks -=-', consoleHeader );
		_csl.debug('dateCheck: ' + dateCheck + '\n' +
		'debugCheck: ' + debugCheck + '\n' +
		'demoCheck: ' + demoCheck + '\n' +
		'spanYear: ' + spanYear +
		consoleDivider);

		_csl.debug('%c-=- Dates and timings -=-', consoleHeader );
		_csl.debug('currentTime: ' + currentTime + '\n' +
		'currentYear: ' + currentYear + '\n' +
		'NewYear: ' + NewYear + '\n' +
		'startDate: ' + startDate + '\n' +
		'endDate: ' + endDate + '\n' +
		'waitTime: ' + waitTime + 'ms' + '\n' +
		'fadeTime: ' + fadeTime + 'ms' + '\n' +
		'fireworksTime: ' + fireworksTime + 'ms' +
		consoleDivider);

		_csl.debug('%c-=- Objects -=-', consoleHeader );
		_csl.debug('FwFooter: ' + FwFooter + '\n' +
		'FireworkText: ' + FireworkText + '\n' +
		'FireworkCanvas: ' + FireworkCanvas +
		consoleDivider);

		_csl.debug('%c-=- Session Storage -=-', consoleHeader );
		_csl.debug('FireworksKey: ' + FireworksKey + '\n' +
		'FireworksValue: ' + FireworksValue );
	}
	deBugger();
}

//if ( ( demoCheck && sessionStorage.getItem( FireworksKey ) !== FireworksValue ) || ( dateCheck && sessionStorage.getItem( FireworksKey ) !== FireworksValue ) ) {
if ( ( demoCheck || dateCheck ) && storageCheck ) {
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
