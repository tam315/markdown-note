<template>
  <ul>
    <li v-for="note in notes">
      <router-link :to="note.path">{{ note.title }}</router-link>
    </li>
  </ul>
</template>

<script>
export default {
  computed: {
    notes() {
      return this.$site.pages.filter(x => x.path !== '/');
    },
  },
};
</script>