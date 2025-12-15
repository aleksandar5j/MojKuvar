<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="register-container">
    <h1>Registracija</h1>
    <form @submit.prevent="handleRegister">
      <div>
        <label>Username:</label>
        <input type="text" v-model="username" required />
      </div>
      <div>
        <label>Full Name:</label>
        <input type="text" v-model="fullname" required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <div>
        <label>Password Again:</label>
        <input type="password" v-model="password2" required />
      </div>
      <button type="submit">Register</button>
    </form>

    <p v-if="errorMsg" style="color: red; margin-top: 15px">{{ errorMsg }}</p>
    <p v-if="successMsg" style="color: green; margin-top: 15px">{{ successMsg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api'

const username = ref('')
const fullname = ref('')
const email = ref('')
const password = ref('')
const password2 = ref('')

const errorMsg = ref('')
const successMsg = ref('')

async function handleRegister() {
  errorMsg.value = ''
  successMsg.value = ''

  if (password.value !== password2.value) {
    errorMsg.value = 'Lozinke se ne poklapaju!'
    return
  }

  try {
    const res = await api.registerUser({
      username: username.value,
      fullname: fullname.value,
      email: email.value,
      password: password.value,
    })

    successMsg.value = `Korisnik je uspešno registrovan!`

    console.log(res.data)

    // reset forme
    username.value = ''
    fullname.value = ''
    email.value = ''
    password.value = ''
    password2.value = ''
  } catch (err) {
    errorMsg.value = err.response?.data?.data || 'Došlo je do greške.'
    console.log(err)
  }
}
</script>

<style scoped>
.register-container {
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
  transition: 0.25s ease;
}

button:hover {
  opacity: 0.9;
}
</style>
