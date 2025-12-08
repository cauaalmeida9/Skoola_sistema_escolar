<template>
  <div class="login-container">
    <div class="login-form-area">
      <div class="form-box">
        <h1 class="logo-modern">Skoola</h1>

        <div class="input-group">
          <input v-model="username" type="text" placeholder="Digite o seu login">
          <input v-model="password" type="password" placeholder="Digite a sua senha">
        </div>

        <a href="#" class="forgot-password">Esqueceu a senha?</a>

        <button @click="handleLogin" class="btn-enter">Entrar</button>
      </div>
    </div>

    <div class="login-branding-area">
      <h1 class="branding-text">Skoola</h1>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
  name: "TelaLogin",
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    handleLogin() {
      const authStore = useAuthStore()
      authStore.login(this.username, this.password)
    }
  }
}
</script>

<style scoped>


/* Layout principal */

.login-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}

/* Lado esquerdo moderno */
.login-form-area {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f7f7fb;
  padding: 20px;
}

/* Caixa com efeito glassmorphism */
.form-box {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 18px;
  padding: 40px 35px;
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}

/* Título moderno */
.logo-modern {
  font-size: 40px;
  font-weight: 800;
  color: #6a5acd;
  text-align: center;
  letter-spacing: 1px;
}

/* Inputs */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group input {
  padding: 14px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  font-size: 16px;
  transition: 0.25s;
}

.input-group input:focus {
  border-color: #6a5acd;
  box-shadow: 0 0 4px rgba(106, 90, 205, 0.25);
  outline: none;
}

/* Link esqueceu senha */
.forgot-password {
  color: #6a5acd;
  text-decoration: none;
  font-size: 14px;
  margin-top: -10px;
}

/* Botão */
.btn-enter {
  width: 100%;
  padding: 14px;
  background: #6a5acd;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;
}

.btn-enter:hover {
  background: #5749c7;
}

/* Lado direito visual */

.login-branding-area {
  flex: 1;
  background: linear-gradient(135deg, #6a5acd, #7b6df0);
  display: flex;
  justify-content: center;
  align-items: center;
}

.branding-text {
  font-size: 85px;
  font-weight: 900;
  color: white;
  letter-spacing: 3px;
}


@media (max-width: 980px) {
  .login-container {
    flex-direction: column;
  }

  .login-branding-area {
    height: 35vh;
  }

  .branding-text {
    font-size: 60px;
  }

  .form-box {
    margin-top: 20px;
  }
}

@media (max-width: 500px) {
  .branding-text {
    font-size: 40px;
  }

  .form-box {
    padding: 30px 25px;
  }

  .logo-modern {
    font-size: 32px;
  }

  .btn-enter {
    font-size: 16px;
  }
}

</style>
