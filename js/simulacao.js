function simulacaoPartida(estilo, clima, torcida, moralTime1, moralTime2, time1, time2){
    for(let jogador of time1.jogadores){
        jogador.jogando = true;
        jogador.amarelado = false;
    }
    for(let jogador of time2.jogadores){
        jogador.jogando = true;
        jogador.amarelado = false;
    }

    let [chanceEventoMod, chanceGolT1Mod, chanceGolT2Mod, chanceVermelhoMod] = calcularModificadores(estilo, clima, torcida, moralTime1, moralTime2);
    
    let ataqueTime1 = calcularForca(time1, "atk");
    let defesaTime1 = calcularForca(time1, "def");
    let ataqueTime2 = calcularForca(time2, "atk");
    let defesaTime2 = calcularForca(time2, "def");

    let chanceEvento = 5 + chanceEventoMod;
    let chanceGolT1 = Math.max(1, (50 + (ataqueTime1-defesaTime2) * 2) + chanceGolT1Mod); 
    let chanceGolT2 = Math.max(1, (50 + (ataqueTime2-defesaTime1) * 2) + chanceGolT2Mod); 
    let chanceAtaque = 52;
    let chanceVermelho = 3 + chanceVermelhoMod;

    let sumula = [];
    let tempoPartida = 90 + Math.floor(Math.random()*10);
    let timeEvento = "";
    
    for(let minuto=0;minuto<=tempoPartida;minuto++){
        let valorRandom1 = Math.random() * 100;
        
        if(valorRandom1 < chanceEvento){
            let valorRandom2 = Math.random() * 100;
            if(valorRandom2<chanceAtaque){
                timeEvento = sorteiarTimeEvento(time1, time2, chanceGolT1, chanceGolT2);
                jogador = sorteiarJogadorEvento(timeEvento.jogadores);
                jogadorAssistencia = sorteiarJogadorAssistencia(timeEvento.jogadores, jogador);
                evento = "gol";
                console.log("gol");
            }else{
                timeEvento = sorteiarTimeEvento(time1, time2, 50, 50);
                jogador = sorteiarJogadorEvento(timeEvento.jogadores);
                jogadorAssistencia = null; 
                evento = sorteiarCartao(chanceVermelho);
                console.log("cartao");
                
                if(evento=="vermelho"){
                    switch(timeEvento){
                        case time1:
                            chanceGolT1 -= 10;
                            break;
                        case time2:
                            chanceGolT2 -= 10;
                            break;
                        }
                        console.log("vermelho");
                        
                        expulsarJogador(timeEvento.jogadores, jogador);
                    }else if(evento=="amarelo"){
                        if(jogador.amarelado){
                            evento = "vermelho";
                            expulsarJogador(timeEvento.jogadores, jogador);
                            console.log("vermelho por 2 amarelo");
                        }else{
                            jogador.amarelado = true;
                            console.log("amarelo");
                        }
                }
            }
                
            sumula.push({
                minuto: minuto, 
                time: timeEvento, 
                jogador: jogador.nome, 
                jogadorAssistencia: jogadorAssistencia, 
                tipo: evento
            });
        }
        if(minuto==45 && clima=="quente"){
            chanceEvento -= 3;
        }
        if(minuto==75 && clima=="quente"){
            chanceEvento -= 1;
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
    let [chanceEventoMod, chanceGolT1Mod, chanceGolT2Mod, chanceVermelhoMod] = [0, 0, 0, 0];
    
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
            chanceGolT1Mod += 4;
            break;
        case "meio-a-meio":
            chanceEventoMod += 1.5;
            break;
        case "mandanteForte":
            chanceGolT1Mod += 5;
            break;    
        case "visitanteForte":
            chanceGolT2Mod += 5;
            break;    
    }
        
    switch(moralTime1){
        case "boa":
            chanceGolT1Mod += 5;
            break;
        case "ruim":
            chanceGolT1Mod += -5;
            break;
    }
        
    switch(moralTime2){
        case "boa":
            chanceGolT2Mod += 8;
            break;
        case "ruim":
            chanceGolT2Mod += -8;
            break;
    }
                                                
    return [chanceEventoMod, chanceGolT1Mod, chanceGolT2Mod, chanceVermelhoMod];
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
    const valores = [1, 2, 3, 4, 4, 5, 5];
    let valorRandom = valores[Math.floor(Math.random() * valores.length)];
    let jogador = jogadores[valorRandom];

    if(jogador.jogando){
        return jogador;
    }else{
        return sorteiarJogadorEvento(jogadores);
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
        return sorteiarJogadorAssistencia(jogadores, jogadorGol);
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