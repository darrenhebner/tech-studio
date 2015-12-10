var http = require("http"),
	url = require("url"),
	fs = require("fs"),
	io = require("socket.io");

var server = http.createServer(function(request, response){
var path = url.parse(request.url).pathname;
	
	// routing
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
		case '/mobile.html':
			fs.readFile(__dirname + path, function(error, data){
				if (error){
					response.writeHead(404);
					response.write("oops this doesn't exist - 404");
					response.end();
				}
				else{
					response.writeHead(200, {'Content-Type': "text/html"});
					response.write(data, "utf8");
					response.end();
				}
			});
			break;
		case '/scripts/visualization.js':
			fs.readFile(__dirname + path, function(error, data) {
				if (error){
					response.writeHead(404);
					response.write("oops this doesn't exist - 404");
					response.end();
				}
				else {
					response.writeHead(200, {'Content-Type': "text/html"});
					response.write(data, "utf8");
					response.end();
				}
			})
			break;
		case '/scripts/audio.js':
			fs.readFile(__dirname + path, function(error, data) {
				if (error){
					response.writeHead(404);
					response.write("oops this doesn't exist - 404");
					response.end();
				}
				else {
					response.writeHead(200, {'Content-Type': "text/html"});
					response.write(data, "utf8");
					response.end();
				}
			})
			break;
		case '/styles/style.css':
			fs.readFile(__dirname + path, function(error, data) {
				if (error){
					response.writeHead(404);
					response.write("oops this doesn't exist - 404");
					response.end();
				}
				else {
					response.writeHead(200, {'Content-Type': "text/css"});
					response.write(data, "utf8");
					response.end();
				}
			})
			break;
		case '/scripts/main.js':
			fs.readFile(__dirname + path, function(error, data) {
				if (error){
					response.writeHead(404);
					response.write("oops this doesn't exist - 404");
					response.end();
				}
				else {
					response.writeHead(200, {'Content-Type': "text/html"});
					response.write(data, "utf8");
					response.end();
				}
			})
			break;
		default:
			response.writeHead(404);
			response.write("oops this doesn't exist! - 404");
			response.end();
			break;
	}
});

// listen to port 8001
server.listen(8001);

var listener = io.listen(server);
listener.sockets.on('connection', function(socket){
	// when server recieves deviceorientation data, broadcast it to socket.html file
    socket.on('deviceMove', function(data){
    	socket.broadcast.emit('deviceData', data);
    })

    // when server recieves playMusic data, broadcast it to socket.html file
    socket.on('playMusic', function(data) {
    	socket.broadcast.emit('play', data);
    	socket.emit('connect', {'init': true});
    })
});