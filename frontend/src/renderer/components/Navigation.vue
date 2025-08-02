<script setup lang="ts">

defineProps<{
  actions: string[]
}>()
const emit = defineEmits(['action'])

const onClicked = (action: string) => {
  console.log(`click ${action}`);
  emit('action', action);
}
</script>

<template>
    <div class="navigation"  >
      <div class="btn-container">
        <button class="action-btn" 
        v-for="(action, index) in actions" :key="index"
        @click="onClicked(action)"> {{ action }} </button>
      </div>
    </div>
</template>

<style scoped>
.navigation {
  width: 80px;
  height: 100%;
  background-color: cornflowerblue;
}
.btn-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: blue;
  width: 100%;
  height: 100%;
}
.action-btn {
  width: 100%;
  height: 80px;
}
</style>
