<template>
  <div class="page-container">
    <div class="header">
      <span class="icon-arrow"></span>
      <h2>Cadastro de Novo Professor</h2>
    </div>

    <form class="form-container" @submit.prevent="submitForm">

      <h3 class="section-title">Informações do Professor</h3>

      <div class="grid">

        <div class="form-group">
          <label>Nome do professor*</label>
          <input 
            type="text" 
            v-model="form.nome"
            @blur="validateField('nome', form.nome, 'Informe o nome completo do professor')"
            :class="{ error: errors['nome'] }"
            placeholder="Informe o nome completo do professor"
          >
          <span v-if="errors['nome']" class="error-message">{{ errors['nome'] }}</span>
        </div>

        <div class="form-group">
          <label>Idade*</label>
          <input 
            type="number" 
            v-model.number="form.idade"
            @blur="validateField('idade', form.idade, 'Informe a idade')"
            :class="{ error: errors['idade'] }"
            placeholder="Informe a idade"
          >
          <span v-if="errors['idade']" class="error-message">{{ errors['idade'] }}</span>
        </div>

        <div class="form-group">
          <label>CPF*</label>
          <input 
            type="text" 
            v-model="form.cpf"
            @input="form.cpf = maskCPF(form.cpf)"
            @blur="validateField('cpf', form.cpf, 'Informe o CPF')"
            :class="{ error: errors['cpf'] }"
            placeholder="Informe o CPF"
          >
          <span v-if="errors['cpf']" class="error-message">{{ errors['cpf'] }}</span>
        </div>

        <div class="form-group">
          <label>Formação*</label>
          <input 
            type="text" 
            v-model="form.formacao"
            @blur="validateField('formacao', form.formacao, 'Informe a formação')"
            :class="{ error: errors['formacao'] }"
            placeholder="Informe a formação"
          >
          <span v-if="errors['formacao']" class="error-message">{{ errors['formacao'] }}</span>
        </div>

        <div class="form-group">
          <label>RG</label>
          <input 
            type="text" 
            v-model="form.rg"
            @input="form.rg = maskRG(form.rg)"
            placeholder="Informe o RG"
          >
        </div>

        <div class="form-group">
          <label>Email*</label>
          <input 
            type="email" 
            v-model="form.email"
            @blur="validateField('email', form.email, 'Informe o email do professor')"
            :class="{ error: errors['email'] }"
            placeholder="Informe o email do professor"
          >
          <span v-if="errors['email']" class="error-message">{{ errors['email'] }}</span>
        </div>

        <div class="form-group">
          <label>Estado*</label>
          <select 
            v-model="form.estado"
            @blur="validateField('estado', form.estado, 'Selecione o estado')"
            :class="{ error: errors['estado'] }"
          >
            <option disabled value="">Selecione o estado onde o docente mora</option>
            <option v-for="uf in estados" :key="uf">{{ uf }}</option>
          </select>
          <span v-if="errors['estado']" class="error-message">{{ errors['estado'] }}</span>
        </div>

        <div class="form-group">
          <label>Telefone*</label>
          <input 
            type="text" 
            v-model="form.telefone"
            @input="form.telefone = maskTelefone(form.telefone)"
            @blur="validateField('telefone', form.telefone, 'Informe o telefone')"
            :class="{ error: errors['telefone'] }"
            placeholder="Informe o telefone do professor"
          >
          <span v-if="errors['telefone']" class="error-message">{{ errors['telefone'] }}</span>
        </div>

        <div class="form-group">
          <label>Bairro*</label>
          <input 
            type="text" 
            v-model="form.bairro"
            @blur="validateField('bairro', form.bairro, 'Informe o bairro')"
            :class="{ error: errors['bairro'] }"
            placeholder="Informe o bairro"
          >
          <span v-if="errors['bairro']" class="error-message">{{ errors['bairro'] }}</span>
        </div>

        <div class="form-group">
          <label>Celular*</label>
          <input 
            type="text" 
            v-model="form.celular"
            @input="form.celular = maskTelefone(form.celular)"
            @blur="validateField('celular', form.celular, 'Informe o celular')"
            :class="{ error: errors['celular'] }"
            placeholder="Informe o celular do professor"
          >
          <span v-if="errors['celular']" class="error-message">{{ errors['celular'] }}</span>
        </div>

      </div>

      <button class="btn-submit" type="submit">Finalizar Cadastro</button>

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

      form: {
        nome: "",
        idade: null,
        cpf: "",
        formacao: "",
        rg: "",
        email: "",
        estado: "",
        telefone: "",
        bairro: "",
        celular: "",
      },

      errors: {}
    };
  },

  computed: {
    isFormValid() {
   
      return Object.keys(this.errors).length === 0;
    }
  },

  methods: {

   
    unmaskValue(v) {
        return (v || "").replace(/\D/g, "");
    },

    /* MÁSCARAS */
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
      if (unmasked.length <= 10) { // Fixo/celular sem 9º dígito
          return unmasked
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4})(\d{4})$/, "$1-$2")
      } else { // Celular com 9º dígito
          return unmasked
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d{4})$/, "$1-$2")
            .substring(0, 15);
      }
    },


    
    validateField(key, value, msg) {
      if (!value || String(value).trim() === "") {
        this.errors[key] = msg; 
      } else {
        delete this.errors[key]; 
      }
    },

   
    validateForm() {
      this.errors = {}; 

   
      this.validateField('nome', this.form.nome, 'Informe o nome completo');
      this.validateField('formacao', this.form.formacao, 'Informe a formação');
      this.validateField('email', this.form.email, 'Informe o email');
      this.validateField('estado', this.form.estado, 'Selecione o estado');
      this.validateField('bairro', this.form.bairro, 'Informe o bairro');
      this.validateField('idade', this.form.idade, 'Informe a idade');


  
      const cpf = this.unmaskValue(this.form.cpf);
      if (cpf.length !== 11) {
          this.errors['cpf'] = 'O CPF deve ter 11 dígitos.';
      } else {
          delete this.errors['cpf'];
      }
      
     
      const tel = this.unmaskValue(this.form.telefone);
      if (tel.length < 10) {
          this.errors['telefone'] = 'Informe um telefone válido (mín. 10 dígitos)';
      } else {
          delete this.errors['telefone'];
      }

      const cel = this.unmaskValue(this.form.celular);
      if (cel.length < 11) {
          this.errors['celular'] = 'Informe um celular válido (mín. 11 dígitos)';
      } else {
          delete this.errors['celular'];
      }

    },


    /* SUBMIT */
    submitForm() {
        this.validateForm();

        if (!this.isFormValid) {
            alert("Preencha todos os campos obrigatórios corretamente!");
            return;
        }

        // 1. CARREGAR E SALVAR PROFESSORES
        const professores = JSON.parse(localStorage.getItem("professores")) || [];
        
        const novoProfessor = {
            registro: Date.now(), // Usando timestamp como registro
            ...this.form,
        };

        professores.push(novoProfessor);
        // Salvando no localStorage com a chave 'professores'
        localStorage.setItem("professores", JSON.stringify(professores));

        // 2. AÇÕES PÓS-SUCESSO
        alert("Professor cadastrado com sucesso!");
        
        // Redirecionamento (mude para a rota correta do seu painel)
        if (this.$router) {
            this.$router.push("/Professores");
        }
    }

  }
};
</script>

<style scoped>
.page-container {
  padding: 15px;
  max-width: 1250px;
  margin: auto;
  font-family: 'Inter', sans-serif;
}

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

.form-container {
  background: #ffffff;
  padding: 35px;
  border-radius: 16px;
  box-shadow: 0px 3px 12px rgba(0,0,0,0.08);
  border: 1px solid #f1f1f1;
}

.section-title {
  margin: 0px 0 15px;
  color: #5A45FF;
  font-size: 16px;
  font-weight: 700;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 22px;
  margin-bottom: 25px;
}

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
  font-size: 14px;
  outline: none;
  transition: .2s ease;
}

input:focus, select:focus, textarea:focus {
  border-color: #5A45FF;
}

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

.btn-submit {
  margin-top: 20px;
  padding: 14px;
  width: 100%;
  border: none;
  background: #5A45FF;
  color: white;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: .2s;
}

.btn-submit:hover {
  background: #4938d1;
}
</style>