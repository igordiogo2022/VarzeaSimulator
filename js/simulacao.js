function simulacaoPartida(estilo, clima, torcida, moralTime1, moralTime2, ehJogoDecisivo, placarIdaTime1, placarIdaTime2, time1, time2){
    placarIdaTime1 = !placarIdaTime1 ? 0 : placarIdaTime1;
    placarIdaTime2 = !placarIdaTime2 ? 0 : placarIdaTime2;
    
    for(let jogador of time1.jogadores){
        jogador.jogando = true;
        jogador.amarelado = false;
    }
    for(let jogador of time2.jogadores){
        jogador.jogando = true;
        jogador.amarelado = false;
    }
    
    let [chanceEventoMod, chanceGolT1Mod, chanceGolT2Mod, chanceVermelhoMod] = calcularModificadores(estilo, clima, torcida, moralTime1, moralTime2, time1, time2);
    
    let mcModT1 = calcularModificadoresTaticos(time1, time2);
    let mcModT2 = calcularModificadoresTaticos(time2, time1);
    let [atkModT1, defModT1] = definirBonusTatico(time1);
    let [atkModT2, defModT2] = definirBonusTatico(time2);

    if(mcModT1>1 && mcModT2>1){
        chanceEventoMod += 5;
        mcModT1 = 1;
        mcModT2 = 1;
    }else if(mcModT1<1 && mcModT2<1){
        chanceEventoMod -= 5;
        mcModT1 = 1;
        mcModT2 = 1;
    }
    
    let [ataqueTime1, ataqueTime2] = converterParaPorcentagem(calcularForcaBase(time1, "atk")*atkModT1, calcularForcaBase(time2, "atk")*atkModT2);
    let [meiocampoTime1, meiocampoTime2] = converterParaPorcentagem(calcularForcaBase(time1, "mc")*mcModT1, calcularForcaBase(time2, "mc")*mcModT2);
    let [defesaTime1, defesaTime2] = converterParaPorcentagem(calcularForcaBase(time1, "def")*defModT1, calcularForcaBase(time2, "def")*defModT2);
    

    let chanceEvento = 23 + chanceEventoMod;
    let chanceGolT1 = Math.max(1, ((ataqueTime1-defesaTime2)/9.5)+9.5 + chanceGolT1Mod); 
    let chanceGolT2 = Math.max(1, ((ataqueTime2-defesaTime1)/9.5)+9.5 + chanceGolT2Mod); 
    let chanceAtaque = 94;
    let chanceVermelho = 3 + chanceVermelhoMod;
    let sumula = [];
    let tempoPartida = 90 + Math.floor(Math.random()*10);
    let timeEvento = "";
    
    for(let minuto=0;minuto<=tempoPartida;minuto++){
        let valorRandom1 = Math.random() * 100;
        
        if(valorRandom1 < chanceEvento){
            let exibirEvento = false;
            let jogadorAssistencia = null; 
            let eventoBloqueado = false;
            let valorRandom2 = Math.random() * 100;
            
            if(valorRandom2<chanceAtaque){
                timeEvento = definirPosseBola(time1, time2, meiocampoTime1, meiocampoTime2, true);
                const chanceGol = timeEvento==time1 ? chanceGolT1 : chanceGolT2;
                evento = sortearEventoOfensivo(chanceGol);
                if(evento=="gol"){
                    jogador = sorteiarJogadorEvento(timeEvento.jogadores, evento);
                    jogadorAssistencia = sorteiarJogadorAssistencia(timeEvento.jogadores, jogador);
                    exibirEvento = true;
                }else if(evento=="defesaGoleiro" || evento=="superDefesaGoleiro"){
                    if(timeEvento==time1){
                        timeInverso = time2;
                    }else if(timeEvento==time2){
                        timeInverso = time1;
                    }
                    timeEvento = timeInverso;
                    jogador = timeInverso.jogadores[0];
                    if(evento=="superDefesaGoleiro"){
                        exibirEvento = true;
                    }
                }else if(evento=="varGol" || evento=="varAnulou"){
                    jogador = sorteiarJogadorEvento(timeEvento.jogadores, evento);
                    jogadorAssistencia = sorteiarJogadorAssistencia(timeEvento.jogadores, jogador);
                    exibirEvento = true;
                }else if(evento=="fora"){
                    jogador = sorteiarJogadorEvento(timeEvento.jogadores, evento);
                }else{
                    if(timeEvento==time1){
                        jogador = sorteiarJogadorEvento(time2.jogadores, evento);
                    }else if(timeEvento==time2){
                        jogador = sorteiarJogadorEvento(time1.jogadores, evento);
                    }
                    exibirEvento = true;
                }

            }else{
                exibirEvento = true;
                timeEvento = definirPosseBola(time1, time2, meiocampoTime1, meiocampoTime2, false);
                evento = sorteiarCartao(chanceVermelho);
                jogador = sorteiarJogadorEvento(timeEvento.jogadores, evento);

                expulsoesJogo = timeEvento.jogadores.filter(jogador=>jogador.jogando==false).length;
                if (expulsoesJogo>=2) eventoBloqueado=true;
                if(evento=="vermelho" && !eventoBloqueado){
                    switch(timeEvento){
                        case time1:
                            chanceGolT1 -= 10;
                            break;
                        case time2:
                            chanceGolT2 -= 10;
                            break;
                        }
                        
                    expulsarJogador(timeEvento.jogadores, jogador);
                }else if(evento=="amarelo" && !eventoBloqueado){
                    if(jogador.amarelado){
                        evento = "vermelho";
                        expulsarJogador(timeEvento.jogadores, jogador);
                    }else{
                        jogador.amarelado = true;
                    }
                }
            }
                
            if(!eventoBloqueado){
                sumula.push({
                    minuto: minuto, 
                    time: timeEvento, 
                    jogador: jogador.nome, 
                    jogadorAssistencia: jogadorAssistencia, 
                    tipo: evento,
                    exibir: exibirEvento
                });
            }

            if(evento=="varGol" || evento=="varAnulou"){
                minuto+=2;
            }
        }
        if(minuto==45 && clima=="quente"){
            chanceEvento -= 3;
        }
        if(minuto==75 && clima=="quente"){
            chanceEvento -= 1;
        }

        if(ehJogoDecisivo && minuto==tempoPartida){
            let placarTime1 = sumula.filter(evento => evento.tipo=="gol" || evento.tipo=="contra" || evento.tipo=="varGol").filter(evento => evento.time==time1).length || 0;
            let placarTime2 = sumula.filter(evento => evento.tipo=="gol" || evento.tipo=="contra" || evento.tipo=="varGol").filter(evento => evento.time==time2).length || 0;
            
            if((placarTime1+placarIdaTime1)==(placarTime2+placarIdaTime2)){
                let sumulaPenaltis = disputaPenaltis(time1, time2);
                return [sumula, tempoPartida, sumulaPenaltis];
            }
        }
    }

    return [sumula, tempoPartida, "sem penaltis"];
}

