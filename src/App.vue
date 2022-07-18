<template>
  <div id="App">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>

export default {
  name: "AppLayout",
  computed: {
    layout() {
      return () => import(`@/components/ColumnList.vue`);
    },
  },
};
</script>
