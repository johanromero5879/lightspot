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
        
        if (files && files.length > 1) {
            this.showNotification({
              message: "Only one file can be uploaded at time", 
              type: "error"
            })
            return
        }
        
        
        if (!this.validateExtension(files[0])){
            this.showNotification({
              message: "Extension not allowed", 
              type: "error"
            })
            return
        }
        
        this.$emit("fileUploaded", files[0]);
      },
      validateExtension(file) {
        const extension = file.name.split(".").at(-1)
        
        return this.allowedExtensions.includes(extension)
      },
    },
    props: {
        allowedExtensions: Array
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
  