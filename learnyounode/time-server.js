const net = require("net");

const port = process.argv[2];
const server = net.createServer((socket) => {
	socket.end(
		`${new Date().toISOString().slice(0, 10)} ${new Date()
			.toTimeString()
			.slice(0, 5)}\n`
	);
});

server.listen(port);
