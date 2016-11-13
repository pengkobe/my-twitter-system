<template>
    <section class="main" v-show="twitters.length" v-cloak>
        <input class="toggle-all" type="checkbox" v-model="allDone">
        <ul class="twitter-list">
            <twitter
            v-for="twitter in filteredTwitters"
            v-bind:twitter-model="twitter"
            :key="twitter.id">
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
import twitter from './twitter'

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
  props:["twitterlist"],
  // app initial state
   data () {
        debugger;
        return {
            twitters: this.twitterlist ? this.twitterlist : [],
            visibility: 'all'
        }
   },

  // watch twitters change for localStorage persistence
  watch: {
    // twitters: {
    //   handler: function (twitters) {
    //     //twitterStorage.save(twitters)
    //   },
    //   deep: true
    // }
  },

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

  methods: {
    removeCompleted: function () {
      this.twitters = filters.active(this.twitters)
    }
  },

  directives: {

  },

  components: {
    twitter
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

</script>
