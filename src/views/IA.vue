<template>
  <div class="page-container">
    <div class="content-box">
      <div class="ai-icon-container">
        <img src="/S.png" alt="S Icone IA" class="svg-icon">
      </div>

      <h1 class="main-title">Nova IA em Breve! </h1>
      
      <p class="subtitle">
        A equipe do Skoola esta desenvolvendo uma Inteligência Artificial para simplificar e acelerar suas tarefas diárias na gestão escolar.
      </p>

      <div class="loading-bar-container">
        <div class="loading-bar"></div>
      </div>
      
      <p class="description">
        Prepare-se para uma experiência mais eficiente.
      </p>
      
      <p class="eta">
        Fique atento aos próximos anúncios!
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmBreve',
}
</script>

<style scoped>
/* ------------------------------------- */
/* 1. Estilos Gerais e Layout da Tela    */
/* (MANTIDOS)                            */
/* ------------------------------------- */

.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f5ff; /* Cor de fundo suave */
  padding: 20px;
  font-family: 'Inter', sans-serif;
  text-align: center;
}

.content-box {
  background: #ffffff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(90, 69, 255, 0.1);
  max-width: 450px;
  width: 100%;
}

.main-title {
  color: #333;
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 16px;
  margin-bottom: 30px;
}

.description {
  color: #888;
  font-size: 14px;
  margin-top: 20px;
}

.eta {
  color: #5A45FF;
  font-weight: 700;
  font-size: 18px;
  margin-top: 10px;
}

/* ------------------------------------- */
/* 2. Ícone e Animação de Pulsação       */
/* (AJUSTADO PARA USAR TAG <img>)        */
/* ------------------------------------- */

.ai-icon-container {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  background-color: #5A45FF; 
  border-radius: 50%;
  position: relative;
  /* Animação de Pulsação */
  animation: pulse 2s infinite ease-out;
}

/* Novo estilo para o SVG */
.svg-icon {
    width: 30px; /* Ajusta o tamanho do ícone SVG dentro do container */
    height: 40px;
    /* Se o SVG for colorido, ajuste a cor diretamente no arquivo SVG */
    /* Caso contrário, se for um SVG monocromático, você pode tentar aplicar filtros */
}

/* Keyframes da Animação de Pulsação (MANTIDOS) */
@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(90, 69, 255, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 15px rgba(90, 69, 255, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(90, 69, 255, 0);
  }
}

/* ------------------------------------- */
/* 3. Animação de Barra de Progresso     */
/* (MANTIDA)                             */
/* ------------------------------------- */

.loading-bar-container {
  width: 100%;
  height: 8px;
  background-color: #e0e0f0;
  border-radius: 4px;
  overflow: hidden;
}

.loading-bar {
  width: 75%; 
  height: 100%;
  background: linear-gradient(90deg, #5A45FF, #7A65FF);
  border-radius: 4px;
  animation: shimmer 1.5s infinite linear;
}

/* Keyframes da Animação de Carregamento (MANTIDOS) */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>