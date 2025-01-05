import { createServer } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import esbuild from 'esbuild';
import fs from 'fs';
import os from 'os';
import env from './env.js';

let dev = {
    server: null,
    electronProcess: null,
    bundledDir: '',
    serverPort: 1600,
    async createServer() {
        let options = {
            configFile: false,
            root: process.cwd(),
            server: {
                port: this.serverPort,
            },
            plugins: [vue()],
        };
        this.server = await createServer(options);
        await this.server.listen();
        this.server.printUrls();
        this.server.bindCLIShortcuts({ print: true });
    },
    async start() {
        this.bundledDir = path.join(process.cwd(), 'release/bundled');
        await this.createServer();
        this.buildMain();
        this.createElectronProcess();
    },
    getEnvScript() {
        env.WEB_PORT = this.serverPort;
        env.RES_DIR = path.join(process.cwd(), 'resource/release');
        let script = '';
        for (let v in env) {
            script += `process.env.${v}="${env[v]}";`;
        }
        return script;
    },
    buildMain() {
        let entryFilePath = path.join(process.cwd(), 'src/main/app.ts');
        let outfile = path.join(process.cwd(), 'release/bundled/entry.cjs');
        esbuild.buildSync({
            entryPoints: [entryFilePath],
            outfile,
            minify: false,
            bundle: true,
            platform: 'node',
            sourcemap: true,
            external: ['electron'],
        });
        let envScript = this.getEnvScript();
        let js = `${envScript}${os.EOL}${fs.readFileSync(outfile)}`;
        fs.writeFileSync(outfile, js);
    },
    async createElectronProcess() {
        const { spawn } = await import('child_process');
        const { default: electronPath } = await import('electron');

        this.electronProcess = spawn(
            electronPath.toString(),
            [path.join(this.bundledDir, 'entry.cjs')],
            {
                cwd: process.cwd(),
            }
        );
        this.electronProcess.on('close', () => {
            this.server.close();
            process.exit();
        });
        this.electronProcess.stdout.on('data', (data) => {
            data = data.toString();
            console.log(data);
        });
    },
};

dev.start();
