const http = require("http");

let collectedData = "";

http
	.get(process.argv[2], (res) => {
		res.on("data", (data) => {
			collectedData += data.toString();
		});
		res.on("error", (err) => {
			console.log(err);
		});
		res.on("end", () => {
			console.log(collectedData.length);
			console.log(collectedData);
		});
	})
	.on("error", (err) => {
		console.log(err);
	});
