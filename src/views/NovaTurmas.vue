<template>
  <div class="page-container">
    <div class="header">
      
      <h2>Cadastro de Nova Turma</h2>
    </div>

    <form class="form-container" @submit.prevent="submitForm">

      <h3 class="section-title">Informações da turma</h3>

      <div class="grid main-grid">

        <div class="column-left">
          
          <div class="form-group">
            <label>ID</label>
            <input 
              type="text" 
              v-model="form.id" 
              placeholder="ID (Opcional, gerado automaticamente se vazio)"
            >
          </div>
          
          <div class="form-group">
            <label>Nome da turma*</label>
            <input 
              type="text" 
              v-model="form.nome"
              @blur="validateField('nome', form.nome, 'Informe o nome da turma')"
              :class="{ error: errors['nome'] }"
              placeholder="Informe o nome da turma"
            >
            <span v-if="errors['nome']" class="error-message">{{ errors['nome'] }}</span>
          </div>
          
          <div class="form-group">
            <label>Semestre*</label>
            <input 
              type="text" 
              v-model="form.semestre"
              @blur="validateField('semestre', form.semestre, 'Informe o semestre')"
              :class="{ error: errors['semestre'] }"
              placeholder="Ex: 2025.1"
            >
            <span v-if="errors['semestre']" class="error-message">{{ errors['semestre'] }}</span>
          </div>

          <div class="form-group">
            <label>Turno*</label>
            <input 
              type="text" 
              v-model="form.turno"
              @blur="validateField('turno', form.turno, 'Informe o turno')"
              :class="{ error: errors['turno'] }"
              placeholder="Ex: Vespertino, Noturno"
            >
            <span v-if="errors['turno']" class="error-message">{{ errors['turno'] }}</span>
          </div>

          <div class="form-group">
            <label>Docente*</label>
            <select 
              v-model="form.docenteRegistro"
              @blur="validateField('docenteRegistro', form.docenteRegistro, 'Selecione o docente')"
              :class="{ error: errors['docenteRegistro'] }"
            >
              <option disabled value="">Selecione o docente</option>
              <option 
                v-for="professor in professores" 
                :key="professor.registro" 
                :value="professor.registro"
              >
                {{ professor.nome }}
              </option>
            </select>
            <span v-if="errors['docenteRegistro']" class="error-message">{{ errors['docenteRegistro'] }}</span>
          </div>

          <div class="form-group group-inline">
            <div class="sub-group">
              <label>Idade Mínima</label>
              <input 
                type="number" 
                v-model.number="form.idadeMinima" 
                @blur="validateForm"
                :class="{ error: errors['idadeMinima'] }"
                placeholder="Mínimo"
              >
              <span v-if="errors['idadeMinima']" class="error-message">{{ errors['idadeMinima'] }}</span>
            </div>
            <div class="sub-group">
              <label>Idade Máxima</label>
              <input 
                type="number" 
                v-model.number="form.idadeMaxima" 
                @blur="validateForm"
                :class="{ error: errors['idadeMaxima'] }"
                placeholder="Máximo"
              >
              <span v-if="errors['idadeMaxima']" class="error-message">{{ errors['idadeMaxima'] }}</span>
            </div>
          </div>
        </div>


        <div class="column-right">
          
          <div class="form-group group-inline limits-top">
            <div class="sub-group">
              <label>Quantidade Mínima de Alunos*</label>
              <input 
                type="number" 
                v-model.number="form.qtdMinima" 
                @blur="validateField('qtdMinima', form.qtdMinima, 'Mínimo de alunos')"
                :class="{ error: errors['qtdMinima'] }"
                placeholder="Ex: 10"
              >
              <span v-if="errors['qtdMinima']" class="error-message">{{ errors['qtdMinima'] }}</span>
            </div>
            <div class="sub-group">
              <label>Quantidade Máxima de Alunos*</label>
              <input 
                type="number" 
                v-model.number="form.qtdMaxima"
                @blur="validateField('qtdMaxima', form.qtdMaxima, 'Máximo de alunos')"
                :class="{ error: errors['qtdMaxima'] }"
                placeholder="Ex: 30"
              >
              <span v-if="errors['qtdMaxima']" class="error-message">{{ errors['qtdMaxima'] }}</span>
            </div>
          </div>
          
          <div class="students-selection-box">
            <label>SELECIONE OS ALUNOS QUE FARÃO PARTE DESSA TURMA:</label>
            <div class="search-and-filter">
              <span class="icon ph-bold ph-magnifying-glass"></span>
              <input 
                type="text" 
                v-model="searchAluno"
                @input="filtrarAlunos"
                placeholder="Pesquise pelo nome ou matrícula do aluno"
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
                <button 
                  class="btn-action" 
                  @click.prevent="toggleAluno(aluno)" 
                  :class="{ selected: isAlunoSelected(aluno.matricula) }"
                >
                  <span class="icon ph-bold ph-plus" v-if="!isAlunoSelected(aluno.matricula)"></span>
                  <span class="icon ph-bold ph-check" v-else></span>
                </button>
              </div>
            </div>
            
            <div v-if="alunosFiltrados.length === 0" class="empty-list">
              Nenhum aluno encontrado.
            </div>
            
            <span v-if="errors['alunosSelecionados']" class="error-message full-width">{{ errors['alunosSelecionados'] }}</span>
          </div>

        </div>

      </div>

      <button class="btn-submit" type="submit">Criar turma</button>

    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
      form: {
        id: "",
        nome: "",
        semestre: "",
        turno: "",
        docenteRegistro: "", 
        qtdMinima: null,
        qtdMaxima: null,
        idadeMinima: null,
        idadeMaxima: null,
        alunosSelecionados: [] 
      },
      
      professores: [],
      alunosDisponiveis: [], 
      alunosFiltrados: [], 
      searchAluno: "", 
      errors: {}
    };
  },
  
  methods: {
    carregarDadosAuxiliares() {
      
      this.professores = JSON.parse(localStorage.getItem("professores")) || [];
      
      if (this.professores.length === 0) {
          this.professores.push({ registro: 'default', nome: 'Nenhum professor cadastrado' });
      }
      
      this.alunosDisponiveis = JSON.parse(localStorage.getItem("alunos")) || [];
      
      // Ordenar alunos por matrícula decrescente (mais recentes primeiro)
      this.alunosDisponiveis.sort((a, b) => b.matricula - a.matricula);

      // Inicializar lista filtrada
      this.alunosFiltrados = this.alunosDisponiveis.slice();
    },
    
    filtrarAlunos() {
      const termo = this.searchAluno.toLowerCase();

      this.alunosFiltrados = this.alunosDisponiveis.filter(a => 
        (a.nome || "").toLowerCase().includes(termo) ||
        String(a.matricula || "").includes(termo)
      );
    },

    /* VALIDAÇÃO GENÉRICA */
    validateField(key, value, msg) {
      if (!value || String(value).trim() === "" || value === null) {
        this.errors[key] = msg;
      } else {
        // A validação completa pode ser mais específica, mas esta é a base
        delete this.errors[key];
      }
    },

    /* LÓGICA DE SELEÇÃO DE ALUNOS */
    isAlunoSelected(matricula) {
        return this.form.alunosSelecionados.includes(matricula);
    },
    
    toggleAluno(aluno) {
        const index = this.form.alunosSelecionados.indexOf(aluno.matricula);
        if (index > -1) {
            this.form.alunosSelecionados.splice(index, 1); // Remover
        } else {
            this.form.alunosSelecionados.push(aluno.matricula); // Adicionar
        }
        // Disparar validação de alunos a cada clique para atualizar o erro de qtd. mínima
        this.validateForm(); 
    },

    /* VALIDAÇÃO DE FORMULÁRIO (COMPLETA) */
    validateForm() {
      this.errors = {}; 

      // 1. Validação de campos obrigatórios de texto e select
      this.validateField('nome', this.form.nome, 'Informe o nome da turma');
      this.validateField('semestre', this.form.semestre, 'Informe o semestre');
      this.validateField('turno', this.form.turno, 'Informe o turno');
      this.validateField('docenteRegistro', this.form.docenteRegistro, 'Selecione o docente');
      this.validateField('qtdMinima', this.form.qtdMinima, 'Informe a Qtd. Mínima');
      this.validateField('qtdMaxima', this.form.qtdMaxima, 'Informe a Qtd. Máxima');
      
      // 2. Validação de alunos selecionados (Mínimo 1)
      if (this.form.alunosSelecionados.length === 0) {
          this.errors['alunosSelecionados'] = 'Selecione ao menos um aluno para a turma.';
      } else {
          delete this.errors['alunosSelecionados'];
      }
      
      // 3. Validação de consistência de QTD
      if (this.form.qtdMinima !== null && this.form.qtdMaxima !== null && this.form.qtdMinima > this.form.qtdMaxima) {
          this.errors['qtdMaxima'] = 'A Qtd. Máxima deve ser maior que a Mínima.';
      }

      // 4. Validação de consistência de IDADE (Melhoria)
      if (this.form.idadeMinima !== null && this.form.idadeMaxima !== null && this.form.idadeMinima > this.form.idadeMaxima) {
          this.errors['idadeMaxima'] = 'A Idade Máxima deve ser maior que a Mínima.';
      } else {
          // Remover erro se a consistência for OK.
          if (!this.errors['idadeMinima']) delete this.errors['idadeMaxima'];
      }

      // 5. Validação de alunos selecionados vs Qtd Mínima
      if (this.form.qtdMinima !== null && this.form.alunosSelecionados.length < this.form.qtdMinima) {
          this.errors['alunosSelecionados'] = `Selecione no mínimo ${this.form.qtdMinima} alunos.`;
      }
    },


    /* SUBMIT */
    submitForm() {
        this.validateForm();

        if (Object.keys(this.errors).length > 0) {
            alert("Preencha todos os campos obrigatórios e corrija os erros!");
            return;
        }

        // 1. CARREGAR E SALVAR TURMAS
        const turmas = JSON.parse(localStorage.getItem("turmas")) || [];
        
        // Determinar o ID: se digitado, use o digitado (como string), se vazio, gere Date.now()
        const idFinal = this.form.id ? String(this.form.id) : Date.now();
        
        const novaTurma = {
            registro: Date.now(), 
            id: idFinal,
            ...this.form,
            // Adicionar o nome do docente ao objeto salvo para facilitar a exibição
            docenteNome: this.professores.find(p => p.registro === this.form.docenteRegistro)?.nome || 'Erro ao carregar docente'
        };

        turmas.push(novaTurma);
        localStorage.setItem("turmas", JSON.stringify(turmas));

        // 2. AÇÕES PÓS-SUCESSO
        alert("Turma criada com sucesso!");
        
        if (this.$router) {
          
            this.$router.push("/Turmas");
        } else {
            
            Object.assign(this.$data, this.$options.data());
        }
    }

  },

  mounted() {
      this.carregarDadosAuxiliares();
  }
};
</script>

