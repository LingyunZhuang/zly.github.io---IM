import App from './App.vue'
import App_practice from './App-practice.vue'

const apps = {
  App,
  App_practice
}

export function getApp (name) {
  return apps[name];
}

// terry: 根据页面参数选择页面
export function getUrlParameter(name){
  name = name.replace(/[]/,"\[").replace(/[]/,"\[").replace(/[]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec(window.parent.location.href );
  if( results == null ) return ""; else {
    return results[1];
  }
};
