<template>
      <v-layout>
      <v-navigation-drawer
        expand-on-hover
        rail
        permanent
      >
        <v-list>
          <v-list-item
            prepend-avatar="/logob.png"
            title="RAMCI"
           
          ></v-list-item>
        </v-list>
       

        <v-list density="compact" nav >
        
          <v-list-item prepend-icon="mdi-map" title="RAMCI Infraestructura" value="mapa" @click="navigateTo('/mapa')"></v-list-item>
         
           <v-list-item prepend-icon="mdi-map" title="RAMCI En tiempo real" value="dinamico" @click="navigateTo('/dinamico')"></v-list-item>

       <!--   <v-list-item prepend-icon="mdi-calculator" title="calcular riesgo" value="riesgo" @click="navigateTo('/riesgo')"></v-list-item> !-->
         
          <v-list-item prepend-icon="mdi-file-document" title="Metodología" value="metodo" @click="navigateTo('/metodo')"></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar :elevation="1" >
        <v-app-bar-title class="text-center">Predicción de severidad</v-app-bar-title>
      </v-app-bar>
      <v-main style="height: 100vh;">
        <router-view />
      </v-main>
    </v-layout>
</template>

<script >
export default {
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    }
  }
};

</script>
