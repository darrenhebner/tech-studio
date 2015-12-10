# Using device orientation data to manipulate content

The goal of this project was to manipulate content in my desktop browser in real-time using device orientation data from my iPhone. I was able to do this with the help of Node.js and Socket.io.

## Setting up Node.js server

First, we need to set up a Node.js server to handle the data and routing. I set up a basic server with routing for each file. 

```
var http = require("http"),
	url = require("url"),
	fs = require("fs"),
	io = require("socket.io");

var server = http.createServer(function(request, response){
var path = url.parse(request.url).pathname;
	
	switch(path){
		case '/':
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write('hello world');
			response.end();
			break;
		case '/socket.html':
			fs.readFile(__dirname + path, function(error, data){
				if (error){
					response.writeHead(404);
					response.write("oops this doesn't exist - 404");
					reponse.end();
				}
				else{
					response.writeHead(200, {'Content-Type': "text/html"});
					response.write(data, "utf8");
					response.end();
				}
			});
			break;

			// repeat for each route
```

## Adding in Socket.io

In the html file that is served to my mobile device I added the following code. This code establishes a socket connection and adds an event listener to watch for deviceorientation events. The data from this event is then emitted via Socket.io to my Node.js server.

```
 // connect socket
    var socket = io.connect();

    // check if device supports device orientation
		if (window.DeviceOrientationEvent) {
      // listen for device orientation event
			window.addEventListener('deviceorientation', function(eventData){
				var tiltLR = eventData.gamma;
				var tiltFB = eventData.beta;
				var dir = eventData.alpha

        // send orientation data to server
				socket.emit('deviceMove', {'lr': tiltLR, 'fb': tiltFB, 'dir': dir});

				DeviceOrientationHandler(tiltLR, tiltFB, dir);
			}, false);
		} else {
			alert("not supported");
		}

```

### Socket.io on the server

On the server, I set up a listener that is listening for the data being emited from my mobile device. Socket.io then broadcasts this data.

```
listener.sockets.on('connection', function(socket){
	// when server recieves deviceorientation data, broadcast it to socket.html file
    socket.on('deviceMove', function(data){
    	socket.broadcast.emit('deviceData', data);
    })
});
```

### Recieving data in my desktop browser

In order to recieve the data being broadcast, I added to following code client side. When I recieve the device orientation data client side, I then used it to manipulate the position of three objects in the DOM. You could do whatever you like with this data.

```
// establish socket.io connection
var socket = io.connect();

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

})
```

