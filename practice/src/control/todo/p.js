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
    store.commit('key_pause', true)
    event.down({
      key: 'p',
      once: true,
      callback: () => {
        const state = store.state
        if (state.lock) {
          return
        }
        const cur = state.cur
        const isPause = state.pause
        if (cur !== null) {
          // 暂停
          states.pause(!isPause)
        } else {
          // 新的开始
          states.start()
        }
      }
    })
  }

  up = store => {
    store.commit('key_pause', false)
    event.up({
      key: 'p'
    })
  }
}

export default {
  down,
  up
}
