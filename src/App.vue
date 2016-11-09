<template>
  <div id="app">
    <img class="headimg" src="./assets/battery.png">
    <twittermvc></twittermvc>
  </div>
</template>

<script>
import twittermvc from './components/twittermvc'

export default {
  name: 'app',
  components: {
    twittermvc
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
img.headimg{
  height: 75px;
}
</style>
