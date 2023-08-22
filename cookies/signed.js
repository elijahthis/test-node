const express = require("express");
const { createReadStream } = require("fs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const USER_DB = new Map([
	["user", "piss"],
	["elijah", "password"],
]);

const BALANCES = new Map([
	["user", 500],
	["elijah", 1000],
]);

// const USER_DB = {user:pass}

const COOKIE_SECRET = "SSdshftDT454DFsdRERRR";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(COOKIE_SECRET));

app.get("/", (req, res) => {
	const username = req.signedCookies.username;
	const balance = BALANCES.get(username);
	if (username) {
		res.send(`Hi ${username}! Your balance is $${balance}`);
	} else createReadStream("index.html").pipe(res);
});

app.post("/login", (req, res) => {
	if (USER_DB.has(req.body.username)) {
		if (USER_DB.get(req.body.username) === req.body.password) {
			res.cookie("username", req.body.username, { signed: true });
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

// the cookie-parser middleware parses cookies from the request headers, and makes them available in req.cookies
// the cookie-parser middleware also signs cookies, and makes them available in req.signedCookies
// the cookie-parser middleware takes a secret as an argument, and uses it to sign cookies
// signing cookies prevents users from tampering with them
// VULNERABILITY: if a user can guess the secret, they can sign their own cookies
// VULNERABILITY: if a user copies another user's signed cookie, they can use it to impersonate that user forever
