const http = require("http");

let collectedData = new Map([
	[1, ""],
	[2, ""],
	[3, ""],
]);

const makeRequest = (url, index, afterFunc = () => {}) =>
	http
		.get(url, (res) => {
			res.on("data", (data) => {
				collectedData.set(index, collectedData.get(index) + data.toString());
			});
			res.on("error", (err) => {
				console.log(err);
			});
			res.on("end", () => {
				afterFunc();
			});
		})
		.on("error", (err) => console.log(err));

makeRequest(process.argv[2], 1, () =>
	makeRequest(process.argv[3], 2, () =>
		makeRequest(process.argv[4], 3, () => {
			console.log(collectedData.get(1));
			console.log(collectedData.get(2));
			console.log(collectedData.get(3));
		})
	)
);
