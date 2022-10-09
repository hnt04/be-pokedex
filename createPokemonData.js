const fs = require("fs");
const csv = require("csvtojson");

const createPokemonData = async() => {
    
    const newData = await csv().fromFile("pokemon.csv");
    newDataPokemon = newData.slice(1,721);

    let data = JSON.parse(fs.readFileSync("db.json"));
    
    const pokemonData = newDataPokemon.map((p, index) => {
        let types = p.Type2 ? [p.Type1.toLowerCase(), p.Type2.toLowerCase()] : [p.Type1.toLowerCase()]
        return {
            name: p.Name,
        id: index + 1,
        types,
        url: `http://localhost:5000/images/${index + 1}.jpg`,
    }
})
    data.pokemon = pokemonData;
    console.log(data);

    fs.writeFileSync("db.json",JSON.stringify(pokemonData));
};

createPokemonData();