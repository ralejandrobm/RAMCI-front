<template>
  <v-layout class="d-flex align-center justify-center px-4 py-4">
   <!-- <mapaGoogle :circulos="circulos" /> -->
       <GoogleMap
      api-key="AIzaSyBgKFy9Wna7cgZbeUnWOfmKa-wnLyNakNA"
      style="width: 1000px; height: 500px"
      :center="center"
      :zoom="12"
    >
      <!-- <Marker v-for="(marke, index) in markers" :options="marke" :key="index" /> -->
      <Circle
        v-for="(circle, index) in circulos"
        :options="circle"
        :key="index"
      />
    </GoogleMap>

    <v-sheet width="250" class="mx-auto" style="padding-left: 15px">
      <v-form ref="form">
        <v-checkbox
          v-model="checkbox"
          label="Personalizar riesgo"
          required
        ></v-checkbox>

        <div class="d-flex flex-column">
          <v-select
            v-model="select1"
            :items="items"
            :rules="[(v) => !!v || 'Item is required']"
            label="Sexo"
            required
            :disabled="!checkbox"
          ></v-select>

          <v-select
            v-model="select2"
            :items="items"
            :rules="[(v) => !!v || 'Item is required']"
            label="Rango de edad"
            required
            :disabled="!checkbox"
          ></v-select>

          <v-select
            v-model="select3"
            :items="items"
            :rules="[(v) => !!v || 'Item is required']"
            label="Typo de vehículo"
            required
            :disabled="!checkbox"
          ></v-select>

          <v-btn
            color="purple"
            class="mt-4"
            block
            @click="Actualiza"
            :disabled="!checkbox"
          >
            Actualiza riesgo
          </v-btn>
        </div>
      </v-form>
    </v-sheet>
  </v-layout>
</template>

<script>
import mapaGoogle from "../components/MapaGoogle.vue"
import { defineComponent } from "vue";
import { GoogleMap, Circle, Marker } from "vue3-google-map";
//import { ref } from 'vue';
import Papa from "papaparse";

export default defineComponent({
  components: { GoogleMap, Circle, Marker, mapaGoogle },


  data() {
    return {
      select1: null,
      select2: null,
      select3: null,
      items: ["Item 1", "Item 2", "Item 3", "Item 4"],
      checkbox: false,
      center: { lat: 20.670303919412067, lng: -103.34941565353975 },
      circulos: [],
      markers: [],
      verMapa: true,
    };
  },

  mounted(){
    this.Actualiza()
  },

  methods: {
    Actualiza() {
      
      //const center = { lat: 20.670303919412067, lng: -103.34941565353975 };
      var circulos = [];
      var markers = [];
      
      var accidentes = [];
      Papa.parse("src/coordenadasAccidentes.csv", {
        download: true,
        header: true,
        complete:  (results) => {
          accidentes = results.data;

          for (let h = 0; h < accidentes.length - 1; h++) {
           
            const circulo = {
              center: {
                lat: parseFloat(accidentes[h].Coordy),
                lng: parseFloat(accidentes[h].Coordx),
              },
              radius: 200,
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#FF0000",
              fillOpacity: 0.35,
            };

            const marker = {
              position: {
                lat: parseFloat(accidentes[h].Coordy),
                lng: parseFloat(accidentes[h].Coordx),
              },
              label: accidentes[h].cantidad,
              title: "Accidente ciclista",
            };
            circulos.push(circulo);
            markers.push(marker);
            //console.log(accidentes[h]);
          }   
          
          this.circulos = circulos;
          this.markers = markers;
        },
        
      });
     
      
      //this.center = center;
      
      //return { center, circulos, markers };
    },
  },

 
 
});
</script>