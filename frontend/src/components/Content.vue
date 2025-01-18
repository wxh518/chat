<script setup lang="ts">
import { ref } from 'vue';
import Navigation from './Navigation.vue';

defineProps<{
  msg: string
}>()
const cur_action = ref<string>('action1');
const actions = ['action1', 'action2'];
const onAction = (action: string) => {
  console.log('recv action: ', action);
  cur_action.value = action;
}
</script>

<template>
  <div class="content">
    <Navigation :actions=actions v-on:action="onAction"></Navigation>
    <h1 style="width: 100%; text-align: center;">内容：{{ msg }}, 当前action：{{ cur_action }}</h1>
  </div>
</template>

<style scoped>
.navigation {
  width: 80px;
  height: 100%;
  background-color: cornflowerblue;
}
.content {
  background-color: bisque;
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
