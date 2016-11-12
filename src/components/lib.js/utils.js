// localStorage persistence
var STORAGE_KEY = 'twitters-vuejs-2.0'

export function twitterStorage(name, url) {
    return {
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
}
