<template>
  <div class="pagina-alunos">

    <div class="caixa-busca">
      <span class="icone ph-bold ph-magnifying-glass"></span>
      <input 
        type="text" 
        v-model="busca" 
        placeholder="Pesquise pelo nome ou matrícula do aluno"
        @input="filtrarAlunos"
      />
      <button class="btn-buscar">
        <span class="icone ph-bold ph-arrow-right"></span>
      </button>
    </div>

    <div class="container-tabela">

      <div class="cabecalho-tabela">
        <span>Matrícula</span>
        <span>Aluno</span>
        <span>Mais informações</span>
      </div>

      <div 
        class="linha-tabela" 
        v-for="aluno in alunosPaginados" 
        :key="aluno.matricula"
      >
        <span>{{ aluno.matricula }}</span>
        <span>{{ aluno.nome }}</span>
        
        <button class="btn-info" @click="$router.push(`/alunos/detalhealuno/${aluno.matricula}`)">
            <span class="icone ph-bold ph-arrow-right"></span>
        </button>
      </div>
     


      <div v-if="alunosPaginados.length === 0" class="vazio">
        Nenhum aluno encontrado
      </div>

    </div>

    <div class="paginacao">
      <button @click="primeiraPagina">«</button>
      <button @click="paginaAnterior">‹</button>
      
      <button class="numero-pagina">{{ paginaAtual }}</button>
      
      <button @click="proximaPagina">›</button>
      <button @click="ultimaPagina">»</button>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      alunos: [],
      alunosFiltrados: [],
      busca: "",
      paginaAtual: 1,
      porPagina: 4,
    };
  },

  computed: {
    totalPaginas() {
      return Math.ceil(this.alunosFiltrados.length / this.porPagina) || 1;
    },

    alunosPaginados() {
      const inicio = (this.paginaAtual - 1) * this.porPagina;
      const fim = inicio + this.porPagina;
      return this.alunosFiltrados.slice(inicio, fim);
    }
  },

  methods: {
    carregarAlunos() {
      this.alunos = JSON.parse(localStorage.getItem("alunos")) || [];
      // inicializa alunosFiltrados assim que carregar
      this.alunosFiltrados = this.alunos.slice();
    },

    filtrarAlunos() {
      const termo = (this.busca || "").toLowerCase();

      this.alunosFiltrados = this.alunos.filter(a => {
        const nome = (a.nome || "").toLowerCase();
        const matricula = String(a.matricula || "");
        return nome.includes(termo) || matricula.includes(termo);
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
    }
  },

  mounted() {
    this.carregarAlunos();
    this.filtrarAlunos(); 
  }
};
</script>

<style scoped>
.pagina-alunos {
  padding: 20px;
  font-family: "Inter", sans-serif;
}

/* Busca */
.caixa-busca {
  display: flex;
  align-items: center;
  background-color: #ffffff;

  padding: 12px 18px;
  border-radius: 14px;
  margin-bottom: 20px;
  gap: 12px;
}

.caixa-busca input {
  flex: 1;
  border: none;
  background-color: #ffffff;
  outline: none;
  font-size: 14px;
}

.btn-buscar {
  background: #b197ff;
  border: none;
  padding: 8px 20px;
  border-radius: 10px;
  cursor: pointer;
}

/* Tabela */
.container-tabela {
  background: white;
  border-radius: 14px;
  padding: 10px 0;
}

.cabecalho-tabela,
.linha-tabela {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  padding: 14px 20px;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.cabecalho-tabela {
  font-weight: bold;
  color: #777;
  background: #ffffff;
}

.linha-tabela:hover {
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

.vazio {
  text-align: center;
  padding: 30px;
  color: #777;
}

/* Paginação */
.paginacao {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

.paginacao button {
  padding: 8px 18px;
  border: none;
  background: #b197ff;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
}

.numero-pagina {
  background: #6a4dff !important;
}
</style>
