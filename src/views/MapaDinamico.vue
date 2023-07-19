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
            v-model="sexo"
            :items="itemsSexo"
            :rules="[(v) => !!v || 'Campo requerido']"
            label="Sexo"
            required
            :disabled="!checkbox"
          ></v-select>

          <v-select
            v-model="rangoEdad"
            :items="itemsRangoEdad"
            :rules="[(v) => !!v || 'Campo requerido']"
            label="Rango de edad"
            required
            :disabled="!checkbox"
          ></v-select>

          <v-select
            v-model="tipoVehiculo"
            :items="itemsVehiculo"
            :rules="[(v) => !!v || 'Campo requerido']"
            label="Typo de vehículo"
            required
            :disabled="!checkbox"
          ></v-select>

          <v-btn
            color="purple"
            class="mt-4"
            block
            @click="realizarPrediccion"
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

import * as XLSX from "xlsx";
//import Papa from "papaparse";

export default defineComponent({
  components: { GoogleMap, Circle, Marker, mapaGoogle },

  data() {
    return {
      sexo: null,
      rangoEdad: null,
      tipoVehiculo: null,
      itemsSexo: ["Hombre", "Mujer"],
      itemsRangoEdad: [
        "0 a 9",
        "10 a 19",
        "20 a 29",
        "30 a 39",
        "40 a 49",
        "50 a 59",
        "60 a 69",
        " 70 o más",
      ],
      itemsVehiculo: [
        "Bicicleta",
        "Vehículo pesado",
        "Vehículo de pasajeros",
        "Tren",
        "Vehículos privados",
      ],
      checkbox: false,
      center: { lat: 20.670303919412067, lng: -103.34941565353975 },
      circulos: [],
      markers: [],
      verMapa: true,
      modelo: null,
    };
  },

  mounted() {
    this.Actualiza();
    this.cargarModelo();
  },

  methods: {
    async Actualiza() {
      var circulos = [];

      try {
        const url =
          "https://www.googleapis.com/drive/v3/files/1njeXoo1FNx0nBxxvnp4FiGawnPZpEtNUUzQDcgXJy9g/export?mimeType=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet&key=AIzaSyBgKFy9Wna7cgZbeUnWOfmKa-wnLyNakNA";
        //const url = "https://www.googleapis.com/drive/v3/files/1KoS9HTfD-HH4hoLYuKZr1TlEU9VcuWRaI13lugV-pw8/export?mimeType=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet&key=AIzaSyBgKFy9Wna7cgZbeUnWOfmKa-wnLyNakNA";
        // const url = "https://www.googleapis.com/drive/v3/files/1C6JmWHUHLgerVjPq_PNHBLW5PfJ2fHjhUmw-vfiN0AA/export?mimeType=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet&key=AIzaSyBgKFy9Wna7cgZbeUnWOfmKa-wnLyNakNA";

        fetch(url)
          .then((response) => response.arrayBuffer())
          .then((buffer) => {
            // Convierte el buffer en un libro de Excel
            const workbook = XLSX.read(buffer, { type: "buffer" });

            // Obtiene la primera hoja del libro de Excel
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Accede a los datos de la primera hoja
            const accidentes = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
            });

            console.log(accidentes);
            // Aquí puedes realizar operaciones con los datos de la primera hoja
            for (let h = 0; h < accidentes.length; h++) {
              var color = "#FF0000";
              if (accidentes[h][3] == "Sin riesgo") {
                color = "#43DA28";
              } else if (accidentes[h][3] == "Poco riesgo") {
                color = "#EEF11D";
              } else if (accidentes[h][3] == "Riesgo moderado") {
                color = "#FAAA26";
              } else if (accidentes[h][3] == "Alto riesgo") {
                color = "#FF0000";
              }

              const circulo = {
                center: {
                  lat: parseFloat(accidentes[h][1]),
                  lng: parseFloat(accidentes[h][2]),
                },
                radius: 100,
                strokeColor: color,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: color,
                fillOpacity: 0.35,
              };

              circulos.push(circulo);

              //console.log(accidentes[h]);
            }

            this.circulos = circulos;
          })
          .catch((error) => {
            console.log("Error al leer el archivo de Excel:", error);
          });
      } catch (error) {
        console.error(error);
      }
    },

    async cargarModelo() {},

    realizarPrediccion() {},
  },
});
</script>