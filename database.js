var sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE preference (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            first text, 
            second text, 
            third text
            )`,
        (err) => {
            if (err) {
                console.log("// Table already created");
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO preference (name, first, second, third) VALUES (?,?,?,?)'
                db.run(insert, ["Luis Clark", "base1", "first", "second"])
                db.run(insert, ["Jimmy James", "first", "second", "third"])
            }
        });  
    }
});


module.exports = db
