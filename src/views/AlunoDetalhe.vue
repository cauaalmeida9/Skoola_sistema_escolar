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
          <button
            class="btn-action generate"
            @click="abrirModal('boletim')"
            :disabled="turmasAluno.length === 0"
          >
            Gerar Boletim
          </button>
          <button class="btn-action edit" @click="navegarParaEdicao()">
            Editar cadastro
          </button>
          <button
            class="btn-action frequency"
            @click="abrirModal('frequencia')"
            :disabled="turmasAluno.length === 0"
          >
            Gerar Frequência
          </button>
          <button class="btn-action delete" @click="excluirAluno()">
            Excluir cadastro
          </button>
        </div>

        <div class="info-card compact-card alert-card">
          <h3>Alergias</h3>
          <p class="content-text">
            {{ aluno.alergias || 'O aluno não possui alergias.' }}
          </p>
        </div>

        <div class="info-card compact-card obs-card">
          <h3>Observações</h3>
          <p class="content-text">
            {{ aluno.observacoes || 'O aluno não possui observações.' }}
          </p>
        </div>
      </div>

      <div class="right-column">
        <div class="info-card responsavel-card">
          <h3>Informações dos Responsáveis</h3>
          <div
            v-for="resp in aluno.responsaveis"
            :key="resp.cpf"
            class="responsavel-detalhe"
          >
            <p>
              <span class="label">Parentesco:</span>
              <strong>{{ resp.parentesco }}</strong>
            </p>
            <p>
              <span class="label">Nome:</span>
              <strong>{{ resp.nome }}</strong>
            </p>
            <p>
              <span class="label">Telefone:</span>
              <strong>{{ resp.telefone || 'Não informado' }}</strong>
            </p>
            <p>
              <span class="label">Cpf:</span>
              <strong>{{ resp.cpf || 'Não informado' }}</strong>
            </p>
            <p>
              <span class="label">Email:</span>
              <strong>{{ resp.email || 'Não informado' }}</strong>
            </p>
          </div>
          <p v-if="!aluno.responsaveis || aluno.responsaveis.length === 0" class="content-text">
            Nenhum responsável cadastrado.
          </p>
        </div>
      </div>

      <div class="turmas-container">
        <h3>Turmas Pertencentes</h3>
        <div v-if="turmasAluno.length > 0" class="turmas-list">
          <div
            v-for="(turma, index) in turmasAluno"
            :key="turma.registro"
            class="turma-card"
            :class="getCardColor(index)"
            @click="navegarParaDetalhesTurma(turma.registro)"
          >
            <div class="turma-info">
              <span class="turma-nome">{{ turma.nome }}</span>
              <span class="turma-detalhe"
                >Reg: {{ turma.registro }} | Prof:
                {{ turma.professor || 'N/A' }}</span
              >
            </div>
            <span class="icone ph-bold ph-arrow-right"></span>
          </div>
        </div>
        <div v-else class="empty-turmas">
          O aluno não está matriculado em nenhuma turma.
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            Gerar {{ modalTipo === 'boletim' ? 'Boletim (Notas)' : 'Frequência' }}
          </h3>
          <span
            class="close-btn ph-bold ph-x"
            @click="fecharModal"
          ></span>
        </div>

        <div class="modal-body">
          <p class="instruction-text">
            Selecione a turma para qual você deseja gerar o documento de
            **{{ modalTipo === 'boletim' ? 'Notas' : 'Frequência' }}**:
          </p>

          <div
            v-if="turmasAluno.length > 0"
            class="turmas-selection-list"
          >
            <label
              v-for="turma in turmasAluno"
              :key="turma.registro"
              class="selection-row"
            >
              <input
                type="radio"
                name="turmaSelection"
                :value="turma.registro"
                v-model="turmaSelecionada"
              />
              <span class="selection-info">
                <span class="turma-nome">{{ turma.nome }}</span>
                <span class="turma-detalhe">
                  Reg: {{ turma.registro }} | Prof:
                  {{ turma.professor || 'N/A' }}
                </span>
              </span>
            </label>
          </div>
          <p v-else class="content-text">
            Não há turmas disponíveis para gerar o documento.
          </p>
        </div>

        <div class="modal-footer">
          <button class="btn-modal cancel-btn" @click="fecharModal">
            Cancelar
          </button>
          <button
            class="btn-modal confirm-btn"
            :disabled="!turmaSelecionada"
            @click="gerarDocumento"
          >
            Gerar PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { jsPDF } from 'jspdf';

