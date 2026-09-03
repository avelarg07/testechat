console.log('conectado');

const usuario = "123"

async function buscarMensagens(){
    const resposta = await fetch('/api/mensagens?rmt=123&dtn=456');
    const dados = await resposta.json();

    console.log(dados);

    for(let i = 0; i <= dados.length-1; i++){
        const novaMensagem = document.createElement("p");
        
        novaMensagem.textContent=dados[i].texto;

        if(dados[i].remetente === usuario){
            novaMensagem.classList.add('texto_remetente');
        }else{
            novaMensagem.classList.add('texto_destinatario');
        }

        const elementoPai = document.getElementById('mensagens'); 
        elementoPai.appendChild(novaMensagem);
    }

} 

buscarMensagens();

const socket = new WebSocket("ws://localhost:3000");

socket.onopen = () => {
    console.log('conectando com o protocolo');

    socket.send(JSON.stringify({
        tipo: "Identificacao",
        usuarioId: usuario
    }))
}

socket.onmessage = (evento) => {
    const dados = JSON.parse(evento.data);

    console.log('mensagem de:', dados.remetente);
    console.log('texto:', dados.texto);

    if(dados.tipo === "mensagem"){
            const novaMensagem = document.createElement("p");
            
            novaMensagem.textContent=dados.texto;
            novaMensagem.classList.add('texto_destinatario');

        const elementoPai = document.getElementById('mensagens'); 
        elementoPai.appendChild(novaMensagem);

    }
}

document.getElementById('formulario').addEventListener('submit', (e) => {
    e.preventDefault();

    console.log('form acionado');

    if(document.getElementById('input'.value === "")){
        return
    }

    enviarMensagem();
})

function enviarMensagem(){
    console.log('clicou');

    socket.send(JSON.stringify({
        remetente: "123",
        tipo: "mensagem",
        destinatario: "456",
        texto: document.getElementById('input').value
    }));

    const novaMensagem = document.createElement("p");
        
    novaMensagem.textContent=document.getElementById('input').value;
    novaMensagem.classList.add('texto_remetente');

    const elementoPai = document.getElementById('mensagens'); 
    elementoPai.appendChild(novaMensagem);
    
    document.getElementById('input').value = '';
}