<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="page">
    <div class="login-layout">
      <!-- LEVA STRANA (SLIKA) -->
      <div class="login-image">
        <div class="overlay">
          <img src="/src/components/logo.png" class="logo" />
          <h2>Dobrodošao nazad</h2>
          <p>Prijavi se i nastavi da kuvaš kao šef</p>
        </div>
      </div>

      <!-- DESNA STRANA (LOGIN) -->
      <div class="login-container">
        <h1>Uloguj se</h1>

        <div class="login-tips">
          <div class="tip">
            <span class="icon">🔐</span>
            <p>Brz i siguran login</p>
          </div>
          <div class="tip">
            <span class="icon">❤️</span>
            <p>Sačuvaj omiljene recepte</p>
          </div>
          <div class="tip">
            <span class="icon">⭐</span>
            <p>Komentariši i ocenjuj jela</p>
          </div>
        </div>

        <form @submit.prevent="loginUser">
          <div class="form-group">
            <label>Korisničko ime</label>
            <input type="text" v-model="username" required />
          </div>

          <div class="form-group">
            <label>Šifra</label>
            <input type="password" v-model="password" required />
          </div>

          <button type="submit">Login</button>
        </form>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        <p v-if="successMsg" class="success">{{ successMsg }}</p>
      </div>
    </div>
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
    router.push('/')
  } catch (err) {
    errorMsg.value = err.response?.data || 'Login failed'
    console.log(err)
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f3efef;
}

/* SPLIT LAYOUT */
.login-layout {
  width: 100%;
  max-width: 1000px;
  min-height: 520px;
  display: flex;
  background: #fff;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.18);
}

/* DESNA STRANA */
.login-container {
  flex: 1;
  padding: 40px;
}

/* NASLOV */
.login-container h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #743f3f;
}

/* TIPS */
.login-tips {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}

.tip {
  flex: 1;
  background-color: rgba(116, 63, 63, 0.1);
  border-radius: 14px;
  padding: 12px 6px;
  text-align: center;
  font-size: 13px;
}

/* FORMA */
.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: 600;
  margin-bottom: 5px;
  display: block;
}

input {
  width: 100%;
  padding: 11px;
  border-radius: 10px;
  border: 1px solid #ccc;
}

.form-group input:focus {
  outline: none;
  border-color: #743f3f;
  box-shadow: 0 0 0 3px rgba(116, 63, 63, 0.2);
}

/* BUTTON */
button {
  width: 100%;
  padding: 13px;
  margin-top: 10px;
  border-radius: 50px;
  border: none;
  background-color: #743f3f;
  color: white;
  font-size: 15px;
  cursor: pointer;
  transition: 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(116, 63, 63, 0.35);
}

/* PORUKE */
.error,
.success {
  text-align: center;
  margin-top: 15px;
}

/* MOBILE */
@media (max-width: 768px) {
  .login-layout {
    flex-direction: column;
  }

  .login-image {
    display: none;
  }
}

.login-image {
  flex: 1;
  background-image: url('@/components/backgroundimage.jpeg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.login-image::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(116, 63, 63, 0.6);
}

/* CENTRIRANJE SADRŽAJA */
.overlay {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; /* vertikalno */
  align-items: center; /* horizontalno */
  text-align: center;
  color: white;
  padding: 40px;
}

/* LOGO */
.logo {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}

/* TEKST */
.overlay h2 {
  font-size: 32px;
  margin-bottom: 10px;
}

.overlay p {
  font-size: 16px;
  max-width: 320px;
  opacity: 0.9;
}
</style>
