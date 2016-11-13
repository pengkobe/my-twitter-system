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
