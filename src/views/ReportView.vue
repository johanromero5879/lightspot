<template>
    <main class="container">
        <Filters 
            v-model="loading"
            @submitted="onSubmit"
        />
        <div v-if="!!pdfUrl" class="report" >
            <iframe 
                :src="pdfUrl"
            >
            </iframe>
        </div>
        <LoaderPanel 
            v-else 
            :loading="loading"
            icon="mdi-file-document-outline"
            no-data-text="No hay datos para generar un reporte"
        />
    </main>
</template>

<script>
import Filters from "@/components/Filters.vue"
import LoaderPanel from "@/components/LoaderPanel.vue"
import { getReport } from "@/services/flash"

export default {
    components: {
        Filters,
        LoaderPanel
    },
    data() {
        return {
            loading: false,
            pdfUrl: null
        }
    },
    methods: {
        onSubmit(filters) {
            this.pdfUrl = null
            this.generatePDF(filters)
        },
        async generatePDF(filters) {
            this.loading = true;
            try {
                const pdfData = await getReport(filters)

                const blob = new Blob([pdfData], {type: "application/pdf"})
                const url = window.URL.createObjectURL(blob)

                this.pdfUrl = url
            }catch(err) {
                //console.log(err)
            } finally {
                this.loading = false;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "src/main.scss";

.container {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 1.5rem;

    @include up-to-tablet-landscape {
        display: flex;
        flex-direction: column;
    }

    .report {
        width: 100%;
        height: 100%;

        iframe {
            width: 100%;
            height: 100%;
        }
    }
}
</style>