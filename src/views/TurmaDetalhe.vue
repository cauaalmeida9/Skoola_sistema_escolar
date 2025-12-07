<template>
  <div class="turma-detalhe-page" v-if="turma">
    
    <div class="header">
      <router-link to="/turmas" class="back-link">
        <span class="icon ph-bold ph-arrow-left"></span>
        INFORMAÇÕES DA TURMA
      </router-link>
    </div>

    <div class="content-grid">

      <div class="alunos-participantes-card">
        <h3>Alunos Participantes</h3>
        
        <div class="search-box">
          <span class="icon ph-bold ph-magnifying-glass"></span>
          <input 
            type="text" 
            v-model="searchAluno" 
            placeholder="Pesquise pelo nome ou matrícula do aluno"
            @input="filtrarAlunos"
          >
          <button class="btn-filter">
            <span class="icon ph-bold ph-arrow-right"></span>
          </button>
        </div>

        <div class="student-list-container">
          <div 
            class="student-list-item" 
            v-for="aluno in alunosFiltrados" 
            :key="aluno.matricula"
          >
            <span class="matricula-col">{{ aluno.matricula }}</span>
            <span class="nome-col">{{ aluno.nome }}</span>
            <router-link 
              :to="{ name: 'DetalheAluno', params: { matricula: aluno.matricula } }" 
              class="btn-action"
            >
              <span class="icon ph-bold ph-arrow-right"></span>
            </router-link>
          </div>
        </div>

        <div v-if="alunosFiltrados.length === 0" class="empty-list">
          Nenhum aluno encontrado nesta turma ou no filtro.
        </div>
      </div>
      
      <div class="info-and-actions">
        
        <div class="informacoes-turma-card">
          <h3>Informações da Turma</h3>
          <p><strong>Id:</strong> {{ turma.id }}</p>
          <p><strong>Nome:</strong> {{ turma.nome }}</p>
          <p><strong>Semestre:</strong> {{ turma.semestre }}</p>
          <p><strong>Turno:</strong> {{ turma.turno }}</p>
          <p><strong>Docente:</strong> {{ turma.docenteNome }}</p>
          <p><strong>Quantidade de alunos:</strong> {{ turma.alunosSelecionados.length }} / {{ turma.qtdMaxima }}</p>
        </div>

        <div class="atividades-provas-card">
          <h3>Atividades e provas da turma</h3>
          <p class="placeholder-text">Nenhuma atividade registrada.</p>
        </div>

        <div class="action-buttons">
          <button class="btn-action-primary" @click="navigateTo('LancarAtividade')">
            Adicionar atividade/prova
          </button>
          <button class="btn-action-secondary" @click="navigateTo('LancarFrquencia')">
            Lançar Frequência
          </button>
          <button class="btn-action-secondary" @click="navigateTo('LancarNota')">
            Lançar Notas
          </button>
        </div>
      </div>
    </div>
    
  </div>
  <div v-else class="not-found">
    <h2>Turma Não Encontrada</h2>
    <p>O registro da turma é inválido ou ela foi excluída.</p>
    <router-link to="/turmas">Voltar para a Lista de Turmas</router-link>
  </div>
</template>

<script>
export default {
    name: 'TurmaDetalhe',
    
    // O nome da prop 'registro' DEVE ser igual ao parâmetro da rota que você configurou
    props: {
        registro: { 
            type: [String, Number],
            required: true
        }
    },
    
    data() {
        return {
            turma: null,
            alunosParticipantes: [], // Lista de objetos de aluno da turma
            alunosFiltrados: [],     // Lista de alunos após o filtro de busca
            searchAluno: "",
        };
    },
    
    watch: {
        // Recarrega os dados se a URL (e, portanto, a prop 'registro') mudar
        registro: 'carregarDadosDaTurma' 
    },

    mounted() {
        this.carregarDadosDaTurma(); 
    },
    
    methods: {
        carregarDadosDaTurma() {
            const idDaTurma = this.registro;

            if (!idDaTurma) {
                this.turma = null;
                return;
            }

            // 1. Busca a turma pelo registro
            const turmas = JSON.parse(localStorage.getItem("turmas")) || [];
            
            // É importante converter para String antes de comparar, pois Date.now() 
            // no localStorage é salvo como Number, mas pode vir como String da URL.
            const turmaEncontrada = turmas.find(t => String(t.registro) === String(idDaTurma));

            if (turmaEncontrada) {
                this.turma = turmaEncontrada;
                this.carregarAlunosDaTurma(); // Carrega os detalhes dos alunos
            } else {
                this.turma = null;
                this.alunosParticipantes = [];
                this.alunosFiltrados = [];
            }
        },
        
        carregarAlunosDaTurma() {
            if (!this.turma || !this.turma.alunosSelecionados) {
                this.alunosParticipantes = [];
                this.alunosFiltrados = [];
                return;
            }
            
            // 2. Filtra a lista global de alunos pelos IDs/matrículas da turma
            const todosAlunos = JSON.parse(localStorage.getItem("alunos")) || [];
            
            this.alunosParticipantes = todosAlunos.filter(aluno => 
                this.turma.alunosSelecionados.includes(aluno.matricula)
            );
            
            // Inicializa a lista filtrada com todos os alunos da turma
            this.alunosFiltrados = this.alunosParticipantes.slice();
            this.filtrarAlunos(); // Aplica o filtro se já houver termo de busca
        },
        
        filtrarAlunos() {
            const termo = (this.searchAluno || "").toLowerCase().trim();

            if (!termo) {
                this.alunosFiltrados = this.alunosParticipantes.slice();
            } else {
                this.alunosFiltrados = this.alunosParticipantes.filter(a => 
                    (a.nome || "").toLowerCase().includes(termo) ||
                    String(a.matricula || "").includes(termo)
                );
            }
        },
        
        // Função para navegar para as telas de ação da turma
        navigateTo(routeName) {
             // Redireciona para as rotas secundárias, passando o registro da turma
             // Note: Você pode precisar ajustar as suas rotas secundárias se elas não
             // estiverem configuradas corretamente para receber o 'registro'.
             
             // Baseado nas suas rotas: /turmas/detalheturma/lancarfrequencia, etc.
             // Como elas são filhas/relacionadas, vamos manter o padrão mais simples
             // ou usar o Vue Router's push completo se necessário.
             
             // Exemplo usando push completo (mais robusto):
             this.$router.push(`/${routeName.toLowerCase()}/${this.registro}`);
             
             // Se você estiver usando as rotas exatas que mandou, elas são mais complexas:
             /*
             if (routeName === 'LancarFrquencia') {
                 this.$router.push('/turmas/detalheturma/lancarfrequencia');
             } else if (routeName === 'LancarAtividade') {
                 this.$router.push('/turmas/detalheturma/lancaratividade');
             } else if (routeName === 'LancarNota') {
                 this.$router.push('/turmas/detalheturma/lancarnota');
             }
             */
             
             // Mantenha as rotas que você enviou se já estiverem funcionando.
             // Para simplificar e garantir a navegação:
             if (routeName === 'LancarFrquencia') {
                 this.$router.push('/turmas/detalheturma/lancarfrequencia');
             } else if (routeName === 'LancarAtividade') {
                 this.$router.push('/turmas/detalheturma/lancaratividade');
             } else if (routeName === 'LancarNota') {
                 this.$router.push('/turmas/detalheturma/lancarnota');
             }

        }
    }
};
</script>

