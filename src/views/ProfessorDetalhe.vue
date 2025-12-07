<template>
  <div class="page-container">
    <div class="header">
      <span class="icone ph-bold ph-arrow-left" @click="$router.back()"></span>
      <h2>INFORMAÇÕES DO PROFESSOR</h2>
    </div>

    <div v-if="!professor" class="empty-state">
      <span class="icone ph-bold ph-smiley-sad"></span>
      <p>Professor não encontrado. Verifique a matrícula fornecida.</p>
    </div>

    <div v-else class="content-grid">
      
      <div class="left-column">
        
        <div class="info-card personal-data">
          <h3>Informações do Professor</h3>
          <div class="data-grid professor-data-grid">
            
            <div class="data-group">
              <p>
                <span class="label">Matrícula:</span> 
                <strong class="value">{{ professor.registro }}</strong>
              </p>
              <p>
                <span class="label">Nome:</span> 
                <strong class="value">{{ professor.nome }}</strong>
              </p>
              <p>
                <span class="label">Cpf:</span> 
                <strong class="value">{{ professor.cpf || 'Não informado' }}</strong>
              </p>
              <p>
                <span class="label">RG:</span> 
                <strong class="value">{{ professor.rg || 'Não informado' }}</strong>
              </p>
              <p>
                <span class="label">Endereço:</span> 
                <strong class="value">{{ getEndereco(professor) }}</strong>
              </p>
            </div>
            
            <div class="data-group">
              <p>
                <span class="label">Idade:</span> 
                <strong class="value">{{ professor.idade ? professor.idade + ' anos' : 'Não informado' }}</strong>
              </p>
              <p>
                <span class="label">Email:</span> 
                <strong class="value">{{ professor.email || 'Não informado' }}</strong>
              </p>
              <p>
                <span class="label">Formação:</span> 
                <strong class="value">{{ professor.formacao || 'Não informado' }}</strong>
              </p>
              <p>
                <span class="label">Telefone:</span> 
                <strong class="value">{{ professor.telefone || 'Não informado' }}</strong>
              </p>
              <p>
                <span class="label">Celular:</span> 
                <strong class="value">{{ professor.celular || 'Não informado' }}</strong>
              </p>
            </div>
          </div>
        </div>

       <div class="action-buttons">
        <button class="btn-action edit" @click="editarProfessor">Editar cadastro</button>
         <button class="btn-action delete" @click="excluirProfessor">Excluir cadastro</button>
      </div>

      </div>
      

      <div class="turmas-container">
        <h3>Turmas Pertencentes</h3>
        <div v-if="turmasProfessor.length > 0" class="turmas-list">
          <div 
            v-for="(turma, index) in turmasProfessor" 
            :key="turma.id" 
            class="turma-card"
            :class="getCardColor(index)"
          >
            <div class="turma-info">
              <span class="turma-detalhe">{{ turma.id }} - {{ turma.turno.toUpperCase() }}</span>
              <span class="turma-nome">{{ turma.nome || 'Disciplina não definida' }}</span>
            </div>
            <span class="icone ph-bold ph-arrow-right"></span>
          </div>
        </div>
        <div v-else class="empty-turmas">
          O professor não está vinculado a nenhuma turma.
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  // Simula a obtenção da matrícula via rota (ex: /professores/0953156)
  props: {
    matricula: {
      type: [String, Number],
      required: true 
    }
  },
  
  data() {
    return {
      professor: null,
      todasTurmas: [],
      turmasProfessor: [],
      // Cores para o ciclo de cards de turma
      cardColors: ['yellow', 'green', 'orange', 'blue'],
    };
  },
  
  methods: {
    // Retorna o endereço formatado
    getEndereco(prof) {
        if (!prof.endereco) return 'Não informado';
        let endereco = `${prof.endereco}`;
        if (prof.bairro) endereco += `, ${prof.bairro}`;
        if (prof.estado) endereco += ` - ${prof.estado}`;
        return endereco;
    },

    // Determina a cor do card (reutilizado)
    getCardColor(index) {
        const colorIndex = index % this.cardColors.length;
        return `color-${this.cardColors[colorIndex]}`;
    },

    carregarDados() {
      // 1. Simula a busca de todos os professores e turmas no Local Storage
      // Em uma aplicação real, você faria uma chamada API.
      const professores = JSON.parse(localStorage.getItem("professores")) || [];
      this.todasTurmas = JSON.parse(localStorage.getItem("turmas")) || [];
      
      // 2. Busca o professor pela matrícula
      this.professor = professores.find(p => String(p.matricula) === String(this.matricula));
      
      if (this.professor) {
        this.encontrarTurmas();
      }
    },
    
    encontrarTurmas() {
      const matriculaProfessor = String(this.professor.matricula);
      
      // 3. Filtra as turmas onde a MATRÍCULA do professor está na lista de professoresTurma
      // Assumo que o objeto turma tem uma propriedade `professorMatricula` ou `professoresSelecionados`
      this.turmasProfessor = this.todasTurmas.filter(turma => {
        // Se a turma usa um único professor por turma (ex: turma.professorMatricula)
        const isSingleProfessor = String(turma.professorMatricula) === matriculaProfessor;

        // Se a turma usa um array de professores (ex: turma.professoresSelecionados)
        const isMultipleProfessor = turma.professoresSelecionados && 
                                   turma.professoresSelecionados.map(String).includes(matriculaProfessor);
        
        // Inclui a turma se a matrícula do professor for encontrada em qualquer um dos campos
        return isSingleProfessor || isMultipleProfessor;
      });
    },
    editarProfessor() {
    // Exemplo de rota: /professores/123/editar
    this.$router.push(`/professores/${this.matricula}/editar`);
  },

  excluirProfessor() {
    if (!confirm("Tem certeza que deseja excluir este professor?")) {
      return;
    }

    let professores = JSON.parse(localStorage.getItem("professores")) || [];

    // Remove o professor pelo número de matrícula
    professores = professores.filter(
      p => String(p.matricula) !== String(this.matricula)
    );

    localStorage.setItem("professores", JSON.stringify(professores));

    alert("Professor removido com sucesso!");

    // Redireciona para a lista de professores
    this.$router.push("/professores");
  }

  },
  
  mounted() {
    this.carregarDados(); 
  },

  
};
</script>

