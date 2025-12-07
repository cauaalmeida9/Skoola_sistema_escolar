<template>
  <section class="faq-wrapper">

    <h2 class="faq-title">Suporte & Perguntas Frequentes</h2>

    <!-- 🔍 Barra de Pesquisa personalizada -->
    <div class="search-box">
      <span class="icon ph-bold ph-magnifying-glass"></span>

      <input 
        type="text"
        v-model="search"
        placeholder="Pesquise por uma dúvida"
      />

      <button class="btn-search">
        <span class="icon ph-bold ph-arrow-right"></span>
      </button>
    </div>

    <!-- Accordion -->
    <v-expansion-panels multiple class="faq-panels">
      <v-expansion-panel
        v-for="(item, index) in filteredFaq"
        :key="index"
        class="faq-card"
      >
        <v-expansion-panel-title expand-icon="mdi-chevron-down">
          {{ item.pergunta }}
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          {{ item.resposta }}
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- 🟢 Botão WhatsApp -->
    <div class="zap-container">
      <a 
        href="https://wa.me/5599999999999" 
        target="_blank"
        class="whatsapp-btn"
      >
        <span class="icon ph-bold ph-whatsapp-logo"></span>
        <span class="tooltip">Entre em contato pelo WhatsApp</span>
      </a>
    </div>

  </section>
</template>


<script setup>
import { ref, computed } from "vue";

const search = ref("");

const faqList = ref([
  {
    pergunta: "Preciso de um CNPJ para começar a alugar?",
    resposta: "Não, você não precisa de CNPJ para utilizar o sistema."
  },
  {
    pergunta: "Como entro em contato com o suporte?",
    resposta: "Você pode falar conosco pelo WhatsApp, e-mail ou chat."
  },
  {
    pergunta: "É fácil de customizar?",
    resposta: "Sim! Você consegue ajustar tudo rapidamente."
  },
  {
    pergunta: "O sistema é responsivo?",
    resposta: "Sim, funciona em computador, tablet e celular."
  }
]);

const filteredFaq = computed(() => {
  if (!search.value) return faqList.value;
  return faqList.value.filter(item =>
    item.pergunta.toLowerCase().includes(search.value.toLowerCase()) ||
    item.resposta.toLowerCase().includes(search.value.toLowerCase())
  );
});
</script>


<style scoped>
.faq-wrapper {
  max-width: 850px;
  margin: auto;
  padding: 20px;
  font-family: "Inter", sans-serif;
}

.faq-title {
  text-align: center;
  margin-bottom: 25px;
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

/* 🔍 Barra de pesquisa */
.search-box {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 12px 18px;
  border-radius: 14px;
  margin-bottom: 25px;
  gap: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
}

.search-box input {
  flex: 1;
  border: none;
  background-color: #ffffff;
  outline: none;
  font-size: 14px;
  color: #444;
}

.btn-search {
  background: #b197ff;
  border: none;
  padding: 8px 20px;
  border-radius: 10px;
  cursor: pointer;
}

.icon {
  font-size: 20px;
  opacity: 0.7;
}

/* Accordion */
.faq-panels {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.faq-card {
  border-radius: 14px !important;
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.08);
  background: #fff;
}

.faq-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.12);
}

/* 🟢 WhatsApp button */
.zap-container {
  display: flex;
  justify-content: center;
  margin-top: 35px;
}

.whatsapp-btn {
  position: relative;
  background: #25d366;
  color: white;
  padding: 14px 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.whatsapp-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
}

/* Tooltip */
.tooltip {
  position: absolute;
  top: 50%;
  left: 120%;
  transform: translateY(-50%);
  background: #333;
  color: #fff;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  opacity: 0;
  pointer-events: none;
  white-space: nowrap;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.whatsapp-btn:hover .tooltip {
  opacity: 1;
  transform: translateY(-50%) translateX(4px);
}

/* Responsividade */
@media (max-width: 600px) {
  .faq-wrapper {
    padding: 12px;
  }

  .search-box {
    padding: 10px 14px;
  }

  .faq-title {
    font-size: 1.6rem;
  }

  .tooltip {
    display: none; /* tooltip some no mobile */
  }
}
</style>
