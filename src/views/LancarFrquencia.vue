<template>
  <div class="page-container">
    <div class="header">
      <span class="icone ph-bold ph-arrow-left" @click="$router.back()"></span>
      <h2>LANÇAR FREQUÊNCIA - TURMA {{ turma ? turma.registro : '' }}</h2>
    </div>

    <div v-if="!turma" class="info-card">
      <p class="content-text">Turma não encontrada. Verifique o registro.</p>
    </div>

    <div v-else class="content-wrapper">
      <div class="controls-card info-card">
        <h3>🗓️ Seleção de Data</h3>
        <div class="control-group date-select-group">
          <label for="selectDate">Data para Lançamento</label>
          <input 
            type="date" 
            id="selectDate" 
            v-model="dataSelecionada" 
            class="select-control"
            :max="hoje"
          />
        </div>
      </div>

      <div class="table-card info-card alunos-card">
        <h3>Alunos Participantes: Marcar Presença (P) / Falta (F)</h3>
        
        <p v-if="alunos.length === 0" class="content-text">
            Nenhum aluno cadastrado nesta turma.
        </p>
        <p v-else-if="!dataSelecionada" class="content-text">
            Por favor, selecione uma data acima para iniciar o lançamento da frequência.
        </p>

        <div v-else class="table-container">
          <table>
            <thead>
              <tr>
                <th class="col-matricula">Matrícula</th>
                <th>Nome do Aluno</th>
                <th v-for="h in horarios" :key="h" class="text-center">{{ h }}º Horário</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="aluno in alunos" 
                :key="aluno.matricula"
              >
                <td class="col-matricula">{{ aluno.matricula }}</td>
                <td class="col-nome">{{ aluno.nome }}</td>
                
                <td 
                  v-for="(horario, index) in horarios" 
                  :key="index" 
                  class="text-center col-horario"
                >
                  <div class="freq-control-group">
                      <label class="toggle-switch">
                          <input 
                              type="checkbox" 
                              v-model="frequencia[aluno.matricula][index]"
                          >
                          <span class="slider"></span>
                      </label>
                      <span class="status-label" :class="{ 'status-presente': frequencia[aluno.matricula][index] }">
                          {{ frequencia[aluno.matricula][index] ? 'P' : 'F' }}
                      </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="save-button-container">
        <button 
          class="btn-action confirm-btn" 
          :disabled="!dataSelecionada"
          @click="salvarFrequencia"
        >
          <span class="icone ph-bold ph-check-circle"></span> Salvar Frequência
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// A lógica (script) é a mesma da versão anterior, garantindo o funcionamento do localStorage
export default {
  name: 'LancarFrequencia',
  data() {
    return {
      turma: null,
      alunos: [],
      turmaRegistro: null,
      dataSelecionada: null,
      hoje: new Date().toISOString().split('T')[0],
      horarios: [1, 2, 3, 4], 
      frequencia: {}, 
    };
  },

  watch: {
    dataSelecionada(newDate) {
      if (newDate) {
        this.inicializarFrequencia();
      } else {
        this.frequencia = {};
      }
    }
  },

  mounted() {
    this.turmaRegistro = this.$route.params.registro;
    this.carregarDadosTurma();
  },

  methods: {
    carregarDadosTurma() {
      const registroParaBuscar = this.turmaRegistro; 

      if (!registroParaBuscar) {
        this.turma = null; 
        return;
      }
      
      const turmas = JSON.parse(localStorage.getItem('turmas') || '[]');
      const alunosData = JSON.parse(localStorage.getItem('alunos') || '[]');

      this.turma = turmas.find(t => String(t.registro) === String(registroParaBuscar));

      if (this.turma) {
        const matriculas = Array.isArray(this.turma.alunosSelecionados) ? this.turma.alunosSelecionados : [];
        this.alunos = matriculas
          .map(matricula => alunosData.find(a => String(a.matricula) === String(matricula)))
          .filter(Boolean);
          
        this.turma.frequencia = this.turma.frequencia || {};
        
        this.dataSelecionada = this.hoje; // Define a data de hoje como padrão
        
      } else {
        this.turma = null;
      }
    },
    
    inicializarFrequencia() {
      if (!this.dataSelecionada || !this.turma) return;
      
      const freqDia = this.turma.frequencia[this.dataSelecionada] || {};
      const novaFrequencia = {};
      
      this.alunos.forEach(aluno => {
        const matricula = String(aluno.matricula);
        
        // Carrega a frequência existente ou inicializa como [true, true, true, true] (Todos presentes)
        novaFrequencia[matricula] = freqDia[matricula] || [true, true, true, true]; 
      });
      
      this.frequencia = novaFrequencia;
    },
    
    salvarFrequencia() {
      if (!this.dataSelecionada) {
        alert("Selecione uma data para salvar a frequência.");
        return;
      }
      
      const frequenciaParaSalvar = {};
      
      this.alunos.forEach(aluno => {
        const matricula = String(aluno.matricula);
        frequenciaParaSalvar[matricula] = this.frequencia[matricula];
      });
      
      let turmas = JSON.parse(localStorage.getItem('turmas') || '[]');
      const turmaIndex = turmas.findIndex(t => String(t.registro) === String(this.turmaRegistro));

      if (turmaIndex !== -1) {
        if (!turmas[turmaIndex].frequencia) {
          turmas[turmaIndex].frequencia = {};
        }
        turmas[turmaIndex].frequencia[this.dataSelecionada] = frequenciaParaSalvar;

        localStorage.setItem('turmas', JSON.stringify(turmas));
        
        this.turma.frequencia = turmas[turmaIndex].frequencia; 
        
        alert(`Frequência salva com sucesso para a data ${this.dataSelecionada}!`);
      } else {
        alert("Erro: Turma não encontrada para salvar frequência.");
      }
    }
  }
};
</script>

