const express = require('express');
const app = express();
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
require('dotenv').config();
const conectarBanco = require('./app/repositories/database/database');
const MensagemSchema = require('./app/messages/model/MensagemSchema');

const usuariosConectados = new Map();

const server = http.createServer(app);

conectarBanco();

const wss = new WebSocket.Server({
    server: server
});

//////////////////////EXPRESS(HTTP)////////////////////////////
app.use(express.static(path.join(__dirname, 'public')));

app.get('/chat1', (req, res) => {
    console.log('acessando o chat1');
    res.sendFile(path.join(__dirname, 'views/chat1.html'));
});

app.get('/chat2', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/chat2.html'));
});

app.get('/js/:file', (req, res) => {
    const {file} = req.params;
    res.sendFile(path.join(__dirname, 'public', 'js', file))
})

app.get('/css/:file', (req, res) => {
    const {file} = req.params;
    res.sendFile(path.join(__dirname, 'public', 'css', file))
})

app.get('/api/usuarios', (req, res) => {
    res.json({
        usuarios: {
            nome: "Danllyo",
            idade: 17,
            curso: "Informática"
        }
    });
});

//////////////////////WEBSOCKET///////////////////////////
wss.on('connection', async(socket) => {
    console.log('Cliente websocket conectado nessa budega!');

    socket.send(JSON.stringify('Bem vindo'));

    socket.on('message', async(mensagem) => {
        const dados = JSON.parse(mensagem.toString());

        if(dados.tipo === "Identificacao"){
            console.log("id do usuario: ",dados.usuarioId);
            usuariosConectados.set(dados.usuarioId, socket);

            console.log('usuario conectado:', dados.usuarioId);
        }

        if(dados.tipo === "mensagem"){

            if(!dados.texto){
                return;
            }

            const destinatario = usuariosConectados.get(dados.destinatario);

            console.log(dados.destinatario);

            console.log(dados);

            const novaMensagem = new MensagemSchema({
                remetente: dados.remetente,
                destinatario: dados.destinatario,
                texto: dados.texto
            });

            console.log('salvando mensagem...');
            await novaMensagem.save();

            if(destinatario){
                console.log('enviando...');

                destinatario.send(JSON.stringify({
                    tipo: "mensagem",
                    remetente: dados.remetente,
                    texto: dados.texto
                }));

                console.log('enviado!');
            }
        }

    });

    socket.on('close', () => {
        console.log('cliente desconectado');
    })
});

app.get('/api/mensagens', async(req, res) => {
    const {rmt, dtn} = req.query;

    const mensagens = await MensagemSchema.find({
        $or: [
            {
                remetente: rmt,
                destinatario: dtn
            },
            {
                remetente: dtn,
                destinatario: rmt
            }
        ]
    }).sort({data: 1});

    console.log(mensagens);

    res.json(mensagens);
})

server.listen(3000, '0.0.0.0', () => {
    console.log('servidor ligado!');
})
