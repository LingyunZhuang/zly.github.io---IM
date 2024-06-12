import event from '../../unit/event'
// terry: 根据页面参数选择页面
function getUrlParameter(name){
  name = name.replace(/[]/,"\[").replace(/[]/,"\[").replace(/[]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec(window.parent.location.href );
  if( results == null ) return ""; else {
    return results[1];
  }
};

let ifDevMode =  getUrlParameter('dev')
let up = function() {}
let down = function() {}

if (ifDevMode === '1') {
  down = store => {
    store.commit('key_music', true)
    if (store.state.lock) {
      return
    }
    event.down({
      key: 's',
      once: true,
      callback: () => {
        if (store.state.lock) {
          return
        }
        store.commit('music', !store.state.music)
      }
    })
  }

  up = store => {
    store.commit('key_music', false)
    event.up({
      key: 's'
    })
  }
}

export default {
  down,
  up
}
