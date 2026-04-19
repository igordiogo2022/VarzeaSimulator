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
        tituloCard.style.background = `linear-gradient(45deg, ${time.cor1} 50%, ${time.cor2})`;
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
        botoesCard.style.background = `linear-gradient(45deg, ${time.cor1} 60%, ${time.cor2})`;
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

function carregarTimesSelect(idSelect1, idSelect2){
    timesSelect = [document.querySelector(idSelect1), document.querySelector(idSelect2)]

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
    
    let div = document.querySelector(`#${janela}Div`);
    div.style.display = "flex";
    if(janela=="transferencia"){carregarTimesSelect("#transferencia-time1", "#transferencia-time2")};
            
    janelaModal.style.display = "flex";
    window.scrollTo({top: 0});
    body.style.overflow = "hidden";
}

function fecharJanela(janela){
    const body =  document.querySelector("body");
    const janelaModal = document.querySelector("#janela-modal");
    
    let div = document.querySelector(`#${janela}Div`);
    div.style.display = "none";
    
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
    
    if(!time){
        return alert("Não deixe campos incompletos.");
    }

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

function transferirJogador(){
    
    const idTime1 = document.querySelector("#transferencia-time1").value;
    const idTime2 = document.querySelector("#transferencia-time2").value;
    const idJogador1 = document.querySelector("#transferencia-jogador1").value;
    const idJogador2 = document.querySelector("#transferencia-jogador2").value;
    
    if(idJogador1=="nenhum" || idJogador2=="nenhum"){
        return alert("Complete todos os campos.");
    }

    let time1 = listaTimes.find(item => item.id == idTime1);
    let time2 = listaTimes.find(item => item.id == idTime2);
    
    const jogador1 = time1.jogadores[idJogador1]; 
    const jogador2 = time2.jogadores[idJogador2]; 
    
    time1.jogadores[idJogador1] = {...jogador2, pos: jogador1.pos}; 
    time2.jogadores[idJogador2] = {...jogador1, pos: jogador2.pos};
    
    localStorage.setItem("listaTimes", JSON.stringify(listaTimes));
    window.location.reload();
}

function carregarJogadoresSelect(idSelectTime, idSelectJogador){
    const selectJogador = document.querySelector(idSelectJogador);
    const idTime = document.querySelector(idSelectTime).value;
    let time = listaTimes.find(item => item.id == idTime);
    
    const opcoesJogadores = selectJogador.querySelectorAll(".optJogador");
    opcoesJogadores.forEach(opt => {
        opt.remove()
    });
    
    for(let i=0;i<=5;i++){
        let jogador = time.jogadores[i];
        let option = document.createElement("option");
        option.classList.add("optJogador");
        option.textContent = jogador.nome;
        option.value = i;
        option.style.backgroundColor = time.cor1;
        option.style.color = time.cor2;

        selectJogador.appendChild(option);
    }
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

    irParaPagina("index.html")
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
    const main = document.querySelector("main");
    const estatisticasDiv = document.querySelector("#estatisticasDiv");
    main.appendChild(estatisticasDiv);
    estatisticasDiv.style.display = "none";
    
    const idTime1 = document.querySelector("#time1").value; 
    const idTime2 = document.querySelector("#time2").value;
    
    let time1 = listaTimes.find(item => item.id == idTime1);
    let time2 = listaTimes.find(item => item.id == idTime2);
    
    if(time1==time2 || !time1 || !time2){
        return alert("Erro na escolha dos times.");
    }
    
    const iniciarPartidaBtn = document.querySelector("#iniciarPartidaBtn");
    iniciarPartidaBtn.style.pointerEvents = "none";
    iniciarPartidaBtn.style.background = "linear-gradient(darkgray, gray)";
    
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
    const audioTorcida = document.querySelector("#audioTorcida");
    const audioApito = document.querySelector("#audioApito");

    const timer = document.querySelector("#timer");
    let minuto = 0;
    let varIntervem = false;
    let eventoVar;
    let exibirResultadoVar;
    
    const intervalo = setInterval(() => {
        minuto++;
        timer.textContent = minuto+"'";

        if(varIntervem){
            html = `<div class="${classeEvento}"><p>${minuto}'</p> <p>⚠️</p> <p>Var está checando!</p></div>`;
            
            eventos.innerHTML += html;
            varIntervem = false;
            exibirResultadoVar = true;
        }else if(exibirResultadoVar){
            audioEvento = audioApito;
            if(eventoVar.tipo=="varGol"){
                html = `<div class="${classeEvento}"><p>${minuto}'</p> <p>✅</p> <p>Gol válido!</p></div>`;
            }else if(eventoVar.tipo=="varAnulou"){
                html = `<div class="${classeEvento}"><p>${minuto}'</p> <p>❌</p> <p>Gol anulado!</p></div>`;
                
                switch(eventoVar.time){
                    case time1:
                        placarT1.textContent --;
                        break;
                    case time2:
                        placarT2.textContent --;
                        break;
                    }
                }
            audioEvento.currentTime = 0;
            audioEvento.play();

            eventos.innerHTML += html;
            exibirResultadoVar = false;
        }
        
        for(let evento of sumula){
            if(evento.minuto==minuto){
                
                if(evento.time == time1){
                    classeEvento = "eventoTime1";
                }else{
                    classeEvento = "eventoTime2";
                }
                
                if(evento.tipo=="gol" || evento.tipo=="contra" || evento.tipo=="varGol" || evento.tipo=="varAnulou"){
                    console.log("hove gol");
                    switch(evento.time){
                        case time1:
                            placarT1.textContent ++;
                            break;
                            case time2:
                                placarT2.textContent ++;
                            break;
                    }
                    audioEvento = audioTorcida;
                    emoji = evento.tipo!="contra"  ? "⚽" : "⁉️";
                    if(evento.tipo=="varGol" || evento.tipo=="varAnulou"){
                        eventoVar = evento;
                        varIntervem = true;
                    }
                }else if(evento.tipo=="superDefesaGoleiro"){
                    audioEvento = audioTorcida;
                    emoji = "🧤🧤";
                }else if(evento.tipo=="amarelo"){
                    emoji = "🟨";
                    audioEvento = audioApito;
                }else if(evento.tipo=="vermelho"){
                    emoji = "🟥";
                    audioEvento = audioApito;
                }
                
                if(evento.exibir){
                    audioEvento.currentTime = 0;
                    audioEvento.play();
                    html = `<div class="${classeEvento}"><p>${minuto}'</p> <p>${emoji}</p> <p>${evento.jogador}</p></div>`;
                    
                    if(evento.jogadorAssistencia!=null){
                        html += `<div class="${classeEvento} assistencia"><p>👟</p> <p>${evento.jogadorAssistencia}</p></div>`;
                    }
                    
                    eventos.innerHTML += html;
                }
            }
        }
        
        if(minuto >= tempoPartida){
            clearInterval(intervalo);
            
            const iniciarPartidaBtn = document.querySelector("#iniciarPartidaBtn");
            carregarEstatisticas(time1, time2, sumula);
            iniciarPartidaBtn.style.background = "linear-gradient(var(--cor3), var(--cor4))";
            iniciarPartidaBtn.style.pointerEvents = "auto";
        }
    }, velocidadePartida);
}

function exibirTimesPlacar(time1, time2){
    const time1Placar = document.querySelector("#time1Placar");
    const time2Placar = document.querySelector("#time2Placar");
    
    time1Placar.textContent = time1.nome;
    time1Placar.style.background = `linear-gradient(90deg, ${time1.cor1}, ${time1.cor2}, ${time1.cor1})`;
    let tom1 = obterTomCor(time1.cor2);
    textoCor1 = tom1=="claro" ? "#000000" : "#ffffff"; 
    time1Placar.style.color = textoCor1;
    
    time2Placar.textContent = time2.nome;
    time2Placar.style.background = `linear-gradient(90deg, ${time2.cor1}, ${time2.cor2}, ${time2.cor1})`;
    let tom2 = obterTomCor(time2.cor2);
    textoCor2 = tom2=="claro" ? "#000000" : "#ffffff"; 
    time2Placar.style.color = textoCor2;
}

function carregarEstatisticas(time1, time2, sumula){
    const eventos = document.querySelector("#eventos");
    const estatisticasDiv = document.querySelector("#estatisticasDiv");
    eventos.appendChild(estatisticasDiv);
    estatisticasDiv.style.display = "flex";

    const time1Th = document.querySelector("#time1Estatisticas");
    const time2Th = document.querySelector("#time2Estatisticas");
    time1Th.textContent = time1.nome;
    time2Th.textContent = time2.nome;
    
    const posseTime1Td = document.querySelector("#posseTime1");
    const posseTime2Td = document.querySelector("#posseTime2");
    let [posseT1, posseT2] = converterParaPorcentagem(sumula.filter(evento => evento.time==time1).length, sumula.filter(evento => evento.time==time2).length);
    posseTime1Td.textContent = posseT1+"%";
    posseTime2Td.textContent = posseT2+"%";
    
    const defesasGoleiroTime1Td = document.querySelector("#defesasGoleiroTime1");
    const defesasGoleiroTime2Td = document.querySelector("#defesasGoleiroTime2");
    let defesasTime1 = sumula.filter(evento => evento.tipo=="defesaGoleiro" || evento.tipo=="superDefesaGoleiro").filter(evento => evento.time==time1).length;
    let defesasTime2 = sumula.filter(evento => evento.tipo=="defesaGoleiro" || evento.tipo=="superDefesaGoleiro").filter(evento => evento.time==time2).length;
    defesasGoleiroTime1Td.textContent = defesasTime1;
    defesasGoleiroTime2Td.textContent = defesasTime2;

    const chutesTime1Td = document.querySelector("#chutesTime1");
    const chutesTime2Td = document.querySelector("#chutesTime2");
    chutesTime1Td.textContent = sumula.filter(evento => evento.tipo=="gol" || evento.tipo=="fora").filter(evento => evento.time==time1).length+defesasTime2;
    chutesTime2Td.textContent = sumula.filter(evento => evento.tipo=="gol" || evento.tipo=="fora").filter(evento => evento.time==time2).length+defesasTime1;

    const chutesForaTime1Td = document.querySelector("#chutesForaTime1");
    const chutesForaTime2Td = document.querySelector("#chutesForaTime2");
    chutesForaTime1Td.textContent = sumula.filter(evento => evento.tipo=="fora").filter(evento => evento.time==time1).length;
    chutesForaTime2Td.textContent = sumula.filter(evento => evento.tipo=="fora").filter(evento => evento.time==time2).length;

    const cartoesTime1Td = document.querySelector("#cartoesTime1");
    const cartoesTime2Td = document.querySelector("#cartoesTime2");
    cartoesTime1Td.textContent = sumula.filter(evento => evento.tipo=="amarelo" || evento.tipo=="vermelho").filter(evento => evento.time==time1).length;
    cartoesTime2Td.textContent = sumula.filter(evento => evento.tipo=="amarelo" || evento.tipo=="vermelho").filter(evento => evento.time==time2).length;
}

function obterTomCor(cor){
    cor = cor.replace("#", "");

    let r = parseInt(cor.substring(1,3), 16);
    let g = parseInt(cor.substring(3,5), 16);
    let b = parseInt(cor.substring(5,7), 16);

    let brilho = 0.299 * r + 0.587 * g + 0.114 * b;

    tom = brilho > 128 ?  "claro" : "escuro";

    return tom;
}

function limparEventos(){
    document.querySelector("#eventos").innerHTML = "";
    placarT1 = document.querySelector("#placarTime1").innerHTML = "0";
    placarT2 = document.querySelector("#placarTime2").innerHTML = "0";
}

function exportarTimesTXT(){
    let timesSemId = [];

    for(let time of listaTimes){
        let novoTime = {
            nome: time.nome,
            cor1: time.cor1,
            cor2: time.cor2,
            jogadores: time.jogadores
        };

        timesSemId.push(novoTime);
    }

    const json = JSON.stringify(timesSemId, null, 2);

    const blob = new Blob([json], {type: "text/plain"});
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "times.txt";
    link.click();
}

function deletarTodosDados(){
    localStorage.clear();
    irParaPagina("index.html");
}

function activeHiddenOptions(){
    const opcoesSecretas = document.querySelectorAll(".opcaoSecreta");
    const body = document.querySelector("body");

    for(let opcao of opcoesSecretas){
        opcao.style.display = "flex";
        body.style.backgroundImage = "url(../img/background_dourado.png)";
        
    }
    console.log("Opções secretas ativadas.");
}