<style scoped>
/* COMENTÁRIO IMPORTANTE: ESTILOS BASEADOS NO SEU CSS DE DETALHESTURMA */

/* --- Variáveis (Não estavam no seu CSS, mas ajudam na manutenção) --- */
/*
:root {
  --primary-color: #5A45FF;
  --primary-light: #f9f8ff;
  --secondary-color: #4b4b63;
  --success-color: #4CAF50;
  --danger-color: #F44336;
}
*/
/* --- FIM DAS VARIÁVEIS --- */


.page-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
}

.header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    padding: 15px 15px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header .icone {
    font-size: 24px;
    color: #5A45FF;
    cursor: pointer;
}

.header h2 {
    font-size: 18px;
    font-weight: 700;
    color: #333;
    margin: 0;
}

/* Card Base */
.info-card {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    border: 1px solid #e1e4e6;
    margin-bottom: 20px; /* Adicionado para separar os cards */
}

.info-card h3 {
    font-size: 16px;
    font-weight: 700;
    color: #5A45FF;
    margin-bottom: 15px;
}

.content-text {
    color: #999;
    font-style: italic;
    line-height: 1.5;
}

/* --- Controles de Data --- */
.controls-card {
    background-color: #f9f8ff;
    border: 1px solid #e9e5ff;
}

.control-group label {
    font-weight: 600;
    color: #4b4b63;
    margin-right: 5px;
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
}

.select-control {
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: white;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    transition: border-color 0.2s;
    min-width: 250px;
}

.select-control:focus {
    border-color: #5A45FF;
    outline: none;
}

/* --- Tabela --- */
.table-card h3 {
    color: #4b4b63; /* Mantendo a cor dos títulos de cards internos */
}

.table-container {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid #eee;
}

table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
}

thead th {
    background-color: #5A45FF; /* Usando cor primária para o cabeçalho da tabela */
    color: white;
    padding: 12px 15px;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    position: sticky;
    top: 0;
}

tbody tr {
    background-color: #fff;
    border-bottom: 1px solid #f0f0f4;
}

tbody tr:hover {
    background-color: #f7f7f9;
}

tbody td {
    padding: 10px 15px;
    font-size: 14px;
    color: #333;
}

.col-matricula { font-weight: 600; color: #5A45FF; }
.col-nome { font-weight: 500; }
.text-center { text-align: center; }

/* --- Toggle Switch para Frequência --- */
.col-horario {
    position: relative;
    padding-top: 15px; /* Ajuste para o switch caber */
    padding-bottom: 15px;
}

.freq-control-group {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 45px;
  height: 25px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #F44336; /* Falta (Vermelho) */
  transition: 0.4s;
  border-radius: 25px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 19px;
  width: 19px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4CAF50; /* Presença (Verde) */
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.status-label {
    font-size: 14px;
    font-weight: 700;
    color: #F44336;
    width: 15px;
}

.status-label.status-presente {
    color: #4CAF50;
}

/* --- Botão Salvar (Reutilizando classes do seu CSS) --- */
.save-button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}

.btn-action {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 15px 30px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s, filter 0.1s;
    font-size: 16px;
    color: white;
    text-align: center;
}

.confirm-btn { /* Usando confirm-btn do seu modal CSS para o botão principal */
    background-color: #5A45FF;
}
.confirm-btn:hover:not(:disabled) {
    background-color: #4b36d9;
    filter: none;
}

.confirm-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    filter: none;
}

.btn-action .icone {
    font-size: 18px;
}

/* Responsividade */
@media (max-width: 768px) {
  .select-control {
    min-width: 100%;
  }
  
  .table-container {
    padding: 0;
  }
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>