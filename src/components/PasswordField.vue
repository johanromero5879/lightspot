<template>
  <v-text-field
    :value="value"
    @input="$emit('input', $event)"
    :label="label"
    :rules="rules"
    outlined
    autocomplete="false"
    prepend-inner-icon="mdi-lock"
    :type="show ? 'text' : 'password'"
    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
    @click:append="show = !show"
  />
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            require: true
        },
        label: {
            type: String,
            default: "Contraseña"
        },
        rules: {
            type: Array,
            default: () => ([
                v => !!v || "La contraseña es requerida",
                v => (v.length >= 8 && v.length <= 16) || 'Debe tener entre 8-16 caracteres',
                v => /[A-Z]/.test(v) || 'Debe tener al menos una mayuscula',
                v => /[a-z]/.test(v) || 'Debe tener al menos una minuscula',
                v => /\d/.test(v) || 'Debe tener al menos un número',
                v => /[^A-Za-z0-9]/.test(v) || 'Debe tener al menos un caracter especial' 
            ])
        }
    },
    data() {
        return {
            show: false
        }
    }
}
</script>
