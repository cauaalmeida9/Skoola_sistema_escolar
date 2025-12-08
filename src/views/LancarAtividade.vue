<template>
  <div class="page-container">
    <div class="header">
      <span class="icone ph-bold ph-arrow-left" @click="$router.back()"></span>
      <h2>ADICIONAR ATIVIDADE OU PROVA</h2>
    </div>

    <div class="form-wrapper">
      <div class="info-card form-card">
        <h3>Informações do Atividade/ Prova</h3>

        <form @submit.prevent="salvarAtividade">
          <div class="form-group">
            <label for="nome">Nome da atividade / Prova*</label>
            <input
              id="nome"
              type="text"
              v-model="atividade.nome"
              placeholder="Informe o nome da atividade"
              required
            />
          </div>

          <div class="form-group">
            <label for="descricao">Descrição da atividade*</label>
            <textarea
              id="descricao"
              v-model="atividade.descricao"
              placeholder="Descrição"
              rows="3"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label for="dataEntrega">Data de entrega*</label>
            <input
              id="dataEntrega"
              type="date"
              v-model="atividade.dataEntrega"
              required
            />
          </div>

          <div class="form-group">
            <label for="notaMinima">Nota mínima (para aprovação)*</label>
            <input
              id="notaMinima"
              type="number"
              v-model.number="atividade.notaMinima"
              placeholder="Nota mínima para passar"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div class="form-group">
            <label for="notaMaxima">Nota máxima*</label>
            <input
              id="notaMaxima"
              type="number"
              v-model.number="atividade.notaMaxima"
              placeholder="Nota máxima"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <button type="submit" class="btn-salvar-atividade" :disabled="!isFormValid">
            Salvar Atividade / Prova
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      turmaRegistro: null,
      atividade: {
        id: Date.now(), // ID simples baseado no timestamp
        nome: '',
        descricao: '',
        dataEntrega: '',
        notaMinima: 60, // Valor padrão como exemplo
        notaMaxima: 100, // Valor padrão como exemplo
      },
    };
  },
  
  computed: {
    // Validação básica do formulário
    isFormValid() {
      return (
        this.atividade.nome &&
        this.atividade.descricao &&
        this.atividade.dataEntrega &&
        this.atividade.notaMinima >= 0 &&
        this.atividade.notaMaxima > 0 &&
        this.atividade.notaMaxima >= this.atividade.notaMinima
      );
    },
  },

  mounted() {
    // Obtém o registro da turma a partir dos parâmetros da rota
    this.turmaRegistro = this.$route.params.registro;
    if (!this.turmaRegistro) {
      alert('Erro: Registro da turma não encontrado na rota.');
      this.$router.back();
    }
  },

  methods: {
    salvarAtividade() {
      if (!this.isFormValid) {
        alert('Preencha todos os campos obrigatórios corretamente.');
        return;
      }
      
      const novaAtividade = { ...this.atividade, id: Date.now() }; // Garante um ID único
      
      // 1. Carrega todas as turmas
      let turmas = JSON.parse(localStorage.getItem('turmas') || '[]');
      
      // 2. Encontra a turma correta
      const turmaIndex = turmas.findIndex(t => String(t.registro) === String(this.turmaRegistro));
      
      if (turmaIndex !== -1) {
        // 3. Adiciona a nova atividade
        if (!turmas[turmaIndex].atividades) {
          turmas[turmaIndex].atividades = [];
        }
        turmas[turmaIndex].atividades.push(novaAtividade);
        
        // 4. Salva de volta no localStorage
        localStorage.setItem('turmas', JSON.stringify(turmas));
        
        alert(`Atividade "${novaAtividade.nome}" adicionada com sucesso à turma ${this.turmaRegistro}!`);
        
        // 5. Volta para a tela de Detalhe da Turma
        this.$router.back();
      } else {
        alert('Erro: Turma não encontrada para salvar a atividade.');
      }
    },
  },
};
</script>

<style scoped>
/* Estilos globais (cabeçalhos, containers) vêm do DetalheTurma.vue */
.page-container {
  padding: 20px;
  max-width: 800px; /* Reduzimos a largura máxima para o formulário */
  margin: 0 auto;
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

/* Estilos específicos do formulário */
.form-wrapper {
  display: flex;
  justify-content: center;
}

.info-card.form-card {
  width: 100%;
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e4e6;
}

.info-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: #5A45FF;
  text-align: center;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #4b4b63;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box; /* Garante que padding e borda não aumentem o tamanho total */
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #5A45FF;
  box-shadow: 0 0 0 3px rgba(90, 69, 255, 0.2);
}

.form-group textarea {
  resize: vertical;
}

.btn-salvar-atividade {
  width: 100%;
  padding: 15px 20px;
  background-color: #5A45FF;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
}

.btn-salvar-atividade:hover:not(:disabled) {
  background-color: #4b36d9;
}

.btn-salvar-atividade:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Estilos para input[type=date] */
input[type="date"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding-right: 15px; /* Espaço para o ícone padrão */
}
</style>