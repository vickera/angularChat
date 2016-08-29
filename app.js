/**
 *  Starting the server and database
 **/
var express = require('express');
var app = express();
var serv = require('http').Server(app);

//
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(process.env.PORT);
console.log("Server started.");

/**
 *  Creating a socket for player
 **/
var SOCKET_LIST = {};

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
	//signing in and initializing
	socket.id = Math.floor(Math.random() * 100000000);
	SOCKET_LIST[socket.id] = socket;
	console.log(SOCKET_LIST[socket.id].id + ' connected.')
	for (var i in SOCKET_LIST) {
		SOCKET_LIST[i].emit('emitMsg', SOCKET_LIST[socket.id].id + ' is connected.');
	}
	
	socket.on('disconnect', function() {
		for (var i in SOCKET_LIST) {
			SOCKET_LIST[i].emit('emitMsg', SOCKET_LIST[socket.id].id + ' has disconnected.');
		}
		console.log(SOCKET_LIST[socket.id].id + ' disconnected.')
		delete SOCKET_LIST[socket.id];
	});

	//chat io
	socket.on('sendMsg', function(data) {
		var username = SOCKET_LIST[socket.id].username;
		for (var i in SOCKET_LIST) {
			SOCKET_LIST[i].emit('emitMsg', socket.id + ': ' + data.msg);
		}
	});
});