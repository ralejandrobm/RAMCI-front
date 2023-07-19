<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col cols="12" md="3">
          <v-select
            v-model="select1"
            :items="items"
            :rules="[(v) => !!v || 'campo requerido']"
            label="Sentidos"
            required
          ></v-select>
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="select2"
            :items="items"
            :rules="[(v) => !!v || 'campo requerido']"
            label="Carriles por sentido"
            required
          ></v-select>
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="select3"
            :items="items"
            :rules="[(v) => !!v || 'campo requerido']"
            label="Semáforo"
            required
          ></v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="select1"
            :items="items"
            :rules="[(v) => !!v || 'campo requerido']"
            label="Ciclovía"
            required
          ></v-select>
        </v-col>
      </v-row>
            <v-row>
        <v-col cols="12" md="3">
          <v-select
            v-model="select1"
            :items="items"
            :rules="[(v) => !!v || 'campo requerido']"
            label="Trasporte publico"
            required
          ></v-select>
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="select2"
            :items="items"
            :rules="[(v) => !!v || 'campo requerido']"
            label="Tipo de calle"
            required
          ></v-select>
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="select3"
            :items="items"
            :rules="[(v) => !!v || 'campo requerido']"
            label="Limite de velocidad"
            required
          ></v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="select1"
            :items="items"
            :rules="[(v) => !!v || 'campo requerido']"
            label="Presencia de ciclistas"
            required
          ></v-select>
        </v-col>
      </v-row>
            <v-row>
        <v-col cols="12" md="3">
          <v-select
            v-model="select1"
            :items="items"
            :rules="[(v) => !!v || 'campo requerido']"
            label="Accidentes previos"
            required
          ></v-select>
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="select2"
            :items="items"
            :rules="[(v) => !!v || 'campo requerido']"
            label="Rango horario"
            required
          ></v-select>
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="select3"
            :items="items"
            :rules="[(v) => !!v || 'campo requerido']"
            label="Cantidad de tráfico"
            required
          ></v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="select1"
            :items="items"
            :rules="[(v) => !!v || 'campo requerido']"
            label="Sexo"
            required
          ></v-select>
        </v-col>
      </v-row>
            <v-row>
        <v-col cols="12" md="3">
          <v-select
            v-model="select1"
            :items="items"
            :rules="[(v) => !!v || 'campo requerido']"
            label="Rango de edad"
            required
          ></v-select>
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="select2"
            :items="items"
            :rules="[(v) => !!v || 'campo requerido']"
            label="Vehículo involucrado"
            required
          ></v-select>
        </v-col>

       
      </v-row>

      <v-row>
        <v-col cols="12" md="3"></v-col>
        <v-col cols="12" md="3">
          <v-btn color="purple" @click="calcular" block> Calcular severidad</v-btn>
        </v-col>
        <v-col cols="12" md="3">
          <v-btn @click="limpiar" block> Limpiar campos </v-btn>
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
      valid: true,
    };
  },

  methods: {
    calcular() {},

    limpiar() {},
  },
});
</script>
