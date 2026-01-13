<template>
  <div class="verify-email">
    <h2>{{ message }}</h2>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'

const route = useRoute()
const router = useRouter()
const message = ref('Verifikacija u toku...')

onMounted(async () => {
  const token = route.query.token
  if (!token) {
    message.value = 'Nevažeći link za verifikaciju'
    return
  }

  try {
    const res = await api.verifyEmail(token)
    message.value = res.data.data || 'Email uspešno verifikovan!'
    // opcionalno: redirect na login nakon par sekundi
    setTimeout(() => router.push('/login'), 3000)
  } catch (err) {
    message.value = err.response?.data?.data || 'Greška pri verifikaciji'
  }
})
</script>

<style scoped>
.verify-email {
  padding: 2rem;
  text-align: center;
}
</style>
