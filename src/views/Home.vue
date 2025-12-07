<template>
  <div class="pagina-dashboard">

    
    <div class="container-cards">
      <div class="card">
        <span class="icone ph-bold ph-chalkboard-teacher icone-card"></span>
        <h2>{{ professores.length }}</h2>
        <p>Professores</p>
      </div>

      <div class="card">
        <span class="icone ph-bold ph-graduation-cap icone-card"></span>
        <h2>{{ alunos.length }}</h2>
        <p>Alunos</p>
      </div>

      <div class="card">
        <span class="icone ph-bold ph-users icone-card"></span>
        <h2>{{ turmas.length }}</h2>
        <p>Turmas</p>
      </div>
    </div>

    <div class="caixa-busca">
      <span class="icone ph-bold ph-magnifying-glass"></span>

      <input 
        type="text"
        v-model="buscaAluno"
        placeholder="Pesquise pelo nome do aluno..."
      />

      <button class="btn-buscar">
        <span class="icone ph-bold ph-arrow-right"></span>
      </button>
    </div>

    <h2 class="titulo-secao">
      <span class="icone ph-bold ph-student"></span>
      Alunos
    </h2>

    <div class="lista-alunos">
      <div 
        v-for="aluno in alunosFiltrados" 
        :key="aluno.matricula" 
        class="cartao-aluno"
      >
        <div class="cabecalho-aluno">
          <span class="icone ph-bold ph-user icone-aluno"></span>
          <h3>{{ aluno.nome }}</h3>
        </div>

        <div class="detalhes-aluno" @click="$router.push(`/alunos/detalhealuno/${aluno.matricula}`)">
          <p>
            <span class="icone ph-bold ph-chalkboard icone-detalhe"></span>
            Idade: <strong>{{ calcularIdade(aluno.nascimento) }}</strong>
          </p>

          <p class="info-responsaveis">
            <span class="icone ph-bold ph-users-three icone-detalhe"></span>
            Responsáveis: 
            <span v-for="(resp, index) in aluno.responsaveis" :key="resp.cpf">
              {{ resp.nome }}{{ index === aluno.responsaveis.length - 1 ? "" : ", " }}
            </span>
          </p>
        </div>
      </div>

      <div v-if="alunosFiltrados.length === 0" class="vazio">
        <span class="icone ph-bold ph-smiley-sad"></span> 
        Nenhum aluno encontrado
      </div>
    </div>

    <h2 class="titulo-secao">
      <span class="icone ph-bold ph-users"></span>
      Turmas
    </h2>

    <div class="lista-turmas">
      <div 
        v-for="turma in turmas"
        :key="turma.nome"
        class="cartao-turma"
      >
        <div class="cabecalho-turma">
          <span class="icone ph-bold ph-users icone-turma"></span>
          <h3>{{ turma.nome }}</h3>
        </div>

        <div class="detalhes-turma">
          <p>
            <span class="icone ph-bold ph-user icone-detalhe"></span>
            Professor: <strong>{{ turma.docenteNome || "Não atribuído" }}</strong>
          </p>

        </div>
      </div>

      <div v-if="turmas.length === 0" class="vazio">
        <span class="icone ph-bold ph-warning"></span> 
        Nenhuma turma cadastrada
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      professores: [],
      alunos: [],
      turmas: [],
      buscaAluno: ""
    };
  },

  computed: {
    alunosFiltrados() {
      const termo = this.buscaAluno
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      return this.alunos.filter(aluno =>
        aluno.nome
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(termo)
      );
    }
  },

  methods: {
    carregarDados() {
      this.professores = JSON.parse(localStorage.getItem("professores")) || [];
      this.alunos = JSON.parse(localStorage.getItem("alunos")) || [];
      this.turmas = JSON.parse(localStorage.getItem("turmas")) || [];
      // Linha incorreta 'this.idade = ...' removida.
    },
    
    // NOVO MÉTODO: Calcula a idade com base na data de nascimento
    calcularIdade(dataNascimento) {
      if (!dataNascimento) return "N/A";
      
      const dataNasc = new Date(dataNascimento);
      const hoje = new Date();
      
      let idade = hoje.getFullYear() - dataNasc.getFullYear();
      const mes = hoje.getMonth() - dataNasc.getMonth();

      // Ajuste se o aniversário ainda não ocorreu este ano
      if (mes < 0 || (mes === 0 && hoje.getDate() < dataNasc.getDate())) {
        idade--;
      }
      
      return idade;
    }
  },

  mounted() {
    this.carregarDados();
  }
};
</script>

<style scoped>
.pagina-dashboard {
  padding: 25px;
  font-family: "Inter", sans-serif;
  background: #f2f3f7;
  min-height: 100vh;
}

/* Título */
.titulo {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 12px;
}

.titulo .icone {
  font-size: 24px;
  color: #5A45FF;
}

/* Cards */
.container-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 25px;
}

.card {
  flex: 1 1 200px;
  min-width: 200px;
  padding: 25px;
  background: white;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.icone-card {
  font-size: 30px;
  color: #5A45FF;
}

.card h2 {
  font-size: 2.4rem;
  color: #5A45FF;
  margin: 10px 0 5px 0;
}

/* Barra de busca */
.caixa-busca {
  display: flex;
  align-items: center;
  background: white;
  padding: 12px 18px;
  border-radius: 14px;
  margin-bottom: 20px;
  gap: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.06);
}

.caixa-busca input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
}

.btn-buscar {
  background: #b197ff;
  border: none;
  padding: 8px 20px;
  border-radius: 10px;
}

/* Seções */
.titulo-secao {
  margin-top: 30px;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #444;
  margin-bottom: 12px;
}

/* Grid responsivo */
.lista-alunos,
.lista-turmas {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 18px;
}

.cartao-aluno,
.cartao-turma {
  background: white;
  padding: 18px;
  border-radius: 14px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
}

.cabecalho-aluno,
.cabecalho-turma {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.icone-aluno,
.icone-turma {
  font-size: 24px;
  color: #5A45FF;
  margin-right: 10px;
}

.icone-detalhe {
  font-size: 18px;
  color: #5A45FF;
  margin-right: 8px;
}

.vazio {
  grid-column: 1 / -1;
  background: white;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  color: #666;
}

/* RESPONSIVIDADE */

/* Tablets / telas médias */
@media (max-width: 900px) {
  .container-cards {
    flex-wrap: wrap;
  }
  .card {
    flex: 1 1 45%;
  }
}

/* Celulares / telas pequenas */
@media (max-width: 650px) {
  .pagina-dashboard {
    padding: 15px;
  }
  .titulo {
    font-size: 1.6rem;
    justify-content: center;
  }
  .container-cards {
    flex-direction: column;
    gap: 15px;
  }
  .card h2 {
    font-size: 2rem;
  }
  .lista-alunos,
  .lista-turmas {
    grid-template-columns: 1fr;
  }
}
</style>