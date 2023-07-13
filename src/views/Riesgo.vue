<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            v-model="select1"
            :items="items"
            :rules="[(v) => !!v || 'Item is required']"
            label="Typo de vehículo"
            required
          ></v-select>
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="select2"
            :items="items"
            :rules="[(v) => !!v || 'Item is required']"
            label="Typo de vehículo"
            required
          ></v-select>
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="select3"
            :items="items"
            :rules="[(v) => !!v || 'Item is required']"
            label="Typo de vehículo"
            required
          ></v-select>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="3"></v-col>
        <v-col cols="12" md="3">
          <v-btn color="purple" @click="calcular" block> Calcular </v-btn>
           </v-col>    
        <v-col cols="12" md="3"> 
        <v-btn @click="limpiar" block> clear </v-btn>
        </v-col>  
        <v-col cols="12" md="3"></v-col>    
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      select1: null,
      select2: null,
      select3: null,
      items: ["Item 1", "Item 2", "Item 3", "Item 4"],
      checkbox: false,
      valid : true
    };
  },

  methods: {
    calcular(){},
    
    limpiar(){},

  },
});
</script>
