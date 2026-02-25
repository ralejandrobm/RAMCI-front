<template>
  <v-layout
    class="d-flex align-center justify-center px-4 py-4"
    style="height: 100%"
  >

  <v-navigation-drawer
        expand-on-hover
        location="right"
        permanent
        
      >

    <v-sheet width="250" class="mx-auto" style="padding-left: 15px">
      <v-form ref="form">
        <v-checkbox
          v-model="checkbox"
          label="Personalizar riesgo"
          required
        ></v-checkbox>

        <div class="d-flex flex-column">

          <v-select
            v-model="dia"
            :items="itemsDia"
            item-value="value"
            item-title="text"
            :rules="[(v) => !!v || 'Campo requerido']"
            label="Día"
            required
            :disabled="!checkbox"
          ></v-select>

          <v-select
            v-model="rangoHora"
            :items="itemsRangoHora"
            item-value="value"
            item-title="text"
            :rules="[(v) => !!v || 'Campo requerido']"
            label="Rango de hora"
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
     </v-navigation-drawer>
     <v-main class="fill-height">
    <GoogleMap
      api-key="YourGoogleAPIKey"
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
  </v-main>
    
  </v-layout>
</template>

<script>
import mapaGoogle from "../components/MapaGoogle.vue";
import { defineComponent } from "vue";
import { GoogleMap, Circle, Marker } from "vue3-google-map";


export default defineComponent({
  components: { GoogleMap, Circle, Marker, mapaGoogle },

  data() {
    return {
      dia: "Monday",
      rangoHora: "12:00 a 13:59",
      rangoEdad: "0-19",
      tipoVehiculo: "Truck",

      itemsRangoHora: [
        
        { text: "00:00 a 05:59", value: "0:00 a 05:59" },
        { text: "06:00 a 07:59", value: "06:00 a 07:59" },
        { text: "08:00 a 09:59", value: "08:00 a 09:59" },
        { text: "10:00 a 11:59", value: "10:00 a 11:59" },
        { text: "12:00 a 13:59", value: "12:00 a 13:59" },
        { text: "14:00 a 15:59", value: "14:00 a 15:59" },
        { text: "16:00 a 17:59", value: "16:00 a 17:59" },
        { text: "18:00 a 19:59", value: "18:00 a 19:59" },
        { text: "20:00 a 21:59", value: "20:00 a 21:59" },
        { text: "22:00 a 23:59", value: "22:00 a 23:59" },
        
      ],

      itemsDia: [
        
        { text: "Lunes", value: "Monday" },
        { text: "Martes", value: "Tuesday" },
        { text: "Miércoles", value: "Wednesday" },
        { text: "Jueves", value: "Thursday" },
        { text: "Viernes", value: "Friday" },
        { text: "Sábado", value: "Saturday" },
        { text: "Domingo", value: "Sunday" },
      ],
      itemsRangoEdad: [
        
        { text: "0 a 19", value: "0-19" },
        { text: "20 a 29", value: "20-29" },
        { text: "30 a 39", value: "30-39" },
        { text: "40 a 49", value: "40-49" },
        { text: "50 a 59", value: "50-59" },
        { text: "60 o más", value: "60+" },
        
      ],
      itemsVehiculo: [
        { text: "Vehículo pesado", value: "Truck" },
        { text: "Vehículo de pasajeros", value: "Passenger_vehicle" },
        { text: "Vehículo privado", value: "Private_car" },
        { text: "Colisión multiple", value: "Multiple_collision" },
      ],
      checkbox: true,
      center: { lat: 20.670303919412067, lng: -103.34941565353975 },
      circulos: [],
      
    };
  },

  mounted() {
        this.realizarPrediccion()
  },

  watch: {
    checkbox(nuevoValor, valorAnterior) {
      console.log('Nuevo valor:', nuevoValor);
      console.log('Valor anterior:', valorAnterior);
      if(nuevoValor==false)
      {
        
      }
    }
  },

  methods: {
    
    //////////////////////////////////////////////////////////////////////////////////////
    async realizarPrediccion() {
      var circulos = [];
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        age: this.rangoEdad,
        hourly_range: this.rangoHora,
        vehicle_type: this.tipoVehiculo,
        day: this.dia
      });
      

      console.log(raw);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        "http://localhost:8000/api/ai/dynamic/logistic-regressions",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result)
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

   
    ////////////////////////////////////////////////////////////////////////////////////
  },
});
</script>
