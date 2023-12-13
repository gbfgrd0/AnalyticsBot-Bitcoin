// Variaveis
let lista = [];

// Importando as tecnologias
let ws = new WebSocket('wss://stream.binance.com:9443/ws/joeusdt@trade')
const {ipcRenderer} = require('electron');
// Importando os elementos HTML para alterar no JS
let precoHtml = document.getElementById('precoBTC') // HTML do Preço
let ultimoPreco = null; // Variável do último preço
let precoHtmlMAX = document.getElementById('precoMAX') // HTML do Preço máximo
let precoHtmlMIN = document.getElementById('precoMIN') // HTML do Preço mínimo 
let variacao = document.getElementById('variacao') // HTML da variação

// Função para pegar a API para o preço máximo, minimo e variação
setInterval(() => {
    fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL').then(response =>{
    return response.json() // Pegando a API por meio do link 
}).then(data =>{
    let pct = data.BTCBRL.pctChange // Porcentagem de variação
    let precoBtcMAX = data.BTCBRL.high; // Valor máximo
    let precoBtcMIN = data.BTCBRL.low; // Valor mínimo
    let precoDOLAR = data.USDBRL.bid; // Valor do dolar 
    let precoUsdMAX = parseFloat(precoBtcMAX/ precoDOLAR).toFixed(2) // Cálculo do valor máximo do BTC em real dividido pela cotação atual do Dólar
    let precoUsdMIN = parseFloat(precoBtcMIN/ precoDOLAR).toFixed(2) // Cálculo do valor mínimo do BTC em real dividido pela cotação atual do Dólar
    precoHtmlMAX.innerText = `$${precoUsdMAX}` // Colocando no HTML
    precoHtmlMAX.style.color = 'green' // Colocando no HTML
    precoHtmlMIN.innerText = `$${precoUsdMIN}` // Colocando no HTML
    precoHtmlMIN.style.color = 'red' // Colocando no HTML
    variacao.innerText = `${pct}%` // Colocando no HTML
})
}, 30000); // DE 30 EM 30 SEGUNDOS, ESSA FUNÇÃO IRÁ BUSCAR A API


// API DO PREÇO DO BTC EM TEMPO REAL
ws.onmessage = (evento) =>{
/*     console.log(evento.data) */
    let dado = JSON.parse(evento.data); // JSON dos Dados
    let preco = parseFloat(dado.p).toFixed(5) // Preço atual do BTC em dólar
    precoHtml.innerText = `$${preco}` // Colocando no HTML
    precoHtml.style.color = !ultimoPreco || ultimoPreco === preco ? 'white' : preco > ultimoPreco ? 'green' : 'red'; // Modificando a cor para vermelho caso o valor seja menor que o ultimo preço e para verde caso seja maior que o ultimo preço...
    lista.push(preco)
    ultimoPreco = preco; // Atualizando o último preço
} 

setInterval(()=>{
    ipcRenderer.send('dados-lista', lista);
    console.log("Dados enviado ao Back-End")
}, 5000); // Código para enviar a lista de 30 em 30 segundos