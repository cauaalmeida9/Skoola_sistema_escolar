<template>
  <div class="login-container">
    <div class="login-form-area">
      <div class="form-box">
        <h1 class="logo-modern">Skoola</h1>

        <div class="input-group">
          <input v-model="username" type="text" placeholder="Digite o seu login">
          <input v-model="password" type="password" placeholder="Digite a sua senha">
        </div>

        <a href="#" class="forgot-password" @click.prevent="openForgotPasswordModal">Esqueceu a senha?</a>

        <button @click="handleLogin" class="btn-enter">Entrar</button>
      </div>
    </div>

    <div class="login-branding-area">
      <h1 class="branding-text">Skoola</h1>
    </div>

    <transition name="modal-fade">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <button class="close-button" @click="closeModal">&times;</button>
          
          <div class="modal-body">
            <span class="modal-icon ph-bold ph-key"></span> 
            <h3 class="modal-title">Recuperação de Senha</h3>
            <p>
              Para sua segurança, a redefinição de senha deve ser solicitada diretamente à nossa equipe de suporte.
            </p>
            <p>
              Por favor, **entre em contato com a equipe de suporte da Skoola** para solicitar uma nova senha de acesso.
            </p>

            <div class="contact-links">
                <a href="mailto:suporte@skoola.com.br" class="contact-link email-link">
                    <span class="ph-bold ph-envelope-simple"></span> E-mail
                </a>
                <a href="https://wa.me/5599999999999" target="_blank" class="contact-link whatsapp-link">
                    <span class="ph-bold ph-whatsapp-logo"></span> WhatsApp
                </a>
            </div>
            <button class="btn-ok" @click="closeModal">Entendi</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
  name: "TelaLogin",
  data() {
    return {
      username: '',
      password: '',
      isModalOpen: false, 
    }
  },
  methods: {
    handleLogin() {
      const authStore = useAuthStore()
      authStore.login(this.username, this.password)
    },
    openForgotPasswordModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    }
  }
}
</script>

<style scoped>


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


/* -------------------------------------- */
/* ESTILOS DO MODAL (JANELA FLUTUANTE)    */
/* -------------------------------------- */

/* Overlay (Fundo escuro/transparente) */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4); 
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

/* Conteúdo do Modal (a caixa branca) */
.modal-content {
    background: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 400px;
    position: relative;
    text-align: center;
}

.modal-icon {
    font-size: 38px;
    color: #6a5acd;
    margin-bottom: 15px;
    display: block;
}

.modal-title {
    font-size: 22px;
    color: #333;
    font-weight: 700;
    margin-bottom: 10px;
}

.modal-body p {
    font-size: 15px;
    line-height: 1.6;
    color: #555;
    margin-bottom: 15px;
}

/* Botão de Fechar (o 'x') */
.close-button {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 30px;
    color: #999;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    transition: color 0.2s;
}

.close-button:hover {
    color: #6a5acd;
}

/* Botão de Ação do Modal (Entendi) */
.btn-ok {
    width: 100%;
    padding: 12px;
    background: #6a5acd;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 20px; /* Aumentado para separar dos links de contato */
    transition: background 0.25s;
}

.btn-ok:hover {
    background: #5749c7;
}

/* Animações de Transição */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* -------------------------------------- */
/* ESTILOS DOS LINKS DE CONTATO (NOVO)    */
/* -------------------------------------- */

.contact-links {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 10px;
    margin-bottom: 15px;
}

.contact-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 15px;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.2s, transform 0.1s;
    font-size: 15px;
}

.contact-link span {
    font-size: 18px;
}

.email-link {
    background-color: #f7f7fb;
    color: #6a5acd;
    border: 1px solid #e0e0f0;
}

.email-link:hover {
    background-color: #e0e0f0;
    transform: translateY(-1px);
}

.whatsapp-link {
    background-color: #25D366;
    color: white;
    box-shadow: 0 4px 10px rgba(37, 211, 102, 0.3);
}

.whatsapp-link:hover {
    background-color: #1DA851;
    transform: translateY(-1px);
}


/* -------------------------------------- */
/* RESPONSIVIDADE JÁ EXISTENTE            */
/* -------------------------------------- */

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
  
  .modal-content {
      padding: 20px;
  }
  .modal-title {
      font-size: 20px;
  }
  .modal-body p {
      font-size: 14px;
  }

  /* Responsividade para os links de contato */
  .contact-links {
      flex-direction: column;
      gap: 10px;
  }
}
</style>