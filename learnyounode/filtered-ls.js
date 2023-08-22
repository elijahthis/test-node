const fs = require("fs");

fs.readdir(process.argv[2], (err, list) => {
	if (err) {
		console.log(err);
	} else {
		list.forEach((file) => {
			if (file.split(".")[1] === process.argv[3]) {
				console.log(file);
			}
		});
	}
});
