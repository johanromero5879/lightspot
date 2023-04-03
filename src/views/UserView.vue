<template>
<main>
<img src="../assets/team.png" height="60" width="60"/>
      <v-text-field
            v-model="Name"
            :rules="nameRules"
            :counter="10"
            label="Name"
            required
            prepend-inner-icon="mdi-account-circle"
          ></v-text-field>
</main>

</template>
<script>
export default {
  data() {
    return {
      Roles: ["Administrador, Usuario"],
      values: "Select",
    };
  },
};
</script>

<style scoped>
.main{
  align-items: center;
}
</style>