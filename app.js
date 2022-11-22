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
    res.render("admin", { rows });
  });
});
app.post("/find/allocation", (req, res) => {
  const { base2Max, base1Max, groundMax, floor1Max, floor2Max } = req.body;
  let max = {
    base2: Number(base2Max),
    base1: Number(base1Max),
    ground: Number(groundMax),
    floor1: Number(floor1Max),
    floor2: Number(floor2Max),
  };

  let gotPref = {
    first: 0,
    second: 0,
    third: 0,
    notGot: 0
  };

  const allocatedUsers = [];

  var sql = "select * from preference";
  db.all(sql, [], (err, members) => {
    if (err) res.status(400).json({ error: err.message });

    // loop each memeber
    if (!members.length) res.status(200).json({ msg: "No Data" });

    members.forEach((member) => {
      if(!member.name) return
      // if space is there on first preference

      if (max[member.first] > 0) {
        // push the user into that preference
        allocatedUsers.push({ name:member.name, allocated:member.first });
        max[member.first] = max[member.first] - 1;
        gotPref.first = gotPref.first + 1;
      }

      // if space is not there see second preference
      else if (max[member.second] > 0) {
        // push the user into that preference
        allocatedUsers.push({ name:member.name, allocated:member.second });
        max[member.second] = max[member.second] - 1;
        gotPref.second = gotPref.second + 1;
      }

      // if space is not there see third preference
      else if (max[member.third] > 0) {
        // push the user into that preference
        allocatedUsers.push({ name:member.name, allocated:member.third });
        max[member.third] = max[member.third] - 1;
        gotPref.third = gotPref.third + 1;
      }
      else {
        console.log(member);
        gotPref.notGot = gotPref.notGot + 1;
      }
    });
    res.render("result", { allocatedUsers, gotPref});
  });
});

// Listen on Port 5000
app.listen(port, () => console.info(`App listening on port ${port}`));
