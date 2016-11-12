<template>
    <section class="main" v-show="twitters.length" v-cloak>
        <input class="toggle-all" type="checkbox" v-model="allDone">
        <ul class="twitter-list">
            <twitter v-for="twitter in filteredTwitters" v-bind:data="twitter" :key="twitter.id">
            </twitter>
        </ul>

        <footer class="footer" v-show="twitters.length" v-cloak>
            <span class="twitter-count">
                    <strong>{{ remaining }}</strong> 还剩: {{ remaining | pluralize }} 
                </span>
            <ul class="filters">
                <li><a href="#/all" :class="{ selected: visibility == 'all' }">全部</a></li>
                <li><a href="#/active" :class="{ selected: visibility == 'active' }">正在做</a></li>
                <li><a href="#/completed" :class="{ selected: visibility == 'completed' }">已完成</a></li>
            </ul>
            <button class="clear-completed" @click="removeCompleted" v-show="twitters.length > remaining">
                   删除成功
             </button>
        </footer>
    </section>
</template>


<script>
// localstorage operation
import {twitterStorage} from '../lib/utils'

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
  name: 'twitter_list',
  // app initial state
   data () {
        return {
            twitters: twitterStorage.fetch(),
            newTwitter: '',
            editedTwitter: null,
            visibility: 'all'
        }
   },

  // watch twitters change for localStorage persistence
  watch: {
    twitters: {
      handler: function (twitters) {
        twitterStorage.save(twitters)
      },
      deep: true
    }
  },

  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
    filteredTwitters: function () {
      return filters[this.visibility](this.twitters)
    },
    remaining: function () {
      return filters.active(this.twitters).length
    },
    allDone: {
      get: function () {
        return this.remaining === 0
      },
      set: function (value) {
        this.twitters.forEach(function (twitter) {
          twitter.completed = value
        })
      }
    }
  },

  filters: {
    pluralize: function (n) {
      return n === 1 ? 'item' : 'items'
    }
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
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
    },

    removeTwitter: function (twitter) {
      this.twitters.splice(this.twitters.indexOf(twitter), 1)
    },

    editTwitter: function (twitter) {
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
        this.removeTwitter(twitter)
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

  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // http://vuejs.org/guide/custom-directive.html
  directives: {
    'twitter-focus': function (el, value) {
      if (value) {
        el.focus()
      }
    }
  }
}

// handle routing
function onHashChange () {
  var visibility = window.location.hash.replace(/#\/?/, '')
  if (filters[visibility]) {
    app.visibility = visibility
  } else {
    window.location.hash = ''
    app.visibility = 'all'
  }
}

window.addEventListener('hashchange', onHashChange)
onHashChange()

// mount
// app.$mount('.twitterapp')

</script>
