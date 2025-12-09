import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import Home from '../views/Home.vue'
import Alunos from '../views/Alunos.vue'
import NovoAluno from '../views/NovoAluno.vue'
import Turmas from '../views/Turmas.vue'
import NovaTurma from '../views/NovaTurmas.vue'
import Professores from '../views/Professores.vue'
import NovoProfessor from '../views/NovoProfessor.vue'
import Suporte from '../views/Suporte.vue'
import Ajuda from '../views/Ajuda.vue'
import TelaLogin from '../views/TelaLogin.vue'
import AlunoDetalhe from '@/views/AlunoDetalhe.vue'
import ProfessorDetalhe from '@/views/ProfessorDetalhe.vue'
import TurmaDetalhe from '@/views/TurmaDetalhe.vue'
import LancarFrquencia from '@/views/LancarFrquencia.vue'
import LancarAtividade from '@/views/LancarAtividade.vue'
import LancarNota from '@/views/LancarNota.vue'
import IA from '@/views/IA.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },

    // Rotas protegidas
    { path: '/home', component: Home, meta: { requiresAuth: true }},
    { path: '/alunos', component: Alunos, meta: { requiresAuth: true }},
  
    { path: '/alunos/novo', component: NovoAluno, meta: { requiresAuth: true }},
    { path: '/turmas', component: Turmas, meta: { requiresAuth: true }},
    { path: '/turmas/novo', component: NovaTurma, meta: { requiresAuth: true }},
    { path: '/turmas/detalheturma/:registro', component: TurmaDetalhe, meta: { requiresAuth: true }},
    { path: '/turmas/detalheturma/lancarfrequencia/:registro', name: 'LancarFrequencia', component: LancarFrquencia, meta: { requiresAuth: true }},
    { path: '/turmas/detalheturma/lancaratividade/:registro', component: LancarAtividade, meta: { requiresAuth: true }},
    { path: '/turmas/detalheturma/lancarnota/:registro', component: LancarNota, meta: { requiresAuth: true }},

    { path: '/professores', component: Professores, meta: { requiresAuth: true }},
    { path: '/professores/novo', component: NovoProfessor, meta: { requiresAuth: true }},
    { path: '/professores/detalheprofessor/:registro', component: ProfessorDetalhe, meta: { requiresAuth: true }},
  
    { path: '/alunos/detalhealuno/:matricula', name: 'DetalheAluno', component: AlunoDetalhe, props: true, meta: { requiresAuth: true }},
    
    // Rotas que agora requerem autenticação
    { path: '/suporte', component: Suporte, meta: { requiresAuth: true }},
    { path: '/ia', component: IA, meta: { requiresAuth: true }},
    { path: '/ajuda', component: Ajuda, meta: { requiresAuth: true }},

    // Livre
    { path: '/login', name: 'login', component: TelaLogin }
  ]
})

// GUARD — protege as rotas
router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }
})

export default router