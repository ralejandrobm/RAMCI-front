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
import mapaGoogle from "../components/MapaGoogle.vue";
import { defineComponent } from "vue";
import { GoogleMap, Circle, Marker } from "vue3-google-map";
//import { read } from 'xlsx';
import * as XLSX from "xlsx"
//import Papa from "papaparse";

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

  mounted() {
    this.Actualiza();
  },

  methods: {
    async Actualiza() {
      //const center = { lat: 20.670303919412067, lng: -103.34941565353975 };
      var circulos = [];
      var markers = [];
      var accidentes = [];

      /*
      Papa.parse("/coordenadasAccidentes.csv", {
        download: true,
        header: true,
        complete:  (results) => {
          accidentes = results.data;

          for (let h = 1; h < accidentes.length; h++) {
           
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

      */
      //https://drive.google.com/file/d/1fGKSWHCswN-t0cloNhe2rwWnxo7lciIF/view?usp=sharing

      //https://docs.google.com/spreadsheets/d/1wcq3IGTRx30qKLk3dY9_wwnKCfKg6OKV/edit?usp=sharing&ouid=114133893460612313255&rtpof=true&sd=true
       // "https://www.googleapis.com/drive/v3/files/1KoS9HTfD-HH4hoLYuKZr1TlEU9VcuWRaI13lugV-pw8/export?mimeType=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet&key=AIzaSyBgKFy9Wna7cgZbeUnWOfmKa-wnLyNakNA";
        
      try {
        const url = "https://www.googleapis.com/drive/v3/files/1KoS9HTfD-HH4hoLYuKZr1TlEU9VcuWRaI13lugV-pw8/export?mimeType=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet&key=AIzaSyBgKFy9Wna7cgZbeUnWOfmKa-wnLyNakNA";
        

        
     
        fetch(url)
          .then((response) => response.arrayBuffer())
          .then((buffer) => {
            // Convierte el buffer en un libro de Excel
            const workbook = XLSX.read(buffer, { type: "buffer" });

            // Obtiene la primera hoja del libro de Excel
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Accede a los datos de la primera hoja
            const accidentes = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            console.log(accidentes);
            // Aquí puedes realizar operaciones con los datos de la primera hoja
            for (let h = 1; h < accidentes.length; h++) {
           
            const circulo = {
              center: {
                lat: parseFloat(accidentes[h][2]),
                lng: parseFloat(accidentes[h][1]),
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
                lat: parseFloat(accidentes[h][2]),
                lng: parseFloat(accidentes[h][1]),
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

          })
          .catch((error) => {
            console.log("Error al leer el archivo de Excel:", error);
          });
      } catch (error) {
        console.error(error);
      }
    },
  },
});
</script>