// moonlander. Um jogo de alunissagem
// Pietro munoz  https://github.com/Pietrojoshua
//28/03/25
//Versão 0.1.0


/** @type {HTMLCanvasElement} */
 
//Seção de modelagem de dados
let canvas = document.querySelector("#jogo")
let contexto = canvas.getContext("2d")



if (Math.round(Math.random()) == 0){
   x = 100
   velocidadeX = 2
   angulo = -Math.PI/2
}else{
   x = 700
   velocidadeX = -2
   angulo = Math.PI/2
};

let lancamentoPelaEsquerda = (Math.round(Math.random()) == 0)



 let moduloLunar = {
    posicao: {
       x: lancamentoPelaEsquerda ? 100 : 700,
       y: 100
      }, 
    angulo : lancamentoPelaEsquerda ?  -Math.PI/2 : Math.PI/2,
    largura: 20,
    altura: 20,
    cor: 'lightgray',
    motorLigado: false,
    velocidade: {
        x: lancamentoPelaEsquerda ? 2 : -2,
        y: 0
    }, 
    combustivel: 1000,
    rotacaoAntiHorario: false,
    rotacaoHorario: false
    
};

let estrelas = [];   

for(let i = 0; i < 600; i++){

   estrelas[i] = {      
      x:Math.random() * canvas.width,
      y:Math.random() * canvas.height,
      raio: Math.sqrt(1 * Math.random()),
      brilho: 1.0,
      apagando: true ,
      cintilacao: 0.05 * Math.random()
   }
   }
      

