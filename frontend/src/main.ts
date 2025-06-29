import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

// 监听主进程发送的 port
let port: MessagePort | null = null;
require('electron').ipcRenderer.on('port', (event) => {
  console.log('listen port222', event);
  port = event.ports[0];
  // 使用 port 进行通信
  port.onmessage = (event) => {
    console.log('Received message from main process:', event.data);
  };
  port.start();
  port.postMessage({ message: 'Renderer Process Say Hello' });
});

export function maximize() {
    console.log('maximize');
    port?.postMessage({ answer: 1 })
}

export function minimize() {
    console.log('minimize');
    port?.postMessage({ answer: 2 })
}

export function close() {
    console.log('close');
    port?.postMessage({ answer: 3 })
}


import axios from 'axios';

let socket = new WebSocket('ws://localhost:8080');
export function register() {
    axios.post('http://localhost:3000/register', {
      id: 666
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      console.log(res);
    });
}

export function send() {
    socket.send('Hello Server');
    socket.onmessage = function(event) {
      console.log('Message from server ', event.data);
    };
}