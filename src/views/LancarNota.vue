<template>
  <div class="page-container">
    <div class="header">
      <span class="icone ph-bold ph-arrow-left" @click="$router.back()"></span>
      <h2>LANÇAR NOTAS</h2>
    </div>

    <div v-if="!turma" class="empty-state">
      <span class="icone ph-bold ph-smiley-sad"></span>
      <p>Turma não encontrada. Verifique o registro.</p>
    </div>

    <div v-else class="content-wrapper">
      <div class="controls-bar">
        <div class="control-group">
          <label for="selectAtividade">Selecione a atividade</label>
          <select 
            id="selectAtividade" 
            v-model="atividadeSelecionadaId"
            class="select-control"
            :disabled="turma.atividades.length === 0"
          >
            <option :value="null" disabled>
              {{ turma.atividades.length > 0 ? 'Selecione uma atividade' : 'Nenhuma atividade cadastrada' }}
            </option>
            <option 
              v-for="atividade in turma.atividades" 
              :key="atividade.id" 
              :value="atividade.id"
            >
              {{ atividade.nome }} (Máx: {{ atividade.notaMaxima }})
            </option>
          </select>
        </div>

        <div class="control-group search-group">
          <label for="searchAluno">Pesquisar aluno</label>
          <div class="search-box">
            <span class="icone ph-bold ph-magnifying-glass"></span>
            <input
              id="searchAluno"
              type="text"
              v-model="searchQuery"
              placeholder="Pesquise pelo nome ou matrícula do aluno"
            />
          </div>
        </div>
      </div>

      <div class="table-card info-card">
        <h3>Alunos Participantes: Lançamento de Notas</h3>
        
        <p v-if="turma.atividades.length === 0" class="content-text-center">
            A turma não possui atividades cadastradas. Cadastre uma em Detalhes da Turma.
        </p>
        <p v-else-if="!atividadeSelecionada" class="content-text-center">
            **Selecione uma atividade acima para lançar as notas.**
        </p>
        <p v-else-if="alunosDaTurmaFiltrados.length === 0" class="content-text-center">
            Nenhum aluno encontrado ou corresponde à pesquisa.
        </p>

        <div v-else class="table-container">
          <table>
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Nome do Aluno</th>
                <th>Nota Mínima</th>
                <th>Nota Máxima</th>
                <th>Nota do Aluno</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="aluno in alunosDaTurmaFiltrados" 
                :key="aluno.matricula"
              >
                <td>{{ aluno.matricula }}</td>
                <td>{{ aluno.nome }}</td>
                <td>{{ atividadeSelecionada.notaMinima }}</td>
                <td>{{ atividadeSelecionada.notaMaxima }}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    :max="atividadeSelecionada.notaMaxima"
                    step="0.01"
                    v-model.number="alunoNotas[aluno.matricula].nota"
                    class="input-nota"
                  />
                </td>
                <td>
                  <span 
                    :class="['status-badge', getStatusClass(aluno.matricula)]"
                  >
                    {{ getStatusText(aluno.matricula) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="save-button-container">
        <button 
          class="btn-salvar-nota" 
          :disabled="!atividadeSelecionadaId"
          @click="salvarNotas"
        >
          Salvar Notas
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // O nome do componente deve ser LancarNotas, LancarNota ou o que você usou na rota
  name: 'LancarNotas', 
  data() {
    return {
      turma: null,
      alunos: [],
      turmaRegistro: null,
      searchQuery: '',
      atividadeSelecionadaId: null,
      alunoNotas: {}, 
    };
  },

  computed: {
    atividadeSelecionada() {
      if (!this.turma || !this.turma.atividades || !this.atividadeSelecionadaId) {
        return null;
      }
      return this.turma.atividades.find(a => String(a.id) === String(this.atividadeSelecionadaId));
    },

    alunosDaTurmaFiltrados() {
      if (!this.alunos) return [];
      const query = this.searchQuery.toLowerCase();
      
      return this.alunos.filter(aluno => {
        return aluno.nome.toLowerCase().includes(query) || 
               String(aluno.matricula).includes(query);
      });
    }
  },

  watch: {
    atividadeSelecionadaId(newId) {
      if (newId) {
        this.inicializarNotas();
      } else {
        this.alunoNotas = {};
      }
    }
  },

  mounted() {
    // ⭐️ CORREÇÃO CHAVE: Garante que o registro é carregado da rota imediatamente
    this.turmaRegistro = this.$route.params.registro;
    this.carregarDadosTurma();
  },

  methods: {
    carregarDadosTurma() {
      // Usa o registro capturado no mounted
      const registroParaBuscar = this.turmaRegistro; 

      if (!registroParaBuscar) {
        this.turma = null; 
        return;
      }
      
      const turmas = JSON.parse(localStorage.getItem('turmas') || '[]');
      const alunosData = JSON.parse(localStorage.getItem('alunos') || '[]');

      // ⭐️ CORREÇÃO CHAVE: Garante que a comparação de registro é sempre string vs string
      this.turma = turmas.find(t => String(t.registro) === String(registroParaBuscar));

      if (this.turma) {
        // Carrega alunos da turma
        const matriculas = Array.isArray(this.turma.alunosSelecionados) ? this.turma.alunosSelecionados : [];
        this.alunos = matriculas
          .map(matricula => alunosData.find(a => String(a.matricula) === String(matricula)))
          .filter(Boolean);
          
        // Garante que atividades e notas existam (inicializa se nulo/undefined)
        this.turma.atividades = this.turma.atividades || [];
        this.turma.notas = this.turma.notas || {};
        
        // Se houver atividades, tenta selecionar a primeira automaticamente
        if (this.turma.atividades.length > 0) {
            this.atividadeSelecionadaId = this.turma.atividades[0].id;
        } else {
             this.atividadeSelecionadaId = null;
        }
        
      } else {
        // Se a turma não for encontrada no LocalStorage, define como null para exibir o erro
        this.turma = null;
      }
    },
    
    inicializarNotas() {
      // ... (lógica de inicialização mantida) ...
      if (!this.atividadeSelecionadaId || !this.turma) return;
      
      const notasAtuais = this.turma.notas[this.atividadeSelecionadaId] || {};
      
      const novoAlunoNotas = {};
      
      this.alunos.forEach(aluno => {
        const matricula = String(aluno.matricula);
        // Tenta carregar a nota existente, senão define como 0
        const notaExistente = notasAtuais[matricula] !== undefined ? notasAtuais[matricula] : 0;
        
        novoAlunoNotas[matricula] = {
          nota: parseFloat(notaExistente) // Garante que é um número
        };
      });
      
      this.alunoNotas = novoAlunoNotas;
    },
    
    // ... (Métodos getStatusClass e getStatusText mantidos) ...
    getStatusClass(matricula) {
      const nota = this.alunoNotas[matricula]?.nota;
      const minima = this.atividadeSelecionada?.notaMinima;
      
      if (minima === undefined || nota === undefined || nota === null || nota === '') return 'status-default';
      
      return nota >= minima ? 'status-aprovado' : 'status-reprovado';
    },

    getStatusText(matricula) {
      const nota = this.alunoNotas[matricula]?.nota;
      const minima = this.atividadeSelecionada?.notaMinima;
      
      if (minima === undefined || nota === undefined || nota === null || nota === '') return 'Aguardando Nota';
      
      return nota >= minima ? 'Aprovado' : 'Reprovado';
    },

    // ... (Método salvarNotas mantido) ...
    salvarNotas() {
      if (!this.atividadeSelecionadaId) {
        alert("Selecione uma atividade para salvar as notas.");
        return;
      }
      
      const notasParaSalvar = {};
      const notaMaxima = this.atividadeSelecionada.notaMaxima;
      let notasInvalidas = false;

      for (const matricula in this.alunoNotas) {
        let nota = this.alunoNotas[matricula].nota;
        
        if (nota === null || nota === '') {
            nota = 0;
        }
        
        if (nota > notaMaxima) {
            // Buscando o nome do aluno para a mensagem de erro
            const alunoNome = this.alunos.find(a => String(a.matricula) === String(matricula))?.nome || 'Aluno Desconhecido';
            alert(`Erro: A nota de ${alunoNome} (${nota}) excede a nota máxima de ${notaMaxima}.`);
            notasInvalidas = true;
            break;
        }
        
        notasParaSalvar[matricula] = parseFloat(nota);
      }
      
      if (notasInvalidas) return;
      
      let turmas = JSON.parse(localStorage.getItem('turmas') || '[]');
      const turmaIndex = turmas.findIndex(t => String(t.registro) === String(this.turmaRegistro));

      if (turmaIndex !== -1) {
        if (!turmas[turmaIndex].notas) {
          turmas[turmaIndex].notas = {};
        }
        turmas[turmaIndex].notas[this.atividadeSelecionadaId] = notasParaSalvar;

        localStorage.setItem('turmas', JSON.stringify(turmas));
        
        // Atualiza o objeto local
        this.turma.notas = turmas[turmaIndex].notas; 
        
        alert("Notas salvas com sucesso!");
      } else {
        alert("Erro: Turma não encontrada para salvar notas.");
      }
    }
  }
};
</script>

<style scoped>
/* Os estilos (CSS) foram mantidos iguais aos que forneci anteriormente. */
.page-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}
/* ... (Resto dos estilos, garantindo que estejam todos presentes) ... */

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
.info-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e1e4e6;
  margin-top: 20px;
}
.info-card h3 {
  font-size: 16px;
  font-weight: 700;
  color: #5A45FF;
  margin-bottom: 15px;
}
.content-text-center {
    color: #999;
    font-style: italic;
    text-align: center;
    padding: 20px;
    border: 1px dashed #e1e4e6;
    border-radius: 8px;
}

