<template>
  <div id="app">
    <Home/>
  </div>
</template>

<script>
import Home from './components/Home'


export default {
  name: 'App',
  components: {
    Home
  }
}
</script>

<style lang="scss" scoped>
  @import './css/main.scss';
  // Bootstrap and its default variables
  @import "../node_modules/bootstrap/scss/bootstrap";
  @import "../node_modules/bootstrap/scss/functions";
  @import "../node_modules/bootstrap/scss/variables";
  @import "../node_modules/bootstrap/scss/mixins";

  $cyan:    pink;

  .panel-heading {
    background-color: $cyan;
  }

</style>
<!-- style>

</style -->