function disputaPenaltis(time1, time2){
    let gkTime1 = time1.jogadores[0];
    let gkTime2 = time2.jogadores[0];
    let batedoresTime1 = JSON.parse(JSON.stringify(time1.jogadores)).reverse();
    let batedoresTime2 = JSON.parse(JSON.stringify(time2.jogadores)).reverse();
    let [expulsosTime1, expulsosTime2, placarTime1, placarTime2] = [0,0,0,0];
    let sumulaPenaltis = [{
        gkTime1: gkTime1,
        gkTime2: gkTime2
    }];
    
    let qtdPenaltis = 4;
    for(i=0;i<=qtdPenaltis;i++){
        [batedor1, expulsosTime1] = definirBatedorPenalti(batedoresTime1, expulsosTime1, i);
        let decisaoTime1 = penalti(batedor1, gkTime2);
        
        [batedor2, expulsosTime2] = definirBatedorPenalti(batedoresTime2, expulsosTime2, i);
        let decisaoTime2 = penalti(batedor2, gkTime1);

        placarTime1 = decisaoTime1=="gol" ? placarTime1+1 : placarTime1;
        placarTime2 = decisaoTime2=="gol" ? placarTime2+1 : placarTime2;
        sumulaPenaltis.push({
            decisao: decisaoTime1,
            batedor: batedor1,
            time: time1
        });
        sumulaPenaltis.push({
            decisao: decisaoTime2,
            batedor: batedor2,
            time: time2
        });

        if(i>=4 && placarTime1==placarTime2){
            qtdPenaltis++;
        }
    }
    return sumulaPenaltis;
    
}

