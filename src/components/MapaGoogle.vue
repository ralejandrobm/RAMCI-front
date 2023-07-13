<template>
  
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
 
</template>

<script>
import { GoogleMap, Circle } from "vue3-google-map";
import { defineComponent } from "vue";
export default defineComponent({
  name: "MapComponent",
  components: {
    GoogleMap,
    Circle,
  },
  props: {
    circulos: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      center: { lat: 20.670303919412067, lng: -103.34941565353975 },
    };
  },
});
</script>
