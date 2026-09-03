const moongose = require('mongoose');

async function conectarBanco(){

    try{

        moongose.set('strictQuery', false);

        await moongose.connect(process.env.MONGO_URI);

        console.log('banco conectado!');

    }catch(erro){

        console.log(erro);

    }
}

module.exports=conectarBanco