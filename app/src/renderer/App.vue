<template>
  <div id="#app">
    <title-bar></title-bar>
    <fusen></fusen>
  </div>
</template>

<script>
  import TitleBar from 'components/TitleBar.vue';
  import Fusen from 'components/Fusen.vue';
  import store from 'renderer/vuex/store';
  export default {
    components: {
      TitleBar,
      Fusen
    },
    store
  }
</script>

<style>
  @font-face {
    font-family: "Yu Gothic";
    src: local("Yu Gothic Medium");
    font-weight: normal;
  }

  @font-face {
    font-family: "Yu Gothic";
    src: local("Yu Gothic Bold");
    font-weight: bold;
  }

  * {
    margin: 0;
    padding: 0;
  }

  body {
    font-size: 13px;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Yu Gothic", YuGothic, Verdana, Meiryo, "M+ 1p", sans-serif;
    line-height: 1.4;
  }

  blockquote {
    background: #eee;
    padding: 1em 1em .75em;
    position: relative;
    font-size: .9em;
  }

  blockquote:before {
    content: '"';
    position: absolute;
    left: 2px;
    top: 0;
    font-size: 1.5em;
    color: #ccc;
  }
</style>
