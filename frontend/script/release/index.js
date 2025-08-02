import { build } from 'vite';
import vue from '@vitejs/plugin-vue';
import path, { win32 } from 'path';
import esbuild from 'esbuild';
import fs from 'fs';
import os, { platform } from 'os';
import env from './env.js';
import { config } from 'process';
import builder from "electron-builder";

// 动态获取 src 目录的路径
const srcPath = path.join(process.cwd(), '/src/renderer');

console.log('srcPath: ', srcPath);

async function buildRender() {
    let options = {
        root: process.cwd(),
        build: {
            enableEsbuild: true,
            minify: true,
            outDir: path.join(process.cwd(), "release/bundled"),
        },
        //plugins: [vue()],
        resolve: {
            alias: {
              '@': srcPath,
            },
        },
    };
    await build(options);
}

function getEnvScript() {
    let script = '';
    for (let v in env) {
        script += `process.env.${v}="${env[v]}";`;
    }
    script += 'process.env.RES_DIR = process.resourcesPath';
    return script;
}

function buildMain() {
    let entryFilePath = path.join(process.cwd(), 'src/main/app.ts');
    let outfile = path.join(process.cwd(), 'release/bundled/entry.cjs');
    esbuild.buildSync({
        entryPoints: [entryFilePath],
        outfile,
        minify: true,
        bundle: true,
        platform: 'node',
        sourcemap: false,
        external: ['electron'],
    });
    let envScript = getEnvScript();
    let js = `${envScript}${os.EOL}${fs.readFileSync(outfile)}`;
    fs.writeFileSync(outfile, js);
}

function buildModule() {
    let pkgJsonPath = path.join(process.cwd(), "package.json");
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
    let electronConfig = localPkgJson.devDependencies.electron.replace("^", "");
    delete localPkgJson.scripts;
    delete localPkgJson.devDependencies;
    localPkgJson.main = "entry.cjs";
    localPkgJson.devDependencies = { electron: electronConfig };
    
    const outPath = path.join(process.cwd(), "release/bundled/package.json");
    console.log(outPath);
    fs.writeFileSync(outPath,
                     JSON.stringify(localPkgJson), { encoding: 'utf8' });
    fs.mkdirSync(path.join(process.cwd()) + "/release/bundled/node_modules");
}

function buildInstaller() {
    let options = {
        config: {
            directories: {
                output: path.join(process.cwd(), "release"),
                app: path.join(process.cwd(), "release/bundled"),
            },
            files: ["**/*"],
            extends: null,
            productName: "app",
            appId: 'id',
            asar: true,
            publish: [{provider: "generic", url: ""}],
            win: {
                target: [
                    {
                        target: "nsis", // 使用 NSIS 作为安装包格式
                        arch: ["x64", "ia32"] // 支持的架构
                    }
                ]
            }
        },
        project: process.cwd(),
    };
    return builder.build(options);
}

// 注意 这四个函数要依次执行

async function myPackage() {
    await buildRender();
    buildMain();
    buildModule();
    buildInstaller();
}
myPackage();