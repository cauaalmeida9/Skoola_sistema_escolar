<template>
  <div class="page-container">
    <div class="header">
      <span class="icone ph-bold ph-arrow-left" @click="$router.back()"></span>
      <h2>INFORMAÇÕES DA TURMA</h2>
    </div>

    <div v-if="!turma" class="empty-state">
      <span class="icone ph-bold ph-smiley-sad"></span>
      <p>Turma não encontrada. Verifique o registro.</p>
    </div>

    <div v-else class="content-grid">
      <div class="left-column">
        <div class="info-card alunos-card">
          <h3>Alunos Participantes</h3>

          <div class="search-filter-area">
            <div class="search-box">
              <span class="icone ph-bold ph-magnifying-glass"></span>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Pesquise pelo nome ou matrícula do aluno"
              >
            </div>
          </div>

          <div class="alunos-list-container">
            <div v-if="filteredAlunos.length > 0">
              <div
                class="aluno-row"
                v-for="aluno in filteredAlunos"
                :key="aluno.matricula"
              >
                <div class="aluno-info-text">
                  <span class="aluno-matricula">{{ aluno.matricula }}</span>
                  <span class="aluno-nome">{{ aluno.nome }}</span>
                </div>
                <button class="aluno-action-btn" @click="$router.push(`/alunos/detalhealuno/${aluno.matricula}`)">
                  <span class="icone ph-bold ph-arrow-right"></span>
                </button>
              </div>
            </div>
            <p v-else class="content-text">Nenhum aluno encontrado ou corresponde à pesquisa.</p>
          </div>
        </div>

        <div class="info-card activities-card">
          <h3>Atividades e provas da turma</h3>

          <div v-if="turma.atividades && turma.atividades.length > 0" class="activities-list">
            <div v-for="atividade in turma.atividades" :key="atividade.id" class="activity-row">
              <div class="activity-info-text">
                <span class="activity-name">{{ atividade.nome }}</span>
                <span class="activity-grade">
                  (Mín. p/ Aprov.: {{ atividade.notaMinima }} / Máx.: {{ atividade.notaMaxima }} pontos)
                </span>
              </div>
              <span class="activity-date">Entrega: {{ formatarData(atividade.dataEntrega) }}</span>
            </div>
          </div>

          <p v-else class="content-text">
            Nenhum dado de atividade disponível. Clique em "Adicionar atividade/prova" na lateral para gerenciar.
          </p>
        </div>
      </div>

      <div class="right-column">

        <div class="info-card compact-card class-info-card">
          <h3>Informações da Turma</h3>
          <div class="data-group">
            <p><span class="label">Id:</span> <strong class="value">{{ turma.registro }}</strong></p>
            <p><span class="label">Nome:</span> <strong class="value">{{ turma.nome }}</strong></p>
            <p><span class="label">Semestre:</span> <strong class="value">{{ turma.semestre }}</strong></p>
            <p><span class="label">Turno:</span> <strong class="value">{{ turma.turno }}</strong></p>
            <p><span class="label">Docente:</span> <strong class="value">{{ turma.docenteNome || turma.docente }}</strong></p>
            <p><span class="label">Quantidade de alunos:</span> <strong class="value">{{ alunos.length }} Alunos</strong></p>
          </div>
        </div>

        <div class="action-buttons-vertical">
          <button
            class="btn-action primary-btn"
            @click="showAddAlunoModal = true"
          >
            Adicionar Aluno à Turma
          </button>
          <button
            class="btn-action secondary-btn"
            @click="$router.push(`/turmas/detalheturma/lancaratividade/${turma.registro}`)"
          >
            Adicionar atividade/prova </button>
          <button class="btn-action secondary-btn"
          @click="$router.push(`/turmas/detalheturma/lancarfrequencia/${turma.registro}`)">Lançar Frequência</button>

          <button
            class="btn-action secondary-btn"
            @click="$router.push(`/turmas/detalheturma/lancarnota/${turma.registro}`)"
          >
            Lançar Notas
          </button>
          <button
            class="btn-action secondary-btn"
            @click="showRemoveAlunoModal = true"
          >
            Remover aluno da turma
          </button>

        </div>
      </div>
    </div>

    <div class="modal-overlay" v-if="showAddAlunoModal" @click.self="showAddAlunoModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Adicionar Alunos à Turma {{ turma.nome }}</h3>
          <span class="close-btn ph-bold ph-x" @click="showAddAlunoModal = false"></span>
        </div>

        <div class="modal-body">
          <div class="search-box-modal">
            <span class="icone ph-bold ph-magnifying-glass"></span>
            <input
              type="text"
              v-model="modalSearchQuery"
              placeholder="Pesquisar por nome ou matrícula"
            >
          </div>

          <div class="alunos-disponiveis-list">
            <p v-if="filteredAlunosDisponiveis.length === 0" class="content-text">
                Nenhum aluno disponível corresponde à pesquisa ou todos já estão na turma.
            </p>
            <div
              class="aluno-selection-row"
              v-for="aluno in filteredAlunosDisponiveis"
              :key="aluno.matricula"
            >
              <div class="aluno-info-text">
                <span class="aluno-matricula">{{ aluno.matricula }}</span>
                <span class="aluno-nome">{{ aluno.nome }}</span>
              </div>

              <label class="checkbox-container">
                <input
                  type="checkbox"
                  :value="aluno.matricula"
                  v-model="selectedAlunosToAdd"
                >
                <span class="checkmark"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            class="btn-modal cancel-btn"
            @click="showAddAlunoModal = false"
          >
            Cancelar
          </button>
          <button
            class="btn-modal confirm-btn"
            :disabled="selectedAlunosToAdd.length === 0"
            @click="adicionarAlunos"
          >
            Adicionar {{ selectedAlunosToAdd.length }} Aluno(s)
          </button>
        </div>
      </div>
    </div>
    
    <div class="modal-overlay" v-if="showRemoveAlunoModal" @click.self="showRemoveAlunoModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Remover Alunos da Turma {{ turma.nome }}</h3>
          <span class="close-btn ph-bold ph-x" @click="showRemoveAlunoModal = false"></span>
        </div>

        <div class="modal-body">
          <div class="search-box-modal">
            <span class="icone ph-bold ph-magnifying-glass"></span>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Pesquisar por nome ou matrícula para remover"
            >
          </div>

          <div class="alunos-disponiveis-list">
            <p v-if="filteredAlunos.length === 0" class="content-text">
                Nenhum aluno encontrado na turma ou corresponde à pesquisa.
            </p>
            <div
              class="aluno-selection-row"
              v-for="aluno in filteredAlunos"
              :key="aluno.matricula"
            >
              <div class="aluno-info-text">
                <span class="aluno-matricula">{{ aluno.matricula }}</span>
                <span class="aluno-nome">{{ aluno.nome }}</span>
              </div>

              <label class="checkbox-container">
                <input
                  type="checkbox"
                  :value="aluno.matricula"
                  v-model="selectedAlunosToRemove"
                >
                <span class="checkmark"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            class="btn-modal cancel-btn"
            @click="showRemoveAlunoModal = false"
          >
            Cancelar
          </button>
          <button
            class="btn-modal confirm-btn"
            :disabled="selectedAlunosToRemove.length === 0"
            @click="removerAlunos"
          >
            Remover {{ selectedAlunosToRemove.length }} Aluno(s)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      turma: null,
      alunos: [], // Alunos ATUALMENTE na turma
      searchQuery: '',

      // VARIÁVEIS PARA O MODAL DE ADICIONAR
      showAddAlunoModal: false,
      todosAlunosSistema: [], // Todos os alunos disponíveis no sistema
      modalSearchQuery: '',
      selectedAlunosToAdd: [], // Matrículas dos alunos selecionados no modal

      // ⭐ NOVO: VARIÁVEIS PARA O MODAL DE REMOVER
      showRemoveAlunoModal: false, // Controla a exibição do modal de remoção
      selectedAlunosToRemove: [],  // Matrículas dos alunos selecionados para remoção
    };
  },

  computed: {
    // 1. Filtra alunos que JÁ ESTÃO na turma (para exibição principal e modal de REMOÇÃO)
    filteredAlunos() {
      if (!this.searchQuery) {
        return this.alunos;
      }
      const query = this.searchQuery.toLowerCase();
      return this.alunos.filter(aluno => {
        return aluno.nome.toLowerCase().includes(query) ||
               String(aluno.matricula).includes(query);
      });
    },

    // 2. Filtra alunos DISPONÍVEIS para serem adicionados no modal
    filteredAlunosDisponiveis() {
        // Encontra as matrículas dos alunos que JÁ estão na turma
        const alunosNaTurma = this.alunos.map(a => String(a.matricula));

        // 1. Filtra todos os alunos para remover os que já estão na turma
        let disponiveis = this.todosAlunosSistema.filter(aluno =>
            !alunosNaTurma.includes(String(aluno.matricula))
        );

        // 2. Aplica a pesquisa do modal
        if (!this.modalSearchQuery) {
            return disponiveis;
        }

        const query = this.modalSearchQuery.toLowerCase();
        return disponiveis.filter(aluno => {
            return aluno.nome.toLowerCase().includes(query) ||
                   String(aluno.matricula).includes(query);
        });
    }
  },

  mounted() {
    // ⭐ MUDANÇA: Agora depende APENAS do parâmetro da rota.
    const registro = this.$route.params.registro;
    this.carregarDados(registro);
   },

  watch: {
    // Reage a mudanças de rota para carregar dados da turma correta
    '$route': 'carregarDados',
  },

  methods: {
    formatarData(dataISO) {
      if (!dataISO) return 'N/A';
      try {
          const [ano, mes, dia] = dataISO.split('-');
          return `${dia}/${mes}/${ano}`;
      } catch (e) {
          return dataISO;
      }
    },

    navegarParaLancamentoNotas() {
        this.$router.push({
            // Path configurado na sua rota
            path: '/turmas/detalheturma/lancarnota',
            query: {
                registroTurma: this.turma.registro
            }
        });
    },

    carregarDados(registro) {
      const currentRegistro = registro || this.$route.params.registro;

      // Adiciona a checagem inicial para registro inválido/nulo
      if (!currentRegistro) {
        this.turma = null;
        this.alunos = [];
        return;
      }

      const turmas = JSON.parse(localStorage.getItem('turmas') || '[]');
      const alunosData = JSON.parse(localStorage.getItem('alunos') || '[]');

      this.todosAlunosSistema = alunosData;
      // Busca apenas a turma cadastrada
      this.turma = turmas.find(t => String(t.registro) === String(currentRegistro));

      if (this.turma) {
        if (Array.isArray(this.turma.alunosSelecionados)) {
          this.alunos = this.turma.alunosSelecionados
            .map(matricula => alunosData.find(a => String(a.matricula) === String(matricula)))
              .filter(Boolean);
           } else {
              this.alunos = []; // Novo ajuste
            }
        // ✅ GARANTE QUE ATIVIDADES É SEMPRE UM ARRAY
        this.turma.atividades = this.turma.atividades || [];
      } else {
        this.alunos = []; // Limpa alunos se a turma não for encontrada
      }
    },

    adicionarAlunos() {
      if (this.selectedAlunosToAdd.length === 0) return;

      const novosAlunosData = this.selectedAlunosToAdd
          .map(matricula => this.todosAlunosSistema.find(a => String(a.matricula) === String(matricula)))
          .filter(Boolean);

      // Adiciona os objetos completos à lista de exibição
      this.alunos.push(...novosAlunosData);

      const novasMatriculas = this.selectedAlunosToAdd;
      // Adiciona as matrículas ao registro da turma
      this.turma.alunosSelecionados = Array.isArray(this.turma.alunosSelecionados)
          ? [...this.turma.alunosSelecionados, ...novasMatriculas]
          : [...novasMatriculas];

      // PERSISTÊNCIA no localStorage
      let todasTurmas = JSON.parse(localStorage.getItem('turmas') || '[]');
      const turmaIndex = todasTurmas.findIndex(t => String(t.registro) === String(this.turma.registro));

      if (turmaIndex !== -1) {
          todasTurmas[turmaIndex].alunosSelecionados = this.turma.alunosSelecionados;
          // Garante que o array atividades está sendo preservado na persistência
          todasTurmas[turmaIndex].atividades = this.turma.atividades || [];
      }

      localStorage.setItem('turmas', JSON.stringify(todasTurmas));

      this.selectedAlunosToAdd = [];
      this.showAddAlunoModal = false;
      this.modalSearchQuery = '';
      alert(`${novosAlunosData.length} alunos adicionados à turma!`);
    },
    
    // ⭐ NOVO MÉTODO PARA REMOVER ALUNOS
    removerAlunos() {
        if (this.selectedAlunosToRemove.length === 0) return;

        const matriculasParaRemover = this.selectedAlunosToRemove.map(String);

        // 1. Atualiza a lista de alunos da turma (this.alunos) - remove os selecionados
        this.alunos = this.alunos.filter(aluno =>
            !matriculasParaRemover.includes(String(aluno.matricula))
        );

        // 2. Atualiza a lista de matrículas salvas na turma (this.turma.alunosSelecionados)
        this.turma.alunosSelecionados = (this.turma.alunosSelecionados || []).filter(matricula =>
            !matriculasParaRemover.includes(String(matricula))
        );

        // 3. PERSISTÊNCIA no localStorage
        let todasTurmas = JSON.parse(localStorage.getItem('turmas') || '[]');
        const turmaIndex = todasTurmas.findIndex(t => String(t.registro) === String(this.turma.registro));

        if (turmaIndex !== -1) {
            todasTurmas[turmaIndex].alunosSelecionados = this.turma.alunosSelecionados;
            todasTurmas[turmaIndex].atividades = this.turma.atividades || [];
        }

        localStorage.setItem('turmas', JSON.stringify(todasTurmas));

        // 4. Limpa e fecha o modal
        const count = this.selectedAlunosToRemove.length;
        this.selectedAlunosToRemove = [];
        this.showRemoveAlunoModal = false;
        alert(`${count} aluno(s) removido(s) da turma!`);
    }
  }
};
</script>

