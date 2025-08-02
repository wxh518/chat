import { log } from 'console';
import { app, BrowserWindow, ipcMain, MessageChannelMain } from 'electron';
import path from 'path';

// 添加 remote-debugging-port 设置
app.commandLine.appendSwitch('remote-debugging-port', '9222');
console.log('remote-debugging-port set to 9222');
console.log('Electron process.argv:', process.argv);
console.log('Electron commandLine switches:', app.commandLine.getSwitchValue('remote-debugging-port'));

let mainWindow: BrowserWindow | null = null;
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false, // 优化：先不显示，等页面 ready-to-show 再显示
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false,
        },
        frame: false,
    });
    console.log(process.env.WEB_PORT);
    if (process.env.ENV_NOW === 'development') {
        console.log(`http://localhost:${process.env.WEB_PORT}/`);
        mainWindow.loadURL(`http://localhost:${process.env.WEB_PORT}/`);
        mainWindow.webContents.openDevTools();
    }
    else {
        console.log(path.join(__dirname, '/index.html'));
        mainWindow.loadFile(path.join(__dirname, '/index.html'));
    }

    // 优化：页面 ready-to-show 后再显示窗口
    mainWindow.once('ready-to-show', () => {
        mainWindow && mainWindow.show();
    });

    mainWindow.webContents.on('did-finish-load', () => {
        // 消息端口是成对创建的。 连接的一对消息端口
        // 被称为通道。
        const channel = new MessageChannelMain()

        // port1 和 port2 之间唯一的不同是你如何使用它们。 消息
        // 发送到port1 将被port2 接收，反之亦然。
        const port1 = channel.port1
        const port2 = channel.port2

        // 允许在另一端还没有注册监听器的情况下就通过通道向其发送消息
        // 消息将排队等待，直到一个监听器注册为止。
        port1.postMessage({ message: 'Main Process Say Hello' })

        port1.on('message', (event) => {
            // 收到的数据是： { answer: 42 }
            const data = event.data
            console.log(data);
            const { answer } = data;
            port2.postMessage({ answer: answer + 1 });
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

        if (mainWindow) {
            mainWindow.webContents.postMessage('port', null, [port2]);
        }
        port1.start();
    })
});

//防止读取本地文件跨域
app.commandLine.appendSwitch('disable-web-security');