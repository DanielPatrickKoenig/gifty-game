<template>
  <div id="app">
    <ThreeStage/>
  </div>
</template>

<script>
import ThreeStage from './components/ThreeStage.vue'

export default {
  name: 'App',
  components: {
    ThreeStage
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