/* --- Estilos da Barra de Controles --- */
.controls-bar {
  display: flex;
  gap: 20px;
  align-items: flex-end; /* Alinha os controles pela base */
  background: #f7f7f9;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.control-group {
  display: flex;
  flex-direction: column;
  min-width: 250px;
}

.control-group label {
  font-size: 13px;
  font-weight: 600;
  color: #4b4b63;
  margin-bottom: 5px;
}

.select-control {
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
}

.search-group {
    flex-grow: 1;
    min-width: 300px;
}

.search-box {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px 12px;
  background-color: white;
}

.search-box .icone {
  font-size: 18px;
  color: #999;
  margin-right: 8px;
}

.search-box input {
  border: none;
  background: transparent;
  width: 100%;
  font-size: 14px;
  color: #333;
}

.search-box input:focus {
  outline: none;
}


/* --- Estilos da Tabela --- */
.table-container {
    overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

thead th {
  background-color: #5A45FF;
  color: white;
  padding: 12px 15px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
}

tbody tr {
  border-bottom: 1px solid #eee;
  transition: background-color 0.1s;
}

tbody tr:hover {
  background-color: #f9f8ff;
}

tbody td {
  padding: 12px 15px;
  font-size: 14px;
  color: #333;
}

.input-nota {
  width: 80px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  transition: border-color 0.2s;
}

.input-nota:focus {
  border-color: #5A45FF;
  outline: none;
}

/* --- Estilos de Status --- */
.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 12px;
  color: white;
  text-align: center;
  min-width: 80px;
}

.status-aprovado {
  background-color: #4CAF50; /* Verde */
}

.status-reprovado {
  background-color: #F44336; /* Vermelho */
}

.status-default {
    background-color: #9e9e9e; /* Cinza */
}


/* --- Estilos do Botão Salvar --- */
.save-button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.btn-salvar-nota {
  padding: 15px 30px;
  background-color: #5A45FF;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-salvar-nota:hover:not(:disabled) {
  background-color: #4b36d9;
}

.btn-salvar-nota:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Responsividade */
@media (max-width: 768px) {
  .controls-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .control-group {
    min-width: 100%;
  }
  table {
    display: block;
    overflow-x: auto;
  }
}
</style>