var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

		var renderer = new THREE.WebGLRenderer({alpha: true});
		renderer.setClearColor( 0xEEEEEE, 1);
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );

		var dir;
		var fb = 4;
		var socket = io.connect();
		socket.on('deviceData', function(data){
			var lr = Math.ceil(data.lr);
			fb = Math.ceil(data.fb);
			dir = Math.ceil(data.dir);
			setTimeout(function() {
				plane.rotation.z += ((dir * 0.06) - plane.rotation.z)*0.05;
			}, 60);
		})

		var geometry = new THREE.PlaneGeometry( 60, 60, 20, 20 );
		geometry.__dirtyVertices = true;
		geometry.dynamic = true;

		for (var i = 0, l = geometry.vertices.length; i < l; i++) {
		  geometry.vertices[i].z = fb * Math.random();
		}
		

		var material = new THREE.MeshBasicMaterial({
	        color : 0x666666,
	        wireframe : true
    	});

		var plane = new THREE.Mesh( geometry, material );
		scene.add( plane );
		plane.rotation.x = 90;

		camera.position.z = 60;

		console.log(plane);

		function render() {
			requestAnimationFrame( render );
			renderer.render( scene, camera );
		}
		render();