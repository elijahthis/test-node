const express = require("express");
const { createReadStream } = require("fs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const USER_DB = new Map([
	["user", "pass"],
	["elijah", "password"],
]);

const BALANCES = new Map([
	["user", 500],
	["elijah", 1000],
]);

// const USER_DB = {user:pass}

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
	const username = req.cookies.username;
	const balance = BALANCES.get(username);
	if (username) {
		res.send(`Hi ${username}! Your balance is $${balance}`);
	} else createReadStream("index.html").pipe(res);
});

app.post("/login", (req, res) => {
	if (USER_DB.has(req.body.username)) {
		if (USER_DB.get(req.body.username) === req.body.password) {
			res.cookie("username", req.body.username);
			res.send("Login successful");
		} else {
			res.send("Invalid password");
		}
	} else {
		res.send("Invalid Username");
	}
});

app.get("/logout", (req, res) => {
	res.clearCookie("username");
	res.redirect("/");
});

app.listen(3000);