function definirBatedorPenalti(listaBatedores, expulsosTime, i){
    if(listaBatedores[(i+expulsosTime)%6].jogando){
        return [listaBatedores[(i+expulsosTime)%6], expulsosTime];
    }else{
        expulsosTime++;
        return definirBatedorPenalti(listaBatedores, expulsosTime, i);
    }
}

function penalti(batedor, goleiro){
    let random = Math.random()*100;

    chanceDefender = 12+((goleiro.over-batedor.over)/2);
    chanceFora = 10;

    if(random<chanceDefender){
        return "defesa";
    }else if(random<chanceFora+chanceDefender){
        return "fora";
    }else{
        return "gol";
    }
}

function calcularForcaBase(time, forca){
    switch (forca){
        case "atk": 
            pesos = [0, 0.5, 2, 4];
            pesoIdeal = 11;
            break;
        case "mc":
            pesos = [0, 2.2, 2.85, 2.2];
            pesoIdeal = 10;
            break;
        case "def": 
            pesos = [3, 4, 1.5, 0.5];
            pesoIdeal = 13.5;
            break;
    }
    
    oversEpesos = [];
    
    for(let jogador of time.jogadores){
        switch (jogador.pos){
            case "GK": peso = pesos[0]; 
            break;
            case "ZG": peso = pesos[1];
            break;
            case "MC": peso = pesos[2]; 
            break;
            case "AT": peso = pesos[3]; 
            break;
        }
        oversEpesos.push([jogador.over, peso]);
    }
    
    let valorFinal = 0;
    
    for(let valorEpeso of oversEpesos){
        let [valor,peso] = valorEpeso;
        valorFinal += (valor*peso);
    }

    valorFinal = valorFinal**2;
    
    return valorFinal / pesoIdeal;
}

function converterParaPorcentagem(valor1, valor2){
    let base = 100/(valor1+valor2);
    let valorPorcentagem1 = Math.round(valor1*base);
    let valorPorcentagem2 = Math.round(valor2*base);

    return [valorPorcentagem1, valorPorcentagem2];
}

function calcularModificadores(estilo, clima, torcida, moralTime1, moralTime2, time1, time2){
    let [chanceEventoMod, chanceGolT1Mod, chanceGolT2Mod, chanceVermelhoMod] = [0, 0, 0, 0];
    
    switch(estilo){
        case "varzeano":
            chanceEventoMod += -5;
            break;
        case "maluco":
            chanceEventoMod += 3;
            break;
        case "ofensivo":
            chanceEventoMod += 4;
            break;
        case "violento":
            chanceVermelhoMod += 7; 
            break;
    }
            
    switch(clima){
        case "quente":
            chanceEventoMod += 4;
            break;
        case "frio":
            chanceEventoMod += -5;
            break;
        case "chuvoso":
            chanceEventoMod += -3;
            break;
    }
            
    switch(torcida){
        case "unica":
            chanceGolT1Mod += 2;
            break;
        case "meio-a-meio":
            chanceEventoMod += 1.5;
            break;
        case "mandanteForte":
            chanceGolT1Mod += 2;
            break;    
        case "visitanteForte":
            chanceGolT2Mod += 2;
            break;    
    }
        
    switch(moralTime1){
        case "boa":
            chanceGolT1Mod += 2;
            break;
        case "ruim":
            chanceGolT1Mod += -2;
            break;
    }
        
    switch(moralTime2){
        case "boa":
            chanceGolT2Mod += 2;
            break;
        case "ruim":
            chanceGolT2Mod += -2;
            break;
    }

    let posicoes = ["ZG", "MC", "AT"];

    posicoes.forEach(posicao => {
            let qtdTimePos1 = time1.jogadores.filter(jogador => jogador.pos==posicao).length;
            let qtdTimePos2 = time2.jogadores.filter(jogador => jogador.pos==posicao).length;
   
            if (posicao === "ZG") {
                if (qtdTimePos1 === 0) chanceGolT2Mod += 50;
                if (qtdTimePos2 === 0) chanceGolT1Mod += 50;
            } else if (posicao === "MC" || posicao === "AT") {
                if (qtdTimePos1 === 0) chanceGolT1Mod -= 50;
                if (qtdTimePos2 === 0) chanceGolT2Mod -= 50;
            }
    });
                                                
    return [chanceEventoMod, chanceGolT1Mod, chanceGolT2Mod, chanceVermelhoMod];
}

