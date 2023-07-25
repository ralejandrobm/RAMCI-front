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
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import * as tf from "@tensorflow/tfjs";
import { toRaw } from "vue";

export default defineComponent({
  components: { GoogleMap, Circle, Marker, mapaGoogle },

  data() {
    return {
      sexo: "Hombre",
      rangoEdad: "0 a 9",
      tipoVehiculo: "Bicicleta",
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
        "Vehículo privado",
      ],
      checkbox: false,
      center: { lat: 20.670303919412067, lng: -103.34941565353975 },
      circulos: [],
      modelo: null,
      trafficVariable: [],
      trafficZone: [],
      dataset: [],
    };
  },

  mounted() {
    this.ActualizaModeloTrafico();
    this.cargarModeloDinamico();
  },

  methods: {
    async ActualizaModeloTrafico() {
      var circulos = [];

      try {
        const url =
          "https://www.googleapis.com/drive/v3/files/1njeXoo1FNx0nBxxvnp4FiGawnPZpEtNUUzQDcgXJy9g/export?mimeType=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet&key=AIzaSyBgKFy9Wna7cgZbeUnWOfmKa-wnLyNakNA";

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

            //console.log(accidentes);
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

    async cargarModeloDinamico() {
      try {
        const url =
          "https://www.googleapis.com/drive/v3/files/1KoS9HTfD-HH4hoLYuKZr1TlEU9VcuWRaI13lugV-pw8/export?mimeType=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet&key=AIzaSyBgKFy9Wna7cgZbeUnWOfmKa-wnLyNakNA";

        fetch(url)
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

        fetch(url)
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

            /*
            const data = this.trafficZone;
            const csvData = this.convertToCSV(data);
            const blob = new Blob([csvData], {
              type: "text/csv;charset=utf-8;",
            });
            saveAs(blob, "traficoZona.csv");
            */
          })
          .catch((error) => {
            console.log("Error al leer el archivo de Excel:", error);
          });
      } catch (error) {
        console.error(error);
      }

      Papa.parse("/datos_dinamico_labels_varibleZona.csv", {
        download: true,
        header: true,
        complete: (results) => {
          this.dataset = results.data;
        },
      });

      try {
        this.modelo = await tf.loadLayersModel("./modelo/model.json");
        console.log("modelo cargado");
      } catch (error) {
        console.error("Error al cargar el modelo:", error);
      }
    },

    rowsToOneHot(rows, classMaps) {
      const categoricalColumns = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        ,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
      ];

      return rows.map((row) =>
        row
          .map((value, index) => {
            if (categoricalColumns.includes(index)) {
              const classIndex = classMaps[index].indexOf(value);
              return tf.oneHot(classIndex, classMaps[index].length).arraySync();
            } else {
              return parseFloat(value);
            }
          })
          .flat()
      );
    },

    async realizarPrediccion() {
      //leer el archivo dataset
      const csvFilePath = "./datos_dinamico_labels_varibleZonaSinVacios.csv";
      const response = await fetch(csvFilePath);
      const csvData = await response.text();
      const { data, meta } = Papa.parse(csvData, { header: true });
      console.log("1 valores meta", meta);

      const numericFeatures = data.map((row) =>
        Object.values(row).slice(0, 3).map(Number)
      );
      //console.log(numericFeatures)
      const categoricalFeatures = data.map((row) =>
        Object.values(row).slice(3, -1)
      );

      const categoricalColumns = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        ,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
      ];

      // Obtener todas las clases únicas y crear el mapeo
      const classMaps = {};
      categoricalColumns.forEach((columnIndex) => {
        const classes = new Set();
        categoricalFeatures.forEach((row) => {
          classes.add(row[columnIndex]);
        });
        classMaps[columnIndex] = Array.from(classes);
      });

      console.log("2 clases de las columnas: ", classMaps);
      // Convertir todas las filas de características categóricas a one-hot encoding
      const oneHotData = this.rowsToOneHot(categoricalFeatures, classMaps);
      console.log("3 tamaño del one hot: ", oneHotData.length);
      console.log(
        "4 tamaño de los features numericos: ",
        numericFeatures.length
      );

      // Convertir los arreglos en tensores de TensorFlow
      const numericFeaturesTensor = await tf.tensor2d(numericFeatures);
      const oneHotDataTensor = await tf.tensor2d(oneHotData);
      // Crear el tensor final de características one-hot
      const encodedFeatures = await tf.concat(
        [numericFeaturesTensor, oneHotDataTensor],
        1
      );

      // Imprimir las primeras 5 filas de encodedFeatures
      await encodedFeatures
        .slice([0, 0], [5, encodedFeatures.shape[1]])
        .array()
        .then((array) => {
          console.log("5 encodedFeatures:", array);
        });

      const labels = data.map((row) => Number(row.label));

      // Convertir las etiquetas a tensores de TensorFlow
      const tensorLabels = await tf.tensor2d(labels, [labels.length, 1]);

      //verifica los tamaños
      console.log("6 Forma de encodedFeatures:", encodedFeatures.shape);
      console.log("7 Forma de tensorLabels:", tensorLabels.shape);

      //predecir
      console.log("8 verificar en la entrada a predecir", encodedFeatures);
      let raw_model = toRaw(this.modelo);

      let result = raw_model.predict(encodedFeatures);
      console.log("no manches paso", result);
      const predictions = await this.modelo
        .predict(encodedFeatures)
        .arraySync();
      console.log("Primeras 100 predicciones:");
      console.log(predictions.slice(0, 100));
      // Convertir las etiquetas de las predicciones a valores binarios (0 o 1)
      const binaryPredictions = predictions.map((value) =>
        value >= 0.5 ? 1 : 0
      );

      // Calcular las métricas de evaluación manualmente
      const truePositives = binaryPredictions.reduce(
        (acc, prediction, index) => {
          return prediction === labels[index] ? acc + 1 : acc;
        },
        0
      );

      const falsePositives = binaryPredictions.reduce(
        (acc, prediction, index) => {
          return prediction === 1 && labels[index] === 0 ? acc + 1 : acc;
        },
        0
      );

      const falseNegatives = binaryPredictions.reduce(
        (acc, prediction, index) => {
          return prediction === 0 && labels[index] === 1 ? acc + 1 : acc;
        },
        0
      );

      const precision = truePositives / (truePositives + falsePositives);
      const recall = truePositives / (truePositives + falseNegatives);
      const f1Score = (2 * precision * recall) / (precision + recall);

      // Imprimir las métricas
      console.log("PrecisionCarga:", precision);
      console.log("RecallCarga:", recall);
      console.log("F1-scoreCarga:", f1Score);
    },

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
  },
});
</script>