<template>
  <div :class="['sidebar', { active: sidebarActive }]">

      
      <div class="menu-btn" @click="toggleSidebar">
        <i class="ph-bold ph-caret-left"></i>
      </div>

      <div class="head">
        <div class="user-img">
          <img src="/public/S.svg" alt="Logo" />
        </div>

        <div class="user-details">
          <p class="title">SKOOLA</p>
          <p class="name">Escola Jesus</p>
        </div>
      </div>

      <div class="menu">
        <p class="title">Menu</p>

        <ul>
          <li v-for="(item, index) in menuItems" :key="index" :class="{ active: activeMain === index }">
            
            <router-link
              v-if="!item.children"
              :to="item.route"
              class="menu-item"
              active-class="active"
            >
              <i :class="item.icon"></i>
              <span class="text">{{ item.title }}</span>
            </router-link>

            <div v-else class="menu-item" @click="toggleMain(index)">
              <i :class="item.icon"></i>
              <span class="text">{{ item.title }}</span>
              <i class="arrow ph-bold ph-caret-down"
                  :class="{ open: activeMain === index }"></i>
            </div>

            <ul class="sub-menu" v-if="item.children" v-show="activeMain === index">
              <li v-for="(child, cIndex) in item.children" :key="cIndex">
                <router-link :to="child.route" class="sub-menu-item" active-class="active">
                  <span class="text">{{ child.title }}</span>
                </router-link>
              </li>
            </ul>

          </li>
        </ul>
      </div>

      <div class="menu">
        <p class="title">Suporte</p>
        <ul>
          <li v-for="(item, index) in menuSuport" :key="index">
            <router-link :to="item.route" class="menu-item" active-class="active">
              <i :class="item.icon"></i>
              <span class="text">{{ item.title }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="push-bottom">
        <div class="menu">
          <p class="title">Ajuda</p>
          <ul>
            <li v-for="(item, index) in menuAccount" :key="index">
              <router-link :to="item.route" class="menu-item" active-class="active">
                <i :class="item.icon"></i>
                <span class="text">{{ item.title }}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>

    
  </div>
</template>

<script>
export default {
  data() {
    return {
      sidebarActive: false,
      activeMain: null,

      menuItems: [
        { title: "Home", icon: "icon ph-bold ph-house-simple", route: "/home" },

        {
          title: "Alunos",
          icon: "icon ph-bold ph-users",
          children: [
            { title: "Todos os alunos", route: "/alunos" },
            { title: "Cadastrar novo Aluno", route: "/alunos/novo" }
          ]
        },

        {
          title: "Turmas",
          icon: "icon ph-bold ph-chalkboard-teacher",
          children: [
            { title: "Turmas ativas", route: "/turmas" },
            { title: "Cadastrar nova turma", route: "/turmas/novo" }
          ]
        },

        {
          title: "Professores",
          icon: "icon ph-bold ph-user",
          children: [
            { title: "Todos os professores", route: "/professores" },
            { title: "Cadastrar novo professor", route: "/professores/novo" }
          ]
        }
      ],

      menuSuport: [
        { title: "Suporte", icon: "icon ph-bold ph-gear", route: "/suporte" }
      ],

      menuAccount: [
        { title: "Tutoriais em video", icon: "icon ph-bold ph-question", route: "/ajuda" },
        { title: "Sair", icon: "icon ph-bold ph-sign-out", route: "/logout" }
      ],
    };
  },

  methods: {
    toggleSidebar() {
      this.sidebarActive = !this.sidebarActive;
    },
    toggleMain(index) {
      this.activeMain = this.activeMain === index ? null : index;
    }
  },
  logout() {
  const auth = useAuthStore()
  auth.logout()
}

};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}


.sidebar {
  position: fixed;
  top:0;
  left: 0;
  width: 256px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: rgb(255, 255, 255);
  padding: 24px;
  border-radius: 30px;
  transition: width 0.3s ease;
  z-index: 100;
}

.sidebar .head {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: visible;
}
.sidebar .head .user-img,
.sidebar .head .user-img img {
  width: 30px;
  height: 30px;
  object-fit: contain;
}
.user-img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
}

.user-img img {
  width: 44px;
  height: 44px;
  object-fit: cover;
}

.user-details .title,
.menu .title {
  font-size: 10px;
  font-weight: 500;
  color: #757575;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.user-details .name {
  font-size: 14px;
  font-weight: 500;
}

