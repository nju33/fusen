<template>
  <div class="container">
    <input type="text" class="title" placeholder="✎ Title"/>
    <div ref="editor" class="editor"></div>
  </div>
</template>

<script>
  import MediumEditor from 'medium-editor';
  import 'medium-editor/dist/css/medium-editor.min.css';

  export default {
    name: 'landing-page',
    mounted() {
      new MediumEditor(this.$refs.editor, {
        toolbar: {
          buttons: ['bold', 'italic', 'underline', 'h2', 'h3', 'quote'],
          align: 'left',
        }
      });
    }
  }
</script>

<style>
  .medium-editor-toolbar {
    margin-top: 8px;
  }
  .medium-editor-toolbar:after {
    display: none;
  }
  .medium-editor-action.medium-editor-action.medium-editor-action {
    font-size: 10px;
    padding: 6px;
    background-color: #131313;
    border: none;
    color: #fff;
  }
</style>

<style scoped>
  .container {
    height: calc(100vh - 24px);
    position: relative;
  }

  .title {
    position: relative;
    z-index: 9;
    box-sizing: border-box;
    border: none;
    padding: .3em .5em;
    width: 100%;
    text-align: center;
    outline: none;
    background: transparent;
  }

  .editor {
    position: absolute;
    left: 0;
    top: 0;
    padding: 2em 1em 1em;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    outline: none;
    background-color: #f8f8f8;
  }
</style>
