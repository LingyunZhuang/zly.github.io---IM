import store from '../vuex/store'
import { want, isClear, isOver } from '../unit/'
import {
  speeds,
  blankLine,
  blankMatrix,
  clearPoints,
  eachLines
} from '../unit/const'
import { music } from '../unit/music'

const getStartMatrix = startLines => {
  // 生成startLines
  const getLine = (min, max) => {
    // 返回标亮个数在min~max之间一行方块, (包含边界)
    const count = parseInt((max - min + 1) * Math.random() + min, 10)
    const line = []
    for (let i = 0; i < count; i++) {
      // 插入高亮
      line.push(1)
    }
    for (let i = 0, len = 10 - count; i < len; i++) {
      // 在随机位置插入灰色
      const index = parseInt((line.length + 1) * Math.random(), 10)
      line.splice(index, 0, 0)
    }

    return line
  }
  let startMatrix = []

  for (let i = 0; i < startLines; i++) {
    if (i <= 2) {
      // 0-3
      startMatrix.push(getLine(5, 8))
    } else if (i <= 6) {
      // 4-6
      startMatrix.push(getLine(4, 9))
    } else {
      // 7-9
      startMatrix.push(getLine(3, 9))
    }
  }
  for (let i = 0, len = 20 - startLines; i < len; i++) {
    // 插入上部分的灰色
    startMatrix.unshift(blankLine)
  }
  return startMatrix
}

