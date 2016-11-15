<template>
  <section class="main" v-show="twitters.length" v-cloak>
    <input class="toggle-all" type="checkbox" v-model="allDone">
    <ul class="twitter-list">
      <twitter v-for="twitter in filteredTwitters" v-bind:twitter-model="twitter" :key="twitter.id">
      </twitter>
    </ul>

    <footer class="footer" v-show="twitters.length" v-cloak>
      <span class="twitter-count">
        <strong>{{ remaining }}</strong> 还剩: {{ remaining | pluralize }}
      </span>
      <ul class="filters">
        <li><a @click.prevent="filterTwitters('all', $event)" href="#/all" :class="{ selected: visibility == 'all' }">全部</a></li>
        <li><a @click.prevent="filterTwitters('active', $event)" href="#/active" :class="{ selected: visibility == 'active' }">正在做</a></li>
        <li><a @click.prevent="filterTwitters('completed', $event)" href="#/completed" :class="{ selected: visibility == 'completed' }">已完成</a></li>
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
    },
    filterTwitters:function(filter,evt){
       this.visibility = filter;
    }
  },

  directives: {
  },

  components: {
    twitter
  }
}

</script>


<style>
  .main {
    position: relative;
    z-index: 2;
    border-top: 1px solid #e6e6e6;
  }
  
  label[for='toggle-all'] {
    display: none;
  }
  
  .toggle-all {
    position: absolute;
    top: -55px;
    left: -12px;
    width: 60px;
    height: 34px;
    text-align: center;
    border: none;
    /* Mobile Safari */
  }
  
  .toggle-all:before {
    content: ' > ';
    font-size: 22px;
    color: #e6e6e6;
    padding: 10px 27px 10px 27px;
  }
  
  .toggle-all:checked:before {
    color: #737373;
  }
  
  .twitter-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  
  .twitter-list li {
    position: relative;
    font-size: 24px;
    border-bottom: 1px solid #ededed;
  }
  
  .twitter-list li:last-child {
    border-bottom: none;
  }
  
  .twitter-list li.editing {
    border-bottom: none;
    padding: 0;
  }
  
  .twitter-list li.editing .edit {
    display: block;
    width: 506px;
    padding: 12px 16px;
    margin: 0 0 0 43px;
  }
  
  .twitter-list li.editing .view {
    display: none;
  }
  
  .twitter-list li .toggle {
    text-align: center;
    width: 40px;
    /* auto, since non-WebKit browsers doesn't support input styling */
    height: auto;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto 0;
    border: none;
    /* Mobile Safari */
    -webkit-appearance: none;
    appearance: none;
  }
  
  .twitter-list li .toggle:after {
    content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#ededed" stroke-width="3"/></svg>');
  }
  
  .twitter-list li .toggle:checked:after {
    content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#bddad5" stroke-width="3"/><path fill="#5dc2af" d="M72 25L42 71 27 56l-4 4 20 20 34-52z"/></svg>');
  }
  
  .twitter-list li label {
    word-break: break-all;
    padding: 15px 60px 15px 15px;
    margin-left: 45px;
    display: block;
    line-height: 1.2;
    transition: color 0.4s;
  }
  
  .twitter-list li.completed label {
    color: #d9d9d9;
    text-decoration: line-through;
  }
  
  .twitter-list li .destroy {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    bottom: 0;
    width: 40px;
    height: 40px;
    margin: auto 0;
    font-size: 30px;
    color: #cc9a9a;
    margin-bottom: 11px;
    transition: color 0.2s ease-out;
  }
  
  .twitter-list li .destroy:hover {
    color: #af5b5e;
  }
  
  .twitter-list li .destroy:after {
    content: 'X';
  }
  
  .twitter-list li:hover .destroy {
    display: block;
  }
  
  .twitter-list li .edit {
    display: none;
  }
  
  .twitter-list li.editing:last-child {
    margin-bottom: -1px;
  }
  
  .twitter-count {
    float: left;
    text-align: left;
  }
  
  .twitter-count strong {
    font-weight: 300;
  }
  
  .clear-completed,
  html .clear-completed:active {
    float: right;
    position: relative;
    line-height: 20px;
    text-decoration: none;
    cursor: pointer;
  }
  
  .clear-completed:hover {
    text-decoration: underline;
  }
  
  .footer {
    color: #777;
    padding: 10px 15px;
    height: 20px;
    text-align: center;
    border-top: 1px solid #e6e6e6;
  }
  
  .footer:before {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 50px;
    overflow: hidden;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6, 0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6, 0 17px 2px -6px rgba(0, 0, 0, 0.2);
  }
  
  .filters {
    margin: 0;
    padding: 0;
    list-style: none;
    position: absolute;
    right: 0;
    left: 0;
  }
  
  .filters li {
    display: inline;
  }
  
  .filters li a {
    color: inherit;
    margin: 3px;
    padding: 3px 7px;
    text-decoration: none;
    border: 1px solid transparent;
    border-radius: 3px;
  }
  
  .filters li a:hover {
    border-color: rgba(175, 47, 47, 0.1);
  }
  
  .filters li a.selected {
    border-color: rgba(175, 47, 47, 0.2);
  }
</style>