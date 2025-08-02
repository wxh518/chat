<script setup lang="ts">
import { maximize, minimize, register, send } from '@/main';

defineProps<{
  msg: string
}>()
const onRegisterClicked = () => {
  console.log("regidter button clicked.");
  register();
}
const onSendClicked = () => {
  console.log("send button clicked.");
  send();
}
const onMinBtnClicked = () => {
  console.log("min button clicked.");
  minimize();
}
const onMaxBtnClicked = () => {
  console.log("max button clicked.");
  maximize();
}
const onCloseBtnClicked = () => {
  console.log("close button clicked.");
  close();
}
</script>

<template>
  <div class="titlebar">
    <img alt="Vue logo" src="../assets/logo.svg" width="60" height="60" />
    <div class="drag"></div>
    <h1>{{ msg }}</h1>
    <button @click="onRegisterClicked">注册</button>
    <button @click="onSendClicked">发送</button>
    <button @click="onMinBtnClicked">最小化</button>
    <button @click="onMaxBtnClicked">最大化</button>
    <button @click="onCloseBtnClicked">关闭</button>
  </div>
</template>

<style scoped>
.titlebar {
  display: flex;
  height: 60px;
  background-color: aqua;
  justify-content: space-between;
}
.drag {
  flex: 1;
  height: 100%;
  background-color: rgb(39, 47, 47);
  -webkit-app-region: drag;
}
</style>
