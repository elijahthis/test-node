const mymodule = require("./mymodule.js");

mymodule(process.argv[2], process.argv[3], (err, list = []) => {
	if (err) {
		console.log(err);
	} else {
		list.forEach((file) => {
			console.log(file);
		});
	}
});
