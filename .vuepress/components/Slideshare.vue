<template>
  <div :style="styles.widthLimitter">
    <div :style="styles.renderingAreaProvider">
      <iframe
        :src="src"
        :style="styles.iframe"
        scrolling="no"
        style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  props: ["maxWidth", "slideId", "startPage"],
  computed: {
    src() {
      return (
        "https://www.slideshare.net/slideshow/embed_code/key/" +
        this.slideId +
        "?startSlide=" +
        this.startPage
      );
    }
  },
  data() {
    return {
      styles: {
        widthLimitter: {
          maxWidth: this.maxWidth ? this.maxWidth : null
        },
        renderingAreaProvider: {
          background: "#f0f0f0",
          height: 0,
          margin: "1rem 0",
          /*
           * - '75%' indicates the aspect rasio (3/4 = 75%).
           * - '38px' indicates the height of the controllers.
           * - note that percentage inside 'padding-(top|bottom)' is calculated based on
           *   its current width. this is a specification of 'calc' used inside
           *   the 'padding-(top|bottom)' property.
           *
           * see: https://nathan.gs/2018/01/07/responsive-slideshare-iframe/
           */
          paddingBottom: "calc(75% + 38px)",
          position: "relative",
          width: "100%"
        },
        iframe: {
          height: "100%",
          left: 0,
          position: "absolute",
          top: 0,
          width: "100%"
        }
      }
    };
  }
};
</script>

