<template>
  <div id="#app">
    <title-bar></title-bar>
    <fusen></fusen>
  </div>
</template>

<script>
  import {ipcRenderer} from 'electron';
  import TitleBar from 'components/TitleBar.vue';
  import Fusen from 'components/Fusen.vue';
  import store from 'renderer/vuex/store';
  import debounce from 'lodash.debounce';

  export default {
    components: {
      TitleBar,
      Fusen
    },
    store,
    mounted() {
      const cache = {
        compactFlag: false,
        viewHeight: document.body.clientHeight
      };

      const handleResize = debounce(e => {
        if (cache.compactFlag) {
          return;
        }

        cache.viewHeight = document.body.clientHeight;
        cache.compactFlag = false;
      }, 100);

      const win = this.$electron.remote.getCurrentWindow();
      win.on('resize', handleResize);

      this.$store.watch(state => state.headerButton.compactMode, bool => {
        if (bool) {
          cache.compactFlag = true;
          setTimeout(() => {
            win.setBounds(Object.assign(win.getBounds(), {
              height: document.body.clientHeight
            }));
          }, 0);
        } else {
          setTimeout(() => {
            win.setBounds(Object.assign(win.getBounds(), {
              height: cache.viewHeight
            }));
          }, 0);
        }

      });
    }
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
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Yu Gothic", YuGothic, Verdana, Meiryo, sans-serif;
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
