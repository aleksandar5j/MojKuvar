<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="loginUser">
      <div>
        <label>Username:</label>
        <input type="text" v-model="username" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>

    <p v-if="errorMsg" style="color: red">{{ errorMsg }}</p>
    <p v-if="successMsg" style="color: green">{{ successMsg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSessionStore } from '@/stores/sessionUser'
import { useRouter } from 'vue-router'

const session = useSessionStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const errorMsg = ref('')
const successMsg = ref('')

const loginUser = async () => {
  errorMsg.value = ''
  successMsg.value = ''
  try {
    await session.login(username.value, password.value)
    successMsg.value = 'Uspesan login'
    router.push('/') // redirect nakon login-a
  } catch (err) {
    errorMsg.value = err.response?.data || 'Login failed'
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  margin-top: 200px;
}

input {
  width: 100%;
  padding: 8px;
  margin: 5px 0 15px 0;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  background-color: #743f3f;
  color: white;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}
</style>
