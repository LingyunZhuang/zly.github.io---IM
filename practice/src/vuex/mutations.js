import { getNextType } from '../unit'
import Block from '../unit/block'
const mutations = {
  nextBlock(state, data) {
    if (!data) {
      data = getNextType()
    }
    state.next = data
  },
  moveBlock(state, data) {
    state.cur = data.reset === true ? null : new Block(data)
  },
  speedStart(state, data) {
    // terry修改，速度永远为1
    // state.speedStart = data
    // state.speedStart = 1
  },
  speedStart2(state, data) {
    // 新增的方法，来修改初始速度
    state.speedStart = data
  },
  speedRun(state, data) {
    state.speedRun = data
  },
  startLines(state, data) {
    // terry修改，起始行永远为0
    // state.startLines = data
    state.startLines = 0
  },
  matrix(state, data) {
    state.matrix = data
  },
  lock(state, data) {
    state.lock = data
  },
  clearLines(state, data) {
    state.clearLines = data
  },
  points(state, data) {
    state.points = data
  },
  max(state, data) {
    state.max = data
  },
  reset(state, data) {
    state.reset = data
  },
  drop(state, data) {
    state.drop = data
  },
  pause(state, data) {
    state.pause = data
  },
  music(state, data) {
    state.music = data
  },
  focus(state, data) {
    state.focus = data
  },
  key_drop(state, data) {
    state.keyboard['drop'] = data
  },
  key_down(state, data) {
    state.keyboard['down'] = data
  },
  key_left(state, data) {
    state.keyboard['left'] = data
  },
  key_right(state, data) {
    state.keyboard['right'] = data
  },
  key_rotate(state, data) {
    state.keyboard['rotate'] = data
  },
  key_reset(state, data) {
    state.keyboard['reset'] = data
  },
  key_music(state, data) {
    state.keyboard['music'] = data
  },
  key_pause(state, data) {
    state.keyboard['pause'] = data
  },
  // 练习页
  activeClearLines(state, data) {
    state.activeClearLines = data
  },
  activeBrisk(state, data) {
    state.activeBrisk = data
  },
  totalScore(state, data) {
    state.totalScore = data
  },
  deadCnt(state, data) {
    state.deadCnt = data
  },
  realGameTime(state, data) {
    state.realGameTime = data
  },
  realScore(state, data) {
    state.realScore = data
  },
  briskNum(state, data) {
    state.briskNum = data
  },
  ifPractice(state, data) {
    state.ifPractice = data
  },
  linesCookie(state, data) {
    state.linesCookie = data
  },
  opponentScore(state, data) {
    state.opponentScore = data
  },
  selfScore(state, data) {
    state.selfScore = data
  },
  leaderboardPath(state, data) {
    state.leaderboardPath = data
  },
}
export default mutations
