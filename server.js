const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('./public'));

//HTML endpts
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', function(req, res){
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

//
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// GET Request
app.get('/api/notes', function(req, res){

  readFile('./db/db.json', 'utf8').then(
    
    function(data){

      notes = [].concat(JSON.parse(data));
      res.json(notes);

    })

});

//POST Request
app.post('/api/notes', function(req, res){

  const note = req.body;

  readFile('./db/db.json', 'utf8').then(

    function(data){

      const notes = [].concat(JSON.parse(data));
      note.id = notes.length + 1
      notes.push(note);
      return notes;

    }).then(function(notes){

      writeFile('./db/db.json', JSON.stringify(notes))
      res.json(note);

    });

});

//DELETE Request
app.delete('/api/notes/:id', function(req, res){

  const id = parseInt(req.params.id);

  readFile('./db/db.json', 'utf8').then(

    function(data){

        const savedNotes = [].concat(JSON.parse(data));
        const updNotes = [];

        for (let i = 0; i < savedNotes.length; i++) {

          if(id !== notes[i].id) {
            
            updNotes.push(savedNotes[i]);

          }

        }

        return updNotes;

      }).then(

        function(notes){

          writeFile("./db/db.json", JSON.stringify(notes));
          res.send('Deleted note');

        });
});

app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, './public/index.html'));
});

//Listen
app.listen(PORT, function(){
  console.log(`Server listening on PORT ${PORT}`);
});