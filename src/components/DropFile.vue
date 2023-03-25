<template>
    <div
      @dragover.prevent="dragover = true"
      @dragenter.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
      @drop.prevent="selectFile($event)"
      :class="{ 'active-dropzone': dragover }"
      class="dropzone"
    >
      <v-icon>mdi-file-upload</v-icon>
      <span> Drag and drop file here to upload</span>
      <small> (or) </small>
  
      <label for="dropfile" class="dropfile-label">Select file to upload </label>
      <input type="file" id="dropfile" @change="selectFile($event)" />
    </div>
  </template>
  
  <script>
  import Vue from "vue";
  import { mapActions } from "vuex";

  import { bytes_to_mb } from "@/utils/file-size-converter"

  export default Vue.extend({
    name: "UploadFile",
    data: () => ({
        dragover: false,
    }),
    methods: {
      ...mapActions("notifier", ["showNotification"]),
      toggleActive() {
        this.dragover = !this.dragover;
      },
      selectFile(e) {
        this.dragover = false;
        const files = e.dataTransfer?.files || e.target?.files
        
        if (!this.muliple && files.length > 1) {
            this.showNotification({
              message: "Multifile upload is not allowed", 
              type: "error"
            })
            return
        }
        
        if (!this.validateExtension(files)){
            this.showNotification({
              message: "Extension not allowed", 
              type: "error"
            })
            return
        }

        if (!this.validateSize(files)){
            this.showNotification({
              message: "Max size allowed per file is 3MB", 
              type: "error"
            })
            return
        }

        this.$emit("uploadedFiles", files);
      },
      validateExtension(files) {
        for (let file of files) {
          const extension = file.name.split(".").at(-1)
          const allowed = this.allowedExtensions.includes(extension)
          
          if (!allowed) return false
        }
        
        return true
      },
      validateSize(files) {
        for (let file of files) {
          const fileSize = bytes_to_mb(file.size)
          
          if (fileSize > this.maxSize) return false
        }
        
        return true
      },
    },
    props: {
        allowedExtensions: Array,
        maxSize: {
          type: Number,
          default: 3
        },
        multiple: {
          type: Boolean,
          default: false
        }
    }
  });
  </script>
  
  <style lang="scss" scoped>
  .dropzone {
    width: 100%;
    padding: 1rem;
    display: flex;
    row-gap: 0.2rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2px dashed #bdbdbd;
    background-color: white;
    transition: 0.3s ease all;
    text-align: center;
  }
  
  .dropzone small {
    color: var(--grey);
  }
  
  .dropfile-label {
    padding: 8px 12px;
    color: var(--light);
    background-color: var(--primary);
    cursor: pointer;
  }
  
  input {
    display: none;
  }
  
  .active-dropzone {
    color: var(--light);
    border-color: var(--light);
    background-color: var(--primary);
    i {
      color: var(--light);
    }
    label{
      color: var(--primary);
      background-color: var(--light);
    }
  }
  </style>
  