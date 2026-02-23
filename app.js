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

function abrirMenu(){
    const menu = document.querySelector("menu");
    menu.classList.add("menuAberto");
}

function fecharMenu(){
    const menu = document.querySelector("menu");
    menu.classList.remove("menuAberto");
}

function abrirFormulario(){
    const body =  document.querySelector("body");
    const janelaModal = document.querySelector("#janela-modal");
    
    janelaModal.style.display = "flex";
    window.scrollTo({top: 0});
    body.style.overflow = "hidden";
}
function fecharFormulario(){
    const body =  document.querySelector("body");
    const janelaModal = document.querySelector("#janela-modal");
    
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
        
        listajogadores.push({pos: posJogador, nome: nomeJogador, over: overJogador});
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

function carregarFormularioEdicao(id){
    let time = listaTimes.find(item => item.id == id);

    abrirFormulario();  
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