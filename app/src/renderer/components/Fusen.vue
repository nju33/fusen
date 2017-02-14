<template>
  <div class="container">
    <input ref="title" @change="handleChange($event)" type="text" class="title" :class="{error: error}" placeholder="✎ Title"/>
    <aside class="error" v-text="error" :style="{display: error ? 'inline-block' : 'none'}"></aside>
    <div ref="editor" class="editor"></div>
  </div>
</template>

<script>
  import {ipcRenderer} from 'electron';
  import MediumEditor from 'medium-editor';
  import 'medium-editor/dist/css/medium-editor.min.css';
  import debounce from 'lodash.debounce';

  export default {
    name: 'landing-page',
    data() {
      return {
        title: '',
        contents: '',
        error: null
      }
    },
    methods: {
      handleChange(e) {
        if (this.$data.title !== e.target.value) {
          ipcRenderer.send('delete-file', this.$data.title);
          this.$data.title = e.target.value;
        }
      }
    },
    mounted() {
      const editor = new MediumEditor(this.$refs.editor, {
        toolbar: {
          buttons: ['bold', 'italic', 'underline', 'h2', 'h3', 'quote'],
          align: 'left',
        }
      });

      ipcRenderer.on('initData:res', (e, data) => {
        this.$data.title = data.title;
        this.$refs.title.value = data.title;
        this.$data.contents = data.contents;
        editor.elements[0].innerHTML = data.contents;
        editor.elements[0].focus();
      });
      ipcRenderer.send('initData');

      const debounceSave = debounce(save.bind(this), 250);

      editor.subscribe('editableInput', (e, editable) => {
        this.$data.contents = editable.innerHTML;
        debounceSave(false);
      });

      ipcRenderer.on('delete-file:complete', function () {
        debounceSave();
      });

      ipcRenderer.on('save:error', (e, err) => {
      });
      ipcRenderer.on('save:error:exists', (e, err) => {
        this.$data.error = err.message;
      });
      ipcRenderer.on('save:complete', () => {
      });

      function save(titleUpdate = true) {
        if (this.$data.error) {
          this.$data.error = null;
        }
        if (this.$data.title && this.$data.contents) {
          ipcRenderer.send('save', {
            titleUpdate,
            title: this.$data.title,
            contents: this.$data.contents
          });
        }
      }
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

  aside.error {
    text-align: center;
    position: absolute;
    right: 50%;
    transform: translateX(50%);
    z-index: 9;
    display: inline-block;
    background: #cb1b45;
    padding: .3em .5em;
    margin-top: 2px;
    color: #fff;
    border-radius: 3px;
  }
  aside.error:before {
    content: "!";
    text-shadow: 0 0 1px #fff,0 0 1px #fff;
    margin-right: .5em;
    font-size: .8em;
    border: 1px solid #fff;
    border-radius: 50%;
    display: inline-block;
    padding: .1em;
    height: 1em;
    width: 1em;
    line-height: 1;
    position: relative;
    top: -1px;
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
    background: #f8f8f8;
    color: #131313;
  }

  .title.error {
    background: rgba(203,27,69, .1);
    outline: 1px solid rgba(203,27,69, .3);
    outline-offset: -1px;
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
    overflow: scroll;
  }
</style>
