const listaTimes = JSON.parse(localStorage.getItem("listaTimes")||"[]");

function $(seletor){
    return document.querySelector(seletor);
}

function carregarTimes(){
    for(let time of listaTimes){
        let atributosJogador = ["pos", "nome", "over"];

        let cardTime = document.createElement("div");
        let tituloCard = document.createElement("p");
        let jogadoresTabela = document.createElement("table");
        let botoesCard = document.createElement("div");
        let botaoEditar = document.createElement("button");
        let botaoDeletar = document.createElement("button");

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
        botaoEditar.classList.add("botaoEditar");
        botaoEditar.textContent = "Editar";
        botaoEditar.setAttribute("onclick", `atualizarFormularioEdicao(${time.id}, "carregar")`);

        botaoDeletar.classList.add("botaoDeletar");
        botaoDeletar.id = "botaoDeletar"+time.id;
        botaoDeletar.textContent = "Deletar";
        botaoDeletar.setAttribute("onclick", "preDeletarTime("+time.id+")");
         
        botoesCard.classList.add("botoesCard");
        botoesCard.style.background = `linear-gradient(45deg, ${time.cor1} 60%, ${time.cor2})`;
        botoesCard.appendChild(botaoEditar);
        botoesCard.appendChild(botaoDeletar);
        
        cardTime.classList.add("cardTime");
        cardTime.appendChild(tituloCard);
        cardTime.appendChild(jogadoresTabela);
        cardTime.appendChild(botoesCard);

        const timesDiv = $("#timesDiv");
        timesDiv.appendChild(cardTime);
    }
}

function iniciarPaginaPartida(idSelect1, idSelect2){
    collectorsModeEstaAtivo = false;
    carregarTimesSelect(idSelect1, idSelect2);
    abrirJanela("configuracoesPartida");
}

function carregarTimesSelect(idSelect1, idSelect2){
    timesSelect = [$(idSelect1), $(idSelect2)]

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
    const menu = $("menu");
    menu.classList.add("menuAberto");
}

function fecharMenu(){
    const menu = $("menu");
    menu.classList.remove("menuAberto");
}

function irParaPagina(pagina){
    window.location.href = pagina;
}

function abrirJanela(janela){
    const body =  $("body");
    const janelaModal = $("#janela-modal");
    
    let div = $(`#${janela}Div`);
    div.style.display = "flex";
    if(janela=="transferencia"){carregarTimesSelect("#transferencia-time1", "#transferencia-time2")};
            
    janelaModal.style.display = "flex";
    window.scrollTo({top: 0});
    body.style.overflow = "hidden";
}

function fecharJanela(janela){
    const body =  $("body");
    const janelaModal = $("#janela-modal");
    
    if(janela=="formulario"){
        atualizarFormularioEdicao("", "descarregar");
    }

    let div = $(`#${janela}Div`);
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
        return alert("Não deixe campos incompletos ou táticas não definidas.");
    }
    
    listaTimes.push(time);
    localStorage.setItem("listaTimes", JSON.stringify(listaTimes));
    window.location.reload();
}