const states = {
  // 自动下落setTimeout变量
  fallInterval: null,
  // 真实游戏时长变量
  realTimeInterval: null,

  // 游戏开始
  start: () => {
    if (music.start) {
      music.start()
    }
    const state = store.state
    states.dispatchPoints(0)
    store.commit('speedRun', state.speedStart)
    const startLines = state.startLines
    const startMatrix = getStartMatrix(startLines)
    store.commit('matrix', startMatrix)
    store.commit('moveBlock', { type: state.next })
    store.commit('nextBlock', '')
    states.auto()

    // 真实游戏时长
    states.realTimeInterval = setInterval(function() {
      store.commit('realGameTime', store.state.realGameTime + 1)
    }, 1000)

  },

  // 自动下落
  auto: timeout => {
    const out = timeout < 0 ? 0 : timeout
    let state = store.state
    let cur = state.cur
    const fall = () => {
      state = store.state
      cur = state.cur
      const next = cur.fall()
      if (want(next, state.matrix)) {
        store.commit('moveBlock', next)
        states.fallInterval = setTimeout(fall, speeds[state.speedRun - 1])
      } else {
        let matrix = JSON.parse(JSON.stringify(state.matrix))
        const shape = cur && cur.shape
        const xy = cur && cur.xy
        shape.forEach((m, k1) =>
          m.forEach((n, k2) => {
            if (n && xy[0] + k1 >= 0) {
              // 竖坐标可以为负
              let line = matrix[xy[0] + k1]
              line[xy[1] + k2]=1
              matrix[xy[0] + k1]=line
            }
          })
        )
        states.nextAround(matrix)
      }
    }
    clearTimeout(states.fallInterval)
    states.fallInterval = setTimeout(
      fall,
      out === undefined ? speeds[state.speedRun - 1] : out
    )
  },

  // 一个方块结束, 触发下一个
  nextAround: (matrix, stopDownTrigger) => {
    clearTimeout(states.fallInterval)
    store.commit('lock', true)
    store.commit('matrix', matrix)

    // 累计方块数加一
    store.commit('briskNum', store.state.briskNum + 1)

    if (typeof stopDownTrigger === 'function') {
      stopDownTrigger()
    }

    // terry修改 掉落时分数不增加
    // const addPoints = store.state.points + 10 + (store.state.speedRun - 1) * 2 // 速度越快, 得分越高
    //
    // states.dispatchPoints(addPoints)

    // 练习页：活跃方块数+1,根据活跃消除行数对速度进行调整
    const state = store.state
    let activeBriskNow = state.activeBrisk + 1
    store.commit('activeBrisk', activeBriskNow)

    if (state.activeBrisk % 30 === 0) {
      if (state.activeClearLines <= 3) {
        let speedRunNow = Math.max(2, state.speedRun - 1)
        store.commit('speedRun', speedRunNow)
        store.commit('activeClearLines', 0)
        store.state.practice_path = store.state.practice_path + 'm'
      }
      else if (state.activeClearLines >= 5) {
        let speedRunNow = Math.min(11, state.speedRun + 1)
        store.commit('speedRun', speedRunNow)
        store.commit('activeClearLines', 0)
        store.state.practice_path = store.state.practice_path + 'a'
      }
      else {
        store.commit('activeClearLines', 0)
        store.state.practice_path = store.state.practice_path + 'b'
      }
    }



    if (isClear(matrix)) {
      if (music.clear) {
        music.clear()
      }
      return
    }
    if (isOver(matrix)) {
      if (music.gameover) {
        music.gameover()
      }
      states.overStart()
      return
    }
    setTimeout(() => {
      store.commit('lock', false)
      store.commit('moveBlock', { type: store.state.next })
      store.commit('nextBlock', '')
      states.auto()
    }, 100)
  },

  // 页面焦点变换
  focus: isFocus => {
    store.commit('focus', isFocus)
    if (!isFocus) {
      clearTimeout(states.fallInterval)
      return
    }
    const state = store.state
    if (state.cur && !state.reset && !state.pause) {
      states.auto()
    }
  },

  // 暂停
  pause: isPause => {
    store.commit('pause', isPause)
    if (isPause) {
      clearTimeout(states.fallInterval)
      return
    }
    states.auto()
  },

  // 消除行
  clearLines: (matrix, lines) => {
    // 修复卡死BUG
    let lines_backup = lines  // 1.首先定义一个变量储存原始的Lines，用于后面写进vuex中

    const state = store.state
    let newMatrix = JSON.parse(JSON.stringify(matrix))


    console.log('lines-1:', lines)

    // 2.当传入的Lines类型非对象时，就读取上一次缓存的lines，并且重复写入vuex中
    if (typeof lines != "object"){
      console.log('bug happened, read last lines:', state.linesCookie)
      lines = state.linesCookie
      lines_backup = lines
    }

    lines.forEach(n => {
      newMatrix.splice(n, 1)
      // newMatrix = newMatrix.unshift(List(blankLine))
       newMatrix.unshift(blankLine)
    })

    // 3.到这里表示游戏正常进行，将备份的Lines写入vuex
    store.commit('linesCookie', lines_backup)

    store.commit('matrix', newMatrix)
    store.commit('moveBlock', { type: state.next })
    store.commit('nextBlock', '')
    states.auto()
    store.commit('lock', false)
    const clearLines = state.clearLines + lines.length
    store.commit('clearLines', clearLines)

    // terry修改，每消除一行固定得10分
    // const addPoints = store.state.points + clearPoints[lines.length - 1] // 一次消除的行越多, 加分越多
    const addPoints = store.state.points + lines.length * 10
    states.dispatchPoints(addPoints)

    // 练习期间总得分
    store.commit('totalScore', store.state.totalScore + lines.length * 10)

    // 真实得分
    store.commit('realScore', store.state.realScore + lines.length * 10)

    // 练习页：把eachLines设为5，每5行加速
    // const speedAdd = Math.floor(clearLines / eachLines) // 消除行数, 增加对应速度
    // const speedAdd = 0
    // let speedNow = state.speedStart + speedAdd
    // speedNow = speedNow > 6 ? 6 : speedNow
    // store.commit('speedRun', speedNow)

    // 练习页：修改活跃消除行数，根据活跃消除行数对速度进行调整
    let activeClearLinesNow = state.activeClearLines + lines.length
    store.commit('activeClearLines', activeClearLinesNow)
    // if (state.activeClearLines >= 5) {
    //   let speedRunNow = Math.min(10, state.speedRun + 1)
    //   store.commit('speedRun', speedRunNow)
    //   store.commit('activeBrisk', 1)
    //   store.commit('activeClearLines', 0)
    // }

  },

  // 游戏结束, 触发动画
  overStart: () => {
    clearTimeout(states.fallInterval)
    store.commit('lock', true)
    store.commit('reset', true)
    store.commit('pause', false)

    // 练习页：重置活跃消除行数、活跃砖块数，下次游戏的初始速度-1
    const state = store.state
    let speedRunNow = Math.max(2, state.speedRun - 1)
    store.commit('speedRun', speedRunNow)
    store.commit('speedStart2', speedRunNow)
    store.commit('activeBrisk', 1)
    store.commit('activeClearLines', 0)
    store.state.practice_path = store.state.practice_path + 'd'

    // 下面这2句一定不能删了！！ 否则死亡后速度会变回初始速度
    // const state = store.state
    // store.commit('speedStart2', state.speedRun)

    // 死亡次数+1
    store.commit('deadCnt', store.state.deadCnt + 1 )

    // 清除计时器
    clearInterval(states.realTimeInterval)

    // 真实得分扣除20%
    store.commit('realScore', Math.floor(store.state.realScore * 0.08)*10)

  },

  // 游戏结束动画完成
  overEnd: () => {
    store.commit('matrix', blankMatrix)
    store.commit('moveBlock', { reset: true })
    store.commit('reset', false)
    store.commit('lock', false)
    store.commit('clearLines', 0)
  },

  // 写入分数
  dispatchPoints: point => {
    // 写入分数, 同时判断是否创造最高分
    store.commit('points', point)
    if (point > 0 && point > store.state.max) {
      store.commit('max', point)
    }
  }
}

export default states
