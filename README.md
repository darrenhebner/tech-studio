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
```