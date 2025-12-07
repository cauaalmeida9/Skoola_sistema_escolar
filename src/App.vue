<script setup>
import Menu from './components/menu.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const showMenu = computed(() => route.path !== '/login')
</script>

<template>
  <div class="layout">

    <Menu v-if="showMenu" />

    <main :class="{ 'has-menu': showMenu }">
      <router-view />
    </main>

  </div>
</template>

<style>
body{
     font-family: Arial, Helvetica, sans-serif;
    margin:0 ;
    padding: 0;
}
.layout {
  display: flex;
  width: 100%;
  height: 100vh;
}

/* quando o menu está aberto */
main.has-menu {
  margin-left: 256px !important;
  transition: margin-left .3s ease;
}

/* quando o menu está fechado */
.sidebar.active ~ main {
  margin-left: 92px !important;
}

main {
  flex: 1;
  height: 100vh;
  overflow-y: auto;
  background: #eef2ff;
  padding: 0; /* remove padding extra */
}
</style>
