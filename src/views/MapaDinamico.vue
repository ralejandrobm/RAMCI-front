<template>
  <v-layout
    class="d-flex align-center justify-center px-4 py-4"
    style="height: 100%"
  >
    <GoogleMap
      api-key="AIzaSyBgKFy9Wna7cgZbeUnWOfmKa-wnLyNakNA"
      style="width: 100%; height: 100%"
      :center="center"
      :zoom="12"
    >
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
            item-value="value"
            item-title="text"
            :rules="[(v) => !!v || 'Campo requerido']"
            label="Sexo"
            required
            :disabled="!checkbox"
          ></v-select>

          <v-select
            v-model="rangoEdad"
            :items="itemsRangoEdad"
            item-value="value"
            item-title="text"
            :rules="[(v) => !!v || 'Campo requerido']"
            label="Rango de edad"
            required
            :disabled="!checkbox"
          ></v-select>

          <v-select
            v-model="tipoVehiculo"
            :items="itemsVehiculo"
            item-value="value"
            item-title="text"
            :rules="[(v) => !!v || 'Campo requerido']"
            label="Tipo de vehículo"
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
            Actualizar riesgo
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
import Papa from "papaparse";


export default defineComponent({
  components: { GoogleMap, Circle, Marker, mapaGoogle },

  data() {
    return {
      sexo: "M",
      rangoEdad: "0-19",
      tipoVehiculo: "Truck",
      itemsSexo: [
        { text: "Hombre", value: "M" },
        { text: "Mujer", value: "F" },
      ],
      itemsRangoEdad: [
        
        { text: "0 a 19", value: "0-19" },
        { text: "20 a 29", value: "20-29" },
        { text: "30 a 39", value: "30-39" },
        { text: "40 a 49", value: "40-49" },
        { text: "50 a 59", value: "50-59" },
        { text: "60 a 69", value: "60-69" },
        { text: "70 o más", value: "70+" },
      ],
      itemsVehiculo: [
        { text: "Vehículo pesado", value: "Truck" },
        { text: "Vehículo de pasajeros", value: "Passenger_vehicle" },
        { text: "Bicicleta", value: "Bicycle" },
        { text: "Vehículo privado", value: "Private_car" },
      ],
      checkbox: false,
      center: { lat: 20.670303919412067, lng: -103.34941565353975 },
      circulos: [],
      trafficVariable: [],
      trafficZone: [],
      dataset: [],
    };
  },

  mounted() {
    this.ActualizaModeloTrafico();
    this.cargarDatosDinamico();
  },

  watch: {
    checkbox(nuevoValor, valorAnterior) {
      console.log('Nuevo valor:', nuevoValor);
      console.log('Valor anterior:', valorAnterior);
      if(nuevoValor==false)
      {
        this.ActualizaModeloTrafico();
      }
    }
  },

  methods: {
    async ActualizaModeloTrafico() {
          var circulos = [];
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        "https://apiramci.ralejandro.com/api/ai/traffic/logistic-regressions",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          result.result.forEach((item) => {
            var color = "#FF0000";
            if (item.risk == "Sin riesgo") {
              color = "#43DA28";
            } else if (item.risk == "Poco riesgo") {
              color = "#EEF11D";
            } else if (item.risk == "Riesgo moderado") {
              color = "#FAAA26";
            } else if (item.risk == "Alto riesgo") {
              color = "#FF0000";
            }

            const circulo = {
              center: {
                lat: parseFloat(item.latitude),
                lng: parseFloat(item.longitude),
              },
              radius: 100,
              strokeColor: color,
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: color,
              fillOpacity: 0.35,
            };

            circulos.push(circulo);
          });
          this.circulos = circulos;
        })

        .catch((error) => console.log("error", error));
    },

    ///////////////////////////////////////////////////////////////////////
    async cargarDatosDinamico() {
      try {
        const url =
          "https://www.googleapis.com/drive/v3/files/1KoS9HTfD-HH4hoLYuKZr1TlEU9VcuWRaI13lugV-pw8/export?mimeType=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet&key=AIzaSyBgKFy9Wna7cgZbeUnWOfmKa-wnLyNakNA";

        await fetch(url)
          .then((response) => response.arrayBuffer())
          .then((buffer) => {
            // Convierte el buffer en un libro de Excel
            const workbook = XLSX.read(buffer, { type: "buffer" });

            // Obtiene la primera hoja del libro de Excel
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Accede a los datos de la primera hoja
            this.trafficVariable = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
            });

            const csv = Papa.unparse(this.trafficVariable);

            const { data, meta } = Papa.parse(csv, { header: true });
            //console.log("1 valores meta", meta, data);

            this.trafficVariable = data;
          })
          .catch((error) => {
            console.log("Error al leer el archivo de Excel:", error);
          });
      } catch (error) {
        console.error(error);
      }

      try {
        const url =
          "https://www.googleapis.com/drive/v3/files/1C6JmWHUHLgerVjPq_PNHBLW5PfJ2fHjhUmw-vfiN0AA/export?mimeType=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet&key=AIzaSyBgKFy9Wna7cgZbeUnWOfmKa-wnLyNakNA";

        await fetch(url)
          .then((response) => response.arrayBuffer())
          .then((buffer) => {
            // Convierte el buffer en un libro de Excel
            const workbook = XLSX.read(buffer, { type: "buffer" });

            // Obtiene la primera hoja del libro de Excel
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Accede a los datos de la primera hoja
            this.trafficZone = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
            });

            const csv = Papa.unparse(this.trafficZone);

            const { data, meta } = Papa.parse(csv, { header: true });
            //console.log("1 valores meta", meta, data);

            this.trafficZone = data;
            //const data = this.trafficZone;
            //const csvData = this.convertToCSV(data);
            //const blob = new Blob([csvData], {
            //  type: "text/csv;charset=utf-8;",
            //});
            //saveAs(blob, "traficoZona.csv");
          })
          .catch((error) => {
            console.log("Error al leer el archivo de Excel:", error);
          });
      } catch (error) {
        console.error(error);
      }

      await Papa.parse("/datos_dinamico_labels_varibleZona.csv", {
        download: true,
        header: true,
        complete: (results) => {
          this.dataset = results.data;
        },
      });

      //console.log("variable de trafico",this.trafficVariable);
      const newData = await this.trafficZone.map((item) => {
        // Buscamos el objeto en meta que tenga el mismo id que el elemento actual de data
        const matchingMeta = this.trafficVariable.find(
          (metaItem) => metaItem.id === item.id
        );

        // Creamos un nuevo objeto con las propiedades originales de data y la nueva columna
        return {
          ...item,
          Traffic_variable: matchingMeta ? matchingMeta.Traffic_variable : null, // Asignamos el valor de meta o null si no se encuentra el id
        };
      });

      //console.log(newData);
    },

    //////////////////////////////////////////////////////////////////////////////////////
    async realizarPrediccion() {
      var circulos = [];
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

    
      var raw = JSON.stringify({
        age: this.rangoEdad,
        sex: this.sexo,
        vehicle_type: this.tipoVehiculo,
      });
      

      console.log(raw);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        "https://apiramci.ralejandro.com/api/ai/dynamic/logistic-regressions",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          result.result.forEach((item) => {
            var color = "#FF0000";
            if (item.risk == "Sin riesgo") {
              color = "#43DA28";
            } else if (item.risk == "Poco riesgo") {
              color = "#EEF11D";
            } else if (item.risk == "Riesgo moderado") {
              color = "#FAAA26";
            } else if (item.risk == "Alto riesgo") {
              color = "#FF0000";
            }

            const circulo = {
              center: {
                lat: parseFloat(item.latitude),
                lng: parseFloat(item.longitude),
              },
              radius: 100,
              strokeColor: color,
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: color,
              fillOpacity: 0.35,
            };

            circulos.push(circulo);
          });
          this.circulos = circulos;
        })

        .catch((error) => console.log("error", error));
    },

    //////////////////////////////////////////////////////////////////////////
    convertToCSV(data) {
      //const headers = ["id", "predominant_color","exponential_color_weighting","linear_color_weighting","diffuse_logic_traffic"];
      const rows = data.map((item) => [
        item[0],
        item[1],
        item[2],
        item[3],
        item[4],
      ]);
      //console.log(rows);
      //return [headers, ...rows].map((row) => row.join(",")).join("\n");
      return [...rows].map((row) => row.join(",")).join("\n");
    },
    ////////////////////////////////////////////////////////////////////////////////////
  },
});
</script>