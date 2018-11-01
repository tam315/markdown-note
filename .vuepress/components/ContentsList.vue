<template>
  <ul>
    <li v-for="note in notes">
      <router-link :to="note.path">{{ note.title }}</router-link>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['junle'],
  computed: {
    notes() {
      return this.$site.pages.filter(
        x => x.path !== '/' && x.path.startsWith(`/${this.junle}`),
      );
    },
  },
};
</script>