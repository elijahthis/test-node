const net = require("net");

const socket = net.createConnection({
	host: "example.com",
	port: 80,
});

const request = `
GET / HTTP/1.1
Host: example.com

`.slice(1);

socket.write(request);

socket.pipe(process.stdout);
