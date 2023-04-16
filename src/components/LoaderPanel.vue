<template>
    <div class="panel">
      <Loader 
        v-if="loading" 
        :message="loadingText" 
       />
      <template v-else>
        <v-icon x-large>{{ icon }}</v-icon>
        <p>{{noDataText}}</p>
      </template>
    </div>
</template>

<script>
import Loader from "@/components/Loader.vue";

export default {
    components: {
        Loader
    },
    props: {
        loading: {
            type: Boolean,
            required: true
        },
        icon: {
            type: String,
            default: "mdi-information-slab-circle"
        },
        noDataText: {
            type: String,
            default: "No hay información disponible"
        },
        loadingText: {
            type: String,
            default: "Cargando datos..."
        }
    }
}
</script>

<style lang="scss" scoped>
.panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.6);
}
</style>