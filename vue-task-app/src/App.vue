<script setup lang="ts">
import Logo from './components/Logo.vue'
import TaskEditor from './components/TaskEditor.vue'
import Annotation from './components/Annotation.vue'
</script>

<template>
  <div class="app-root">
    <Logo msg="Vite + Vue" />
    <TaskEditor />
    <Annotation />
  </div>
  </template>

<style scoped>
.app-root {
  display: flex;
  flex-direction: column;
  align-content: center;
  flex-wrap: wrap;
  margin: 0 auto;
  padding: 2rem;  
}
</style>
