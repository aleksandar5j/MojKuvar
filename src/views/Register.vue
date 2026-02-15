<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="register-wrapper">
    <div class="register-layout">
      <div class="register-image">
        <div class="overlay">
          <img src="/src/components/logo.png" class="logo" />
          <h2>Registracija</h2>
          <p>Registruj se i sačuvaj omiljene recepte</p>
        </div>
      </div>

      <div class="register-card">
        <h1>Registruj se</h1>
        <p class="subtitle">Kreiraj nalog i dodaj svoj komentar</p>

        <form @submit.prevent="handleRegister">
          <div class="field">
            <label>Korisničko ime</label>
            <input type="text" v-model="username" required />
          </div>

          <div class="field">
            <label>Ime i prezime</label>
            <input type="text" v-model="fullname" required />
          </div>

          <div class="field">
            <label>Email</label>
            <input type="email" v-model="email" required />
          </div>

          <div class="field">
            <label>Šifra</label>
            <input type="password" v-model="password" required />
          </div>

          <div class="field">
            <label>Ponovi šifru</label>
            <input type="password" v-model="password2" required />
          </div>

          <button type="submit">Registruj se</button>
        </form>

        <p v-if="errorMsg" class="msg error">{{ errorMsg }}</p>
        <p v-if="successMsg" class="msg success">{{ successMsg }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api'
import { useRouter } from 'vue-router'

const router = useRouter()

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

    router.push('/login')

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
.register-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f3efef;
}

.register-layout {
  width: 100%;
  max-width: 1000px;
  min-height: 510px;
  margin-top: 60px;
  display: flex;
  background: #fff;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.18);
}

.register-image {
  flex: 1;
  background-image: url('@/components/backgroundimage.jpeg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.register-image::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(116, 63, 63, 0.55);
}

.overlay {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  padding: 40px;
}

.overlay .logo {
  width: 150px;
  height: 150px;
}

.overlay h2 {
  font-size: 32px;
  margin-bottom: 10px;
}

.overlay p {
  font-size: 16px;
  max-width: 320px;
  opacity: 0.9;
}

.register-card {
  flex: 1;
  padding: 40px;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(6px);
}

.register-card h1 {
  margin-bottom: 8px;
  color: #743f3f;
  font-size: 32px;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
}

.field {
  text-align: left;
  margin-bottom: 18px;
}

.field label {
  display: block;
  font-size: 15px;
  margin-bottom: 6px;
  color: black;
  font-weight: 600;
}

.field input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1.5px solid #ddd;
  font-size: 14px;
  transition: 0.25s ease;
}

.field input:focus {
  outline: none;
  border-color: #743f3f;
  box-shadow: 0 0 0 3px rgba(116, 63, 63, 0.2);
}

button {
  width: 100%;
  margin-top: 10px;
  padding: 14px;
  border-radius: 50px;
  border: none;
  background: linear-gradient(135deg, #743f3f, #9b5a5a);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(116, 63, 63, 0.35);
}

.msg {
  margin-top: 18px;
  font-size: 14px;
  font-weight: 600;
}

.msg.error {
  color: #c0392b;
}

.msg.success {
  color: #27ae60;
}

@media (max-width: 768px) {
  .register-layout {
    flex-direction: column;
  }
  .register-image {
    display: none;
  }
}
</style>