<style scoped>
/* CORES PRINCIPAIS */
:root {
  --primary-color: #5A45FF;
  --secondary-color: #8e7aff;
  --text-dark: #333;
  --text-medium: #555;
  --background-light: #f7f7f7;
  --border-color: #e1e4e6;
}

.turma-detalhe-page, .not-found {
  padding: 20px;
  max-width: 1250px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

/* HEADER (Seta Voltar e Título) */
.header {
  margin-bottom: 25px;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text-dark);
  font-size: 20px;
  font-weight: 700;
  padding: 10px 15px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.back-link .icon {
    font-size: 24px;
    color: var(--primary-color);
}

/* GRID PRINCIPAL */
.content-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr; /* Mais espaço para a lista de alunos */
  gap: 25px;
}

/* ESTILOS DOS CARDS */
.alunos-participantes-card,
.informacoes-turma-card,
.atividades-provas-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color);
}

.alunos-participantes-card h3,
.informacoes-turma-card h3,
.atividades-provas-card h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: var(--secondary-color);
  font-size: 18px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
}

/* INFORMAÇÕES DA TURMA */
.informacoes-turma-card p {
    margin-bottom: 8px;
    font-size: 15px;
    color: var(--text-medium);
}
.informacoes-turma-card p strong {
    color: var(--text-dark);
}

/* COLUNA DA DIREITA */
.info-and-actions {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.atividades-provas-card {
    flex-grow: 1; /* Ocupa o espaço restante */
}

.placeholder-text {
    color: #999;
    font-style: italic;
    font-size: 14px;
}

/* --- ESTILO DA BUSCA DE ALUNOS (Copiado de NovaTurmas.vue) --- */
.search-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: var(--background-light);
    border: 1px solid #dcdcdc;
    border-radius: 8px;
    padding: 0 10px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.03);
    margin-bottom: 15px;
}
.search-box input {
    flex-grow: 1;
    border: none;
    padding: 10px 0;
    box-shadow: none;
    font-size: 14px;
    background-color: transparent;
    outline: none;
}
.search-box .icon {
    color: var(--secondary-color);
    font-size: 18px;
}
.btn-filter {
    background: transparent;
    border: none;
    padding: 3px 9px;
    cursor: pointer;
    color: var(--primary-color);
    margin-right: -5px;
}
.btn-filter .icon {
    color: var(--primary-color);
}
/* --- FIM ESTILO DA BUSCA --- */


/* LISTA DE ALUNOS */
.student-list-container {
  max-height: 400px; 
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 5px;
}
.student-list-item {
  display: grid;
  grid-template-columns: 80px 1fr max-content;
  gap: 10px;
  padding: 10px 12px;
  background: var(--background-light);
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  align-items: center;
  transition: background 0.2s;
}
.student-list-item:hover {
    background: #e9e5ff; /* Fundo mais escuro no hover */
}
.student-list-item .matricula-col {
  font-size: 13px;
  font-weight: 700;
  color: var(--primary-color);
}
.student-list-item .nome-col {
  font-weight: 500;
  color: var(--text-dark);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btn-action {
    background: var(--secondary-color);
    border: none;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    font-size: 18px;
    text-decoration: none; /* Para usar em router-link */
}
.btn-action:hover {
    background: var(--primary-color);
}
.empty-list {
  text-align: center;
  padding: 20px;
  color: #999;
  font-style: italic;
  font-size: 14px;
}

/* BOTÕES DE AÇÃO (Lançamentos) */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-action-primary,
.btn-action-secondary {
  width: 100%;
  padding: 15px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-action-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-action-primary:hover {
  background-color: #4a38cc;
}

.btn-action-secondary {
  background-color: var(--secondary-color);
  color: white;
}

.btn-action-secondary:hover {
  background-color: var(--primary-color);
}

/* RESPONSIVIDADE */
@media (max-width: 900px) {
    .content-grid {
        grid-template-columns: 1fr; /* Colunas empilhadas em telas menores */
    }
}
</style>