window.onload = init();
var audioCtx, oscillator, oscillator2, oscillator3, oscillator4, oscillator5, gainNode;

function init() {
	audioCtx = new (window.AudioContext || window.webkitAudioContext)();

	//create oscillators
	oscillator = audioCtx.createOscillator();
	oscillator2 = audioCtx.createOscillator();
	oscillator3 = audioCtx.createOscillator();
	oscillator4 = audioCtx.createOscillator();
	oscillator5 = audioCtx.createOscillator();

	oscillatord = audioCtx.createOscillator();
	oscillatord2 = audioCtx.createOscillator();
	oscillatord3 = audioCtx.createOscillator();
	oscillatord4 = audioCtx.createOscillator();
	oscillatord5 = audioCtx.createOscillator();

	//create gainNode and set it's value to 0
	gainNode = audioCtx.createGain();
	gainNode.gain.value = 0;

	//connect it all together
	oscillator.connect(gainNode);
	oscillator2.connect(gainNode);
	oscillator3.connect(gainNode);
	oscillator4.connect(gainNode);
	oscillator5.connect(gainNode);

	oscillatord.connect(gainNode);
	oscillatord2.connect(gainNode);
	oscillatord3.connect(gainNode);
	oscillatord4.connect(gainNode);
	oscillatord5.connect(gainNode);

	gainNode.connect(audioCtx.destination);

	// configure oscillators
	oscillator.type = 'sawtooth'; // wave type
	oscillator.frequency.value = 440; // value in hertz
	oscillator.start();

	oscillator2.type = 'sine';
	oscillator2.frequency.value = 550;
	oscillator2.start();

	oscillator3.type = 'sawtooth';
	oscillator3.frequency.value = 550;
	oscillator3.start();

	oscillator4.type = 'sine';
	oscillator4.frequency.value = 550;
	oscillator4.start();

	oscillator5.type = 'sawtooth';
	oscillator5.frequency.value = 550;
	oscillator5.start();

	oscillatord.type = 'sawtooth'; 
	oscillatord.frequency.value = 440; 
	oscillatord.detune.value = 10; // detune value will add character to the synth tone
	oscillatord.start();

	oscillatord2.type = 'sine';
	oscillatord2.frequency.value = 550;
	oscillatord2.detune.value = 10;
	oscillatord2.start();

	oscillatord3.type = 'sawtooth';
	oscillatord3.frequency.value = 550;
	oscillatord3.detune.value = 10;
	oscillatord3.start();

	oscillatord4.type = 'sine';
	oscillatord4.frequency.value = 550;
	oscillatord4.detune.value = 10;
	oscillatord4.start();

	oscillatord5.type = 'sawtooth';
	oscillatord5.frequency.value = 550;
	oscillatord5.detune.value = 10;
	oscillatord5.start();
	
}

// colection of pitches in hertz 
var notes = {
			g2: 98,
			b3: 246.9,
			d4: 293.7,
			fSharp4: 370,
			a4: 440,
			a2: 110,
			a3: 220,
			cSharp4: 277.2,
			e4: 329.6,
			b2: 123.5,
			g3: 196
		};


// connect socket
var dir;
var socket = io.connect();

// play is broadcast, turn gain up to 0.1. Otherwise gain is 0.
socket.on('play', function(data) {
	if (data.play) {
		gainNode.gain.value = 0.1;
	} else {
		gainNode.gain.value = 0;
	}
});

