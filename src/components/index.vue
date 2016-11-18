<template>
    <div>
        <h1>简易Twitter系统</h1>
        <section class="twitterapp">
            <add_twitter v-on:add="addTwitter"></add_twitter>
            <twitter_list v-bind:twitterlist="twitters"></twitter_list>
            <footer class="info">
                <p> Will written by <a href="http://yipeng.info">kobepeng</a></p>
            </footer>
    </div>
</template>


<script>
// localstorage operation
import {twitterStorage} from '../libs/utils'
import twitter_list from './twitter_list'
import add_twitter from './add_twitter'

// app Vue instance
export default {
  name: 'TwitterMVC',
  // app initial state
   data () {
        var data = twitterStorage().fetch();
        console.log('pp:',data);
        return {
            twitters: data,
        }
   },
   components: {
    twitter_list,
    add_twitter
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
      addTwitter (model){
        alert('add twitter now!');
      }
  },

  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // http://vuejs.org/guide/custom-directive.html
  directives: {
  }
}

</script>


<style lang="scss">
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
    
    .twitterapp {
        input::-webkit-input-placeholder {
            font-style: italic;
            font-weight: 300;
            color: #e6e6e6;
        }
        input::-moz-placeholder {
            font-style: italic;
            font-weight: 300;
            color: #e6e6e6;
        }
        input::input-placeholder {
            font-style: italic;
            font-weight: 300;
            color: #e6e6e6;
        }
        h1 {
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
    }
    
    .info {
        margin: 65px auto 0;
        color: #bfbfbf;
        font-size: 10px;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
        text-align: center;
    }
    
    .info {
        p {
            line-height: 1;
        }
        a {
            color: inherit;
            text-decoration: none;
            font-weight: 400;
        }
        o a:hover {
            text-decoration: underline;
        }
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