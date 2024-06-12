import Vue from 'vue'
import Vuex from 'vuex'
import { getNextType } from '../unit'
import mutations from './mutations'
import { isFocus } from '../unit/'
import { blankMatrix, lastRecord, maxPoint, blockType } from '../unit/const'
import Block from '../unit/block'
import { hasWebAudioAPI } from '../unit/music'
Vue.use(Vuex)

let clearLinesInitState = lastRecord &&
  !isNaN(parseInt(lastRecord.clearLines, 10))
  ? parseInt(lastRecord.clearLines, 10)
  : 0
if (clearLinesInitState < 0) {
  clearLinesInitState = 0
}

const curInitState = (() => {
  if (!lastRecord || !lastRecord.cur) {
    // 无记录 或 有记录 但方块为空, 返回 null
    return null
  }
  const cur = lastRecord.cur
  const option = {
    type: cur.type,
    rotateIndex: cur.rotateIndex,
    shape: cur.shape,
    xy: cur.xy
  }
  return new Block(option)
})()

const dropInitState = lastRecord && lastRecord.drop !== undefined
  ? !!lastRecord.drop
  : false

const lockInitState = lastRecord && lastRecord.lock !== undefined
  ? !!lastRecord.lock
  : false

const matrixInitState = lastRecord && Array.isArray(lastRecord.matrix)
  ? lastRecord.matrix
  : blankMatrix

let maxInitState = lastRecord && !isNaN(parseInt(lastRecord.max, 10))
  ? parseInt(lastRecord.max, 10)
  : 0

if (maxInitState < 0) {
  maxInitState = 0
} else if (maxInitState > maxPoint) {
  maxInitState = maxPoint
}
let musicInitState = lastRecord && lastRecord.music !== undefined
  ? !!lastRecord.music
  : true
if (!hasWebAudioAPI.data) {
  musicInitState = false
}

const nextInitState = lastRecord && blockType.indexOf(lastRecord.next) !== -1
  ? lastRecord.next
  : getNextType()

const pauseInitState = lastRecord && lastRecord.pause !== undefined
  ? !!lastRecord.pause
  : false

let pointsInitState = lastRecord && !isNaN(parseInt(lastRecord.points, 10))
  ? parseInt(lastRecord.points, 10)
  : 0

if (pointsInitState < 0) {
  pointsInitState = 0
} else if (pointsInitState > maxPoint) {
  pointsInitState = maxPoint
}

let speedRunInitState = lastRecord && !isNaN(parseInt(lastRecord.speedRun, 10))
  ? parseInt(lastRecord.speedRun, 10)
  : 1
if (speedRunInitState < 1 || speedRunInitState > 12) {
  speedRunInitState = 1
}
let speedStartInitState = lastRecord &&
  !isNaN(parseInt(lastRecord.speedStart, 10))
  ? parseInt(lastRecord.speedStart, 10)
  : 1
if (speedStartInitState < 1 || speedStartInitState > 12) {
  speedStartInitState = 1
}

let startLinesInitState = lastRecord &&
  !isNaN(parseInt(lastRecord.startLines, 10))
  ? parseInt(lastRecord.startLines, 10)
  : 0
if (startLinesInitState < 0 || startLinesInitState > 10) {
  startLinesInitState = 0
}
const resetInitState = lastRecord && lastRecord.reset
  ? !!lastRecord.reset
  : false
const state = {
  music: musicInitState,
  pause: pauseInitState,
  matrix: matrixInitState,
  next: nextInitState,
  cur: curInitState,
  // dispatch: '',
  speedStart: speedStartInitState,
  speedRun: speedRunInitState,
  startLines: startLinesInitState,
  clearLines: clearLinesInitState,
  points: pointsInitState,
  max: maxInitState,
  reset: resetInitState,
  drop: dropInitState,
  keyboard: {
    drop: false,
    down: false,
    left: false,
    right: false,
    rotate: false,
    reset: false,
    music: false,
    pause: false
  },

  lock: lockInitState,
  focus: isFocus(),
  speedCondition : 'a',  // terry：记录被试的条件
  sequenceCondition : '1',  // terry：记录抵消平衡顺序的条件
  activeClearLines: 0,
  activeBrisk: 1,
  ifDevMode: false,
  totalScore: 0,
  deadCnt: -1,  // 死亡次数
  realGameTime: 0,  // 真正的总游戏时长
  realScore: 0,  // 最终的计分
  briskNum: 0,  // 累计方块数量
  practice_path: '',  //练习时速度变化路径
  ifPractice: 0,  // 该页面是否是练习页
  linesCookie: [], // 缓存的上一次消除的Lines
  opponentScore:0, // 对手的分数
  selfScore:0, // 排行榜上每1分钟变化一次的分数
  leaderboardPath:"0VS0", // 排行榜分数变化路径，自己vs对手
  ifShowCompetitionStatement:true, // 是否显示排行榜中的文字说明，为了做闪动效果
}
export default new Vuex.Store({
  state,
  // getters,
  // actions,
  mutations
})