function editarTime(id){
    const time = obterDadosFormulario(id);
    
    if(!time){
        return alert("Não deixe campos incompletos ou táticas não definidas.");
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
    const botaoDeletar = $("#botaoDeletar"+id);
    botaoDeletar.textContent = "Confirmar";
    botaoDeletar.style.background = "linear-gradient(rgb(255, 0, 13), rgb(216, 0, 0)";
    botaoDeletar.setAttribute("onclick", "deletarTime("+id+")");
}

function transferirJogador(){
    
    const idTime1 = $("#transferencia-time1").value;
    const idTime2 = $("#transferencia-time2").value;
    const idJogador1 = $("#transferencia-jogador1").value;
    const idJogador2 = $("#transferencia-jogador2").value;
    
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
    const selectJogador = $(idSelectJogador);
    const idTime = $(idSelectTime).value;
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
    const nomeTime = $("#nomeTime-formulario").value;
    const cor1Time = $("#cor1-formulario").value;
    const cor2Time = $("#cor2-formulario").value;
    const estiloJogoTime = $("#estiloJogo").value;
    const modoAtaqueTime = $("#modoAtaque").value;
    const modoDefesaTime = $("#modoDefesa").value;
    
    let listajogadores = [];
    for(let i=0;i<6;i++){
        const posJogador = document.querySelectorAll(".posicaoSelect")[i].value;
        const nomeJogador = document.querySelectorAll(".nomePlayer")[i].value;
        const overJogador = document.querySelectorAll(".overPlayer")[i].value;
        
        if(posJogador=="nenhuma" || !nomeJogador || !overJogador || estiloJogoTime=="nenhum" || modoAtaqueTime=="nenhum" || modoDefesaTime=="nenhum"){
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
        estiloJogo: estiloJogoTime,
        modoAtaque: modoAtaqueTime,
        modoDefesa: modoDefesaTime,
        jogadores: listajogadores
    }
    
    return time;
}

function atualizarFormularioEdicao(id, acao){
    const botaoConfirmar = $("#botaoConfirmarFormulario");
    if(acao=="carregar"){
        time = listaTimes.find(item => item.id == id);

        botaoConfirmar.setAttribute("onclick", "editarTime("+id+")");
    }else if(acao=="descarregar"){
        time = {
            id: "",
            nome: "",
            cor1: "#000000",
            cor2: "#000000",
            estiloJogo: "nenhum",
            modoAtaque: "nenhum",
            modoDefesa: "nenhum",
            jogadores: [{pos: "GK",nome: "",over: ""},
                {pos: "nenhuma",nome: "",over: ""},
                {pos: "nenhuma",nome: "",over: ""},
                {pos: "nenhuma",nome: "",over: ""},
                {pos: "nenhuma",nome: "",over: ""},
                {pos: "nenhuma",nome: "",over: ""}]
            }

        botaoConfirmar.setAttribute("onclick", "registrarTime()");
    }
    
    abrirJanela('formulario');  
    $("#nomeTime-formulario").value = time.nome;
    $("#cor1-formulario").value = time.cor1;
    $("#cor2-formulario").value = time.cor2;
    const estiloJogoTime = $("#estiloJogo");
    const modoAtaqueTime = $("#modoAtaque");
    const modoDefesaTime = $("#modoDefesa");

    estiloJogoTime.value = !time.estiloJogo ? "nenhum" : time.estiloJogo;
    modoAtaqueTime.value = !time.modoAtaque ? "nenhum" : time.modoAtaque;
    modoDefesaTime.value = !time.modoDefesa ? "nenhum" : time.modoDefesa;

    for(let i=0;i<6;i++){
        jogador = time.jogadores[i];
        document.querySelectorAll(".posicaoSelect")[i].value = jogador.pos;
        document.querySelectorAll(".nomePlayer")[i].value = jogador.nome;
        document.querySelectorAll(".overPlayer")[i].value = jogador.over;
    }    
}

function chamarSimulacao(){
    const main = $("main");
    const estatisticasDiv = $("#estatisticasDiv");
    const botaoProximaPartida = $("#botaoProximaPartida");
    main.appendChild(botaoProximaPartida);
    main.appendChild(estatisticasDiv);
    estatisticasDiv.style.display = "none";
    botaoProximaPartida.style.display = "none";
    
    const idTime1 = $("#time1").value; 
    const idTime2 = $("#time2").value;
    
    let time1 = listaTimes.find(item => item.id == idTime1);
    let time2 = listaTimes.find(item => item.id == idTime2);
    
    if(time1==time2 || !time1 || !time2){
        return alert("Erro na escolha dos times.");
    }

    if(!time1.estiloJogo || !time1.modoAtaque || !time1.modoDefesa){
        return alert(`O time(${time1.nome}) não está com táticas definidas, edite o time e defina suas táticas.`);
    }
    if(!time2.estiloJogo || !time2.modoAtaque || !time2.modoDefesa){
        return alert(`O time(${time2.nome}) não está com táticas definidas, edite o time e defina suas táticas.`);
    }

    fecharJanela("configuracoesPartida");
    
    let registroPartida = simulacaoPartida($("#estilo").value,
    $("#clima").value, 
    $("#torcida").value, 
    $("#moralTime1").value, 
    $("#moralTime2").value,
    $("#jogoDecisivo").checked,
    parseInt($("#placarIdaTime1").value),
    parseInt($("#placarIdaTime2").value),
    time1, time2);

    if(collectorsModeEstaAtivo){
        definirBackground(time1.nome);
    }
    
    limparEventos();
    exibirTimesPlacar(time1, time2);
    rodarPartida(registroPartida,  $("#velocidade").value, time1, time2);
}

function rodarPartida(registroPartida, velocidadePartida, time1, time2){
    let [sumula, tempoPartida, sumulaPenaltis] = registroPartida;
    
    const eventos = $("#eventos");
    const placarT1 = $("#placarTime1");
    const placarT2 = $("#placarTime2");
    const audioTorcida = $("#audioTorcida");
    const audioApito = $("#audioApito");

    const timer = $("#timer");
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
                        html += `<div class="${classeEvento} subEvento"><p>👟</p> <p>${evento.jogadorAssistencia}</p></div>`;
                    }
                    
                    eventos.innerHTML += html;
                }
            }
        }
        
        
        if(minuto >= tempoPartida){
            if(sumulaPenaltis!="sem penaltis"){
                eventos.innerHTML += `<div><h2>Disputa de pênaltis</h2></div>`;
                exibirPenaltis(sumulaPenaltis, time1, time2).then(() => {
                    finalizarPartida(time1, time2, sumula);
                });
            }else{
                finalizarPartida(time1, time2, sumula);
            }
            clearInterval(intervalo);
        }
        
    }, velocidadePartida);
}

