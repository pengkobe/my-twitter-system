<template>
            <li class="twitter" 
            :class="{ completed: twitter.completed, editing: twitter == editedTwitter }">
                <div class="view">
                    <input class="toggle" type="checkbox" v-model="twitter.completed">
                    <label @dblclick="edit(twitter)">{{ twitter.title }}</label>
                    <button class="destroy" @click="remove(twitter)"></button>
                </div>
                <input  
                class="edit" 
                type="text" 
                v-model="twitter.title" 
                v-twitter-focus="twitter == editedTwitter" 
                @blur="doneEdit(twitter)"
                @keyup.enter="doneEdit(twitter)" 
                @keyup.esc="cancelEdit(twitter)" />
            </li>
</template>


<script>

// visibility filters
var filters = {
  all: function (twitters) {
    return twitters
  },
  active: function (twitters) {
    return twitters.filter(function (twitter) {
      return !twitter.completed
    })
  },
  completed: function (twitters) {
    return twitters.filter(function (twitter) {
      return twitter.completed
    })
  }
}

// app Vue instance
export default {
  name: 'twitter',
  props: ['data'],

  // app initial state
  data () {
        return {
            twitter: twitterStorage.fetch(),
            editedTwitter: null,
            visibility: 'all'
        }
   },

  methods: {
    remove: function (twitter) {
      this.twitters.splice(this.twitters.indexOf(twitter), 1)
    },

    edit: function (twitter) {
      this.beforeEditCache = twitter.title
      this.editedTwitter = twitter
    },

    doneEdit: function (twitter) {
      if (!this.editedTwitter) {
        return
      }
      this.editedTwitter = null
      twitter.title = twitter.title.trim()
      if (!twitter.title) {
        this.remove(twitter)
      }
    },

    cancelEdit: function (twitter) {
      this.editedTwitter = null
      twitter.title = this.beforeEditCache
    },

    removeCompleted: function () {
      this.twitters = filters.active(this.twitters)
    }
  },

}

</script>
