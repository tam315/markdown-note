<template>
  <div :style="styles.container">
    <div v-if="link">
      <a :href="link" target="_blank">
        <img :src="src">
      </a>
    </div>
    <div v-else>
      <img :src="src">
    </div>
  </div>
</template>

<script>
export default {
  props: ["maxWidth", "src", "link"],
  data() {
    return {
      styles: {
        container: {
          margin: "1rem 0",
          maxWidth: this.maxWidth ? this.maxWidth : null
        }
      }
    };
  }
};
</script>

