<template>
  <section class="faq-wrapper">

    <h2 class="faq-title">Tutoriais & Vídeos de Ajuda</h2>

    <!-- 🔍 Barra de Pesquisa personalizada -->
    <div class="search-box">
      <span class="icon ph-bold ph-magnifying-glass"></span>

      <input 
        type="text"
        v-model="search"
        placeholder="Pesquise por um tutorial"
      />

      <button class="btn-search">
        <span class="icon ph-bold ph-arrow-right"></span>
      </button>
    </div>

    <!-- Lista de cards de vídeo -->
    <div class="video-cards">
      <div 
        v-for="video in filteredVideos" 
        :key="video.id" 
        class="video-card"
        @click="abrirVideo(video)"
      >
        <div class="video-thumbnail">
          <img :src="video.thumbnail" alt="thumbnail do vídeo" />
          <span class="play-icon">▶️</span>
        </div>
        <h3>{{ video.title }}</h3>
        <p>{{ video.description }}</p>
      </div>
      <div v-if="filteredVideos.length === 0" class="vazio">
        <span class="icon ph-bold ph-smiley-sad"></span> Nenhum tutorial encontrado
      </div>
    </div>

    <!-- Modal do vídeo -->
    <div v-if="modalAberto" class="modal" @click.self="fecharModal">
      <div class="modal-conteudo">
        <button class="fechar-btn" @click="fecharModal">✖️</button>
        <h2>{{ videoAtual.title }}</h2>
        <iframe 
          :src="videoAtual.url" 
          frameborder="0" 
          allowfullscreen
        ></iframe>
      </div>
    </div>

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

const videos = ref([
  {
    id: 1,
    title: "Como cadastrar alunos",
    description: "Aprenda a cadastrar novos alunos no sistema",
    thumbnail: "https://img.youtube.com/vi/VIDEO_ID_1/hqdefault.jpg",
    url: "https://www.youtube.com/embed/dTohpaFgwjE?si=PJaYA9cv98bvot1Z"
  },
  {
    id: 2,
    title: "Criando turmas",
    description: "Aprenda a criar turmas e atribuir alunos",
    thumbnail: "https://img.youtube.com/vi/VIDEO_ID_2/hqdefault.jpg",
    url: "https://www.youtube.com/embed/VIDEO_ID_2"
  },
  {
    id: 3,
    title: "Como cadastrar um professor",
    description: "Navegando pelo dashboard e relatórios",
    thumbnail: "https://img.youtube.com/vi/VIDEO_ID_3/hqdefault.jpg",
    url: "https://www.youtube.com/embed/VIDEO_ID_3"
  },
    {
    id: 4,
    title: "Como gerar um boletin",
    description: "Navegando pelo dashboard e relatórios",
    thumbnail: "https://img.youtube.com/vi/VIDEO_ID_3/hqdefault.jpg",
    url: "https://www.youtube.com/embed/VIDEO_ID_3"
  },
    {
    id: 5,
    title: "Como gerar frequência",
    description: "Navegando pelo dashboard e relatórios",
    thumbnail: "https://img.youtube.com/vi/VIDEO_ID_3/hqdefault.jpg",
    url: "https://www.youtube.com/embed/VIDEO_ID_3"
  }
]);

const modalAberto = ref(false);
const videoAtual = ref({});

const filteredVideos = computed(() => {
  if (!search.value) return videos.value;
  return videos.value.filter(video =>
    video.title.toLowerCase().includes(search.value.toLowerCase()) ||
    video.description.toLowerCase().includes(search.value.toLowerCase())
  );
});

function abrirVideo(video) {
  videoAtual.value = video;
  modalAberto.value = true;
}

function fecharModal() {
  modalAberto.value = false;
  videoAtual.value = {};
}
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

/* Lista de cards de vídeo */
.video-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 18px;
}

.video-card {
  background: white;
  padding: 18px;
  border-radius: 14px;
  box-shadow: 0 3px 14px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.video-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.12);
}

.video-thumbnail {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.video-thumbnail img {
  width: 100%;
  display: block;
}

.play-icon {
  position: absolute;
  font-size: 40px;
  color: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-shadow: 0 0 5px rgba(0,0,0,0.7);
  pointer-events: none;
}

.video-card h3 {
  font-size: 16px;
  margin: 5px 0;
  color: #333;
}

.video-card p {
  font-size: 14px;
  color: #666;
}

.vazio {
  grid-column: 1 / -1;
  text-align: center;
  color: #666;
  padding: 30px;
  font-size: 14px;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-conteudo {
  background: white;
  padding: 20px;
  border-radius: 16px;
  max-width: 800px;
  width: 90%;
  position: relative;
}

.modal-conteudo iframe {
  width: 100%;
  height: 450px;
  border-radius: 10px;
}

.fechar-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
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
    display: none;
  }

  .modal-conteudo iframe {
    height: 250px;
  }
}
</style>
