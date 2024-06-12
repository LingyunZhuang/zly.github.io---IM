import Vue from 'vue'
import App from './App.vue'
import App2 from './App-practice.vue'
import store from './vuex/store'
import {getUrlParameter} from './choose_practice.js'

import './unit/const';
import './control';
import { subscribeRecord } from './unit';
// terry: 关闭数据持久化
// subscribeRecord(store); // 将更新的状态记录到localStorage
Vue.config.productionTip = false
/* eslint-disable no-new */

new Vue({
  el: '#root',
  render: h => h(App),
  store: store
})

// 若是没有开启Devtools工具，在开发环境中开启，在生产环境中关闭
if (process.env.NODE_ENV == 'development') {
  Vue.config.devtools = true;
} else {
  Vue.config.devtools = false;
}

// 记录该页面开始的时间
const timestamp = (new Date()).valueOf();
console.log(timestamp)

function pointNow() {
  console.log(store.state.point)
}

// 每1分钟变化一次对手分数
let last_self_score = 0  // 先定义上次变化的分数值
let last_opponent_score = 0 // 先定义上次变化的分数值

if (store.state.ifPractice) {
  // 练习页面
  setTimeout(function () {
    // 先输1次
    store.state.opponentScore  = store.state.realScore + 100
    store.state.selfScore = store.state.realScore
    //做闪动效果
    store.state.ifShowCompetitionStatement = false
    setTimeout(function () {store.state.ifShowCompetitionStatement = true}, 30)
  }, 60*1000)

  setTimeout(function () {
    // 再赢1次
    store.state.opponentScore  = 0
    store.state.selfScore = store.state.realScore
    //做闪动效果
    store.state.ifShowCompetitionStatement = false
    setTimeout(function () {store.state.ifShowCompetitionStatement = true}, 30)
  }, 2*60*1000)

}
else {
  // 正式页面
  setInterval(function () {
    let score_now = store.state.realScore
    let max_s = 0
    let min_s = 0

    // 1.确定最低波动率
    let random_rate = 0.5  // 对手分数的浮动范围，分数越低波动范围越大，每个阶段都大约在60分左右
    if (score_now <=200) {random_rate = 0.5}
    else if (score_now <=400) {random_rate = 0.6}
    else {random_rate = 0.7}

    // 2.确定波动的上下限
    if (getUrlParameter('c') === 'a') {
      // 获胜条件下
      min_s = Math.floor(score_now * random_rate / 10)
      max_s = Math.floor(score_now * 0.8 / 10)
      if (score_now >= last_self_score) {
        // 如果被试的分数比上次高，那么对手分数就不能比上次低
        min_s = Math.max(min_s, last_opponent_score)
      }
      min_s = Math.min(min_s, max_s) // 下限不能比上限高
    }
    else {
      // 失败条件下
      min_s = Math.floor(score_now * 1.2 / 10)
      max_s = Math.floor(score_now * (2-random_rate) / 10)

      if (score_now >= last_self_score) {
        // 如果被试的分数比上次高，那么对手分数就不能比上次低
        min_s = Math.max(min_s, last_opponent_score)
      }
      max_s = Math.max(min_s, max_s) // 上限不能比下限低
    }

    // 3.得到新的分数
    store.state.opponentScore  = Math.floor(Math.random()*(max_s-min_s+1)+min_s) * 10
    store.state.selfScore = score_now // 自己的分数也1分钟更新一次
    store.state.leaderboardPath += '-' + score_now + 'VS' + store.state.opponentScore
    // console.log(store.state.leaderboardPath)

    //做闪动效果
    store.state.ifShowCompetitionStatement = false
    setTimeout(function () {store.state.ifShowCompetitionStatement = true}, 50)
    // setTimeout(function () {store.state.ifShowCompetitionStatement = false}, 100)
    // setTimeout(function () {store.state.ifShowCompetitionStatement = true}, 150)

  }, 0.998*60*1000)
}



// 设定页面跳转时长
if (store.state.ifPractice === 1) {
  // 如果是练习页就3分钟跳转
  setTimeout(function () {
      let ext = getUrlParameter('ext') + '_' + store.state.realGameTime + '_' + store.state.briskNum

      let a = '../../pre/guide-2.html?c=' + store.state.speedCondition + '&ext=' + ext
              + '&tchain=' + getUrlParameter('tchain') + '_' + timestamp
      if (getUrlParameter('dev') === '1') {
        a = a + '&dev=1'
      }
      window.location.href = a
  }, 3*60*1000)
}
else {
  // 如果是正式页面，就10分钟后跳转
  const speedCondition = getUrlParameter('c')
  let nth_game = getUrlParameter('f')

  setTimeout(function() {

    let a = ''
    if (getUrlParameter('cp') === '1') {
      cp_word = 'cp'
    }

    let ext = getUrlParameter('ext') + '_xxx' + '_' + store.state.speedRun + '_' + store.state.max + '_'
      + store.state.totalScore + '_rs' + '_' + store.state.realScore + '_' + store.state.deadCnt + '_' + store.state.realGameTime
      + '_' + store.state.briskNum + '_' + store.state.practice_path + '_' + store.state.leaderboardPath + '_vr' + (store.state.selfScore/10+2)

    a = '../../pre/guide-3.html' + '?c=' + speedCondition + '&s=' + store.state.selfScore + '&os=' + store.state.opponentScore + '&ext=' + ext
        + '&tchain=' + getUrlParameter('tchain') + '_' + timestamp

    if (getUrlParameter('dev') === '1') {
      a = a + '&dev=1'
    }

    window.location.href = a
  }, 10*60*1000);
}

console.log(store.state.speedCondition)




// 自动跳转
// const speedCondition = getUrlParameter('c')
// const sequence = getUrlParameter('se')
//
// console.log(store.state.speedCondition)
//
// setTimeout(function() {
//
//   // let adjustedSpeed = Math.max(1, store.state.speedRun - 1)
//   let adjustedSpeed = store.state.speedRun
//
//   let ext = getUrlParameter('ext') + '_' + adjustedSpeed + '_' + store.state.max + '_'
//     + store.state.totalScore + '_' + store.state.realScore + '_' + store.state.deadCnt + '_' + store.state.realGameTime
//     + '_' + store.state.briskNum + '_' + store.state.practice_path
//   let a = '../../pre/guide-2.html?c=' + store.state.speedCondition + '&se=' + store.state.sequenceCondition + '&v=' + adjustedSpeed
//           + '&ms=' + store.state.max + '&ts=' + store.state.totalScore + '&rs=' + store.state.realScore + '&ext=' + ext
//   if (getUrlParameter('dev') === '1') {
//     a = a + '&dev=1'
//   }
//   window.location.href = a
// }, 10*60*1000);