// When device motion is triggered
socket.on('deviceData', function(data){
	// store orientation data
	var lr = Math.ceil(data.lr);
	var fb = Math.ceil(data.fb) + 90; // to offset the -90deg
	dir = Math.ceil(data.dir);
	
	// get reference to shapes
	var circle = document.querySelector("#circle");
	var triangle = document.querySelector("#triangle");
	var octagon = document.querySelector("#octagon");

	// move shapes left or right on tilt
	circle.style.left = ((lr * 100)/360) * 0.16 + 50 + "%";
	octagon.style.left = ((lr * 100)/360) * 0.32  + 50 + "%";
	triangle.style.left = ((lr * 100)/360) * 0.64 + 50 + "%";

	// rotate shapes on device rotation
	circle.style.transform = "rotate(" + dir + "deg) translate(-50%, -50%)";
	octagon.style.transform = "rotate(" + dir + "deg) translate(-50%, -50%)";
	triangle.style.transform = "rotate(" + dir + "deg) translate(-50%, -50%)";

	// move shapes up or down on tilt
	circle.style.top = (((fb - 90) * -100)/180) * 0.16 + 50 + "%";
	octagon.style.top = (((fb - 90) * -100)/180) * 0.32 + 50 +"%";
	triangle.style.top = (((fb - 90) * -100)/180) * 0.64 + 50 + "%";

	// portamento factor adjusts the slide between pitches
	var portamento = 0.9;

	// check front/back value and set pitches of oscillators accordingly
	setTimeout(function() {
		if ( fb < 60) {
			oscillator.frequency.value += (notes.g2 - oscillator.frequency.value) * portamento;
			oscillator2.frequency.value += (notes.b3 - oscillator2.frequency.value) * portamento;
			oscillator3.frequency.value += (notes.b3 - oscillator3.frequency.value) * portamento;
			oscillator4.frequency.value += (notes.d4 - oscillator4.frequency.value) * portamento;
			oscillator5.frequency.value += (notes.fSharp4 - oscillator5.frequency.value) * portamento;

			oscillatord.frequency.value += (notes.g2 - oscillatord.frequency.value) * portamento;
			oscillatord2.frequency.value += (notes.b3 - oscillatord2.frequency.value) * portamento;
			oscillatord3.frequency.value += (notes.b3 - oscillatord3.frequency.value) * portamento;
			oscillatord4.frequency.value += (notes.d4 - oscillatord4.frequency.value) * portamento;
			oscillatord5.frequency.value += (notes.fSharp4 - oscillatord5.frequency.value) * portamento;
		} else if ( fb > 60 && fb < 120 ) {
			oscillator.frequency.value += (notes.b2 - oscillator.frequency.value) * portamento;
			oscillator2.frequency.value += (notes.b3 - oscillator2.frequency.value) * portamento;
			oscillator3.frequency.value += (notes.d4 - oscillator3.frequency.value) * portamento;
			oscillator4.frequency.value += (notes.fSharp4 - oscillator4.frequency.value) * portamento;
			oscillator5.frequency.value += (notes.a4 - oscillator5.frequency.value) * portamento;

			oscillatord.frequency.value += (notes.b2 - oscillatord.frequency.value) * portamento;
			oscillatord2.frequency.value += (notes.b3 - oscillatord2.frequency.value) * portamento;
			oscillatord3.frequency.value += (notes.d4 - oscillatord3.frequency.value) * portamento;
			oscillatord4.frequency.value += (notes.fSharp4 - oscillatord4.frequency.value) * portamento;
			oscillatord5.frequency.value += (notes.a4 - oscillatord5.frequency.value) * portamento;
		} else if ( fb > 120 ) {
			oscillator.frequency.value += (notes.a2 - oscillator.frequency.value) * portamento;
			oscillator2.frequency.value += (notes.a3 - oscillator2.frequency.value) * portamento;
			oscillator3.frequency.value += (notes.cSharp4 - oscillator3.frequency.value) * portamento;
			oscillator4.frequency.value += (notes.e4 - oscillator4.frequency.value) * portamento;
			oscillator5.frequency.value += (notes.fSharp4 - oscillator5.frequency.value) * portamento;

			oscillatord.frequency.value += (notes.a2 - oscillatord.frequency.value) * portamento;
			oscillatord2.frequency.value += (notes.a3 - oscillatord2.frequency.value) * portamento;
			oscillatord3.frequency.value += (notes.cSharp4 - oscillatord3.frequency.value) * portamento;
			oscillatord4.frequency.value += (notes.e4 - oscillatord4.frequency.value) * portamento;
			oscillatord5.frequency.value += (notes.fSharp4 - oscillatord5.frequency.value) * portamento;
		}
	}, 60);
})