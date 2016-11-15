<template>
  <header class="header">
    <input class="new-twitter"
    autofocus autocomplete="off"
    placeholder="你正在想什么/做什么.写下来吧..."
    v-model="newTwitter" @keyup.enter="add">
  </header>
</template>


<script>
export default {
  name: 'add_twitter',

   data () {
        return {
            newTwitter: ''
        }
  },

  methods: {
    add: function () {
      var value = this.newTwitter && this.newTwitter.trim()
      if (!value) {
        return
      }
      this.$emit('add',value);
      this.newTwitter = '';
    }
  }
}

</script>

<style>
.new-twitter,.edit {
        position: relative;
        margin: 0;
        width: 100%;
        font-size: 24px;
        font-family: inherit;
        font-weight: inherit;
        line-height: 1.4em;
        border: 0;
        color: inherit;
        padding: 6px;
        border: 1px solid #999;
        box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .new-twitter {
        padding: 16px 16px 16px 60px;
        border: none;
        background: rgba(0, 0, 0, 0.003);
        box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
    }
</style>