import event from '../../unit/event'
import states from '../states'

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
    store.commit('key_reset', true)
    if (store.state.lock) {
      return
    }
    if (store.state.cur !== null) {
      event.down({
        key: 'r',
        once: true,
        callback: () => {
          states.overStart()
        }
      })
    } else {
      event.down({
        key: 'r',
        once: true,
        callback: () => {
          if (store.state.lock) {
            return
          }
          states.start()
        }
      })
    }
  }

  up = store => {
    store.commit('key_reset', false)
    event.up({
      key: 'r'
    })
  }
}

export default {
  down,
  up
}
