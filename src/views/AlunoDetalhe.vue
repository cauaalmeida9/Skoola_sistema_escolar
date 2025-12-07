<template>
  <div class="page-container">
    <div class="header">
      <span class="icone ph-bold ph-arrow-left" @click="$router.back()"></span>
      <h2>INFORMAÇÕES DO ALUNO</h2>
    </div>

    <div v-if="!aluno" class="empty-state">
      <span class="icone ph-bold ph-smiley-sad"></span>
      <p>Aluno não encontrado. Verifique a matrícula fornecida.</p>
    </div>

    <div v-else class="content-grid">
      
      <div class="left-column">
        
        <div class="info-card personal-data">
          <h3>Informações do Aluno</h3>
          <div class="data-grid">
            <div class="data-group">
              <p>
                <span class="label">Matrícula:</span> 
                <strong class="value">{{ aluno.matricula }}</strong>
              </p>
              <p>
                <span class="label">Nome:</span> 
                <strong class="value">{{ aluno.nome }}</strong>
              </p>
              <p>
                <span class="label">Cpf:</span> 
                <strong class="value">{{ aluno.cpf || 'Não informado' }}</strong>
              </p>
              <p>
                <span class="label">Endereço:</span> 
                <strong class="value">{{ aluno.endereco || 'Não informado' }}</strong>
              </p>
              <p>
                <span class="label">Bairro:</span> 
                <strong class="value">{{ aluno.bairro || 'Não informado' }}</strong>
              </p>
              <p>
                <span class="label">Cidade:</span> 
                <strong class="value">{{ aluno.cidade || 'Não informada' }}</strong>
              </p>
              <p>
                <span class="label">Idade:</span> 
                <strong class="value">{{ calcularIdade(aluno.nascimento) }} anos</strong>
              </p>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn-action generate">Gerar Boletim</button>
          <button class="btn-action edit">Editar cadastro</button>
          <button class="btn-action frequency">Gerar frequência</button>
          <button class="btn-action delete">Excluir cadastro</button>
        </div>

        <div class="info-card compact-card alert-card">
          <h3>Alergias</h3>
          <p class="content-text">{{ aluno.alergias || 'O aluno não possui alergias.' }}</p>
        </div>

        <div class="info-card compact-card obs-card">
          <h3>Observações</h3>
          <p class="content-text">{{ aluno.observacoes || 'O aluno não possui observações.' }}</p>
        </div>
      </div>
      
      <div class="right-column">
        
        <div class="info-card responsavel-card">
          <h3>Informações dos Responsáveis</h3>
          <div v-for="resp in aluno.responsaveis" :key="resp.cpf" class="responsavel-detalhe">
            <p><span class="label">Parentesco:</span> <strong>{{ resp.parentesco }}</strong></p>
            <p><span class="label">Nome:</span> <strong>{{ resp.nome }}</strong></p>
            <p><span class="label">Telefone:</span> <strong>{{ resp.telefone || 'Não informado' }}</strong></p>
            <p><span class="label">Cpf:</span> <strong>{{ resp.cpf || 'Não informado' }}</strong></p>
            <p><span class="label">Email:</span> <strong>{{ resp.email || 'Não informado' }}</strong></p>
          </div>
          <p v-if="aluno.responsaveis.length === 0" class="content-text">Nenhum responsável cadastrado.</p>
        </div>
        
      </div>

      <div class="turmas-container">
        <h3>Turmas Pertencentes</h3>
        <div v-if="turmasAluno.length > 0" class="turmas-list">
          <div 
            v-for="(turma, index) in turmasAluno" 
            :key="turma.id" 
            class="turma-card"
            :class="getCardColor(index)"
          >
            <div class="turma-info">
              <span class="turma-nome">{{ turma.nome }}</span>
              <span class="turma-detalhe">{{ turma.semestre }} - {{ turma.turno.toUpperCase() }}</span>
            </div>
            <span class="icone ph-bold ph-arrow-right"></span>
          </div>
        </div>
        <div v-else class="empty-turmas">
          O aluno não está matriculado em nenhuma turma.
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  // Simula a obtenção da matrícula via rota (ex: /alunos/0953156)
  props: {
    matricula: {
      type: [String, Number],
      required: true 
      // Em uma aplicação real, você pegaria isso de this.$route.params.matricula
      // Por enquanto, assumimos que é passado via prop.
    }
  },
  
  data() {
    return {
      aluno: null,
      todasTurmas: [],
      turmasAluno: [],
      // Cores para o ciclo de cards de turma
      cardColors: ['yellow', 'green', 'orange', 'blue'],
    };
  },
  
  methods: {
    // Função de utilidade para calcular a idade (Reutilizada do Dashboard)
    calcularIdade(dataNascimento) {
      if (!dataNascimento) return "N/A";
      const dataNasc = new Date(dataNascimento);
      const hoje = new Date();
      let idade = hoje.getFullYear() - dataNasc.getFullYear();
      const mes = hoje.getMonth() - dataNasc.getMonth();
      if (mes < 0 || (mes === 0 && hoje.getDate() < dataNasc.getDate())) {
        idade--;
      }
      return idade;
    },

    // Determina a cor do card (para seguir o padrão da imagem)
    getCardColor(index) {
        const colorIndex = index % this.cardColors.length;
        return `color-${this.cardColors[colorIndex]}`;
    },

    carregarDados() {
      const alunos = JSON.parse(localStorage.getItem("alunos")) || [];
      this.todasTurmas = JSON.parse(localStorage.getItem("turmas")) || [];
      
      // 1. Busca o aluno pela matrícula
      // Garante que a comparação seja entre string/number se houver inconsistência no storage
      this.aluno = alunos.find(a => String(a.matricula) === String(this.matricula));
      
      if (this.aluno) {
        this.encontrarTurmas();
      }
    },
    
    encontrarTurmas() {
      const matriculaAluno = String(this.aluno.matricula);
      
      // 2. Filtra as turmas onde a matrícula do aluno está na lista de alunosSelecionados
      this.turmasAluno = this.todasTurmas.filter(turma => {
        // turmas.alunosSelecionados guarda apenas as matrículas
        return turma.alunosSelecionados && 
               turma.alunosSelecionados.map(String).includes(matriculaAluno);
      });
    }
  },
  
  mounted() {
    this.carregarDados();
  }
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
  font-family: 'Inter', sans-serif;
 
  min-height: 100vh;
}

