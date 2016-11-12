<template>
    <div>
        <section class="twitterapp">
            <header class="header">
                <h1>简易Twitter系统</h1>
                <input class="new-twitter" autofocus autocomplete="off" 
                placeholder="你正在想什么/做什么.写下来吧..."
                v-model="newTwitter" 
                @keyup.enter="addTwitter">
            </header>
            <section class="main" v-show="twitters.length" v-cloak>
                <input class="toggle-all" type="checkbox" v-model="allDone">
                <ul class="twitter-list">
                    <li class="twitter"
                     v-for="twitter in filteredTwitters"  
                    :key="twitter.id" 
                    :class="{ completed: twitter.completed, editing: twitter == editedTwitter }">
                        <div class="view">
                            <input class="toggle" type="checkbox" v-model="twitter.completed">
                            <label @dblclick="editTwitter(twitter)">{{ twitter.title }}</label>
                            <button class="destroy" @click="removeTwitter(twitter)"></button>
                        </div>
                        <input class="edit" type="text" 
                        v-model="twitter.title" 
                        v-twitter-focus="twitter == editedTwitter" 
                        @blur="doneEdit(twitter)" 
                        @keyup.enter="doneEdit(twitter)"
                        @keyup.esc="cancelEdit(twitter)">
                    </li>
                </ul>
            </section>
            <footer class="footer" v-show="twitters.length" v-cloak>
                <span class="twitter-count">
                    <strong>{{ remaining }}</strong> 还剩: {{ remaining | pluralize }} 
                </span>
                <ul class="filters">
                    <li><a href="#/all" :class="{ selected: visibility == 'all' }">全部</a></li>
                    <li><a href="#/active" :class="{ selected: visibility == 'active' }">正在做</a></li>
                    <li><a href="#/completed" :class="{ selected: visibility == 'completed' }">已完成</a></li>
                </ul>
                <button class="clear-completed"
                 @click="removeCompleted" 
                 v-show="twitters.length > remaining">
                   删除成功
                </button>
            </footer>
        </section>
        <footer class="info">
            <p> Will written by <a href="http://yipeng.info">kobepeng</a></p>
        </footer>
    </div>
</template>


<script>
// Full spec-compliant TwitterMVC with localStorage persistence
// and hash-based routing in ~120 effective lines of JavaScript.

// localStorage persistence
var STORAGE_KEY = 'twitters-vuejs-2.0'
var twitterStorage = {
  fetch: function () {
    var twitters = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    twitters.forEach(function (twitter, index) {
      twitter.id = index
    })
    twitterStorage.uid = twitters.length
    return twitters
  },
  save: function (twitters) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(twitters))
  }
}

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
  name: 'TwitterMVC',
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

<style>
    html,
    body {
        margin: 0;
        padding: 0;
    }
    
    button {
        margin: 0;
        padding: 0;
        border: 0;
        background: none;
        font-size: 100%;
        vertical-align: baseline;
        font-family: inherit;
        font-weight: inherit;
        color: inherit;
        -webkit-appearance: none;
        appearance: none;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    
    body {
        font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
        line-height: 1.4em;
        background: #f5f5f5;
        color: #4d4d4d;
        min-width: 230px;
        max-width: 550px;
        margin: 0 auto;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-weight: 300;
    }
    
    :focus {
        outline: 0;
    }
    
    .hidden {
        display: none;
    }
    
    .twitterapp {
        background: #fff;
        margin: 130px 0 40px 0;
        position: relative;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
    }
    
    .twitterapp input::-webkit-input-placeholder {
        font-style: italic;
        font-weight: 300;
        color: #e6e6e6;
    }
    
    .twitterapp input::-moz-placeholder {
        font-style: italic;
        font-weight: 300;
        color: #e6e6e6;
    }
    
    .twitterapp input::input-placeholder {
        font-style: italic;
        font-weight: 300;
        color: #e6e6e6;
    }
    
    .twitterapp h1 {
        position: absolute;
        top: -155px;
        width: 100%;
        font-size: 50px;
        font-weight: 100;
        text-align: center;
        color: rgba(175, 47, 47, 0.15);
        -webkit-text-rendering: optimizeLegibility;
        -moz-text-rendering: optimizeLegibility;
        text-rendering: optimizeLegibility;
    }
    
    .new-twitter,
    .edit {
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
    
    .twitter-count {
        float: left;
        text-align: left;
    }
    
    .twitter-count strong {
        font-weight: 300;
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
    
    .info {
        margin: 65px auto 0;
        color: #bfbfbf;
        font-size: 10px;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
        text-align: center;
    }
    
    .info p {
        line-height: 1;
    }
    
    .info a {
        color: inherit;
        text-decoration: none;
        font-weight: 400;
    }
    
    .info a:hover {
        text-decoration: underline;
    }
    /*
	Hack to remove background from Mobile Safari.
	Can't use it globally since it destroys checkboxes in Firefox
*/
    
    [v-cloak] {
        display: none;
    }
    
    @media screen and (-webkit-min-device-pixel-ratio:0) {
        .toggle-all,
        .twitter-list li .toggle {
            background: none;
        }
        .twitter-list li .toggle {
            height: 40px;
        }
        .toggle-all {
            -webkit-transform: rotate(90deg);
            transform: rotate(90deg);
            -webkit-appearance: none;
            appearance: none;
        }
    }
    
    @media (max-width: 430px) {
        .footer {
            height: 50px;
        }
        .filters {
            bottom: 10px;
        }
    }
</style>