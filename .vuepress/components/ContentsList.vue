<template>
  <ul>
    <li v-for="note in notes">
      <router-link :to="note.path">{{ note.title }}</router-link>
    </li>
  </ul>
</template>

<script>
export default {
  props: ["junle"],
  computed: {
    notes() {
      return this.$site.pages
        .filter(x => x.path !== "/" && x.path.startsWith(`/${this.junle}`))
        .sort((a, b) => {
          if (!(a.title && b.title)) {
            return;
          } else if (a.title.toUpperCase() > b.title.toUpperCase()) {
            return 1;
          } else if (a.title.toUpperCase() < b.title.toUpperCase()) {
            return -1;
          }
        });
    }
  }
};
</script>