function exibirTimesPlacar(time1, time2){
    const time1Placar = $("#time1Placar");
    const time2Placar = $("#time2Placar");
    
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

function finalizarPartida(time1, time2, sumula){
    carregarEstatisticas(time1, time2, sumula);
    $("#eventos");
    const botaoProximaPartida = $("#botaoProximaPartida");
    eventos.appendChild(botaoProximaPartida);
    botaoProximaPartida.style.display = "block";
}

function carregarEstatisticas(time1, time2, sumula){
    const eventos = $("#eventos");
    const estatisticasDiv = $("#estatisticasDiv");
    eventos.appendChild(estatisticasDiv);
    estatisticasDiv.style.display = "flex";
    
    const time1Th = $("#time1Estatisticas");
    const time2Th = $("#time2Estatisticas");
    time1Th.textContent = time1.nome;
    time2Th.textContent = time2.nome;
    
    const posseTime1Td = $("#posseTime1");
    const posseTime2Td = $("#posseTime2");
    let [posseT1, posseT2] = converterParaPorcentagem(sumula.filter(evento => evento.time==time1).length, sumula.filter(evento => evento.time==time2).length);
    posseTime1Td.textContent = posseT1+"%";
    posseTime2Td.textContent = posseT2+"%";
    
    const defesasGoleiroTime1Td = $("#defesasGoleiroTime1");
    const defesasGoleiroTime2Td = $("#defesasGoleiroTime2");
    let defesasTime1 = sumula.filter(evento => evento.tipo=="defesaGoleiro" || evento.tipo=="superDefesaGoleiro").filter(evento => evento.time==time1).length;
    let defesasTime2 = sumula.filter(evento => evento.tipo=="defesaGoleiro" || evento.tipo=="superDefesaGoleiro").filter(evento => evento.time==time2).length;
    defesasGoleiroTime1Td.textContent = defesasTime1;
    defesasGoleiroTime2Td.textContent = defesasTime2;
    
    const chutesTime1Td = $("#chutesTime1");
    const chutesTime2Td = $("#chutesTime2");
    chutesTime1Td.textContent = sumula.filter(evento => evento.tipo=="gol" || evento.tipo=="fora" || evento.tipo=="varGol").filter(evento => evento.time==time1).length+defesasTime2;
    chutesTime2Td.textContent = sumula.filter(evento => evento.tipo=="gol" || evento.tipo=="fora" || evento.tipo=="varGol").filter(evento => evento.time==time2).length+defesasTime1;
    
    const chutesForaTime1Td = $("#chutesForaTime1");
    const chutesForaTime2Td = $("#chutesForaTime2");
    chutesForaTime1Td.textContent = sumula.filter(evento => evento.tipo=="fora").filter(evento => evento.time==time1).length;
    chutesForaTime2Td.textContent = sumula.filter(evento => evento.tipo=="fora").filter(evento => evento.time==time2).length;
    
    const cartoesTime1Td = $("#cartoesTime1");
    const cartoesTime2Td = $("#cartoesTime2");
    cartoesTime1Td.textContent = sumula.filter(evento => evento.tipo=="amarelo" || evento.tipo=="vermelho").filter(evento => evento.time==time1).length;
    cartoesTime2Td.textContent = sumula.filter(evento => evento.tipo=="amarelo" || evento.tipo=="vermelho").filter(evento => evento.time==time2).length;
}

function exibirPenaltis(sumulaPenaltis, time1, time2){
    const placarT1 = $("#placarTime1");
    const placarT2 = $("#placarTime2");
    const audioTorcida = $("#audioTorcida");
    const audioTorcidaDesapontada = $("#audioTorcidaDesapontada");

    return new Promise((resolve) => {
        let contadorInterval = 0;
        const intervaloPenaltis = setInterval(() => {
            contadorInterval++;
        
            let penalti = sumulaPenaltis[contadorInterval];

            if(penalti.time == time1){
                classeEvento = "eventoTime1";
                goleiro = sumulaPenaltis[0].gkTime2;
            }else{
                classeEvento = "eventoTime2";
                goleiro = sumulaPenaltis[0].gkTime1;
            }

            emoji = penalti.decisao=="gol" ? "⚽" : "❌";
            audioEvento = penalti.decisao=="gol" ? audioTorcida : audioTorcidaDesapontada;

            html = `<div class="${classeEvento}"><p>${emoji}</p> <p>${penalti.batedor.nome}</p></div>`;
            
            if(penalti.decisao=="defesa"){
                html += `<div class="${classeEvento} subEvento"> <p>🧤</p> <p>${goleiro.nome}</p></div>`;
            }

            audioEvento.currentTime = 0;
            audioEvento.play();
            eventos.innerHTML += html;
            
            
            if(contadorInterval>=sumulaPenaltis.length-1){
                let placarPenaltisTime1 = sumulaPenaltis.filter((penalti) => penalti.time==time1 && penalti.decisao=="gol").length;
                let placarPenaltisTime2 = sumulaPenaltis.filter((penalti) => penalti.time==time2 && penalti.decisao=="gol").length;
                
                placarT1.textContent = placarT1.textContent+` (${placarPenaltisTime1})`;
                placarT2.textContent = `(${placarPenaltisTime2}) `+placarT2.textContent;

                clearInterval(intervaloPenaltis);
                resolve();  
            }
        }, 2000)

    });
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
    $("#eventos").innerHTML = "";
    placarT1 = $("#placarTime1").innerHTML = "0";
    placarT2 = $("#placarTime2").innerHTML = "0";
}

async function importarPacote(){
    const pacoteArquivo = $("#pacote").files[0];
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

function exportarPacote(){
    let timesSemId = [];

    for(let time of listaTimes){
        let novoTime = {
            nome: time.nome,
            cor1: time.cor1,
            cor2: time.cor2,
            estiloJogo: time.estiloJogo,
            modoAtaque: time.modoAtaque,
            modoDefesa: time.modoDefesa,
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

function exibirConfiguracaoPlacarIda(){
    const placarIda = document.querySelectorAll(".placarIda");
    placarIda.forEach(elemento => {
        if(elemento.style.display=="" || elemento.style.display=="none"){
            elemento.style.display = "flex";
        }else{
            elemento.style.display = "none";
        }
    });
}

function ativarCollectorsMode(){
    const opcoesCollectors = document.querySelectorAll(".opcoesCollectors");
    
    for(let opcao of opcoesCollectors){
        opcao.style.display = "flex";
    }
    
    collectorsModeEstaAtivo = true;
    console.log("Collectors Mode Ativo.");
}

function definirBackground(timeMandante){
    const body = $("body");

    listaTimesCollectors = {
        "Safados FC": "https://i.imgur.com/mh3bRqV.png",
        "Anaconda Mineira": "https://i.imgur.com/rpFpNus.png",
        "Carlos FC": "https://i.imgur.com/CaqWGam.png",
        "Danados FC": "https://i.imgur.com/FAKwxbM.jpeg",
        "Magic All Stars": "https://i.imgur.com/CugH1FX.jpeg",
        "Renegados FC": "https://i.imgur.com/caLNRG7.png",
        "Olaria Tietê FC": "https://i.imgur.com/wYPtyri.jpeg",
        "Atl. Várzeanos": "https://i.imgur.com/x2FB1Ll.png",
        "Jabatiuma FC": "https://i.imgur.com/kaSK1es.png",
        "Davi FC": "https://i.imgur.com/sEAvd1Q.png",
        "Sinistros FC": "https://i.imgur.com/J4tLOOd.png",
        "Geral Sabe FC":"https://i.imgur.com/7wc3F9c.png",
        "Maconharia do botafogo":"https://i.imgur.com/uw7WmIN.png",
        "Kauanverse":"https://i.imgur.com/hRkb025.png",
        "Batistuta FC":"https://i.imgur.com/2DkyfbB.png"
    };
    
    if(listaTimesCollectors[timeMandante]){
        body.style.backgroundImage = `url(${listaTimesCollectors[timeMandante]})`;
    }else{
        body.style.backgroundImage = "url(../img/background.png)";
    }
}