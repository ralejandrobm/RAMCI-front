<template>
  
    <v-layout class="d-flex align-center justify-center px-4 py-4" style="height: 100%;">
       <GoogleMap
      api-key="YourAPIKey"
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
    </v-layout>

</template>

<script>
import { defineComponent } from "vue";
import { GoogleMap, Circle, Marker } from "vue3-google-map";

import Papa from "papaparse";

export default defineComponent({

  components: { GoogleMap, Circle, Marker },

  setup() {
    const center = { lat: 20.670303919412067, lng: -103.34941565353975 };
   
    var circulos = [];
    var markers = [];
 
   
    var accidentes = [];

    //Papa.parse("/gbInfraestructuraManuelV1.csv", {
     // Papa.parse("/gbInfraestructuraManuelV2.csv", {
     // Papa.parse("/ramdom-forest.csv", {
     // Papa.parse("/regresionLogisticaPrediccion.csv", {
      Papa.parse("/regresionLogisticaPrediccionInter.csv", {
      download: true,
      header: true,
      complete:  (results)  => {
        accidentes = results.data;
       
        
        for (let h = 1; h < accidentes.length; h++) {
          
          var color = "#FF0000"
          if(accidentes[h].riesgo=="Sin riesgo")
          {
              color = "#43DA28"
          }else if(accidentes[h].riesgo=="Poco riesgo")
          {
              color = "#EEF11D"
          }
          else if(accidentes[h].riesgo=="Riesgo moderado")
          {
              color = "#FAAA26"
          }
          else if(accidentes[h].riesgo=="Alto riesgo")
          {
              color = "#FF0000"
          }
          
          const circulo = {
            center: { lat: parseFloat(accidentes[h].Coordy), lng: parseFloat(accidentes[h].Coordx) },
            radius: 100,
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: 0.35,
          };

         

          circulos.push(circulo);
         

          //console.log(accidentes[h])
          
        } 
        // console.log(accidentes)
        
      },
    });

   
    return { center, circulos };
  },

  data() {
    return {
      Coordx: 0.0,
      Coordy: 0.0,
      metrosRedonda: 0.0,
      cantidad: 0,
      
    };
  },

  
  

});
</script>
