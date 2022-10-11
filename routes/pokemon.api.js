const fs = require("fs");
var express = require('express');
var router = express.Router();
// const pokemons = require('../db.json');


router.get("/",(req,res,next)=>{
    const allowedFilter = ["name","types"];
      try {
        let { page, limit, ...filterQuery } = req.query;
        page = parseInt(page) || 1
        limit = parseInt(limit) || 20  

        const filterKeys = Object.keys(filterQuery);
        filterKeys.forEach((key) => {
          if (!allowedFilter.includes(key)) {
            const exception = new Error(`Query ${key} is not allowed`);
            exception.statusCode = 401;
            throw exception;
          }
          if (!filterQuery[key]) delete filterQuery[key];
        });

        let db = fs.readFileSync("db.json", "utf-8");
        db = JSON.parse(db);

        const { pokemons } = db;

        let result = [];
    
        if (filterKeys.length) {
          filterKeys.forEach((condition) => {
            result = result.length
              ? result.filter((pokemon) => pokemon[condition].includes(filterQuery[condition]))
              : pokemons.filter((pokemon) => pokemon[condition].includes(filterQuery[condition]));
          });
        } else {
          result = pokemons;
        }
        // const totalPoke = pokemons.length;
        const totalPage = Math.ceil(result.length/limit);
        const offset = (page - 1)*limit;

        result = result.slice(offset, offset + limit);

        res.status(200).send({data: result, totalPoke: result.length, page:page})
      } catch (error) {
        next(error);
      }
    })


router.post("/",(req,res,next)=>{
    try{
        const { name, types, url, id } = req.body;
    if(!name | !types | !types.length | !url | !id ){
        const exception = new Error(`Missing required data.`);
        exception.statusCode = 401;
        throw exception;
    }

    const pokemonTypes = [
        "bug", "dragon", "fairy", "fire", "ghost", 
        "ground", "normal", "psychic", "steel", "dark", 
        "electric", "fighting", "flyingText", "grass", "ice", 
        "poison", "rock", "water"
        ]

        if(types.length > 2) {
            const exception = new Error(`Pokémon can only have one or two types`);
            exception.statusCode = 401;
                throw exception;
        } 
        types.forEach((t)=>{
            if(!pokemonTypes.includes(t)){
                const exception = new Error("Pokémon’s type is invalid");
                exception.statusCode = 401;
                throw exception;
            }
          })
          
    db = JSON.parse(fs.readFileSync("db.json", "utf-8"));

    const { pokemons } = db;

    pokemons.forEach(p => {
        if(p.Name === name || p.id === parseInt(id)) {
            const exception = new Error("Pokémon exist");
            exception.statusCode = 401;
                throw exception;
        }
    })
    
    const newPoke = {name, types, url, id};

    pokemons.push(newPoke)
    db.pokemons = pokemons
    fs.writeFileSync("db.json",JSON.stringify(db))
    res.status(200).send(newPoke)
    } catch (error) {
        next(error)
    }
})

router.put("/:id",(req,res,next)=>{
    try{
        const allowUpdate= ["name", "id", "types"]

        let { id } = req.params
        id = parseInt(id);

        const updates = req.body
        const updateKeys = Object.keys(updates)

        const notAllow = updateKeys.filter(el => !allowUpdate.includes(el));

        if(notAllow.length){
            const exception = new Error(`Update field not allow`);
            exception.statusCode = 401;
            throw exception;
        }

        let db = fs.readFileSync("db.json", "utf-8");
        db = JSON.parse(db);
        const { pokemons } = db;

        const targetIndex = pokemons.findIndex(pokemon => pokemon.id === id)
        if(targetIndex < 0){
            const exception = new Error(`Pokemon not found`);
                exception.statusCode = 404;
                throw exception;
        }
        const updatedPoke={...db.pokemons[targetIndex],...updates}
        db.pokemons[targetIndex] = updatedPoke

        db=JSON.stringify(db)

        fs.writeFileSync("db.json",db)

        res.status(200).send(updatedPoke)
        
    } catch(error) {
        next(error)
    }
})

router.get("/:id", ((req,res,next) => {
    try {
        let { id } = req.params;
        id = parseInt(id);

        let pokemon;
        let nextPokemon;
        let previousPokemon;

        let db = fs.readFileSync("db.json", "utf-8");
        db = JSON.parse(db);

        const { pokemons } = db;

        pokemons.forEach(p => {
        if(id === 1) {
            pokemon = pokemons[0]
            nextPokemon = pokemons[1]
            previousPokemon = pokemons[pokemons.length - 1]
        } else if(id === pokemons.length - 1) {
            pokemon = pokemons[pokemons.length - 1]
            nextPokemon = pokemons[0]
            previousPokemon = pokemons[pokemons.length - 2]
        } else if( 1 < id < pokemons.length - 1) {
            pokemon = pokemons[id - 1]
            nextPokemon = pokemons[id]
            previousPokemon = pokemons[id - 2]
        } else {
            const exception = new Error(`Pokemon not found`);
                exception.statusCode = 404;
                throw exception;
        }
    })
        res.send({data:{pokemon, nextPokemon, previousPokemon}})
        }  catch (error) {
           next(error)
    }
}
));

router.delete("/:id", (req,res,next)=>{
    try{
      const { id } = req.params;
  
      let db = JSON.parse(fs.readFileSync("db.json", "utf-8"));
  
      const { pokemons }  = db;
  
      const targetIndex = pokemons.findIndex(pokemon => pokemon.id === parseInt(id))
      console.log(pokemons);
      console.log(id);

      if(targetIndex < 0) {
          const exception = new Error(`Pokemon Not found`);
              exception.statusCode = 404;
              throw exception;
      }
          db.pokemons = pokemons.filter(pokemon => pokemon.id !== parseInt(id))
          fs.writeFileSync("db.json",JSON.stringify(db))
          res.status(200).send({})
      } catch(error) {
          next(error)
      }
    });

    module.exports = router;