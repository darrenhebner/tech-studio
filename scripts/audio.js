window.onload = init();
var audioCtx, oscillator, oscillator2, oscillator3, oscillator4, oscillator5, gainNode, biquadFilter;

function init() {
	audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	oscillator = audioCtx.createOscillator();
	oscillator2 = audioCtx.createOscillator();
	oscillator3 = audioCtx.createOscillator();
	oscillator4 = audioCtx.createOscillator();
	oscillator5 = audioCtx.createOscillator();

	gainNode = audioCtx.createGain();
	gainNode.gain.value = 0.03; //reduce the volume by half

	oscillator.connect(gainNode);
	oscillator2.connect(gainNode);
	oscillator3.connect(gainNode);
	oscillator4.connect(gainNode);
	oscillator5.connect(gainNode);

	gainNode.connect(audioCtx.destination);

	biquadFilter = audioCtx.createBiquadFilter();
	biquadFilter.type = "lowshelf";
	biquadFilter.frequency.value = 1000;
	biquadFilter.gain.value = 25;

	oscillator.type = 'sawtooth'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
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
}

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
			g4: 392
		};



var dir;
var socket = io.connect();
socket.on('message', function(data){
    console.log(data.letter);
});
socket.on('deviceData', function(data){
	var lr = Math.ceil(data.lr);
	var fb = Math.ceil(data.fb) + 90; // to offset the -90deg
	dir = Math.ceil(data.dir);
	$("#lr").text(lr);
	$("#fb").text(fb);
	$("#dir").text(dir);

	//gainNode.gain.value = lr;

	var portamento = 0.3;
	setTimeout(function() {
		if ( fb < 60) {
			oscillator.frequency.value += (notes.g2 - oscillator.frequency.value) * portamento;
			oscillator2.frequency.value += (notes.b3 - oscillator2.frequency.value) * portamento;
			oscillator3.frequency.value += (notes.d4 - oscillator3.frequency.value) * portamento;
			oscillator4.frequency.value += (notes.fSharp4 - oscillator4.frequency.value) * portamento;
			oscillator5.frequency.value += (notes.g4 - oscillator5.frequency.value) * portamento;
		} else if ( fb > 60 && fb < 120 ) {
			oscillator.frequency.value += (notes.b2 - oscillator.frequency.value) * portamento;
			oscillator2.frequency.value += (notes.b3 - oscillator2.frequency.value) * portamento;
			oscillator3.frequency.value += (notes.d4 - oscillator3.frequency.value) * portamento;
			oscillator4.frequency.value += (notes.fSharp4 - oscillator4.frequency.value) * portamento;
			oscillator5.frequency.value += (notes.a4 - oscillator5.frequency.value) * portamento;
		} else if ( fb > 120 ) {
			oscillator.frequency.value += (notes.a2 - oscillator.frequency.value) * portamento;
			oscillator2.frequency.value += (notes.a3 - oscillator2.frequency.value) * portamento;
			oscillator3.frequency.value += (notes.cSharp4 - oscillator3.frequency.value) * portamento;
			oscillator4.frequency.value += (notes.e4 - oscillator4.frequency.value) * portamento;
			oscillator5.frequency.value += (notes.fSharp4 - oscillator5.frequency.value) * portamento;
		}
	}, 60);
	biquadFilter.frequency.value = lr;
})