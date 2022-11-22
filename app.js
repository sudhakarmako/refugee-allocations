const express = require("express");
const bodyParser = require("body-parser");
var db = require("./database.js");

const app = express();
const port = 4040;

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Routes
app.get("", (req, res) => res.render("index"));

app.post("/add/refugee", (req, res) => {
  const { fullName, firstChoice, secondChoice, thirdChoice } = req.body;
  var insert =
    "INSERT INTO preference (name, first, second, third) VALUES (?,?,?,?)";
  db.run(insert, [fullName, firstChoice, secondChoice, thirdChoice]);
  res.status(200).redirect("/");
});

app.get("/admin", (req, res) => {
  var sql = "select * from preference";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) res.status(400).json({ error: err.message });
    res.render("admin", {rows} )
  });
});

// Listen on Port 5000
app.listen(port, () => console.info(`App listening on port ${port}`));
