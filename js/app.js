let versaoDados = Number(localStorage.getItem("versaoDados") || "1");

const listaTimes = JSON.parse(localStorage.getItem("listaTimes")||"[]");
const listaJogadores = JSON.parse(localStorage.getItem("listaJogadores")||"[]");

if (versaoDados < 2){
    migrarDados1Para2();
    versaoDados = 2;
    localStorage.setItem("versaoDados", versaoDados);
}


function migrarDados1Para2() {
    const times = [];
    const jogadores = [];
    
    let idJogador = 0;
    
    for (let i = 0; i < listaTimes.length; i++) {
        
        const timeAntigo = listaTimes[i];
        
        const timeNovo = {
            id: String(i),
            nome: timeAntigo.nome,
            cor1: timeAntigo.cor1,
            cor2: timeAntigo.cor2,
            estiloJogo: timeAntigo.estiloJogo,
            modoAtaque: timeAntigo.modoAtaque,
            modoDefesa: timeAntigo.modoDefesa,
            
            // O modelo antigo não possui formação
            formacao: null,
            
            jogadores: []
        };

        for (const jogadorAntigo of timeAntigo.jogadores) {

            console.log(jogadorAntigo);
            console.log(jogadorAntigo.nome);
            
            const jogadorNovo = {
                id: idJogador,
                nome: jogadorAntigo.nome,
                over: jogadorAntigo.over,
                time: String(i),
                clube: String(i),
                pos: jogadorAntigo.pos
            };
            
            console.log(jogadorNovo);
            
            
            jogadores.push(jogadorNovo);
            
            // O time passa a guardar somente o ID
            timeNovo.jogadores.push(idJogador);
            
            idJogador++;
        }
        
        times.push(timeNovo);
    }
    
    localStorage.setItem("listaTimes", JSON.stringify(times));
    localStorage.setItem("listaJogadores", JSON.stringify(jogadores));

    window.location.reload();
}

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
        
        if (time.jogadores.length == 0){
            let tr = document.createElement("tr");
            
            let td = document.createElement("td");
            td.textContent = "Não há jogadores";
            tr.appendChild(td);
            
            jogadoresTabela.appendChild(tr);
        }
        
        const ordemPosicoes = ["GK", "ZG", "MC", "AT", null];
        jogadores = time.jogadores.map(id => listaJogadores.find(jogador => jogador.id === id));
        
        for (const posicao of ordemPosicoes){
            for(const jogador of jogadores){
                if(jogador.pos == posicao){
                    let tr = document.createElement("tr");
                    
                    for(let atributo of atributosJogador){
                        let td = document.createElement("td");
                        td.textContent = jogador[atributo];
                        tr.appendChild(td);
                    }
                    jogadoresTabela.appendChild(tr);        
                }
            }
        }
        
        botaoEditar.classList.add("botaoEditar");
        botaoEditar.textContent = "Editar";
        botaoEditar.setAttribute("onclick", `irParaPagina("time.html?id=${time.id}")`);

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

function carregarPaginaJogadores(){
    const inputNome = $("#nome-input");
    inputNome.addEventListener("input", () => buscarJogadores());
    
    carregarTimesSelect('#clube-select');
    carregarJogadores(listaJogadores);
}

function iniciarPaginaPartida(idSelect1, idSelect2){
    collectorsModeEstaAtivo = false;
    carregarTimesSelect(idSelect1);
    carregarTimesSelect(idSelect2);
    abrirJanela("configuracoesPartida");
}

