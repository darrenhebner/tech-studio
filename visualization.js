var scene, camera, renderer;
 
 init();
 animate();

 function init() {
 	scene = new THREE.Scene();
 	var WIDTH = window.innerWidth,
 		HEIGHT = window.innerHeight;

 	renderer = new THREE.WebGLRenderer({antialias:true});
 	renderer.setSize(WIDTH, HEIGHT);
 	document.body.appendChild(renderer.domElement);

 	camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000);
 	camera.position.set(0,6,0);
 	scene.add(camera);

 	window.addEventListender('resize', function() {
 		var WIDTH = window.innerWidth,
 			HEIGHT = window.innerHeight;
 		renderer.setSize(WIDTH, HEIGHT);
 		camera.aspect = WIDTH / HEIGHT;
 		camera.updateProjectionMatrix();
 	});

 	renderer.setClearColorHex(0x33F47, 1);

 	var light = new THREE.PointLight(0xffffff);
 	light.position.set(-100,200,100);
 	scene.add(light);

 	renderer.render(scene, camera);
 	controls.update;

 }