<style scoped>

.page-container {
    padding: 20px;
    max-width: 1250px;
    margin: 0 auto;
    font-family: 'Inter', sans-serif;
  
}

/* --- HEADER --- */
.header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 25px;
    background-color: #ffffff;
    border-radius: 12px;
    padding: 15px 25px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); /* Sombra mais suave */
}

.header .icon-arrow { 
    /* Placeholder para um ícone de seta real, se houver */
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #e9e5ff;
}

.header h2 {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin: 0;
}

/* --- FORMULÁRIO CONTAINER --- */
.form-container {
    background: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    border: 1px solid #e1e4e6;
}

.section-title {
    margin: 0 0 20px;
    color: #5A45FF;
    font-size: 20px;
    font-weight: 700;
    padding-bottom: 5px;
    border-bottom: 2px solid #f0f0f0;
}

/* --- GRID PRINCIPAL (2 COLUNAS) --- */
.main-grid {
    display: grid;
    grid-template-columns: 1fr 1.3fr; /* Coluna da direita um pouco maior para a lista de alunos */
    gap: 30px;
    margin-bottom: 30px;
}

.column-left,
.column-right {
    display: flex;
    flex-direction: column;
    gap: 20px;
}


/* ==================================== */
/* 📝 ESTILOS DE GRUPOS E ENTRADAS */
/* ==================================== */
.form-group {
    display: flex;
    flex-direction: column;
}

