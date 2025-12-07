<template>
  <div class="professores-page">

    <div class="search-box">
      <span class="icon ph-bold ph-magnifying-glass"></span>
      <input 
        type="text" 
        v-model="search" 
        placeholder="Pesquise pelo nome do professor"
        @input="filtrarProfessores"
      />
      <button class="btn-search">
        <span class="icon ph-bold ph-arrow-right"></span>
      </button>
    </div>

    <div class="table-container">

      <div class="table-header">
        <span>Registro</span>
        <span>Professor</span>
        <span>Mais informações</span>
      </div>

      <div 
        class="table-row" 
        v-for="professor in professoresPaginados" 
        :key="professor.registro"
        @click="verDetalhes(professor)" 
      >
        <span>{{ professor.registro }}</span>
        <span>{{ professor.nome }}</span>

        <button class="btn-info" @click="$router.push(`/professores/detalheprofessor/${professor.registro}`)" >
          <span class="icon ph-bold ph-arrow-right" ></span>
        </button>
      </div>

      <div v-if="professoresPaginados.length === 0" class="empty">
        Nenhum professor encontrado
      </div>

    </div>

    <div class="pagination">
      <button @click="primeiraPagina" :disabled="paginaAtual === 1">«</button>
      <button @click="paginaAnterior" :disabled="paginaAtual === 1">‹</button>
      
      <button class="page-number">{{ paginaAtual }}</button>
      
      <button @click="proximaPagina" :disabled="paginaAtual === totalPaginas">›</button>
      <button @click="ultimaPagina" :disabled="paginaAtual === totalPaginas">»</button>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
    
      professores: [],
      professoresFiltrados: [],
      search: "",
      paginaAtual: 1,
      porPagina: 4,
    };
  },

  computed: {
    totalPaginas() {
  
      return Math.ceil(this.professoresFiltrados.length / this.porPagina) || 1;
    },

    professoresPaginados() {
   
      const start = (this.paginaAtual - 1) * this.porPagina;
      const end = start + this.porPagina;
      return this.professoresFiltrados.slice(start, end);
    }
  },

  methods: {
    carregarProfessores() {
      
      this.professores = JSON.parse(localStorage.getItem("professores")) || [];
     
      this.professores.sort((a, b) => b.registro - a.registro);
      
      this.professoresFiltrados = this.professores.slice();
    },

    filtrarProfessores() {
      const termo = (this.search || "").toLowerCase();

      // Filtra apenas pelo nome do professor
      this.professoresFiltrados = this.professores.filter(p => {
        const nome = (p.nome || "").toLowerCase();
        return nome.includes(termo);
      });

      this.paginaAtual = 1;
    },

    paginaAnterior() {
      if (this.paginaAtual > 1) this.paginaAtual--;
    },

    proximaPagina() {
      if (this.paginaAtual < this.totalPaginas) this.paginaAtual++;
    },

    primeiraPagina() {
      this.paginaAtual = 1;
    },

    ultimaPagina() {
      this.paginaAtual = this.totalPaginas;
    },
    

    verDetalhes(professor) {
       
        console.log("Informações completas do professor:", professor);
       
    }
  },

  mounted() {
    this.carregarProfessores();
    this.filtrarProfessores(); 
  }
};
</script>

<style scoped>

.professores-page {
  padding: 20px;
  font-family: "Inter", sans-serif;
}

/* Busca */
.search-box {
  display: flex;
  align-items: center;
  background-color: #ffffff;

  padding: 12px 18px;
  border-radius: 14px;
  margin-bottom: 20px;
  gap: 12px;
}

.search-box input {
  flex: 1;
  border: none;
  background-color: #ffffff;
  outline: none;
  font-size: 14px;
}

.btn-search {
  background: #b197ff;
  border: none;
  padding: 8px 20px;
  border-radius: 10px;
  cursor: pointer;
}

/* Tabela */
.table-container {
  background: white;
  border-radius: 14px;
  padding: 10px 0;
}

.table-header,
.table-row {
  display: grid;
  /* Mantém 3 colunas para Registro, Nome e Botão Info */
  grid-template-columns: 1fr 3fr 1fr;
  padding: 14px 20px;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.table-header {
  font-weight: bold;
  color: #777;
  background: #ffffff;
}

.table-row:hover {
  background: #f7f4ff;
}

/* Botão info */
.btn-info {
  background: #b197ff;
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.empty {
  text-align: center;
  padding: 30px;
  color: #777;
}

/* Paginação */
.pagination {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 18px;
  border: none;
  background: #b197ff;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
}

.page-number {
  background: #6a4dff !important;
}
</style>