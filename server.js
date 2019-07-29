const express = require("express");
const path = require("path");
const socket = require('socket.io');
const mongoose = require('mongoose')

const app = express();
const http = require("http").Server(app);
const bodyParser = require("body-parser");

const io = socket(http);
const game = io.of('/game')

app.use(bodyParser.json());
app.use(express.json());

const {
	db_user,
	db_password,
	db_url,
  db_schema,
  PORT = 8080,
} = process.env

mongoose.connect(`mongodb://${db_user}:${db_password}@${db_url}/${db_schema}`)

const db = mongoose.connection

db
  .on('error', error => console.log(error))
  .once('open', () => {
    console.log('Database Connected!')
    http.listen(PORT, (error) => {
      if(error){
        console.log(error)
      }
      else{
        console.log(`Server online: connected to port ${PORT}`)
      }
    });
  })

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

let Schema = mongoose.Schema

let gameSchema = new Schema({
  gameCode: String,
	players: [
    {
      playerId: Number,
      name: String,
      points: String,
      socket: String,
    }
  ],
	sockets: [String],
	turn: Number
}, {collection: 'games'})

var promptSchema = new Schema({
	expansion: String,
	prompt: String
}, {collection: 'prompts'})

var Game = mongoose.model('Game', gameSchema)

var Prompts = mongoose.model('Prompts', promptSchema)

game
.on('connection', socket => {
  socket 
    .on('start-game', ({ name }) => {
      const gameCode = (() => {
        let text = "";
			  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

			  for (var i = 0; i < 6; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
			  return text;
      })()

      socket.join(gameCode)

      let player = { 
        playerId: 0,
        name,
        points: 0,
      }

      let game = {
        gameCode,
        players: [{...player, socket: socket.id}],
        sockets: [socket.id],
        turn: 0,
      }

      let newGame =  new Game(game)
      newGame.save()

      io.of('game').to(gameCode).emit('update-game', game)
      socket.emit('update-cookie', { gameCode, ...player })
    })
    .on('join-game', ({ name, gameCode, playerId, points }) => {
      Game.findOne({ 'gameCode': gameCode }, (error, doc) => {
        if(error){
          console.log(error)
        }
        else if(doc){
          socket.join(gameCode)

          let player = doc.players.filter(player => {
            return player.playerId === playerId
          })[0]

          if(player){
            doc.sockets.splice(doc.sockets.indexOf(player.socket), 1)
            doc.players.splice(doc.players.indexOf(player), 1)
          }
          
          player = { 
            playerId: playerId === undefined ? Math.max.apply(Math, doc.players.map((player) => { return player.playerId; })) + 1 : playerId,
            name,
            points: points || 0,
          }

          doc.players = [ ...doc.players, { ...player, socket: socket.id } ]
          doc.sockets = [ ...doc.sockets, socket.id ]
          doc.save()

          io.of('game').to(gameCode).emit('update-game', doc)
          socket.emit('update-cookie', { gameCode, ...player })
        }
        else {
          socket.emit('game-not-found')
        }
      })
    })
    .on('disconnect', () => {
      Game.findOne({ sockets: socket.id }, (error, doc) => {
        if(error){
          console.log(error)
        }
        else if(doc){
          doc.sockets.splice(doc.sockets.indexOf(socket.id), 1)

          let player = doc.players.filter(player => {
            return player.socket === socket.id
          })[0]

          if(doc.turn === player.playerId){
            doc.turn = doc.players[player.playerId + 1]
          }

          doc.players.splice(doc.players.indexOf(player), 1)

          doc.save()

          io.of('game').to(doc.gameCode).emit('update-game', doc)
        }
        else {
          socket.emit('game-not-found')
        }
      })
    })
})