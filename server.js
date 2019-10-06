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

console.log(`mongodb://${db_user}:${db_password}@${db_url}/${db_schema}`)

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
      points: Number,
      socket: String,
    }
  ],
	sockets: [String],
  turn: Number,
  active: Boolean,
  used: [String],
  prompt: String,
  responses: [
    {
      playerId: Number, 
      response: String
    }
  ]
}, {collection: 'games'})

let promptSchema = new Schema({
	expansion: String,
	prompt: String
}, {collection: 'prompts'})

let Game = mongoose.model('Game', gameSchema)

let Prompts = mongoose.model('Prompts', promptSchema)

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
        active: false,
        used: [],
        prompt: '',
        responses: []
      }

      Prompts.find({ 'expansion': 'standard' }, (err, prompts) => {
        if (err) {
          console.log(err)
        }
        else{
          try{
            const newPrompt = prompts[Math.floor(Math.random() * prompts.length)]
            game.used.push(newPrompt._id)
            game.prompt = newPrompt.prompt
            let newGame =  new Game(game)
            newGame.save()

            io.of('game').to(gameCode).emit('update-game', game)
            socket.emit('set-active-player', true)
            socket.emit('update-cookie', { gameCode, ...player })
          } catch (error){
            console.log(error)
          }
        }
      })
    })

    .on('join-game', ({ name, gameCode, playerId, points }) => {
      Game.findOne({ 'gameCode': gameCode }, (error, doc) => {
        if(error){
          console.log(error)
        }
        else if(doc){
          try{
            socket.join(gameCode)

            let player = doc.players.filter(player => {
              return player.playerId === playerId
            })[0]

            if(player){
              doc.sockets.splice(doc.sockets.indexOf(player.socket), 1)
              doc.players.splice(doc.players.indexOf(player), 1)
            }
            
            player = { 
              playerId: playerId === undefined ? Math.max.apply(Math, doc.players.map((player) => { return player.playerId; })) + 1 || 0 : playerId,
              name,
              points: points || 0,
            }

            doc.players = [ ...doc.players, { ...player, socket: socket.id } ]
            doc.sockets = [ ...doc.sockets, socket.id ]
            doc.save()

            io.of('game').to(gameCode).emit('update-game', doc)
            socket.emit('update-cookie', { gameCode, ...player })
            if(doc.players.length === 1) socket.emit('set-active-player', true)

          }catch (error){
            console.log(error)
          }
        }
        else {
          try{
            socket.emit('game-not-found')
          }catch (error){
            console.log(error)
          }
        }
      })
    })

    .on('all-in', ({ gameCode }) => {
      Game.findOne({ 'gameCode': gameCode }, (error, doc) => {
        if(error){
          console.log(error)
        }
        else{
          try{
            doc.active = true;
            doc.save()
            io.of('game').to(gameCode).emit('update-game', doc)
          }catch (error){
            console.log(error)
          }
        }
      })
    })

    .on('submit-response', ({ gameCode, response }) => {
      Game.findOne({ 'gameCode': gameCode }, (error, doc) => {
        if(error){
          console.log(error)
        }
        else{
          try{
            let player = doc.players.filter(player => {
              return player.socket === socket.id
            })[0]
  
            const newResponse = {
              response,
              playerId: player.playerId
            }
  
            doc.responses.push(newResponse)
            doc.save()
  
            io.of('game').to(gameCode).emit('update-game', doc)
          }catch (error){
            console.log(error)
          }
        }
      })
    })

    .on('pick-response', ({ gameCode, playerId }) => {
      Game.findOne({ 'gameCode': gameCode }, async (error, doc) => {
        if(error){
          console.log(error)
        }
        else{
          try{
            const chosenPlayer = doc.players.filter(player => playerId === player.playerId)[0]

            chosenPlayer.points += 1

            doc.turn = doc.players.length - 1 === doc.turn ? doc.players[0].playerId : doc.players[doc.turn + 1].playerId

            doc.responses = []

            await Prompts.find({ 'expansion': 'standard' }, (err, prompts) => {
              if (err) {
                console.log(err)
              }
              else{
                doc.used.map(used => {
                  let find = prompts.filter(prompt => {
                    return prompt._id === used
                  })[0]
                  prompts.splice(prompts.indexOf(find), 1)
                })
  
                const newPrompt = prompts[Math.floor(Math.random() * prompts.length)]

                doc.used.push(newPrompt._id)
                if(doc.used.length >= prompts.length) doc.used = []
                doc.prompt = newPrompt.prompt
              }
            })

            doc.save()

            io.of('game').to(gameCode).emit('update-game', doc)

            io.of('game').to(gameCode).emit('set-active-player', false)

            socket.broadcast.to(doc.players[doc.turn].socket).emit('set-active-player', true);

          }catch (error){
            console.log(error)
          }
        }
      })
    })

    .on('change-turn', ({ gameCode }) => {
      Game.findOne({ 'gameCode': gameCode }, (error, doc) => {
        if(error){
          console.log(error)
        }
        else{
          try{
            doc.turn = doc.players[doc.turn + 1].playerId

            doc.save()

            io.of('game').to(gameCode).emit('update-game', doc)
          }catch (error){
            console.log(error)
          }
        }
      })
    })

    .on('new-prompt', ({ gameCode }) => {
      Game.findOne({ 'gameCode': gameCode }, (error, doc) => {
        if(error){
          console.log(error)
        }
        else{
          try{
            Prompts.find({ 'expansion': 'standard' }, (err, prompts) => {
              if (err) {
                console.log(err)
              }
              else{
                doc.used.map(used => {
                  let find = prompts.filter(prompt => {
                    return prompt._id === used
                  })[0]
                  prompts.splice(prompts.indexOf(find), 1)
                })
  
                const newPrompt = prompts[Math.floor(Math.random() * prompts.length)]
                doc.used.push(newPrompt._id)
                if(doc.used.length >= prompts.length) doc.used = []
                doc.prompt = newPrompt
                doc.save()
  
                io.of('game').to(gameCode).emit('update-game', doc)
              }
            })
          }catch (error){
            console.log(error)
          }
        }
      })
    })

    .on('disconnect', () => {
      Game.findOne({ sockets: socket.id }, (error, doc) => {
        if(error){
          console.log(error)
        }
        else if(doc){
          try{
            socket.leave(doc.gameCode)
            doc.sockets.splice(doc.sockets.indexOf(socket.id), 1)
            
            let player = doc.players.filter(player => {
              return player.socket === socket.id
            })[0]

            doc.players.splice(doc.players.indexOf(player), 1)
            doc.save()

            io.of('game').to(doc.gameCode).emit('update-game', doc)
          }catch (error){
            console.log(error)
          }
        }
        else {
          try{
            socket.emit('game-not-found')
          }catch (error){
            console.log(error)
          }
        }
      })
    })
})