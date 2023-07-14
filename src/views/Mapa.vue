<template>
  
    <v-layout class="d-flex align-center justify-center px-4 py-4" >
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

    Papa.parse("/coordenadasAccidentes.csv", {
      download: true,
      header: true,
      complete:  (results)  => {
        accidentes = results.data;
       
        
        for (let h = 1; h < accidentes.length; h++) {
          
         
          
          const circulo = {
            center: { lat: parseFloat(accidentes[h].Coordy), lng: parseFloat(accidentes[h].Coordx) },
            radius: 200,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
          };

          const marker = {
            position: { lat: parseFloat(accidentes[h].Coordy), lng: parseFloat(accidentes[h].Coordx) },
            label: accidentes[h].cantidad,
            title: "Accidente ciclista",
          };

          circulos.push(circulo);
          markers.push(marker );

          //console.log(accidentes[h])
          
        } 
        // console.log(accidentes)
        
      },
    });

   
    return { center, circulos, markers };
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