.nav {
  flex: 1;
}

.menu ul li {
  position: relative;
  list-style: none;
  margin-bottom: 5px;
}

/* ---------------------------------------------------- */
/* ESTILOS PRINCIPAIS: Aplicados à classe .menu-item (usada em Home, Pais de Submenus, Suporte, Ajuda, Sair) */
/* ---------------------------------------------------- */
.menu ul li .menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #757575;
  text-decoration: none;
  padding: 12px 8px;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
}

/* Estilos Hover/Active para .menu-item */
.menu ul li .menu-item:hover,
.menu ul li .menu-item.active, /* Item ativo sem submenu */
.menu ul li.active > .menu-item { /* Item pai ativo com submenu aberto */
  color: #000;
  background-color: #f6f6f6;
}

/* ---------------------------------------------------- */
/* ESTILOS DO SUB-MENU */
/* ---------------------------------------------------- */

.menu .sub-menu {
  margin-left: 20px;
  padding-left: 20px;
  padding-top: 5px;
  border-left: 1px solid #f6f6f6;
}

/* NOVO: Estilos base para os links do sub-menu (classe .sub-menu-item) */
.menu .sub-menu li .sub-menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    font-weight: 500;
    color: #757575;
    text-decoration: none;
    padding: 10px 8px;
    border-radius: 8px;
    transition: all 0.3s;
    /* O flex e o gap são importantes para garantir que o texto não fique colado */
}

/* NOVO: Estilo Hover/Active para os links do sub-menu */
.menu .sub-menu li .sub-menu-item:hover,
.menu .sub-menu li .sub-menu-item.active {
    color: #000;
    background-color: #f6f6f6;
}

/* Remover ou ajustar a regra antiga se existir para evitar conflito */
/*
.menu .sub-menu li a {
  padding: 10px 8px;
  font-size: 12px;
}
*/
/* ---------------------------------------------------- */

.menu ul li .icon {
  font-size: 20px;
}

.menu ul li .text {
  flex: 1;
}

.menu ul li .arrow {
  font-size: 14px;
  transition: transform 0.3s;
}

.menu ul li .arrow.open {
  transform: rotate(180deg);
}


.menu:not(:last-child) {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 2px solid #f6f6f6;
}
.push-bottom {
  margin-top: auto;
}
.menu-btn{
  position: absolute;
  right: -14px;
  top: 3.5%;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #757575;
  border: 2px solid(#f6f6f6);
  background-color: #fff;
  transition: transform 0.3s ease, right 0.3s ease;

}

.menu-btn:hover i{
  color:#000;
}
.menu-btn i{
  transition: all 0.3s;
}

.sidebar.active{
  width: 92px
}
.sidebar.active .head {
  justify-content: center;
  gap: 0;
}
.sidebar.active .menu-btn{
  transform: rotate(180deg);
}
.sidebar.active .user-details{
  display: none;
}
.sidebar.active .menu .title{
  text-align: center;
}
.sidebar.active .menu ul li .arrow{
  display: none;
}

/* Seletores ajustados para .menu-item para o modo colapsado */
.sidebar.active .menu > ul > li > .menu-item{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar.active .menu > ul > li > .menu-item .text{
  position: absolute;
  left: 70px;
  top: 50%;
  transform: translateY(-50%);
  padding: 10px;
  border-radius: 4px;
  color: #fff;
  background-color: #000;
  opacity: 0;
  visibility:hidden ;
  transition: all 0.3s;
}

.sidebar.active .menu > ul > li > .menu-item .text::after{
  content: "";
  position: absolute;
  left: -5px;
  top:20%;
  width: 20px;
  height: 20px;
  border-radius: 2px;
  background-color: #000;
  transform: rotate(45deg);
  z-index: -1;
}

.sidebar.active .menu > ul > li > .menu-item:hover .text{
  left: 50px;
  opacity: 1;
  visibility: visible;
}
.sidebar.active .menu .sub-menu{
  position: absolute;
  top:0;
  left: 20px;
  width: 200px;
  border-radius: 20px;
  padding: 10px 20px;
  border: 1px solid #f6f6f6;
  background-color: #fff;
  box-shadow: 0px 10px 8px rgba(0, 0, 0, 0.1);
}
</style>