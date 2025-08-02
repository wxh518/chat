<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import TitleBar from './components/TitleBar.vue';
import Content from './components/Content.vue';
</script>

<template>
  <div class="app">
    <TitleBar msg="titlebar"></TitleBar>
    <Content msg="content"></Content>
  </div>
</template>

<style scoped>
.app {
  background-color: black;
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
