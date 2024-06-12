import store from '../vuex/store'
// 使用 Web Audio API
const AudioContext =
  window.AudioContext ||
  window.webkitAudioContext ||
  window.mozAudioContext ||
  window.oAudioContext ||
  window.msAudioContext

export const hasWebAudioAPI = {
  data: !!AudioContext && location.protocol.indexOf('http') !== -1
}

export const music = {}
;(() => {
  if (!hasWebAudioAPI.data) {
    return
  }
  const url = './static/music.mp3'
  const context = new AudioContext()
  const req = new XMLHttpRequest()
  req.open('GET', url, true)
  req.responseType = 'arraybuffer'

  req.onload = () => {
    context.decodeAudioData(
      req.response,
      buf => {
        // 将拿到的audio解码转为buffer
        const getSource = () => {
          // 创建source源。
          const source = context.createBufferSource()
          source.buffer = buf
          source.connect(context.destination)
          return source
        }

        music.killStart = () => {
          // 游戏开始的音乐只播放一次
          music.start = () => {}
        }

        music.start = () => {
          // 游戏开始
          music.killStart()
          if (!store.state.music) {
            return
          }
          // getSource().start(0, 3.7202, 3.6224)
          getSource().start(0, 4.873, 3.6224)
        }

        music.clear = () => {
          // 消除方块
          if (!store.state.music) {
            return
          }
          getSource().start(0, 0, 0.889)
        }

        music.fall = () => {
          // 立即下落
          if (!store.state.music) {
            return
          }
          // getSource().start(0, 1.2558, 0.3546)
          getSource().start(0, 1.575, 1.712-1.575)
        }

        music.gameover = () => {
          // 游戏结束
          if (!store.state.music) {
            return
          }
          // getSource().start(0, 8.1276, 1.1437)
          getSource().start(0, 9.107, 1.1437)
        }

        music.rotate = () => {
          // 旋转
          if (!store.state.music) {
            return
          }
          // getSource().start(0, 2.2471, 0.0807)
          getSource().start(0, 2.291, 2.429-2.291)
        }

        music.move = () => {
          // 移动
          if (!store.state.music) {
            return
          }
          // getSource().start(0, 2.9088, 0.1437)
          // getSource().start(0, 2.977, 3.050-2.977)
          // getSource().start(0, 2.291, 2.429-2.291)
        }
      },
      error => {
        if (window.console && window.console.error) {
          window.console.error(`音频: ${url} 读取错误`, error)
          hasWebAudioAPI.data = false
        }
      }
    )
  }

  req.send()
})()
