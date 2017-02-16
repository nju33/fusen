<template>
  <div class="title-bar">
    <div class="icon-box">
      <button class="icon-button" @click="toggleCompactMode()">
        <span class="modeicon" :class="{active: compactMode}"></span>
      </button>
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';

  export default {
    name: 'title-bar',
    computed: {
      compactMode() {
        return this.$store.state.headerButton.compactMode;
      }
    },
    methods: {
      ...mapActions([
        'toggleCompactMode'
      ])
    }
    // methods: {
    //   ...mapActions([
    //     'toggleCompactMode'
    //   ])
    // },
  }
</script>

<style scoped>
  .title-bar {
    width: 100vw;
    height: 24px;
    -webkit-user-select: none;
    -webkit-app-region: drag;
    background: #f8f8f8;
    padding-left: 80px;
    box-sizing: border-box;
    position: relative;
  }

  .icon-box {
    display: inline-block;
    position: absolute;
    top: 4px;
    right: 10px;
    text-align: right;
  }

  .icon-button {
    border: none;
    background: transparent;
    display: inline-block;
    vertical-align: top;
    line-height: 0;
    cursor: pointer;
    outline: none;
  }

  .modeicon {
    display: inline-block;
    width: 1em;
    height: 1em;
    border: 1px solid #ccc;
    background: linear-gradient(to bottom, transparent 50%, #ccc 50%);
    position: relative;
  }

  .modeicon:before {
    content: "";
    position: absolute;
    bottom: 0;
    left: -1px;
  }

  .modeicon.active {
    height: .5em;
    background: #fff;
  }
  .modeicon.active:before {
    bottom: -.55em;
    width: 100%;
    height: .45em;
    background-image: linear-gradient(to right, transparent 50%, #ccc 50%);
    background-size: 2px 2px;
    border: solid #ccc;
    border-width: 0 1px 1px 1px;
  }
</style>