function calcularModificadoresTaticos(time1, time2){
    const regrasTaticas = {
        trocaPasses: {
            zona: "vAtaque",
            individual: "vDefesa",
            pressaoAlta: "vDefesa",
            linhaImpedimento: "vAtaque"
        },
        cruzamentos: {
            zona: "vDefesa",
            individual: "vAtaque",
            pressaoAlta: "vDefesa",
            linhaImpedimento: "vAtaque"
        },
        contraAtaque: {
            zona: "vAtaque",
            individual: "vDefesa",
            pressaoAlta: "vAtaque",
            linhaImpedimento: "vDefesa"
        },
        pontas: {
            zona: "vDefesa",
            individual: "vAtaque",
            pressaoAlta: "vAtaque",
            linhaImpedimento: "vDefesa"
        }
    };

    let vantagem = regrasTaticas[time1.modoAtaque][time2.modoDefesa];
    if(vantagem=="vAtaque"){
        return 1.1;
    }else if(vantagem=="vDefesa"){
        return 0.9;
    }
}

function definirBonusTatico(time){
    if(time.estiloJogo=="ofensivo"){
        return [1.12, 1];
    }else if(time.estiloJogo=="defensivo"){
        return [1, 1.12];
    }else{
        return [1.06, 1.06];
    }
}

function definirPosseBola(time1, time2, meiocampoTime1, meiocampoTime2, eventoOfensivo){
    let valorRandom = Math.random() * (meiocampoTime1+meiocampoTime2) + 1;

    let expressao = eventoOfensivo ?  valorRandom < meiocampoTime1 : valorRandom > meiocampoTime1;
    
    if(expressao){
        timeEvento = time1;
    }else{
        timeEvento = time2;
    }

    return timeEvento;
}

function sorteiarJogadorEvento(jogadores, evento){
    const valores = [];
    for(let i=1;i<=5;i++){
        if(jogadores[i].pos=="AT" && evento=="gol"){
            valores.push(i);
        }
        valores.push(i);
    }

    let valorRandom = valores[Math.floor(Math.random() * valores.length)];
    let jogador = jogadores[valorRandom];
    
    if(jogador.jogando){
        return jogador;
    }else{
        return sorteiarJogadorEvento(jogadores);
    }
}

function sorteiarJogadorAssistencia(jogadores, jogadorGol){
    let valorRandom1 = Math.floor(Math.random() * 101);
    if(valorRandom1>70){
        return null;
    }

    const valores = [];
    for(let i=1;i<=5;i++){
        if(jogadores[i].pos=="MC"){
            valores.push(i);
        }
        valores.push(i);
    }

    let valorRandom2 = valores[Math.floor(Math.random() * valores.length)];
    let jogador = jogadores[valorRandom2];
    
    if(jogador.jogando && jogador!=jogadorGol){
        return jogador.nome;
    }else{
        return sorteiarJogadorAssistencia(jogadores, jogadorGol);
    }
}

function sortearEventoOfensivo(chanceGol){
    let valorRandom = Math.random() * 100;
    
    let chancePraFora = (58.8-(chanceGol-9.5))+chanceGol;
    let chanceVar = 1.5+chancePraFora;
    let chanceDefender = 30+chanceVar;

    if(valorRandom < chanceGol){
        return "gol";
    }else if(valorRandom < chancePraFora){
        return "fora";
    }else if(valorRandom < chanceVar){
        let valorRandom2 = Math.random() * 100;
        let varConclusao = valorRandom2<50 ? "varGol" : "varAnulou";
        return varConclusao;
    }else if(valorRandom < chanceDefender){
        let valorRandom2 = Math.random() * 100;
        let tipoDefesa = valorRandom2<95 ? "defesaGoleiro" : "superDefesaGoleiro";
        return tipoDefesa;
    }else{
        return "contra";
    }
}

function sorteiarCartao(chanceVermelho){
    let valorRandom = Math.random() * 101;
    if(valorRandom < chanceVermelho){
        evento = "vermelho";
    }else{
        evento = "amarelo";
    }

    return evento;
}

function expulsarJogador(jogadores, jogadorExpulso){
    jogadores.forEach(jogador => {
        if(jogador == jogadorExpulso){
            jogador.jogando = false;
        }
    });
}