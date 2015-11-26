window.onload = init();
var audioCtx, oscillator, oscillator2, oscillator3, gainNode, biquadFilter;

function init() {
	audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	oscillator = audioCtx.createOscillator();
	oscillator2 = audioCtx.createOscillator();
	oscillator3 = audioCtx.createOscillator();
	gainNode = audioCtx.createGain();

	oscillator.connect(gainNode);
	oscillator2.connect(gainNode);
	oscillator3.connect(gainNode);
	gainNode.connect(audioCtx.destination);

	biquadFilter = audioCtx.createBiquadFilter();
	biquadFilter.type = "lowshelf";
	biquadFilter.frequency.value = 1000;
	biquadFilter.gain.value = 25;

	oscillator.type = 'sine'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
	oscillator.frequency.value = 440; // value in hertz
	oscillator.start();

	oscillator2.type = 'sine';
	oscillator2.frequency.value = 550;
	oscillator2.start();

	oscillator3.type = 'sine';
	oscillator3.frequency.value = 550;
	oscillator3.start();
}


var dir;
var socket = io.connect();
socket.on('message', function(data){
    console.log(data.letter);
});
socket.on('deviceData', function(data){
	var lr = Math.ceil(data.lr);
	var fb = Math.ceil(data.fb);
	dir = Math.ceil(data.dir);
	$("#lr").text(lr);
	$("#fb").text(fb);
	$("#dir").text(dir);

	oscillator.frequency.value = fb * 10;
	oscillator2.frequency.value = (fb * 10) * 1.25; // major third
	oscillator3.frequency.value = ((fb * 10) * 1.25) * 1.189; // minor third
	biquadFilter.frequency.value = lr;
})