const listaTimes = JSON.parse(localStorage.getItem("listaTimes")||"[]");

function carregarTimes(){
    for(let time of listaTimes){
        let atributosJogador = ["pos", "nome", "over"];

        let cardTime = document.createElement("div");
        let tituloCard = document.createElement("p");
        let jogadoresTabela = document.createElement("table");
        let botoesCard = document.createElement("div");
        let editarBtn = document.createElement("button");
        let deletarBtn = document.createElement("button");

        tituloCard.classList.add("tituloCard");
        tituloCard.textContent = time.nome;
        tituloCard.style.backgroundColor = time.cor1;
        tituloCard.style.color = time.cor2;

        jogadoresTabela.classList.add("jogadoresTabela");
        
        for(let jogador of time.jogadores){
            let tr = document.createElement("tr");

            for(let atributo of atributosJogador){
                let td = document.createElement("td");
                td.textContent = jogador[atributo];
                tr.appendChild(td);
            }
            jogadoresTabela.appendChild(tr);
        }
        editarBtn.classList.add("editarBtn");
        editarBtn.textContent = "Editar";
        editarBtn.setAttribute("onclick", "carregarFormularioEdicao("+time.id+")");

        deletarBtn.classList.add("deletarBtn");
        deletarBtn.id = "deletarBtn"+time.id;
        deletarBtn.textContent = "Deletar";
        deletarBtn.setAttribute("onclick", "preDeletarTime("+time.id+")");
        
        botoesCard.classList.add("botoesCard");
        botoesCard.style.backgroundColor = time.cor1;
        botoesCard.appendChild(editarBtn);
        botoesCard.appendChild(deletarBtn);
        
        cardTime.classList.add("cardTime");
        cardTime.appendChild(tituloCard);
        cardTime.appendChild(jogadoresTabela);
        cardTime.appendChild(botoesCard);

        const timesDiv = document.querySelector("#timesDiv");
        timesDiv.appendChild(cardTime);
    }
}

function carregarTimesPartida(){
    timesSelect = [document.querySelector("#time1"), 
        document.querySelector("#time2")]

    for(let time of listaTimes){
        for(let i=0;i<2;i++){
            let option = document.createElement("option");
            option.textContent = time.nome;
            option.value = time.id;
            option.style.backgroundColor = time.cor1;
            option.style.color = time.cor2;

            timesSelect[i].appendChild(option);
        }   
    }
}

function abrirMenu(){
    const menu = document.querySelector("menu");
    menu.classList.add("menuAberto");
}

function fecharMenu(){
    const menu = document.querySelector("menu");
    menu.classList.remove("menuAberto");
}

function irParaPagina(pagina){
    window.location.href = pagina;
}

function abrirJanela(janela){
    const body =  document.querySelector("body");
    const janelaModal = document.querySelector("#janela-modal");

    switch(janela){
        case "formulario":
            let formulario = document.querySelector("#formularioDiv");
            formulario.style.display = "flex";
            break;
        case "pacotes":
            let pacotes = document.querySelector("#pacotesDiv");
            pacotes.style.display = "flex";
            break;
    }
    
    janelaModal.style.display = "flex";
    window.scrollTo({top: 0});
    body.style.overflow = "hidden";
}
function fecharFormulario(janela){
    const body =  document.querySelector("body");
    const janelaModal = document.querySelector("#janela-modal");
    
    switch(janela){
        case "formulario":
            let formulario = document.querySelector("#formularioDiv");
            formulario.style.display = "none";
            break;
        case "pacotes":
            let pacotes = document.querySelector("#pacotesDiv");
            pacotes.style.display = "none";
            break;
    }

    janelaModal.style.display = "none";
    window.scrollTo({top: 0});
    body.style.overflow = "auto";
}

function registrarTime(){
    if(listaTimes.length == 0){
        idTime = 0;
    }else{
        idTime = listaTimes[listaTimes.length-1].id+1;
    }

    const time = obterDadosFormulario(idTime);

    if(!time){
        return alert("Não deixe campos incompletos.");
    }
    
    listaTimes.push(time);
    localStorage.setItem("listaTimes", JSON.stringify(listaTimes));
    window.location.reload();
}

function editarTime(id){
    const time = obterDadosFormulario(id);
    
    for(let i=0;i<listaTimes.length;i++){
        if(listaTimes[i].id == id){
            listaTimes[i] = time;
        }
    }
    
    localStorage.setItem("listaTimes", JSON.stringify(listaTimes));
    window.location.reload();
}

function deletarTime(id){
    for(let i=0;i<listaTimes.length;i++){
        if(listaTimes[i].id == id){
            listaTimes.splice(i, 1);
        }
    }

    localStorage.setItem("listaTimes", JSON.stringify(listaTimes));
    window.location.reload();
}

function preDeletarTime(id){
    const deletarBtn = document.querySelector("#deletarBtn"+id);
    deletarBtn.textContent = "Confirmar";
    deletarBtn.style.background = "linear-gradient(rgb(255, 0, 13), rgb(216, 0, 0)";
    deletarBtn.setAttribute("onclick", "deletarTime("+id+")");
}

