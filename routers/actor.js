const mongoose = require('mongoose');
const { findOneAndDelete } = require('../models/actor');
const Actor = require('../models/actor');
const Movie = require('../models/movie');
module.exports = {
    // getAll: function (req, res) {
    //     Actor.find(function (err, actors) {
    //         if (err) {
    //             return res.status(404).json(err);
    //         } else {
    //             res.json(actors);
    //         }
    //     });
    // },
    // ====================================================================================================
    // Task 7 Array of movies should contain the details of the movies instead of IDs
    // ====================================================================================================
    getAll: function (req, res) {
        Actor.find().populate("movies").exec(function (err, actors) {
            if (err) {
                return res.status(404).json(err);
            } else {
                res.json(actors); // res.json() function sends the response in a JSON format
            }
        });
    },
    // Creates a new document based on the parsed data in ‘req.body’ and saves it in ‘Actor’ collection
    createOne: function (req, res) {
        let newActorDetails = req.body;
        newActorDetails._id = new mongoose.Types.ObjectId();
        let actor = new Actor(newActorDetails);
        actor.save(function (err) {
            res.json(actor);
        });
    },
    // Finds one document by an ID, '.populate' replaces each ID in the array ‘movies’ with its document
    // If omit populate, then output will be movie id only, otherwise populate will show movie id, title, and year
    getOne: function (req, res) {
        Actor.findOne({ _id: req.params.id })
            .populate('movies') // populate function fills the ID specified in the array 'movies' with the actor document
            .exec(function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            });
    },
    // Finds a document by its ID and sets new content that is retrieved from ‘req.body’
    updateOne: function (req, res) {
        Actor.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            res.json(actor);
        });
    },

    // Moodle - Deletes the document that matches the criteria
    deleteOne: function (req, res) {
        Actor.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },
    // Adds a movie ID to the list of movies in an actor’s document
    // Retrieves actor id from URL param, then retrieves movie id and adds it to the actor's document, and save it in the database
    addMovie: function (req, res) {
        Actor.findOne({ _id: req.params.id }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            Movie.findOne({ _id: req.body.id }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                actor.movies.push(movie._id); // push movie details into actor's document
                actor.save(function (err) { // save pushed movie details
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                });
            });
        });
    },

    // ====================================================================================================
    // Task 2 Delete an actor by its ID and all its movies from the 'Movie' collection
    // ====================================================================================================
    deleteActorAndMovies: function (req, res) {
        // Version 1 https://edstem.org/au/courses/6007/discussion/580644 - delete actors and the movies too
        Actor.findOneAndDelete({ _id: req.params.id }, function (err, docs) {
            if (err) return res.status(400).json(err);
            if (!docs) return res.status(404).json();
            Movie.deleteMany().where({ _id: { $in: Actor.movies } }).exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
        });

        // Version 2
        // Actor.findByIdAndDelete({ _id: req.params.id }, function (err, docs) {
        //     if (err) return res.status(400).json(err);
        //     Movie.findOne({ _id: req.params.id }, function (err, movie) {
        //         if (err) return res.status(400).json(err);
        //         if (!movie) return res.status(404).json();
        //         actor.findByIdAndDelete(function (err) {
        //             if (err) return res.status(500).json(err);
        //             res.json(docs);
        //         });
        //     });
        // });
    },

    // ====================================================================================================
    // Task 3 Remove a movie from the list of movies of an actor
    // ====================================================================================================
    removeMovie: function (req, res) {
        let movieID = new mongoose.Types.ObjectId(req.params.movieId);
        let actorID = new mongoose.Types.ObjectId(req.params.actorId);

        Actor.findOne({ _id: actorID }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            Movie.findOne({ _id: movieID }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                actor.movies.remove(movie._id);
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                });
            });
        });
    }
};