function carregarTimesSelect(idSelect){
    let select = $(idSelect);
    
    for(let time of listaTimes){
        let option = document.createElement("option");
        option.textContent = time.nome;
        option.value = time.id;
        option.style.backgroundColor = time.cor1;
        option.style.color = time.cor2;
        
        select.appendChild(option);
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
            
    janelaModal.style.display = "flex";
    window.scrollTo({top: 0});
    body.style.overflow = "hidden";
}

function fecharJanela(janela){
    const body =  $("body");
    const janelaModal = $("#janela-modal");
    
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

function editarTime(){
    const params = new URLSearchParams(window.location.search);
    const idTime = params.get("id");

    let timeAntes = listaTimes.find(time => time.id==idTime);
    
    const nomeTime = $("#nomeTime").value;
    const cor1Time = $("#cor1").value;
    const cor2Time = $("#cor2").value;
    const estiloJogoTime = $("#estiloJogo").value;
    const modoAtaqueTime = $("#modoAtaque").value;
    const modoDefesaTime = $("#modoDefesa").value;
    const formacao = $("#formacao").value;
    console.log(formacao);

    
    if(!nomeTime || !cor1Time || !cor2Time || estiloJogoTime=="nenhum" || modoAtaqueTime=="nenhum" || modoDefesaTime=="nenhum"){
        return alert("Não deixe campos incompletos ou táticas não definidas.");
    }

    const posicoes = document.querySelectorAll(".posicao");

    for (const posicao of posicoes){
        jogadorHtml = posicao.querySelectorAll(".jogador");
        if(jogadorHtml.length>1){
            return alert("Existem mais de um jogador na mesma posição.");
        } 
        
        posicaoJogador = posicao.classList[1];

        if(jogadorHtml[0]){
            jogador = listaJogadores.find(jogador => jogador.id==jogadorHtml[0].id);

            jogador.pos = posicaoJogador;
        }
    }
    
    const reservaHtml = $("#reservasDiv");
    const reservas = reservaHtml.querySelectorAll(".jogador");
    for (const reserva of reservas){
        jogador = listaJogadores.find(jogador => jogador.id==reserva.id);
    
        jogador.pos = null;
    }

    const timeAtualizado = {
        id: idTime,
        nome: nomeTime,     
        cor1: cor1Time,
        cor2: cor2Time,
        estiloJogo: estiloJogoTime,
        modoAtaque: modoAtaqueTime,
        modoDefesa: modoDefesaTime,
        formacao: formacao,
        jogadores: timeAntes.jogadores
    }

    for(let i=0;i<listaTimes.length;i++){
        if(listaTimes[i].id == idTime){
            listaTimes[i] = timeAtualizado;
        }
    }
    
    localStorage.setItem("listaTimes", JSON.stringify(listaTimes));
    localStorage.setItem("listaJogadores", JSON.stringify(listaJogadores));
    irParaPagina("index.html");
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

function obterDadosFormulario(idTime){
    const nomeTime = $("#nomeTime-formulario").value;
    const cor1Time = $("#cor1-formulario").value;
    const cor2Time = $("#cor2-formulario").value;
    const estiloJogoTime = $("#estiloJogo").value;
    const modoAtaqueTime = $("#modoAtaque").value;
    const modoDefesaTime = $("#modoDefesa").value;
    
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
        jogadores: []
    }
    
    return time;
}

function buscarJogadores(){
    const valorBusca = $("#nome-input").value.toLowerCase();

    const jogadoresFiltrados = listaJogadores.filter(jogador => jogador.nome.toLowerCase().includes(valorBusca))
    carregarJogadores(jogadoresFiltrados)
}

function carregarJogadores(jogadores){
    conteudo = "";
    let time;
    
    for (const jogador of jogadores){
        time = listaTimes.find(time => time.id==jogador.time);
        
        console.log(time);

        conteudo += `<tr>
        <td>${jogador.nome}</td>
        <td>${jogador.over}</td>
        <td>${time.nome}</td>
        <td><button class="botao-tabela botao-editar" onclick="carregarDadosFormularioJogador(${jogador.id})">Editar</button></td>
        <td><button class="botao-tabela botao-deletar" onclick="preDeletar(${jogador.id}, 'deletarJogador')" data-id="${jogador.id}">Deletar</button></td>
        </tr>`
    }
    
    tbody = $("tbody");
    tbody.innerHTML = conteudo;
}

function adicionarJogador(){
    const nome = $("#nome-input").value;
    const over = $("#over-input").value;
    const clube = $("#clube-select").value;
    
    if (!nome || !clube){
        return alert("Complete todos os campos.")
    }
    
    const id = gerarId(listaJogadores);

    time = listaTimes.find(time => time.id==clube);
    time.jogadores.push(id);
    
    jogador = {
        id: id,
        nome: nome,
        over: over, 
        pos: null,
        time: Number(clube),
    }
    
    listaJogadores.push(jogador);

    localStorage.setItem("listaJogadores", JSON.stringify(listaJogadores));
    localStorage.setItem("listaTimes", JSON.stringify(listaTimes));
    window.location.reload();
}

function carregarDadosFormularioJogador(id){
    const nome = $("#nome-input");
    const over = $("#over-input");
    const clube = $("#clube-select");
    const botaoEditar = $("#botao-adicionar-jogador");
    
    const jogador = listaJogadores.find(jogador => jogador.id === id);
    
    nome.value = jogador.nome;
    over.value = jogador.over;
    clube.value = jogador.time;

    botaoEditar.textContent = "Editar Jogador";
    botaoEditar.onclick = () => editarJogador(id);
}

function editarJogador(id){
    const nome = $("#nome-input").value;
    const over = $("#over-input").value;
    const clube = $("#clube-select").value;
    
    if (!nome || !clube){
        return alert("Complete todos os campos.")
    }
    
    const jogador = listaJogadores.find(jogador => jogador.id === id);
    
    timeAntigo = listaTimes.find(time => time.id==jogador.time);
    indexParaRemover = timeAntigo.jogadores.findIndex(id => id==jogador.id);
    timeAntigo.jogadores.splice(indexParaRemover, 1);

    novoTime = listaTimes.find(time => time.id==clube);
    novoTime.jogadores.push(id);
    
    jogador.nome = nome;
    jogador.over = over;
    jogador.time = clube;
    
    localStorage.setItem("listaJogadores", JSON.stringify(listaJogadores));
    localStorage.setItem("listaTimes", JSON.stringify(listaTimes));
    window.location.reload();
}

function deletarJogador(id){
    const index = listaJogadores.findIndex(jogador => jogador.id === id);
    
    listaJogadores.splice(index, 1);

    localStorage.setItem("listaJogadores", JSON.stringify(listaJogadores));
    window.location.reload();
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

    
    time1 = verificarFormacao(time1);
    if(!time1){
        return alert(`O time 1 está com a formação inválida.`);
    }
    
    time2 = verificarFormacao(time2);
    if(!time2){
        return alert(`O time 2 está com a formação inválida.`);
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

function carregarPaginaTime(atualizarFormacao){
    const params = new URLSearchParams(window.location.search);
    const idTime = params.get("id");
    
    const time = listaTimes.find(item => item.id == idTime);

    $("#nomeTime").value = time.nome;
    $("#cor1").value = time.cor1;
    $("#cor2").value = time.cor2;
    
    const estiloJogoTime = !time.estiloJogo ? "nenhum" : time.estiloJogo;
    const modoAtaqueTime = !time.modoAtaque ? "nenhum" : time.modoAtaque;
    const modoDefesaTime = !time.modoDefesa ? "nenhum" : time.modoDefesa;
    let formacao = !time.formacao ? "221" : time.formacao;
    
    
    $("#estiloJogo").value = estiloJogoTime;
    $("#modoAtaque").value = modoAtaqueTime;
    $("#modoDefesa").value = modoDefesaTime;
    
    if(atualizarFormacao){
        formacao = $("#formacao").value;
        console.log(formacao);
    }else{
        $("#formacao").value = formacao;
    }

    carregarCampoTaticoHtml(formacao);

    let jogadoresDisponiveis = time.jogadores.map(id => listaJogadores.find(jogador => jogador.id === id));
    let posicoes = ["GK", "ZG", "MC", "AT"];
    let posicaoAtual;
    let jogadoresPorPosicao;

    for(let i=0;i<4;i++){
        if(i==0){
            jogadoresPorPosicao = 1;
        }else{
            jogadoresPorPosicao = formacao[i-1];
        }
        posicaoAtual = posicoes[i];

        posicoesPorLinhaHtml = document.querySelectorAll("."+posicaoAtual);

        for(let n=0;n<jogadoresPorPosicao;n++){
            jogador = jogadoresDisponiveis.find(jogador => jogador.pos==posicaoAtual);

            if(jogador){
                posicaoHtml = posicoesPorLinhaHtml[n];
                posicaoHtml.innerHTML += `<div class="jogador" id=${jogador.id} draggable="true">
                <span class="nomeJogador">${jogador.nome}</span>
                <span class="overJogador">${jogador.over}</span>
            </div>`;
                idJogador = jogadoresDisponiveis.indexOf(jogador);
                jogadoresDisponiveis.splice(idJogador, 1); 
            }
        }
    }

    
    let conteudo = "";
    for (const jogador1 of jogadoresDisponiveis){
        conteudo += `<div class="jogador" draggable="true" id=${jogador1.id}>
                <span class="nomeJogador">${jogador1.nome}</span>
                <span class="overJogador">${jogador1.over}</span>
            </div>`;
    }

    const reservasDiv = $("#reservasDiv");
    reservasDiv.innerHTML += conteudo;

    document.addEventListener("dragstart", (elemento) => {
        elemento.target.classList.add("arrastando");
    });
    
    document.addEventListener("dragend", (elemento) => {
        elemento.target.classList.remove("arrastando");
    });

    let posicoesHtml = [...document.querySelectorAll(".posicao"),
    $("#reservasDiv")];
    
    posicoesHtml.forEach((item) => {
        item.addEventListener("dragover", (event) => {
            event.preventDefault();
        })

        item.addEventListener("drop", () => {
            const jogador = document.querySelector(".arrastando");

            item.appendChild(jogador);
        });
    })
}

function carregarCampoTaticoHtml(formacao){
    limparCampoTatico();

    let posicoesAtaque = "";
    let posicoesMeio = "";
    let posicoesDefesa = "";
    for (let i=0; i<formacao[2]; i++){
        posicoesAtaque += `<div class="posicao AT">
        <span class="funcao">Atacante</span>
        </div>`;
    }
    $(".ataque").innerHTML = posicoesAtaque;
    
    for (let i=0; i<formacao[1]; i++){
        posicoesMeio += `<div class="posicao MC">
        <span class="funcao">Meio-Campo</span>
        </div>`;
    }
    $(".meio").innerHTML = posicoesMeio;
    
    for (let i=0; i<formacao[0]; i++){
        posicoesDefesa += `<div class="posicao ZG">
        <span class="funcao">Zagueiro</span>
        </div>`;
    }
    $(".defesa").innerHTML = posicoesDefesa;
}

function limparCampoTatico(){
    const jogadores = document.querySelectorAll(".jogador");

    for(const jogador of jogadores){
        jogador.remove();
    }
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
    const dadosArquivo = $("#dados").files[0];
    const conteudo = await dadosArquivo.text();
    let dados = JSON.parse(conteudo);    
    
    if(!dados.versaoDados){
        for(let time of dados){
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
        localStorage.setItem("versaoDados", 1);
    }else{
        localStorage.setItem("versaoDados", JSON.stringify(dados.versaoDados));
        localStorage.setItem("listaTimes", JSON.stringify(dados.times));
        localStorage.setItem("listaJogadores", JSON.stringify(dados.jogadores));
    }

    irParaPagina("index.html")
}

function exportarPacote(){
    const conteudo = {
        versaoDados: 2,
        times: listaTimes,
        jogadores: listaJogadores
    }

    const json = JSON.stringify(conteudo, null, 4);

    const blob = new Blob([json],{
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "dados-varzea-simulator.json";

    a.click()

    URL.revokeObjectURL(url);
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

function verificarFormacao(time){
    let jogadores = time.jogadores.map(id => listaJogadores.find(jogador => jogador.id==id)).filter(jogador => jogador.pos);

    if(jogadores.length!=6){
        return null;
    }else{
        time.jogadores = jogadores;
    }
    
    return time;
}

function gerarId(lista){
    if (lista.length == 0){
        return 0;
    }
    
    return Number(lista[lista.length-1].id+1);
}