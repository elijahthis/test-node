const express = require("express");
const { createReadStream } = require("fs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { randomBytes } = require("crypto");

// database
const USER_DB = new Map([
	["user", "pass"],
	["elijah", "pass"],
]);
const BALANCES = new Map([
	["user", 500],
	["elijah", 1000],
]);
const SESSIONS_DB = new Map([
	[121101, { username: "user", device: "Mac", expiry: new Date() }],
]); // sessionID: {username, device, expiry}

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
	const sessionID = req.cookies.sessionID;

	console.log(SESSIONS_DB);

	const username = SESSIONS_DB.get(sessionID)?.username;
	const balance = BALANCES.get(username);
	if (username) {
		res.send(`
		Hi <b>${username}</b>! Your balance is $${balance}
		<form method="POST" action="/transfer">
		Send amount: <input name="amount" type="number" />
		To user: <input name="to" type="text" />
		<button type="submit">Send</button>
		</form> 
		`);
	} else createReadStream("index.html").pipe(res);
});

app.post("/login", (req, res) => {
	if (USER_DB.has(req.body.username)) {
		if (USER_DB.get(req.body.username) === req.body.password) {
			const currSessionId = randomBytes(16).toString("base64");
			res.cookie("sessionID", currSessionId, {
				httpOnly: true,
				// secure: true,
				sameSite: "lax",
			});
			SESSIONS_DB.set(currSessionId, {
				username: req.body.username,
				device: "Mac",
				expiry: new Date(Date.now() + 2 * (60 * 60 * 1000)),
			});
			// res.send("Login successful");
			res.redirect("/");
		} else {
			res.send("Invalid password");
		}
	} else {
		res.send("Invalid Username");
	}
});

app.post("/transfer", (req, res) => {
	const sessionID = req.cookies.sessionID;
	const username = SESSIONS_DB.get(sessionID)?.username;
	const balance = BALANCES.get(username);

	if (!username) {
		res.send("You are not logged in. Go away!");
		return;
	}
	if (balance < req.body.amount) {
		res.send("Not enough money");
		return;
	}
	if (!USER_DB.has(req.body.to)) {
		res.send("User does not exist");
		return;
	}

	BALANCES.set(username, balance - req.body.amount);
	BALANCES.set(
		req.body.to,
		BALANCES.get(req.body.to) + Number(req.body.amount)
	);
	res.redirect("/");
});

app.get("/logout", (req, res) => {
	res.clearCookie("sessionID", {
		httpOnly: true,
		// secure: true,
		sameSite: "lax",
	});
	SESSIONS_DB.delete(req.cookies.sessionID);
	res.redirect("/");
});

app.listen(3000);

// the idea here is to create a value(sessionID) that can be destroyed whenever the user logs out or the session expires
// the sessionID is stored in the cookie
// the sessionID is also stored in the SESSIONS_DB
// the SESSIONS_DB is a map of sessionID to {username, device, expiry}
// the expiry is a date object that is set to 2 hours from the current time
// this is safer than just storing the username in the cookie because the username can be changed by the user
// it is also better than signing the cookie because the user can still see the cookie and change it, or copy it to another device and have access to the account forever
