const electron = require('electron')
const url = require('url')
const path = require('path')

const {app, BrowserWindow, Menu, ipcMain} = electron

//Set ENV
process.env.NODE_ENV = 'production'

let mainWindow

//Funcao executada quando o app estiver carregado
app.on('ready', function(){
    //Cria uma nova janela
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    })
    //Carrega o HTML dentro da janela
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main_window.html'),
        protocol: 'file:',
        slashes: true
    }))
    //Sai do aplicativo
    mainWindow.on('closed', function(){
        app.quit()
    })

    //Constroi o menu
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    //Insere o menu
    Menu.setApplicationMenu(mainMenu)
})

//Cria a janela de adicionar item
function createAddWindow(){
    //Cria uma nova janela
    addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 300,
        height: 200,
        title: 'Adicionar item `a lista de compras'
    })
    //Carrega o HTML dentro da janela
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'add_window.html'),
        protocol: 'file:',
        slashes: true
    }))
    //Remove a janela da memoria ao fechar
    addWindow.on('closed', function(){
        addWindow = null
    })
}
//Recebe o item:add da janela addWindow
ipcMain.on('item:add', function(evt, item){
    mainWindow.webContents.send('item:add', item)
    addWindow.close()
})

//Cria o menu do app
const mainMenuTemplate = [
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Adiconar item',
                accelerator: 'CmdOrCtrl+A',
                click(){
                    createAddWindow()
                }
            },
            {
                label: 'Limpar itens',
                accelerator: 'CmdOrCtrl+L',
                click(){
                    mainWindow.webContents.send('item:clear')
                }
            },
            {
                label: 'Sair',
                accelerator: 'CmdOrCtrl+Q',
                click(){
                    app.quit()
                }
            }
        ]
    }
]

//Corrige o menu no Mac OS para exibir Arquivo no lugar de Electron
if (process.platform == 'darwin'){
    mainMenuTemplate.unshift({label: ''})
}

//Cria o menu para abrir o developer tools
if (process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Abrir/Fechar o DevTools',
                accelerator: 'CmdOrCtrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools()
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}