function obterDadosFormulario(idTime){
    const nomeTime = document.querySelector("#nomeTime-formulario").value;
    const cor1Time = document.querySelector("#cor1-formulario").value;
    const cor2Time = document.querySelector("#cor2-formulario").value;

    let listajogadores = [];
    for(let i=0;i<6;i++){
        const posJogador = document.querySelectorAll(".posicaoSelect")[i].value;
        const nomeJogador = document.querySelectorAll(".nomePlayer")[i].value;
        const overJogador = document.querySelectorAll(".overPlayer")[i].value;

        if(posJogador=="nenhuma" || !nomeJogador || !overJogador){
            return null;
        }
        
        listajogadores.push({pos: posJogador, nome: nomeJogador, over: overJogador});
    }    

    if(!nomeTime || !cor1Time || !cor2Time){
        return null;
    }
    
    const time = {
        id: idTime,
        nome: nomeTime,     
        cor1: cor1Time,
        cor2: cor2Time,
        jogadores: listajogadores
    }

    return time;
}

async function importarPacote(){
    const pacoteArquivo = document.querySelector("#pacote").files[0];
    const conteudo = await pacoteArquivo.text();
    let pacote = JSON.parse(conteudo);

    for(let time of pacote){
        if(!listaTimes.includes(time)){
            if(listaTimes.length == 0){
                idTime = 0;
            }else{
                idTime = listaTimes[listaTimes.length-1].id+1;
            }
            time.id = idTime;
            
            listaTimes.push(time);
            localStorage.setItem("listaTimes", JSON.stringify(listaTimes));
        }
    }

    window.location.reload();
}

function carregarFormularioEdicao(id){
    let time = listaTimes.find(item => item.id == id);
    
    abrirJanela('formulario');  
    document.querySelector("#nomeTime-formulario").value = time.nome;
    document.querySelector("#cor1-formulario").value = time.cor1;
    document.querySelector("#cor2-formulario").value = time.cor2;
    
    for(let i=0;i<6;i++){
        jogador = time.jogadores[i];
        document.querySelectorAll(".posicaoSelect")[i].value = jogador.pos;
        document.querySelectorAll(".nomePlayer")[i].value = jogador.nome;
        document.querySelectorAll(".overPlayer")[i].value = jogador.over;
    }    
    
    const btnConfirmar = document.querySelector("#btnConfirmar-formulario");
    btnConfirmar.setAttribute("onclick", "editarTime("+id+")");
}

function chamarSimulacao(){
    const iniciarPartidaBtn = document.querySelector("#iniciarPartidaBtn");
    iniciarPartidaBtn.style.pointerEvents = "none";

    const idTime1 = document.querySelector("#time1").value; 
    const idTime2 = document.querySelector("#time2").value;
    
    let time1 = listaTimes.find(item => item.id == idTime1);
    let time2 = listaTimes.find(item => item.id == idTime2);

    if(time1==time2 || !time1 || !time2){
        return alert("Erro na escolha dos times.");
    }

    for(let jogador of time1.jogadores){
        jogador.jogando = true;
    }
    for(let jogador of time2.jogadores){
        jogador.jogando = true;
    }
    
    let registroPartida = simulacaoPartida(document.querySelector("#estilo").value,
    document.querySelector("#clima").value, 
    document.querySelector("#torcida").value, 
    document.querySelector("#moralTime1").value, 
    document.querySelector("#moralTime2").value,
    time1, time2);

    limparEventos();
    exibirTimesPlacar(time1, time2);
    rodarPartida(registroPartida,  document.querySelector("#velocidade").value, time1, time2);
}

function rodarPartida(registroPartida, velocidadePartida, time1, time2){
    let [sumula, tempoPartida] = registroPartida;
    
    const eventos = document.querySelector("#eventos");
    const placarT1 = document.querySelector("#placarTime1");
    const placarT2 = document.querySelector("#placarTime2");
    
    const timer = document.querySelector("#timer");
    let minuto = 0;
    
    const intervalo = setInterval(() => {
        minuto++;
        timer.textContent = minuto+"'";
        
        for(let evento of sumula){
            if(evento.minuto==minuto){
                
                if(evento.time == time1){
                    classeEvento = "eventoTime1";
                }else{
                    classeEvento = "eventoTime2";
                }
                
                if(evento.tipo=="gol"){
                    switch(evento.time){
                        case time1:
                            placarT1.textContent ++;
                            break;
                            case time2:
                            placarT2.textContent ++;
                            break;
                    }
                    emoji = "⚽";
                }else if(evento.tipo=="vermelho"){
                    emoji = "🟥";
                }
                
                eventos.innerHTML += `<div class="${classeEvento}"><p>${minuto}'</p> <p>${emoji}</p> <p>${evento.jogador}</p></div>`;
            }
        }
        
        if(minuto >= tempoPartida){
            clearInterval(intervalo);
            
            const iniciarPartidaBtn = document.querySelector("#iniciarPartidaBtn");
            iniciarPartidaBtn.style.pointerEvents = "auto";
        }
    }, velocidadePartida);

}

function exibirTimesPlacar(time1, time2){
    const time1Placar = document.querySelector("#time1Placar");
    const time2Placar = document.querySelector("#time2Placar");
    
    time1Placar.textContent = time1.nome;
    time1Placar.style.backgroundColor = time1.cor1;
    time1Placar.style.color = time1.cor2;
    
    time2Placar.textContent = time2.nome;
    time2Placar.style.backgroundColor = time2.cor1;
    time2Placar.style.color = time2.cor2;
}

function limparEventos(){
    document.querySelector("#eventos").innerHTML = "";
    placarT1 = document.querySelector("#placarTime1").innerHTML = "0";
    placarT2 = document.querySelector("#placarTime2").innerHTML = "0";
}