label {
    font-weight: 600;
    font-size: 13px;
    margin-bottom: 8px;
    color: #555;
    text-transform: uppercase;
}

input, select, textarea {
    padding: 12px 14px;
    border-radius: 8px;
    border: 1px solid #dcdcdc;
    font-size: 15px;
    color: #333;
    outline: none;
    transition: all .2s ease;
    background-color: #ffffff;
}

input:focus, select:focus, textarea:focus {
    border-color: #5A45FF;
    box-shadow: 0 0 0 3px rgba(90, 69, 255, 0.15);
}

/* Estado de Erro */
input.error, select.error, textarea.error {
    border: 2px solid #ff4d4f !important; /* Vermelho de erro mais padrão */
    background: #fffafa;
}

.error-message {
    margin-top: 5px;
    color: #ff4d4f;
    font-size: 12px;
    font-weight: 600;
}

.error-message.full-width {
    grid-column: 1 / -1; 
}

/* Agrupamento em linha (2 colunas) */
.form-group.group-inline {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.group-inline .sub-group {
    display: flex;
    flex-direction: column;
    gap: 8px; /* Espaço entre label e input dentro do sub-group */
}

/* ==================================== */
/* 🧑‍🎓 SELEÇÃO DE ALUNOS */
/* ==================================== */
.students-selection-box {
    border: 1px solid #e1e4e6;
    border-radius: 10px;
    padding: 20px;
    background: #fcfdfe; /* Fundo muito leve */
    display: flex;
    flex-direction: column;
    gap: 15px;
    flex-grow: 1; /* Para garantir que ocupe todo o espaço vertical disponível */
}
.students-selection-box label {
    font-size: 14px;
    color: #8e7aff;
    font-weight: 700;
}

/* Barra de Pesquisa */
.search-and-filter {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: #ffffff;
    border: 1px solid #dcdcdc;
    border-radius: 8px;
    padding: 0 10px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}
.search-and-filter input {
    flex-grow: 1;
    border: none;
    padding: 10px 0;
    box-shadow: none;
    font-size: 14px;
}
.search-and-filter .icon {
    color: #5A45FF;
    font-size: 18px;
}
.btn-filter {
    background: #8e7aff;
    border: none;
    padding: 3px 9px;
    border-radius: 6px;
    cursor: pointer;
    color: white;
    margin-right: -5px; /* Ajuste para o padding lateral do container */
    transition: background 0.2s;
}
.btn-filter:hover {
    background: #4a38cc;
}

/* Lista de Alunos */
.student-list-container {
    max-height: 350px; /* Aumentei um pouco a altura para telas maiores */
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-right: 5px; /* Para acomodar a barra de rolagem */
}
.student-list-container::-webkit-scrollbar {
    width: 6px;
}
.student-list-container::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
}


