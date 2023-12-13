// Importando as tecnologias
const {app, BrowserWindow, ipcMain} = require('electron');
const electronReload = require('electron-reload');
const fs = require('fs');

// Definindo variaveis
let tempo = 2;
let caminhoPasta = "./arquivos"
let fileName = "listaNum"

// Código para recarregar a página após qualquer alteração
electronReload(__dirname);

// Criar janela do App
function createWindow(){
    const win = new BrowserWindow({
        width: 1500,
        height: 1000,
        minWidth: 1500,
        minHeight: 1000,
        webPreferences:{
            devTools: true,
            nodeIntegration: true,
            contextIsolation: false,
        },
        backgroundColor: "#161A1E"
    })
    /* win.setMenu(null)  */// Para não aparecer o menu pois é inutil
    win.loadFile('./index.html') // Carregar o HTML que irá aparecer
}

// Rodando a função para criar a janela do App assim que estiver pronto para inicializar
app.whenReady().then(() =>{
    createWindow()
})

// BackEnd

ipcMain.on('dados-lista', (evento, dados)=>{
    console.log("Dados recebidos do Front-End")
    fileName = `listaNum${tempo}.txt`
    let caminho = `${caminhoPasta}/${fileName}`
    console.log(dados)
    let dado = JSON.stringify(dados)
    tempo++
    fs.writeFile(caminho, dado, (err)=>{
        if(err){
            console.log("Houve um erro na criação do arquivo: " + err )
        }
        console.log("Arquivo criado com sucesso!")
    })
}) // Código para salvar a lista em um arquivo txt de 30 em 30 segundos