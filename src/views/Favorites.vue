<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div v-if="isLoggedIn">
    <h1>Trenutno nemate omiljene recepte!</h1>
  </div>

  <div v-else>Morate biti ulogovani da bi ste dodali svoj omiljeni recept.</div>
</template>

<script setup>
import { useSessionStore } from '@/stores/sessionUser'

const session = useSessionStore()
const isLoggedIn = session.isLoggedIn
</script>

<style scoped>
div {
  min-height: 100vh; /* ili 100vh ako želiš celo screen */
  display: flex;
  justify-content: center; /* horizontalno */
  align-items: center; /* vertikalno */
  text-align: center;
  color: #743f3f;
  font-size: 28px;
  font-weight: bold;
}
</style>
