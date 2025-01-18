import { log } from 'console';
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;
app.on('ready', ()=>{
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false,
        },
        frame: false,
    });
    console.log(process.env.WEB_PORT);
    if (process.env.ENV_NOW === 'development')
    {
        console.log(`http://localhost:${process.env.WEB_PORT}/`);
        mainWindow.loadURL(`http://localhost:${process.env.WEB_PORT}/`);
        mainWindow.webContents.openDevTools();
    }
    else{
        console.log(path.join(__dirname, '/index.html'));
        mainWindow.loadFile(path.join(__dirname, '/index.html'));
    }

    // 主进程
    // 在主进程中，我们接收端口对象。
    ipcMain.on('port', (event) => {
        // 当我们在主进程中接收到 MessagePort 对象, 它就成为了
        // MessagePortMain.
        const port = event.ports[0]
        port.postMessage({ answer: 666 });
    
        // MessagePortMain 使用了 Node.js 风格的事件 API, 而不是
        // web 风格的事件 API. 因此使用 .on('message', ...) 而不是 .onmessage = ...
        port.on('message', (event) => {
            // 收到的数据是： { answer: 42 }
            const data = event.data
            console.log(data);
            const { answer } = data;
            port.postMessage({ answer: answer + 1 });
            if (answer === 1) {
                if (mainWindow) {
                    if (mainWindow.isMaximized()) {
                        console.log('restore');
                        mainWindow.unmaximize();
                    } else {
                        console.log('maximize');
                        mainWindow.maximize();
                    }
                }
            }
            if (answer === 2) {
                if (mainWindow) {
                    mainWindow.minimize();
                }
            }
            if (answer === 3) {
                if (mainWindow) {
                    mainWindow.close();
                }
            }
        })

        // MessagePortMain 阻塞消息直到 .start() 方法被调用
        port.start()
  })
});

//防止读取本地文件跨域
app.commandLine.appendSwitch('disable-web-security');