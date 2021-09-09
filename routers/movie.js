var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');
module.exports = {
    // getAll: function (req, res) {
    //     Movie.find(function (err, movies) {
    //         if (err) return res.status(400).json(err);
    //         res.json(movies);
    //     });
    // },
    // ====================================================================================================
    // Task 8 Retrieves the details of all actors for each individual movie
    // ====================================================================================================
    getAll: function (req, res) {
        Movie.find().populate('actors').exec(function (err, movies) {
            if (err) return res.status(404).json(err);
            res.json(movies); // res.json() function sends the response in a JSON format
        });
    },
    // Creates a new movie document
    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },
    // Uses Movie model to retrieve a document (a movie) using its _id
    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },
    // Finds a document by its ID and sets new content that is retrieved from ‘req.body’
    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },
    // ====================================================================================================
    // Task 1 Delete a movie by its ID
    // ====================================================================================================
    deleteOne: function (req, res) {
        Movie.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },
    // ====================================================================================================
    // Task 4 Remove an actor from the list of actors in a movie
    // ====================================================================================================
    removeActor: function (req, res) {
        let movieID = new mongoose.Types.ObjectId(req.params.movieId);
        let actorID = new mongoose.Types.ObjectId(req.params.actorId);

        Movie.findOne({ _id: movieID }, function (err, movie) {
            if (err) return res.params.status(400).json(err);
            if (!movie) return res.status(404).json();
            Actor.findOne({ _id: actorID }, function (err, actor) {
                if (err) return res.status(400).json();
                if (!movie) return res.status(404).json();
                movie.actors.removeOne(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            });
        });
    },
    // ====================================================================================================
    // Task 5 Add an existing actor to the list of actors in a movie

    // Postman
    // {
    //     "title":"Movie 1",
    //     "year" : 2010,
    //     "actors":["6138426e1fe65a223f7d9d9d","6138427e1fe65a223f7d9d9f"]
    // }

    // ====================================================================================================

    addActor: function (req, res) {
        Movie.findOne({ _id: req.params.id }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            Actor.findOne({ _id: req.body.id }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            })
        });

    },
    // ====================================================================================================
    // Task 6 Retrieve (GET) all the movies produced between year1 and year2, where year1>year2
    // {    
    //     "year1":2015,
    //     "year2": 2030
    //  }
    // ====================================================================================================
    getYear: function (req, res) {
        let year1 = req.params.year1;
        let year2 = req.params.year2;

        console.log(year1, year2)

        if (year1 > year2) {
            Movie.find().where('year').gte(year2).lte(year1).exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
        }
    },

    // Version - old
    // getYear: function (req, res) {
    //     let year1 = req.params.year1;
    //     let year2 = req.params.year2;

    //     Movie.find().where('year').gte(year2).lte(year1).exec(function (err, movie) {
    //         if (err) return res.status(400).json(err);
    //         if (!movie) return res.status(404).json();
    //         res.json(movie);
    //     });
    // },

    // ====================================================================================================
    // Task 9 Delete all the movies that are produced between two years
    // The two years (year1 & year2) must be sent to the backend server through the request's body in JSON format
    // ====================================================================================================
    deleteYear: function (req, res) {
        let year1 = parseInt(req.body.year1);
        let year2 = parseInt(req.body.year2);

        Movie.deleteMany().where('year').gte(year1).lte(year2).exec(function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },
};