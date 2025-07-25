const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

let db = new sqlite3.Database(
  path.join(__dirname, "../databases/database.db"),
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the database.");
  }
);

app.post("/adminlogin", (req, res) => {
  const { email, password } = req.body;
  db.get(
    "SELECT * FROM admin WHERE email = ? AND password = ?",
    [email, password],
    (err, row) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (row) {
        return res.json({ success: "Logged in successfully." });
      } else {
        return res.status(401).json({ error: "Invalid login credentials." });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT * FROM teamlid WHERE email = ? AND password = ?",
    [email, password],
    (err, row) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (row) {
        const sql = `INSERT INTO antwoorden (email) VALUES (?)`;
        db.run(sql, [email], function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          return res.json({ success: "Logged in successfully." });
        });
      } else {
        return res.status(401).json({ error: "Invalid login credentials." });
      }
    }
  );
});

app.get("/overview", (req, res) => {
  db.all("SELECT id, vraag, type, opties FROM vragen", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.json(rows);
  });
});

app.get("/answers", (req, res) => {
  db.all("SELECT teamlid, vragen, antwoorden FROM antwoord", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.json(rows);
  });
});

app.post("/addQuestion", (req, res) => {
  // Controleer of de gebruiker een admin is
  const isAdmin = true; // Vervang dit met de werkelijke controle voor admin

  if (!isAdmin) {
    return res.status(401).json({ error: "Ongeautoriseerde toegang" });
  }

  // Vervolg met de rest van de code om de vraag toe te voegen
  const { vraag, type, opties, is_anoniem, teamlid_naam } = req.body;

  if (!vraag || !type) {
    return res
      .status(400)
      .json({ error: "Vraag en type zijn verplichte velden." });
  }

  const sql = `INSERT INTO vragen (vraag, type, opties, is_anoniem, teamlid_naam)
               VALUES (?, ?, ?, ?, ?)`;

  db.run(sql, [vraag, type, opties, is_anoniem, teamlid_naam], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    return res.json({ message: "Vraag toegevoegd", id: this.lastID });
  });
});

app.post("/editQuestion", (req, res) => {
  const { question, newQuestion, type, options } = req.body;

  // Controleer of de gebruiker een administrator is (je kunt dit op verschillende manieren implementeren, bijvoorbeeld via authenticatie of autorisatie)
  const isAdmin = true; // Vervang dit met je eigen implementatie van de controle

  if (!isAdmin) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (!newQuestion) {
    return res.status(400).json({ error: "New question cannot be empty" });
  }

  // Update de vraag in de database
  const query =
    "UPDATE vragen SET vraag = ?, type = ?, opties = ? WHERE vraag = ?";
  db.run(query, [newQuestion, type, options, question], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.json({ success: "Question updated successfully" });
  });
});

app.post("/deleteQuestion", (req, res) => {
  const { question } = req.body;

  db.run("DELETE FROM vragen WHERE vraag = ?", [question], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.json({ success: "Question deleted successfully" });
  });
});

app.post("/addAnswer", (req, res) => {
  const { email, answers } = req.body;

  const sql = `INSERT INTO antwoord (teamlid, vragen, antwoorden) VALUES (?, ?, ?)`;

  const vragen = answers.map((answer) => answer.question);
  const antwoorden = answers.map((answer) => answer.answer);

  db.run(
    sql,
    [email, vragen.join(", "), antwoorden.join(", ")],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      return res.json({ message: "Answers added to the database" });
    }
  );
});

app.listen(3001, () => {
  console.log("Server is running on port 3001.");
});
