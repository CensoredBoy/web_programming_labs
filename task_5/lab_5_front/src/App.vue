<script setup>
import HelloWorld from './components/DisciplineList.vue'
import TheWelcome from './components/TheWelcome.vue'
import TransportList from './components/WorkerList.vue'
import DisciplineList from './components/DisciplineList.vue'
import { ref } from 'vue'

const currentComponent = ref('TransportList');
const components = { TransportList, DisciplineList };
</script>

<template>
  <main>
    <select v-model="currentComponent">
      <option value="TransportList">TransportList</option>
      <option value="DisciplineList">DisciplineList</option>
    </select>
    <component :is="components[currentComponent]" />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>