//secao de visualização
 function desenharModuloLunar(){
    contexto.save();
    contexto.beginPath();
    contexto.translate(moduloLunar.posicao.x, moduloLunar.posicao.y);
    contexto.rotate(moduloLunar.angulo);
    contexto.rect(moduloLunar.largura * -0.5, moduloLunar.altura * -0.5, moduloLunar.largura, moduloLunar.altura );
    contexto.fillStyle = moduloLunar.cor
    contexto.fill();
    contexto.closePath();
    
    

    if(moduloLunar.motorLigado){
      desenharChama()
    }
    
   // desenharChama()

    contexto.restore();
    
   }
   
   function desenharChama(){
      contexto.beginPath()
      //aumentar a chama
      contexto.moveTo(moduloLunar.largura * -0.5, moduloLunar.altura * 0.5)
      contexto.lineTo(moduloLunar.largura * 0.5, moduloLunar.altura * 0.5)
      contexto.lineTo(0, moduloLunar.altura * 0.5 + Math.random() * 125)
      contexto.lineTo(moduloLunar.largura * -0.5, moduloLunar.altura * 0.5)
      contexto.closePath();
      contexto.fillStyle = "rgb(23, 23, 221)"
      contexto.fill()
   }
   function mostrarIndicador(mensagem, x, y){

      contexto.font = 'bold 18px Arial'
      contexto.textAlign = 'center'
      contexto.textBaseline = 'middle'
      contexto.fillStyle = 'lightgray'
      contexto.fillText(mensagem, x, y)
   }
   
   function mostrarVelocidade(){
       mensagem = `velocidadeH: ${(10 * moduloLunar.velocidade.x).toFixed(2)}`;
       mostrarIndicador(mensagem, 100, 60);
       mensagem = `Velocidade Vertical ${(10 * moduloLunar.velocidade.y).toFixed(2)}`;
       mostrarIndicador(mensagem, 100, 90)
      
   }
    
   function mostrarCombustivel(){
      mensagem = `Combustivel: ${((moduloLunar.combustivel / 1000) * 100).toFixed(2)}%`
      mostrarIndicador(mensagem, 500, 30)
      
   }
    
   function mostrarAngulo(){
      mensagem = `Angulo: ${(moduloLunar.angulo * 180/Math.PI).toFixed(2)}°`
      mostrarIndicador(mensagem,500, 60)
   }
   
   function mostrarAltitude(){    
     mensagem = `Altitude: ${(canvas.height - moduloLunar.posicao.y).toFixed(2)}`
     mostrarIndicador(mensagem, 100, 30)
   }


   function desenharEstrelas(){
      contexto.save()
      for(let i = 0; i < estrelas.length; i++){
         let estrela = estrelas[i];
         contexto.beginPath();
         contexto.arc(estrela.x, estrela.y, estrela.raio, 0, 2*Math.PI);
         contexto.closePath();
         contexto.fillStyle = `rgba(255, 255, 255, ${estrela.brilho} )`;
         contexto.fill();
         if(estrela.apagando){
            estrela.brilho -=estrela.cintilacao
            if(estrela.brilho <= 0.1){
               estrela.apagando = false
            }
         } else {
            estrela.brilho += estrela.cintilacao
            if(estrela.brilho >= 0.95){
               estrela.apagando = true
            }
            
         }
         
         
      }
      contexto.restore()
   }
      
   function desenhar(){
      //limpar tela
      contexto.clearRect(0, 0, canvas.width, canvas.height)
      //essa funcao atualiza o posicao do modulo lunar em funcao da gravidade
      
      atracaoGravitacional()
      desenharEstrelas()
      desenharModuloLunar()
      mostrarVelocidade()
      mostrarCombustivel()
      mostrarAngulo()
      mostrarAltitude()
      if(moduloLunar.posicao.y >= (canvas.height - 0.5 * moduloLunar.altura)){ 
         
         if(moduloLunar.velocidade.y >= 0.5|| 
            Math.abs(moduloLunar.velocidade.x) >= 0.5||
            5 < Math.abs(moduloLunar.angulo)
         )
         {
            contexto.font = "Bold 48px VT323 "
            contexto.textAlign = "center"
            contexto.textBaseline = "middle"
            contexto.fillStyle = "red"
            return contexto.fillText("Game over", 360, 270)
            
         }else {contexto.font = "Bold 48px VT323"
            contexto.textAlign = "center"
            contexto.textBaseline = "middle"
            contexto.fillStyle = "Blue"
            return contexto.fillText("You win", 360, 270)
            
         }

      }
      
      //Esta funcao repete a execuçao da funcao desenhar a cada atualização de tela (ou a cada quatro)
         requestAnimationFrame(desenhar)
   }
   //secao de controle
   document.addEventListener('keydown', teclaPressionada);
   function teclaPressionada(evento){
      if(evento.keyCode == 38 && moduloLunar.combustivel > 0){
         moduloLunar.motorLigado = true;
      }
      else if(evento.keyCode == 39){
         moduloLunar.rotacaoAntiHorario = true
         
         
         //comando para girar no sentido anti-horario
         
      }else if (evento.keyCode == 37){
         //comando para girar no sentido horario
         moduloLunar.rotacaoHorario = true
         
      }
      
      
   }
   document.addEventListener('keyup', teclaSolta);
   
 function teclaSolta(evento){
    if(evento.keyCode == 38){
       moduloLunar.motorLigado = false;
      } else if(evento.keyCode == 39){
         moduloLunar.rotacaoAntiHorario = false
         
      }else if(evento.keyCode == 37){
         moduloLunar.rotacaoHorario = false
         
      }
   }
   function gasto(){
     if(moduloLunar.combustivel > 0) {
        moduloLunar.combustivel -=0.5
     }else{
        moduloLunar.combustivel = 0
        moduloLunar.motorLigado = false
     }
   }
   
   let gravidade = 0.01
   function atracaoGravitacional(){
      moduloLunar.posicao.x += moduloLunar.velocidade.x;
    moduloLunar.posicao.y += moduloLunar.velocidade.y;
    if(moduloLunar.rotacaoAntiHorario){
      moduloLunar.angulo += Math.PI/180
    }else if (moduloLunar.rotacaoHorario){
      moduloLunar.angulo -= Math.PI/180
    }
    if(moduloLunar.motorLigado){
      moduloLunar.velocidade.y -=0.0115 * Math.cos(moduloLunar.angulo)
      moduloLunar.velocidade.x +=0.0115 * Math.sin(moduloLunar.angulo)
      gasto()
    }
    moduloLunar.velocidade.y += gravidade   
}
desenhar() 