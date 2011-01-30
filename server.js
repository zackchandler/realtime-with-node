var http = require('http')
var url = require('url')
var fs = require('fs')
var io = require('socket.io')

function streamFileWithContentType(fileName, contentType, response){
	fs.readFile(__dirname + fileName, function(error, data){
		response.writeHead(200, { 'Content-Type': contentType })
		response.end(data, 'utf8')
	})
}

var server = http.createServer(function(request, response){
	var path = url.parse(request.url).pathname;
	
	console.log('path: ' + path)
	
	if (path === '/') {
		streamFileWithContentType('/index.html', 'text/html', response)
	} else if (path === '/jquery.js' || path === '/socket.io.js') {
		streamFileWithContentType(path, 'text/javascript', response)
	} else {
		response.writeHead(404)
		response.end('404')
	}

})

server.listen(4567)

var socketIOServer = io.listen(server)

socketIOServer.on('connection', function(client){
	client.on('message', function(message){
		client.broadcast({ message: message })
	})
})