/* --- HEADER --- */
.header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  padding: 15px 15px;
  background-color: #ffffff;
  border-radius: 10px;
}

.header .icone {
  font-size: 24px;
  color: #5A45FF;
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

/* --- GRID PRINCIPAL --- */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr; /* Coluna esquerda (dados, botões) e direita (responsáveis) */
  grid-template-rows: auto auto 1fr;
  gap: 25px;
}

.left-column {
    display: flex;
    flex-direction: column;
    gap: 25px;
    grid-column: 1 / 2;
}

.right-column {
    grid-column: 2 / 3;
    grid-row: 1 / 3; /* Ocupa o espaço da info pessoal e dos botões */
}

.turmas-container {
    grid-column: 1 / -1; /* Ocupa toda a largura na parte inferior */
    margin-top: 15px;
}

.turmas-container h3 {
    margin-bottom: 15px;
    font-size: 16px;
    font-weight: 700;
    color: #333;
}


/* --- CARDS BASE --- */
.info-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e1e4e6;
}

.info-card h3 {
  font-size: 16px;
  font-weight: 700;
  color: #5A45FF; /* Cor de destaque */
  margin-bottom: 15px;
}

.label {
    font-weight: 600;
    color: #000000;
    margin-right: 5px;
}

.value {
    color: #000000;
    font-weight: 400;
}

.content-text {
    color: #555;
    font-style: italic;
    line-height: 1.5;
}

/* --- Card de Informações Pessoais --- */
.personal-data .data-grid {
    display: grid;
    grid-template-columns: 1fr; 
    gap: 10px;
}

.personal-data p {
    margin: 0;
    line-height: 1.6;
}

/* --- Card de Responsáveis --- */
.responsavel-card {
    height: 100%;
    background-color: #ffffff; /* Fundo roxo claro (como na imagem) */
}
.responsavel-card h3 {
    color: #5A45FF;
}

.responsavel-detalhe {
    border-bottom: 1px solid #e9e5ff;
    padding-bottom: 10px;
    margin-bottom: 15px;
}
.responsavel-detalhe:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}
.responsavel-detalhe p {
    margin: 3px 0;
    font-size: 14px;
}
.responsavel-detalhe .label {
    font-size: 13px;
    color: #000000;
}

/* --- Cards Compactos (Alergias/Obs) --- */
.compact-card {
    flex: 1;
    min-width: 0;
}
.alert-card {
    /* Pode estilizar a borda ou fundo levemente para alertar */
    border-left: 5px solid #ff9800;
}

/* --- BOTÕES DE AÇÃO --- */
.action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.btn-action {
    padding: 10px 18px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 14px;
    color: white;
    flex-grow: 1;
    min-width: 120px;
}

/* Estilos de Cor dos Botões (Seguindo o padrão da imagem) */
.btn-action.generate {
    background-color: #8e7aff; /* Roxo */
}
.btn-action.edit {
    background-color: #b197ff; /* Lilás */
}
.btn-action.frequency {
    background-color: #70d2b4; /* Verde Água */
}
.btn-action.delete {
    background-color: #ff7f75; /* Vermelho/Coral */
}

.btn-action:hover {
    filter: brightness(0.9);
}


/* --- TURMAS PERTENCENTES --- */
.turmas-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.turma-card {
    flex: 1 1 200px; /* Flexível, com largura mínima */
    padding: 15px 20px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 200px;
    transition: transform 0.2s;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.turma-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
}

.turma-info {
    display: flex;
    flex-direction: column;
}

.turma-nome {
    font-weight: 700;
    font-size: 15px;
    margin-bottom: 2px;
}

.turma-detalhe {
    font-size: 12px;
    opacity: 0.8;
}

.turma-card .icone {
    font-size: 20px;
}

/* Cores dos cards (Seguindo o padrão da imagem) */
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

.empty-turmas {
    padding: 30px;
    text-align: center;
    background: #ffffff;
    border-radius: 8px;
    color: #999;
    font-style: italic;
    border: 1px dashed #ccc;
}

/* --- ESTADO VAZIO / ERRO --- */
.empty-state {
    text-align: center;
    padding: 50px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    border: 1px solid #e1e4e6;
}
.empty-state .icone {
    font-size: 40px;
    color: #ff7f75;
}
.empty-state p {
    color: #555;
    margin-top: 10px;
}


/* ==================================== */
/* 📱 RESPONSIVIDADE */
/* ==================================== */
@media (max-width: 990px) {
    .content-grid {
        grid-template-columns: 1fr; /* Uma única coluna */
        gap: 20px;
    }

    .left-column {
        grid-column: 1 / -1;
    }

    .right-column {
        grid-column: 1 / -1;
        grid-row: auto; /* Volta ao fluxo normal após a coluna esquerda */
    }

    .action-buttons {
        justify-content: center;
    }
}

@media (max-width: 600px) {
    .action-buttons {
        flex-direction: column;
    }

    .turmas-list {
        flex-direction: column;
        gap: 15px;
    }
    
    .turma-card {
        flex-basis: auto;
    }
}
</style>