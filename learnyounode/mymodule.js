const fs = require("fs");

module.exports = function printFileList(dirName, extension, callback) {
	fs.readdir(dirName, (err, list) => {
		if (err) {
			return callback(err);
		} else {
			list = list.filter((file) => file.split(".")[1] === extension);
			return callback(null, list);
		}
	});
};