export default {
  name: 'DetalheAluno',
  props: {
    matricula: {
      type: [String, Number],
      required: true,
      default: '9999999'
    }
  },

  data() {
    return {
      aluno: null,
      todasTurmas: [],
      turmasAluno: [],
      cardColors: ['yellow', 'green', 'orange', 'blue'],

      // Modal State
      isModalOpen: false,
      modalTipo: '', // 'boletim' ou 'frequencia'
      turmaSelecionada: null,
    };
  },

  methods: {
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

    getCardColor(index) {
      const colorIndex = index % this.cardColors.length;
      return `color-${this.cardColors[colorIndex]}`;
    },

    carregarDados() {
      const alunos = JSON.parse(localStorage.getItem("alunos") || "[]");
      this.todasTurmas = JSON.parse(localStorage.getItem("turmas") || "[]");

      this.aluno = alunos.find(a => String(a.matricula) === String(this.matricula));

      if (this.aluno) {
        this.aluno.responsaveis = this.aluno.responsaveis || [];
        this.encontrarTurmas();
      }
    },

    encontrarTurmas() {
      const matriculaAluno = String(this.aluno.matricula);

      this.turmasAluno = this.todasTurmas
        .filter(turma => turma.alunosSelecionados && turma.alunosSelecionados.map(String).includes(matriculaAluno))
        .map(turma => ({
          nome: turma.nome,
          registro: turma.registro,
          professor: turma.professor || 'N/A'
        }));
    },

    abrirModal(tipo) {
      if (this.turmasAluno.length === 0) {
        alert("O aluno não está matriculado em nenhuma turma.");
        return;
      }
      this.modalTipo = tipo;
      this.isModalOpen = true;
      this.turmaSelecionada = null;
    },

    fecharModal() {
      this.isModalOpen = false;
      this.turmaSelecionada = null;
      this.modalTipo = '';
    },

    gerarDocumento() {
      if (!this.turmaSelecionada) return;

      const tipoDoc = this.modalTipo === 'boletim' ? 'Boletim de Notas' : 'Relatório de Frequência';

      const turmaDetalhe = this.todasTurmas.find(t => String(t.registro) === String(this.turmaSelecionada));

      if (!turmaDetalhe) {
        alert("Erro: Turma não encontrada.");
        return;
      }

      this.gerarDocumentoPDF(tipoDoc, turmaDetalhe);
      this.fecharModal();
    },

    // 📄 ***GERAÇÃO DO PDF COM CORREÇÃO***
    gerarDocumentoPDF(tipo, turma) {
      const doc = new jsPDF('p', 'mm', 'a4');
      let y = 10;
      const margin = 20;
      const matricula = String(this.aluno.matricula);

      // Cabeçalho
      doc.setFontSize(18);
      doc.setTextColor(90, 69, 255);
      doc.text(tipo.toUpperCase(), margin, y);
      y += 10;

      doc.setLineWidth(0.5);
      doc.line(margin, y, 210 - margin, y);
      y += 5;

      doc.setFontSize(14);
      doc.setTextColor(51, 51, 51);
      doc.text(`ALUNO: ${this.aluno.nome}`, margin, y);
      y += 7;
      doc.setFontSize(12);
      doc.text(`Matrícula: ${this.aluno.matricula}`, margin, y);
      y += 7;
      doc.text(`Turma: ${turma.nome} (Reg: ${turma.registro})`, margin, y);
      y += 7;
      doc.text(`Professor: ${turma.professor || 'N/A'}`, margin, y);
      y += 10;
      doc.line(margin, y, 210 - margin, y);
      y += 10;

      doc.setFontSize(16);
      doc.setTextColor(90, 69, 255);
      doc.text(`DETALHES DO ${tipo.split(' ')[0].toUpperCase()}`, margin, y);
      y += 8;

      // ----------------------------------------------------------------------
      // 📘 ***BOLETIM***
      // ----------------------------------------------------------------------
      if (tipo.includes('Boletim')) {
        const atividades = turma.atividades || [];
        const notasAluno = turma.notas || {};

        if (atividades.length > 0) {
          let totalNotaAluno = 0;
          let totalMaximo = 0;

          doc.setFontSize(12);
          doc.setTextColor(51, 51, 51);

          doc.setFont('helvetica', 'bold');
          doc.text('Atividade', margin, y);
          doc.text('Nota Max.', 100, y);
          doc.text('Nota Aluno', 130, y);
          doc.text('Status', 160, y);
          doc.setFont('helvetica', 'normal');
          y += 5;

          doc.line(margin, y, 210 - margin, y);
          y += 5;

          atividades.forEach(atividade => {
  const notaRaw = notasAluno[atividade.id] ? notasAluno[atividade.id][matricula] : null;
  const nota = notaRaw !== null && notaRaw !== undefined ? Number(notaRaw) : null;

  const notaMax = atividade.notaMaxima || 100;
  const notaMin = atividade.notaMinima || 60;

  const notaFormatada = nota !== null ? nota.toFixed(2) : 'N/A';
  let status = 'Pendente';
  let statusColor = [150, 150, 150];

  if (nota !== null) {
    totalNotaAluno += nota;
    totalMaximo += notaMax;

    if (nota >= notaMin) {
      status = 'Aprovado';
      statusColor = [76, 175, 80];
    } else {
      status = 'Reprovado';
      statusColor = [244, 67, 54];
    }
  } else {
    totalMaximo += notaMax;
  }

  doc.setFontSize(10);
  doc.text(atividade.nome || 'N/A', margin, y);
  doc.text(notaMax.toFixed(2), 100, y);
  doc.text(notaFormatada, 130, y);

  doc.setTextColor(...statusColor);
  doc.text(status, 160, y);
  doc.setTextColor(51, 51, 51);

  y += 7;

  if (y > 280) {
    doc.addPage();
    y = 20;
  }
});

          y += 5;
          doc.line(margin, y, 210 - margin, y);
          y += 5;

          const mediaGeral = totalMaximo > 0 ? (totalNotaAluno / totalMaximo) * 100 : 0;

          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text(`Soma de Pontos Obtidos: ${totalNotaAluno.toFixed(2)}`, margin, y);
          doc.text(`Máximo Total: ${totalMaximo.toFixed(2)}`, 100, y);

          y += 8;

          doc.setTextColor(90, 69, 255);
          doc.text(`MÉDIA GERAL (%): ${mediaGeral.toFixed(2)}%`, margin, y);

        } else {
          doc.setTextColor(153, 153, 153);
          doc.text("Nenhuma atividade cadastrada para esta turma.", margin, y);
        }

      // ----------------------------------------------------------------------
      // 📗 ***FREQUÊNCIA***
      // ----------------------------------------------------------------------
      } else {
        const frequenciaTurma = typeof turma.frequencia === 'object' ? turma.frequencia : {};

        let totalAulas = 0;
        let totalPresencas = 0;
        let faltasPorData = [];
        const horarios = [1, 2, 3, 4];

        for (const data in frequenciaTurma) {
          const registrosDoDia = frequenciaTurma[data];

          if (registrosDoDia) {
            let statusHorarios = registrosDoDia[matricula];

            // ❤️ CORREÇÃO: Garante que statusHorarios seja array de booleans
            if (!Array.isArray(statusHorarios)) {
              if (typeof statusHorarios === 'string') {
                // Converte a string "true,false,..." para um array de booleans
                statusHorarios = statusHorarios
                  .split(',')
                  .map(v => v.trim() === 'true');
              } else {
                continue;
              }
            }

            const aulasDia = statusHorarios.length;
            const presencasDia = statusHorarios.filter(p => p).length;

            totalAulas += aulasDia;
            totalPresencas += presencasDia;

            if (presencasDia < aulasDia) {
              const faltasNoDia = [];
              statusHorarios.forEach((presente, index) => {
                if (!presente) faltasNoDia.push(`${horarios[index]}º`);
              });

              faltasPorData.push({
                data,
                faltas: aulasDia - presencasDia,
                horariosFaltas: faltasNoDia.join(', '),
                totalHorarios: aulasDia
              });
            }
          }
        }

        const totalFaltas = totalAulas - totalPresencas;
        const porcentagemPresenca = totalAulas > 0 ? (totalPresencas / totalAulas) * 100 : 0;

        doc.setFontSize(12);
        doc.setTextColor(51, 51, 51);

        if (totalAulas > 0) {
          doc.text(`Total de Horários Lançados: ${totalAulas}`, margin, y);
          y += 6;
          doc.text(`Total de Presenças: ${totalPresencas}`, margin, y);
          y += 6;
          doc.text(`Total de Faltas: ${totalFaltas}`, margin, y);
          y += 8;

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
          doc.setTextColor(
            porcentagemPresenca >= 75
              ? [76, 175, 80]
              : [255, 152, 0]
          );
          doc.text(`PERCENTUAL DE PRESENÇA: ${porcentagemPresenca.toFixed(1)}%`, margin, y);

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(51, 51, 51);
          y += 10;

          doc.setFontSize(12);
          doc.text('Detalhe das Faltas:', margin, y);
          y += 6;

          if (faltasPorData.length > 0) {
            faltasPorData.sort((a, b) => new Date(a.data) - new Date(b.data));

            faltasPorData.forEach(item => {
              doc.setFontSize(10);
              doc.text(`- Data: ${item.data}`, margin + 5, y);
              doc.text(`Faltas: ${item.faltas}`, 80, y);
              doc.text(`Horários: ${item.horariosFaltas}`, 125, y);
              y += 6;

              if (y > 280) {
                doc.addPage();
                y = 20;
              }
            });
          } else {
            doc.setFontSize(10);
            doc.text("Nenhuma falta registrada no período.", margin + 5, y);
          }
        } else {
          doc.setTextColor(153, 153, 153);
          doc.text("Nenhum registro de frequência encontrado para esta turma.", margin, y);
        }
      }

      const nomeArquivo = `${tipo.replace(/ /g, '_')}_${this.aluno.matricula}_${turma.registro}.pdf`;
      doc.save(nomeArquivo);

      alert(`O PDF de ${tipo} foi gerado com sucesso! Arquivo: ${nomeArquivo}`);
    },

    navegarParaDetalhesTurma(registro) {
      this.$router.push(`/turmas/detalheturma/${registro}`);
    },

    navegarParaEdicao() {
      alert("Navegação para tela de edição (a implementar).");
    },

    excluirAluno() {
      if (!this.aluno) return;

      const nomeAluno = this.aluno.nome;
      const matriculaExcluir = String(this.aluno.matricula);

      if (confirm(`Tem certeza que deseja EXCLUIR o aluno ${nomeAluno}?`)) {
        let alunos = JSON.parse(localStorage.getItem("alunos") || "[]");
        const novosAlunos = alunos.filter(a => String(a.matricula) !== matriculaExcluir);
        localStorage.setItem("alunos", JSON.stringify(novosAlunos));

        let turmas = JSON.parse(localStorage.getItem("turmas") || "[]");
        const novasTurmas = turmas.map(turma => {
          if (turma.alunosSelecionados) {
            turma.alunosSelecionados =
              turma.alunosSelecionados.filter(m => String(m) !== matriculaExcluir);
          }
          return turma;
        });

        localStorage.setItem("turmas", JSON.stringify(novasTurmas));

        alert(`Aluno ${nomeAluno} removido com sucesso.`);
        this.$router.push('/alunos');
      }
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
    /* Coluna esquerda (dados, botões) e direita (responsáveis) */
    grid-template-columns: 2fr 1fr;
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
    /* Ocupa o espaço da info pessoal e dos botões */
    grid-row: 1 / 3;
}

.turmas-container {
    /* Ocupa toda a largura na parte inferior */
    grid-column: 1 / -1;
    margin-top: 15px;
}

.turmas-container h3 {
    margin-bottom: 15px;
    font-size: 16px;
    font-weight: 700;
    color: #333;
}


/* ==================================== */
/* 🗂️ ESTILOS DOS CARDS DE INFORMAÇÃO */
/* ==================================== */
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
    color: #5A45FF;
    /* Cor de destaque */
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
    /* Fundo roxo claro (como na imagem) */
    background-color: #ffffff;
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

/* ==================================== */
/* 🚀 ESTILOS DOS BOTÕES DE AÇÃO */
/* ==================================== */
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

/* Estilos de Cor dos Botões */
.btn-action.generate {
    background-color: #8e7aff;
    /* Roxo */
}

.btn-action.edit {
    background-color: #b197ff;
    /* Lilás */
}

.btn-action.frequency {
    background-color: #70d2b4;
    /* Verde Água */
}

.btn-action.delete {
    background-color: #ff7f75;
    /* Vermelho/Coral */
}

.btn-action:hover:not(:disabled) {
    filter: brightness(0.9);
}

.btn-action:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* ==================================== */
/* 🎓 ESTILOS DAS TURMAS PERTENCENTES */
/* ==================================== */
.turmas-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.turma-card {
    /* Flexível, com largura mínima */
    flex: 1 1 200px;
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

/* Cores dos cards de Turma */
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

.turma-card.color-yellow .icone {
    color: #d09000;
}

.turma-card.color-green .icone {
    color: #00a060;
}

.turma-card.color-orange .icone {
    color: #d06000;
}

.turma-card.color-blue .icone {
    color: #0060d0;
}

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
/* 🪟 ESTILOS DO MODAL (JANELA FLUTUANTE) */
/* ==================================== */
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
    max-width: 550px;
    display: flex;
    flex-direction: column;
    max-height: 80vh;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
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
    color: #ff7f75;
}

.modal-body {
    padding: 20px;
    overflow-y: auto;
    flex-grow: 1;
}

.instruction-text {
    font-size: 14px;
    color: #4b4b63;
    margin-bottom: 15px;
    line-height: 1.5;
}

.modal-footer {
    padding: 15px 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

/* --- Lista de Seleção no Modal --- */
.turmas-selection-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.selection-row {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    background-color: #f7f7f9;
    border: 1px solid #e1e4e6;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s;
}

.selection-row:has(input:checked) {
    background-color: #f0f0ff;
    border-color: #5A45FF;
}

.selection-row input[type="radio"] {
    margin-right: 15px;
    /* Estilo customizado (opcional) */
    appearance: none;
    background-color: #fff;
    margin: 0;
    font: inherit;
    color: currentColor;
    width: 1.15em;
    height: 1.15em;
    border: 0.15em solid #ccc;
    border-radius: 50%;
    transform: translateY(-0.075em);
    display: grid;
    place-content: center;
    cursor: pointer;
}

.selection-row input[type="radio"]::before {
    content: "";
    width: 0.65em;
    height: 0.65em;
    border-radius: 50%;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em #5A45FF;
}

.selection-row input[type="radio"]:checked::before {
    transform: scale(1);
}

.selection-row input[type="radio"]:checked {
    border-color: #5A45FF;
}


.selection-info {
    display: flex;
    flex-direction: column;
}

.selection-info .turma-nome {
    font-weight: 600;
    color: #333;
}

.selection-info .turma-detalhe {
    font-size: 12px;
    color: #777;
}


/* --- Botões do Modal --- */
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

/* ==================================== */
/* 📱 RESPONSIVIDADE */
/* ==================================== */
@media (max-width: 990px) {
    .content-grid {
        /* Uma única coluna */
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .left-column {
        grid-column: 1 / -1;
    }

    .right-column {
        grid-column: 1 / -1;
        /* Volta ao fluxo normal após a coluna esquerda */
        grid-row: auto;
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

    .modal-footer {
        flex-direction: column-reverse;
    }

    .btn-modal {
        width: 100%;
    }
    .turma-card {
        flex-basis: auto;
    }
}
</style>