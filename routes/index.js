var express = require('express');
var router = express.Router();
const pokemons = require('../db.json');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).send(pokemons);
});

const pokeRouter = require('./pokemon.api.js');
router.use('/pokemons', pokeRouter)

module.exports = router;