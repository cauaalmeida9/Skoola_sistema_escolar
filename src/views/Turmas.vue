<template>
  <div class="professores-page">
    
    <!-- BARRA DE PESQUISA (Estilo do segundo código) -->
    <div class="search-box">
      <!-- Ícone do segundo código (Phospor Icons) -->
      <span class="icon ph-bold ph-magnifying-glass"></span>
      <input 
        type="text" 
        v-model="search" 
        placeholder="Pesquise pelo nome da turma"
        @input="filtrarTurmas"
      />
      <button class="btn-search">
        <span class="icon ph-bold ph-arrow-right"></span>
      </button>
    </div>
    
    <!-- CONTAINER DA TABELA -->
    <div class="table-container">

      <!-- CABEÇALHO DA TABELA (Mantendo as colunas do primeiro código) -->
      <div class="table-header">
        <span>Registro</span>
        <span>Turmas</span>
        <span>Mais informações</span>
      </div>

      <!-- LINHAS DA TABELA (DADOS das Turmas) -->
      <div 
        class="table-row" 
        v-for="turma in turmasPaginados" 
        :key="turma.registro"
        @click="verDetalhes(turma)" 
      >
        <span>{{ turma.registro }}</span>
        <span>{{ turma.nome }}</span>

        <button class="btn-info" @click="$router.push(`/turmas/detalheturma/${turma.registro}`)">
          <span class="icon ph-bold ph-arrow-right"></span>
        </button>
      </div>

      <!-- MENSAGEM DE VAZIO -->
      <div v-if="turmasPaginados.length === 0" class="empty">
        Nenhuma turma encontrada
      </div>

    </div>

    <!-- PAGINAÇÃO -->
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
  // Mantendo a lógica de turmas do primeiro código
  name: 'TurmasPage',
  
  data() {
    return {
      turmas: [],           // Todas as turmas carregadas
      turmasFiltrados: [],  // Turmas após a aplicação do filtro
      search: "",           // Modelo do campo de pesquisa
      paginaAtual: 1,       // Página atualmente exibida
      porPagina: 4,         // Número de itens por página
    };
  },

  computed: {
    // Calcula o número total de páginas baseado nos itens filtrados
    totalPaginas() {
      return Math.ceil(this.turmasFiltrados.length / this.porPagina) || 1;
    },

    // Retorna as turmas que devem ser exibidas na página atual
    turmasPaginados() {
      const start = (this.paginaAtual - 1) * this.porPagina;
      const end = start + this.porPagina;
      return this.turmasFiltrados.slice(start, end);
    }
  },

  methods: {
    // 1. Carrega todas as turmas do localStorage (Key "turmas")
    carregarTurmas() {
      const turmasData = localStorage.getItem("turmas");
      this.turmas = turmasData ? JSON.parse(turmasData) : [];
      
      this.turmas.sort((a, b) => b.registro - a.registro);
      
      this.turmasFiltrados = this.turmas.slice();
    },

    // 2. Filtra as turmas baseado no termo de busca
    filtrarTurmas() {
      const termo = (this.search || "").toLowerCase().trim();

      if (!termo) {
        this.turmasFiltrados = this.turmas.slice();
      } else {
        // Filtra a lista completa pelo nome da turma
        this.turmasFiltrados = this.turmas.filter(t => {
          const nome = (t.nome || "").toLowerCase();
          return nome.includes(termo);
        });
      }

      this.paginaAtual = 1;
    },

    // 3. Funções de Paginação
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
    
    // 4. Ação ao clicar na linha
    verDetalhes(turma) {
      console.log("Informações completas da turma:", turma);
    }
  },

  mounted() {
    this.carregarTurmas(); 
    // O filtro inicializa a lista com todos os itens, não há necessidade de chamar filtrarTurmas()
  }
};
</script>

<style scoped>
/* ESTILO COMPLETO DO SEGUNDO CÓDIGO APLICADO */

.professores-page {
  padding: 20px;
  font-family: "Inter", sans-serif;
  /* Não definiu background no segundo código, mantendo o padrão */
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); /* Adicionado uma sombra suave */
}

.search-box input {
  flex: 1;
  border: none;
  background-color: #ffffff;
  outline: none;
  font-size: 16px; /* Aumentado um pouco para melhor legibilidade */
}

/* Ícones de busca - ajustados para a nova estrutura de ícones */
.search-box .icon {
    font-size: 1.2rem;
    color: #b197ff;
}

.btn-search {
  background: #b197ff;
  border: none;
  padding: 8px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-search:hover {
    background: #6a4dff;
}

.btn-search .icon {
    color: white;
    font-size: 1.1rem;
}

/* Tabela */
.table-container {
  background: white;
  border-radius: 14px;
  padding: 10px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Mantendo a sombra de tabela limpa */
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
  background: #fcfcfc; /* Fundo leve para o cabeçalho */
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.table-row {
    cursor: pointer;
    transition: background-color 0.2s;
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
  justify-self: center;
  transition: background-color 0.2s;
}

.btn-info:hover {
    background: #6a4dff;
}

.btn-info .icon {
    color: white;
    font-size: 0.9rem;
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
  margin-top: 30px; /* Aumentado o margin para espaçamento */
}

.pagination button {
  padding: 8px 18px;
  border: 1px solid #b197ff; /* Adicionando borda para melhor contraste */
  background: white;
  color: #6a4dff;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.pagination button:hover:not(:disabled) {
    background: #b197ff;
    color: white;
    border-color: #b197ff;
}

.pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f5f5f5;
    color: #999;
    border-color: #ddd;
}

.page-number {
  background: #6a4dff !important;
  color: white !important;
  border-color: #6a4dff !important;
  font-weight: bold;
}

/* Responsividade */
@media (max-width: 600px) {
    .table-header,
    .table-row {
        grid-template-columns: 0.8fr 2fr 0.8fr; 
        padding: 12px 10px;
        font-size: 0.9rem;
    }
}
</style>