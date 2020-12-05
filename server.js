const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./db/db.json");
var uniqid = require("uniqid");


app.delete("/api/notes/:id", function (req, res) {
  const chosen = req.params.id;

fs.readFile('db/db.json', function(error, data){
  if(error)throw error;
  let newArray =  JSON.parse(data);

  function searchArray(chosen, newArray){
    for(var i=0; i< newArray.length; i++){
      if(newArray[i].id === chosen){
        newArray.splice(i,1);
      }
    }
  }
  searchArray(chosen, newArray);
    fs.writeFile('db/db.json', JSON.stringify(newArray, null, 2), function (err) {
      console.log(err);
      res.json({message: 'deleted successfully'});
    });
  
})

  // const newArray = db.filter(function (note) {
  //   if (note.id !== selectedId) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // });
  // console.log(newArray);
  // let p = path.join(__dirname, "db/db.json");
  // fs.writeFile(p, JSON.stringify(newArray), function (err) {
  //   console.log(err);
  //   res.json({message: 'deleted successfully'});
  //  });
});
//HTML Routes
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function (req, res) {

  fs.readFile('db/db.json', function(error, data){
    if(error)throw error;
    let newArray =  JSON.parse(data);
    return res.json(newArray);
  });
});

app.post("/api/notes", function (req, res) {
  console.log(req.body);
  const newNote = req.body;
  newNote.id = uniqid();
  let p = path.join(__dirname, "db/db.json");
  db.push(newNote);
  fs.writeFile(p, JSON.stringify(db), function (err) {
    console.log(err);
    res.json(newNote);
  });
});
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(process.env.PORT|| 3000);
