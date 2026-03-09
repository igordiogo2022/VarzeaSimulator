function simulacaoPartida(estilo, clima, torcida, moralTime1, moralTime2, time1, time2){
    let [chanceEventoMod, chanceEventoTime1Mod, chanceEventoTime2Mod, chanceVermelhoMod] = calcularModificadores(estilo, clima, torcida, moralTime1, moralTime2);
    
    let ataqueTime1 = calcularForca(time1, "atk");
    let defesaTime1 = calcularForca(time1, "def");
    let ataqueTime2 = calcularForca(time2, "atk");
    let defesaTime2 = calcularForca(time2, "def");

    let chanceEvento = 3 + chanceEventoMod;
    let chanceEventoT1 = Math.max(1, (50 + (ataqueTime1-defesaTime2) * 2) + chanceEventoTime1Mod); 
    let chanceEventoT2 = Math.max(1, (50 + (ataqueTime2-defesaTime1) * 2) + chanceEventoTime2Mod); 
    let chanceVermelho = 5 + chanceVermelhoMod;

    let sumula = [];
    let tempoPartida = 90 + Math.floor(Math.random()*10);
    let timeEvento = "";
    
    for(let minuto=0;minuto<=tempoPartida;minuto++){
        let valorRandom = Math.random() * 100;

        if(valorRandom < chanceEvento){
            timeEvento = sorteiarTimeEvento(time1, time2, chanceEventoT1, chanceEventoT2);
            jogador = sorteiarJogadorEvento(timeEvento.jogadores);
            evento = sorteiarTipoEvento(chanceVermelho);
            if(evento === "gol"){
                jogadorAssistencia = sorteiarJogadorAssistencia(timeEvento.jogadores, jogador);
            }else{
                jogadorAssistencia = null;
            }

            if(evento=="vermelho"){
                switch(timeEvento){
                    case time1:
                        chanceEventoT1 -= 10;
                        break;
                    case time2:
                        chanceEventoT2 -= 10;
                        break;
                    }
                        
                    for(let i=0;i<timeEvento.jogadores.length;i++){
                        if(timeEvento.jogadores[i] == jogador){
                            timeEvento.jogadores[i].jogando = false;
                        }
                    }
                    if(timeEvento.jogadores.length<=3){
                        chanceVermelho = 0;
                    }
                }

            if(minuto==45 && clima=="quente"){
                chanceEvento -= 3;
            }
            if(minuto==75 && clima=="quente"){
                chanceEvento -= 1;
            }
            
            sumula.push({
                minuto: minuto, 
                time: timeEvento, 
                jogador: jogador.nome, 
                jogadorAssistencia: jogadorAssistencia, 
                tipo: evento
            });
        }
    }

    return [sumula, tempoPartida];
}

function calcularForca(time, forca){
    switch (forca){
        case "atk": 
            pesos = [0, 0.5, 2, 4];
            pesoIdeal = 11;
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
    
    return valorFinal / pesoIdeal;
}

function calcularModificadores(estilo, clima, torcida, moralTime1, moralTime2){
    let [chanceEventoMod, chanceEventoTime1Mod, chanceEventoTime2Mod, chanceVermelhoMod] = [0, 0, 0, 0];
    
    switch(estilo){
        case "varzeano":
            chanceEventoMod += -1;
            break;
        case "maluco":
            chanceEventoMod += 2;
            break;
        case "ofensivo":
            chanceEventoMod += 2;
            break;
        case "violento":
            chanceVermelhoMod += 5; 
            break;
    }
            
    switch(clima){
        case "quente":
            chanceEventoMod += 3;
            break;
        case "frio":
            chanceEventoMod += -1.5;
            break;
        case "chuvoso":
            chanceEventoMod += -1;
            break;
    }
            
    switch(torcida){
        case "unica":
            chanceEventoTime1Mod += 4;
            break;
        case "meio-a-meio":
            chanceEventoMod += 1.5;
            break;
        case "mandanteForte":
            chanceEventoTime1Mod += 5;
            break;    
        case "visitanteForte":
            chanceEventoTime2Mod += 5;
            break;    
    }
        
    switch(moralTime1){
        case "boa":
            chanceEventoTime1Mod += 5;
            break;
        case "ruim":
            chanceEventoTime1Mod += -5;
            break;
    }
        
    switch(moralTime2){
        case "boa":
            chanceEventoTime2Mod += 8;
            break;
        case "ruim":
            chanceEventoTime2Mod += -8;
            break;
    }
                                                
    return [chanceEventoMod, chanceEventoTime1Mod, chanceEventoTime2Mod, chanceVermelhoMod];
}

function sorteiarTimeEvento(time1, time2, chanceT1, chanceT2){
    let valorRandom = Math.random() * (chanceT1+chanceT2) + 1;
    
    if(valorRandom < chanceT1){
        timeEvento = time1;
    }else{
        timeEvento = time2;
    }
    
    return timeEvento;
}

function sorteiarJogadorEvento(jogadores){
    let valorRandom = Math.floor(Math.random() * (jogadores.length-1))+1;
    let jogador = jogadores[valorRandom];

    if(jogador.jogando){
        return jogador;
    }else{
        sorteiarJogadorEvento(jogadores);
    }
}

function sorteiarJogadorAssistencia(jogadores, jogadorGol){
    let valorRandom1 = Math.floor(Math.random() * 100);
    if(valorRandom1>70){
        return null;
    }

    let valorRandom2 = Math.floor(Math.random() * (jogadores.length-1))+1;
    let jogador = jogadores[valorRandom2];
    
    if(jogador.jogando && jogador!=jogadorGol){
        return jogador.nome;
    }else{
        sorteiarJogadorEvento(jogadores);
    }
}

function sorteiarTipoEvento(chanceVermelho){
    let valorRandom = Math.random() * 101;
    if(valorRandom > chanceVermelho){
        evento = "gol";
    }else{
        evento = "vermelho";
    }

    return evento;
}
