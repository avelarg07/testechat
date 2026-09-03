const moongose = require('mongoose');

const mensagemSchema = new moongose.Schema({
    remetente: {
        type: String,
        required: true
    },

    destinatario: {
        type: String,
        required: true
    },

    texto: {
        type: String,
        required: true
    },

    data: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    collection: process.env.COLLECTION_FOR_SOCKET_CHAT
});

module.exports= moongose.model('MensagemSchema', mensagemSchema);