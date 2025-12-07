<template>
  <div class="page-container">
    <div class="header">
      <h2>Cadastro de Novo Aluno</h2>
    </div>

    <form class="form-container" @submit.prevent="submitForm">
      
      <div class="main-grid">
        
        <div class="aluno-coluna">
          <h3 class="section-title">Informações do Aluno</h3>
          <div class="grid">

            <div class="form-group full">
              <label>Nome do aluno*</label>
              <input 
                type="text" 
                v-model="form.aluno.nome"
                @blur="validateField('aluno.nome', form.aluno.nome, 'Digite o nome do aluno')"
                :class="{ error: errors['aluno.nome'] }"
                placeholder="Informe o nome completo do aluno"
              >
              <span v-if="errors['aluno.nome']" class="error-message">{{ errors['aluno.nome'] }}</span>
            </div>

            <div class="form-group">
              <label>CPF*</label>
              <input 
                type="text" 
                v-model="form.aluno.cpf"
                @input="form.aluno.cpf = maskCPF(form.aluno.cpf)"
                @blur="validateField('aluno.cpf', form.aluno.cpf, 'Digite o CPF')"
                :class="{ error: errors['aluno.cpf'] }"
                placeholder="Informe o CPF"
              >
              <span v-if="errors['aluno.cpf']" class="error-message">{{ errors['aluno.cpf'] }}</span>
            </div>

            <div class="form-group">
              <label>RG</label>
              <input 
                type="text" 
                v-model="form.aluno.rg"
                @input="form.aluno.rg = maskRG(form.aluno.rg)"
                placeholder="Informe o RG"
              >
            </div>

            <div class="form-group full">
              <label>Estado*</label>
              <select 
                v-model="form.aluno.estado"
                @blur="validateField('aluno.estado', form.aluno.estado, 'Selecione o estado')"
                :class="{ error: errors['aluno.estado'] }"
              >
                <option disabled value="">Selecione o estado onde o aluno mora</option>
                <option v-for="uf in estados" :key="uf">{{ uf }}</option>
              </select>
              <span v-if="errors['aluno.estado']" class="error-message">{{ errors['aluno.estado'] }}</span>
            </div>

            <div class="form-group">
              <label>Bairro*</label>
              <input 
                type="text" 
                v-model="form.aluno.bairro"
                @blur="validateField('aluno.bairro', form.aluno.bairro, 'Informe o bairro')"
                :class="{ error: errors['aluno.bairro'] }"
                placeholder="Informe o bairro"
              >
              <span v-if="errors['aluno.bairro']" class="error-message">{{ errors['aluno.bairro'] }}</span>
            </div>

            <div class="form-group">
              <label>Cidade*</label>
              <input 
                type="text" 
                v-model="form.aluno.cidade"
                @blur="validateField('aluno.cidade', form.aluno.cidade, 'Informe a cidade')"
                :class="{ error: errors['aluno.cidade'] }"
                placeholder="Informe a cidade do aluno"
              >
              <span v-if="errors['aluno.cidade']" class="error-message">{{ errors['aluno.cidade'] }}</span>
            </div>
            
            <div class="form-group full">
              <label>Endereço*</label>
              <input 
                type="text" 
                v-model="form.aluno.endereco"
                @blur="validateField('aluno.endereco', form.aluno.endereco, 'Informe o endereço')"
                :class="{ error: errors['aluno.endereco'] }"
                placeholder="Informe o endereço do aluno"
              >
              <span v-if="errors['aluno.endereco']" class="error-message">{{ errors['aluno.endereco'] }}</span>
            </div>

            <div class="form-group full">
              <label>Data de Nascimento*</label>
              <input 
                type="date" 
                v-model="form.aluno.nascimento"
                @blur="validateField('aluno.nascimento', form.aluno.nascimento, 'Informe a data de nascimento')"
                :class="{ error: errors['aluno.nascimento'] }"
              >
              <span v-if="errors['aluno.nascimento']" class="error-message">{{ errors['aluno.nascimento'] }}</span>
            </div>

            <div class="form-group full">
              <label>Alergias*</label>
              <textarea 
                v-model="form.aluno.alergias"
                @blur="validateField('aluno.alergias', form.aluno.alergias, 'Informe alergias')"
                :class="{ error: errors['aluno.alergias'] }"
                placeholder="Informe alergias"
                rows="3"
              ></textarea>
              <span v-if="errors['aluno.alergias']" class="error-message">{{ errors['aluno.alergias'] }}</span>
            </div>

          </div>
        </div>

        <div class="responsaveis-coluna">
          <h3 class="section-title">Informações dos Responsáveis</h3>

          <div class="responsaveis-grid">
            
            <div v-for="i in 2" :key="i" class="responsavel-card">

              <div class="form-group">
                <label>Nome do responsável*</label>
                <input 
                  type="text"
                  v-model="form.responsaveis[i-1].nome"
                  @blur="validateField(`resp${i}.nome`, form.responsaveis[i-1].nome, 'Informe o nome')"
                  :class="{ error: errors[`resp${i}.nome`] }"
                  placeholder="Informe o nome completo do responsável"
                >
                <span v-if="errors[`resp${i}.nome`]" class="error-message">{{ errors[`resp${i}.nome`] }}</span>
              </div>

              <div class="form-group">
                <label>CPF do responsável*</label>
                <input 
                  type="text"
                  v-model="form.responsaveis[i-1].cpf"
                  @input="form.responsaveis[i-1].cpf = maskCPF(form.responsaveis[i-1].cpf)"
                  @blur="validateField(`resp${i}.cpf`, form.responsaveis[i-1].cpf, 'Informe o CPF')"
                  :class="{ error: errors[`resp${i}.cpf`] }"
                  placeholder="Informe o CPF do responsável"
                >
                <span v-if="errors[`resp${i}.cpf`]" class="error-message">{{ errors[`resp${i}.cpf`] }}</span>
              </div>

              <div class="form-group">
                <label>RG do responsável</label>
                <input 
                  type="text"
                  v-model="form.responsaveis[i-1].rg"
                  @input="form.responsaveis[i-1].rg = maskRG(form.responsaveis[i-1].rg)"
                  placeholder="Informe o RG do responsável"
                >
              </div>

              <div class="form-group">
                <label>Telefone do responsável*</label>
                <input 
                  type="text"
                  v-model="form.responsaveis[i-1].telefone"
                  @input="form.responsaveis[i-1].telefone = maskTelefone(form.responsaveis[i-1].telefone)"
                  @blur="validateField(`resp${i}.telefone`, form.responsaveis[i-1].telefone, 'Informe o telefone')"
                  :class="{ error: errors[`resp${i}.telefone`] }"
                  placeholder="Informe o telefone do responsável"
                >
                <span v-if="errors[`resp${i}.telefone`]" class="error-message">{{ errors[`resp${i}.telefone`] }}</span>
              </div>

              <div class="form-group">
                <label>Celular do responsável*</label>
                <input 
                  type="text"
                  v-model="form.responsaveis[i-1].celular"
                  @input="form.responsaveis[i-1].celular = maskTelefone(form.responsaveis[i-1].celular)"
                  @blur="validateField(`resp${i}.celular`, form.responsaveis[i-1].celular, 'Informe o celular')"
                  :class="{ error: errors[`resp${i}.celular`] }"
                  placeholder="Informe o celular do responsável"
                >
                <span v-if="errors[`resp${i}.celular`]" class="error-message">{{ errors[`resp${i}.celular`] }}</span>
              </div>

              <div class="form-group">
                <label>Email*</label>
                <input 
                  type="email"
                  v-model="form.responsaveis[i-1].email"
                  @blur="validateField(`resp${i}.email`, form.responsaveis[i-1].email, 'Informe o email')"
                  :class="{ error: errors[`resp${i}.email`] }"
                  placeholder="Informe o email do responsável"
                >
                <span v-if="errors[`resp${i}.email`]" class="error-message">{{ errors[`resp${i}.email`] }}</span>
              </div>
              
            </div>
            
          </div>
          
          <div class="form-group full observacoes-area">
            <label>Observações</label>
            <textarea v-model="form.observacoes" rows="5" placeholder="Observações adicionais sobre o aluno ou responsáveis"></textarea>
          </div>
          
        </div>

      </div>

      <button class="btn-submit" type="submit">
          Finalizar Cadastro
          <span class="icon ph-bold ph-arrow-right"></span>
      </button>

    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      estados: [
        "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
        "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
      ],

      estadoInicialForm: { 
        aluno: {
          nome: "",
          cpf: "",
          rg: "",
          estado: "",
          bairro: "",
          endereco: "",
          cidade: "",
          nascimento: "",
          alergias: ""
        },
        responsaveis: [
          { nome: "", cpf: "", rg: "", telefone: "", celular: "", email: "" },
          { nome: "", cpf: "", rg: "", telefone: "", celular: "", email: "" },
        ],
        observacoes: ""
      },

      form: {
        aluno: {
          nome: "",
          cpf: "",
          rg: "",
          estado: "",
          bairro: "",
          endereco: "",
          cidade: "",
          nascimento: "",
          alergias: ""
        },
        responsaveis: [
          { nome: "", cpf: "", rg: "", telefone: "", celular: "", email: "" },
          { nome: "", cpf: "", rg: "", telefone: "", celular: "", email: "" },
        ],
        observacoes: ""
      },

      errors: {}
    };
  },
  
  methods: {
    unmaskValue(v) {
      return (v || "").replace(/\D/g, "");
    },

    maskCPF(v) {
      return this.unmaskValue(v)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        .substring(0, 14);
    },

    maskRG(v) {
      return this.unmaskValue(v)
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1})$/, "$1-$2");
    },

    maskTelefone(v) {
      const unmasked = this.unmaskValue(v);
      if (unmasked.length <= 10) {
          return unmasked
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4})(\d{4})$/, "$1-$2")
      } else {
          return unmasked
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d{4})$/, "$1-$2")
            .substring(0, 15);
      }
    },

    validateField(key, value, msg) {
      if (!value || value.trim() === "") {
        this.errors[key] = msg;
      } else {
        delete this.errors[key];
      }
    },

    validateForm() {
      this.errors = {};

      this.validateField('aluno.nome', this.form.aluno.nome, 'Digite o nome do aluno');
      this.validateField('aluno.estado', this.form.aluno.estado, 'Selecione o estado');
      this.validateField('aluno.bairro', this.form.aluno.bairro, 'Informe o bairro');
      this.validateField('aluno.endereco', this.form.aluno.endereco, 'Informe o endereço');
      this.validateField('aluno.cidade', this.form.aluno.cidade, 'Informe a cidade');
      this.validateField('aluno.nascimento', this.form.aluno.nascimento, 'Informe a data de nascimento');
      this.validateField('aluno.alergias', this.form.aluno.alergias, 'Informe alergias');

      const cpfAluno = this.unmaskValue(this.form.aluno.cpf);
      if (cpfAluno.length !== 11) this.errors['aluno.cpf'] = 'O CPF deve ter 11 dígitos';

      this.form.responsaveis.forEach((resp, index) => {
        const i = index + 1;
        this.validateField(`resp${i}.nome`, resp.nome, 'Informe o nome');
        this.validateField(`resp${i}.email`, resp.email, 'Informe o email');

        const cpfResp = this.unmaskValue(resp.cpf);
        if (cpfResp.length !== 11) this.errors[`resp${i}.cpf`] = 'O CPF deve ter 11 dígitos';

        const telResp = this.unmaskValue(resp.telefone);
        if (telResp.length < 10) this.errors[`resp${i}.telefone`] = 'Informe um telefone válido (mín. 10 dígitos)';

        const celResp = this.unmaskValue(resp.celular);
        if (celResp.length < 11) this.errors[`resp${i}.celular`] = 'Informe um celular válido (mín. 11 dígitos)';
      });
    },

    resetForm() {
      Object.assign(this.form, JSON.parse(JSON.stringify(this.estadoInicialForm)));
      this.errors = {};
    },

    getNextMatricula() {
    let lastMatricula = Number(localStorage.getItem("last_matricula")) || 0;
    let novaMatricula = lastMatricula + 1;

    localStorage.setItem("last_matricula", novaMatricula);

    return String(novaMatricula).padStart(4, "0");
  },


    submitForm() {
      this.validateForm();

      if (Object.keys(this.errors).length > 0) {
        alert("Preencha todos os campos obrigatórios corretamente!");
        return;
      }

      
      const alunos = JSON.parse(localStorage.getItem("alunos")) || [];
      const novoAluno = {
        matricula: this.getNextMatricula(),
        ...this.form.aluno,
        responsaveis: this.form.responsaveis,
        observacoes: this.form.observacoes
      };
      alunos.push(novoAluno);
      localStorage.setItem("alunos", JSON.stringify(alunos));

      alert("Aluno cadastrado com sucesso!");
      this.resetForm();

      if (this.$router) this.$router.push("/Alunos");
    }
  }
};
</script>
<style scoped>
/* Estilo geral da página (similares aos refinados da imagem) */
.page-container {
  padding: 30px;
  background-color: #f4f5ff; /* Cor de fundo suave */
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* Estilo do cabeçalho */
.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
  background-color: #fff;
  border-radius: 16px;
  padding: 12px 20px;
  box-shadow: 0px 3px 12px rgba(0,0,0,0.08);
}

