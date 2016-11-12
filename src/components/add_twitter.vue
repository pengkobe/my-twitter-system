<template>
  <header class="header">
   
    <input class="new-twitter" 
    autofocus autocomplete="off" 
    placeholder="你正在想什么/做什么.写下来吧..." 
    v-model="newTwitter" @keyup.enter="addTwitter">
  </header>
</template>


<script>
import {twitterStorage} from '../lib/utils'

export default {
  name: 'twitter_list',

   data () {
        return {
            newTwitter: ''
        }
   }
  },

  methods: {
    addTwitter: function () {
      var value = this.newTwitter && this.newTwitter.trim()
      if (!value) {
        return
      }
      this.twitters.push({
        id: twitterStorage.uid++,
        title: value,
        completed: false
      })
      this.newTwitter = ''
    }
  },

  directives: {
    'twitter-focus': function (el, value) {
      if (value) {
        el.focus()
      }
    }
  }
}

</script>