<style scoped>
/* ==================================== */
/* 🌎 ESTILOS BASE E LAYOUT PRINCIPAL */
/* ==================================== */

.page-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: "Inter", sans-serif;
  min-height: 100vh;
}

/* --- HEADER --- */
.header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 10px;
}

.header .icone {
  font-size: 24px;
  color: #5a45ff;
  cursor: pointer;
  transition: opacity 0.2s;
}

.header .icone:hover {
  opacity: 0.8;
}

.header h2 {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

/* ==================================== */
/* 📦 CONTEÚDO */
/* ==================================== */

.content-grid {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* ==================================== */
/* 📌 CARD DE INFORMAÇÕES */
/* ==================================== */

.info-card {
  background: #ffffff;
  padding: 25px;
  border-radius: 12px;
  border: 1px solid #e1e4e6;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.info-card h3 {
  font-size: 16px;
  font-weight: 700;
  color: #5a45ff;
  margin-bottom: 15px;
}

/* GRID INTERNO */
.data-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.data-group p {
  margin: 0;
  line-height: 1.6;
}

.label {
  font-weight: 600;
  color: #000;
}

.value {
  font-weight: 400;
  color: #000;
}

/* ==================================== */
/* 🛠 BOTÕES DE AÇÃO */
/* ==================================== */

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn-action {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  color: #fff;
  flex-grow: 1;
  transition: 0.2s;
}

.btn-action.edit {
  background-color: #b197ff;
}

.btn-action.delete {
  background-color: #ff7f75;
}

.btn-action:hover {
  filter: brightness(0.9);
}

/* ==================================== */
/* 📚 TURMAS */
/* ==================================== */

.turmas-container h3 {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.turmas-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.turma-card {
  flex: 1 1 250px;
  background: #fff;
  padding: 15px 20px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  border: 1px solid #e1e4e6;
}

.turma-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(0,0,0,0.15);
}

.turma-info {
  display: flex;
  flex-direction: column;
}

.turma-nome {
  font-size: 15px;
  font-weight: 700;
}

.turma-detalhe {
  font-size: 12px;
  opacity: 0.8;
}

/* Ícones */
.turma-card .icone {
  font-size: 20px;
}

/* ===== Cores dos cards ===== */
.turma-card.color-yellow {
  background-color: #fffed1;
  border: 1px solid #e0d0a0;
}
.turma-card.color-green {
  background-color: #d1ffee;
  border: 1px solid #a0e0d1;
}
.turma-card.color-orange {
  background-color: #ffe2cf;
  border: 1px solid #e0b090;
}
.turma-card.color-blue {
  background-color: #d1eaff;
  border: 1px solid #a0c2e0;
}

.turma-card.color-yellow .icone { color: #d09000; }
.turma-card.color-green .icone { color: #00a060; }
.turma-card.color-orange .icone { color: #d06000; }
.turma-card.color-blue .icone { color: #0060d0; }

/* ==================================== */
/* ❗ ESTADO VAZIO */
/* ==================================== */

.empty-state {
  text-align: center;
  padding: 50px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e1e4e6;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.empty-state .icone {
  font-size: 40px;
  color: #ff7f75;
}

.empty-state p {
  margin-top: 10px;
  font-size: 14px;
  color: #555;
}

.empty-turmas {
  padding: 25px;
  background: #fff;
  border-radius: 10px;
  border: 1px dashed #bbb;
  text-align: center;
  font-style: italic;
  color: #777;
}

/* ==================================== */
/* 📱 RESPONSIVIDADE */
/* ==================================== */

@media (max-width: 850px) {
  .data-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .turmas-list {
    flex-direction: column;
  }

  .turma-card {
    flex: 1 1 auto;
  }
}
</style>