.header h2 {
   font-size: 22px;
  font-weight: 600;
  color: #333;
}

/* Contêiner principal do formulário com sombra e borda */
.form-container {
  background: #ffffff;
  padding: 35px;
  border-radius: 16px;
  box-shadow: 0px 4px 15px rgba(0,0,0,0.08);
  border: 1px solid #e0e0f0;
}

/* Layout de Duas Colunas Principais (Aluno | Responsáveis) */
.main-grid {
    display: grid;
    grid-template-columns: 1fr 2fr; /* 1 parte para Aluno, 2 partes para Responsáveis */
    gap: 30px;
    margin-bottom: 25px;
}

.aluno-coluna {
    border-right: 1px solid #f1f1f1; /* Linha divisória sutil */
    padding-right: 20px;
}

/* Títulos das Seções */
.section-title {
  margin: 0px 0 20px;
  color: #5A45FF;
  font-size: 18px;
  font-weight: 700;
}

/* Grid para os campos do Aluno (2 colunas) */
.aluno-coluna .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

/* Grid para os Responsáveis (2 cards lado a lado) */
.responsaveis-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.responsavel-card {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.observacoes-area {
    margin-top: 20px;
}

/* Estilo dos campos (Input, Select, Textarea) */
.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full {
  grid-column: 1 / -1;
}

label {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
  color: #444;
}

input, select, textarea {
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #fafafa; /* Fundo levemente cinza */
  font-size: 14px;
  outline: none;
  transition: .2s ease;
}

input:focus, select:focus, textarea:focus {
  border-color: #5A45FF;
  box-shadow: 0 0 0 3px rgba(90, 69, 255, 0.15); /* Sombra suave no foco */
}

/* Estilo de erro */
input.error, select.error, textarea.error {
  border: 2px solid #ff3b3b !important;
  background: #fff4f4;
}

.error-message {
  margin-top: 4px;
  color: #ff3b3b;
  font-size: 12px;
  font-weight: 600;
}

/* Botão de Submissão */
.btn-submit {
  margin-top: 20px;
  padding: 16px;
  width: 100%;
  border: none;
  /* Gradiente para seguir o estilo da imagem */
  background: linear-gradient(90deg, #8e7aff, #b598ff);
  color: white;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: .2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.btn-submit:hover {
  opacity: 0.95;
  transform: translateY(-1px);
}

/* Estilo para os ícones */
.icon {
    font-size: 18px;
    color: #5A45FF; /* Cor para ícones no cabeçalho */
}

.btn-submit .icon {
    color: white; /* Cor branca para ícones dentro do botão de submissão */
}

/* Responsividade: Voltar para uma coluna em telas menores */
@media (max-width: 1024px) {
    .main-grid {
        grid-template-columns: 1fr;
    }
    .aluno-coluna {
        border-right: none;
        padding-right: 0;
        border-bottom: 1px solid #f1f1f1;
        padding-bottom: 20px;
    }
    .responsaveis-grid {
        grid-template-columns: 1fr;
    }
}
</style>