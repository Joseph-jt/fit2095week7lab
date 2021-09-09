//https://hub.packtpub.com/building-movie-api-express/
const express = require('express');
const mongoose = require('mongoose');
const actors = require('./routers/actor');
const movies = require('./routers/movie');
const app = express();

app.listen(8080);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


mongoose.connect('mongodb://localhost:27017/movies', function (err) {
    if (err) {
        return console.log('Mongoose - connection error:', err);
    }
    console.log('Connect Successfully');
});


// ====================================================================================================
// Configuring Endpoints
// ====================================================================================================
// Actor RESTFul endpoionts
// Task 7
app.get('/actors', actors.getAll);
app.post('/actors', actors.createOne);
app.get('/actors/:id', actors.getOne);
app.put('/actors/:id', actors.updateOne);
app.post('/actors/:id/movies', actors.addMovie);
app.delete('/actors/:id', actors.deleteOne);


app.delete('/actors/task2/:id', actors.deleteActorAndMovies);
// Task 3
app.delete('/actors/:actorId/:movieId', actors.removeMovie);



// Movie RESTFul  endpoints
// Task 8
app.get('/movies', movies.getAll);
app.post('/movies', movies.createOne);
app.get('/movies/:id', movies.getOne);
app.put('/movies/:id', movies.updateOne);

// Task 1
app.delete('/movies/:id', movies.deleteOne)
// Task 4
app.delete('/movies/:movieId/:actorId', movies.removeActor);
// Task 5
app.put('/movies/:id/actors', movies.addActor);
// Task 6
app.get('/movies/:year2/:year1', movies.getYear);
// Task 9
app.delete('/movies', movies.deleteYear);