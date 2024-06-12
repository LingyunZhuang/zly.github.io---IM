
// 定时跳转页面的函数，参数一是目标页面，参数2是等待的秒
function changePage(target, time) {
  function get_tiao_func(target) {
    return function tiao(){
      window.open(target,"_self");
    }
  };

  tiao = get_tiao_func(target);

  setTimeout( "tiao()",time*1000);
}