<style scoped>
/* A seção de estilos (style scoped) não precisa de alterações funcionais para o modal de remoção, pois a classe modal-overlay, modal-content, etc. e os estilos de checkbox já existem e foram reutilizados no novo modal. */
/* ... (Estilos mantidos exatamente como estavam no código original) ... */
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

.content-grid {
    display: grid;
    grid-template-columns: 3fr 1.5fr;
    gap: 20px;
}

.left-column {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.right-column {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.info-card {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    border: 1px solid #e1e4e6;
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

.class-info-card {
    background-color: #f9f8ff;
    border: 1px solid #e9e5ff;
}
.class-info-card h3 {
    color: #5A45FF;
    font-size: 18px;
}

.data-group p {
    margin: 8px 0;
    font-size: 14px;
    line-height: 1.5;
}
.label {
    font-weight: 600;
    color: #4b4b63;
    margin-right: 5px;
}
.value {
    color: #000000;
    font-weight: 400;
}

.action-buttons-vertical {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.btn-action {
    padding: 15px 18px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 14px;
    color: white;
    text-align: center;
}

.primary-btn {
    background-color: #8e7aff;
}
.secondary-btn {
    background-color: #b197ff;
}

.btn-action:hover {
    filter: brightness(0.9);
}

.alunos-card h3 {
    margin-bottom: 5px;
}

.search-filter-area {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.search-box {
    flex-grow: 1;
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 8px 12px;
    background-color: #f0f0f4;
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

.filter-btn, .add-btn {
    border: none;
    padding: 10px 14px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.filter-btn {
    background-color: #f0f0f4;
    border: 1px solid #ccc;
}
.filter-btn .icone {
    color: #999;
    font-size: 18px;
}

.add-btn {
    background-color: #8e7aff;
}
.add-btn .icone {
    color: white;
    font-size: 18px;
}

.filter-btn:hover { background-color: #e0e0e4; }
.add-btn:hover { background-color: #7a6eff; }


.aluno-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 12px 15px;
    margin-bottom: 8px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #eee;
}

.aluno-info-text {
    display: flex;
    gap: 20px;
    align-items: center;
}

.aluno-matricula {
    font-weight: 600;
    color: #5A45FF;
    font-size: 14px;
    min-width: 70px;
}

.aluno-nome {
    font-weight: 500;
    color: #333;
    font-size: 15px;
}

.aluno-action-btn {
    background-color: #b197ff;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
}
.aluno-action-btn .icone {
    color: white;
    font-size: 16px;
}
.aluno-action-btn:hover {
    background-color: #8e7aff;
}

/* ✅ ESTILOS PARA LISTA DE ATIVIDADES */
.activities-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.activity-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background-color: #f7f7f9;
    border-radius: 8px;
    border-left: 4px solid #5A45FF; /* Linha de destaque */
}

.activity-info-text {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.activity-name {
    font-weight: 600;
    color: #333;
    font-size: 15px;
}

.activity-grade {
    font-size: 12px;
    color: #8e7aff;
    font-weight: 500;
}

.activity-date {
    font-size: 13px;
    color: #666;
    font-weight: 500;
    white-space: nowrap; /* Evita quebra de linha na data */
}

.activities-card h3 {
    font-size: 16px;
    color: #4b4b63;
}

@media (max-width: 990px) {
    .content-grid {
        grid-template-columns: 1fr;
    }

    .left-column { order: 1; }
    .right-column { order: 2; }
}

@media (max-width: 600px) {
    .search-filter-area {
        flex-wrap: wrap;
    }
    .search-box {
        flex-basis: 100%;
    }
    .filter-btn, .add-btn {
        flex-grow: 1;
    }
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    max-height: 80vh;
    overflow: hidden;
}

.modal-header {
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    font-size: 18px;
    color: #5A45FF;
}

.close-btn {
    font-size: 20px;
    color: #999;
    cursor: pointer;
    transition: color 0.2s;
}
.close-btn:hover {
    color: #5A45FF;
}

.modal-body {
    padding: 20px;
    overflow-y: auto;
    flex-grow: 1;
}

.modal-footer {
    padding: 15px 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.search-box-modal {
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 8px 12px;
    background-color: #f7f7f9;
    margin-bottom: 15px;
}
.search-box-modal input {
    border: none;
    background: transparent;
    width: 100%;
    font-size: 14px;
}
.search-box-modal .icone {
    color: #999;
    margin-right: 8px;
}

.alunos-disponiveis-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.aluno-selection-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background-color: #fff;
    border: 1px solid #e9e5ff;
    border-radius: 8px;
}
.aluno-selection-row .aluno-info-text {
    gap: 10px;
}

.btn-modal {
    padding: 10px 18px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 14px;
    border: none;
}
.cancel-btn {
    background-color: #e0e0e4;
    color: #4b4b63;
}
.confirm-btn {
    background-color: #5A45FF;
    color: white;
}
.confirm-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.checkbox-container {
    display: block;
    position: relative;
    padding-left: 30px;
    margin-bottom: 0;
    cursor: pointer;
    font-size: 14px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: #eee;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.checkbox-container input:checked ~ .checkmark {
    background-color: #5A45FF;
    border-color: #5A45FF;
}

.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
    display: block;
}

.checkbox-container .checkmark:after {
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
}

@media (max-width: 600px) {
    .modal-footer {
        flex-direction: column-reverse;
    }
    .btn-modal {
        width: 100%;
    }
}
</style>