.student-list-item {
    display: grid;
    grid-template-columns: 80px 1fr max-content; /* Largura fixa para matrícula, restante para nome */
    gap: 10px;
    padding: 10px 12px;
    background: #ffffff;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.student-list-item .matricula-col {
    font-size: 13px;
    font-weight: 700;
    color: #8e7aff; /* Cor da marca */
}
.student-list-item .nome-col {
    font-weight: 500;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Botão de Ação (Selecionar) */
.btn-action {
    background: #dcd9e9; /* Cor de fundo suave para o botão não selecionado */
    border: none;
    color: #5A45FF;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    font-size: 18px;
}
.btn-action.selected {
    background: #4cd964; /* Verde quando selecionado */
    color: white;
}
.btn-action:hover:not(.selected) {
    background: #c5c2d3;
}

.empty-list {
    text-align: center;
    padding: 20px;
    color: #999;
    font-style: italic;
    font-size: 14px;
    border-radius: 6px;
    background-color: #f7f7f7;
}

/* ==================================== */
/* ✅ BOTÃO SUBMIT */
/* ==================================== */
.btn-submit {
    display: block;
    width: 100%;
    padding: 15px 20px;
    background-color: #8e7aff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
}

.btn-submit:hover {
    background-color: #8e7aff;
}

.btn-submit:active {
    transform: translateY(1px);
}

/* ==================================== */
/* 📱 RESPONSIVIDADE (MEDIA QUERIES) */
/* ==================================== */
@media (max-width: 900px) {
    .main-grid {
        grid-template-columns: 1fr; /* Colunas empilhadas em telas menores */
        gap: 20px;
    }
    
    .column-left,
    .column-right {
        gap: 15px;
    }
    
    .form-group.group-inline {
        grid-template-columns: 1fr; /* Inputs em linha única */
        gap: 15px;
    }

    .students-selection-box {
        height: auto;
    }
    
    .header {
        margin-bottom: 20px;
    }
    
    .header h2 {
        font-size: 20px;
    }

    .form-container {
        padding: 20px;
    }
    
    .student-list-item {
        grid-template-columns: 60px 1fr max-content; /* Ajusta a largura da matrícula */
    }
}

/* Para telas muito pequenas */
@media (max-width: 480px) {
    .page-container {
        padding: 10px;
    }

    .form-container {
        padding: 15px;
    }
    
    .section-title {
        font-size: 18px;
    }
    
    label {
        font-size: 12px;
    }
    
    input, select {
        padding: 10px 12px;
        font-size: 14px;
    }
    
    .student-list-item {
        gap: 8px;
    }
}
</style>