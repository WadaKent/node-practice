const asyncMiddleware = require('../middleware/async');
const {Rental, validate} = require('../models/rental');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); // Object Destructuring
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      name: movie.name,
      dailyRentalRate: movie.dailyRentalRate
    },
  });

  try{
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, {
        $inc: { numberInStock: -1 }
      })
      .run();
      
    res.send(rental);
  }
  catch(ex) {
    res.status(500).send('Something failed.');
  }

});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send('The rental with the given ID does not exisst');
  res.send(rental);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body); // Object Destructuring
  if (error) return res.status(400).send(result.error.details[0].message);

  const rental = await Rental.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    genre: req.body.genre,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  }, 
  {
    new: true
  });

  if (!rental) return res.status(404).send('The rental with the given ID was not found');
  res.send(rental);
});


router.delete('/:id', async (req, res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id);
  if (!rental) return res.status(404).send('The rental with the given ID was not found');
  res.send(rental);
});

module.exports = router;