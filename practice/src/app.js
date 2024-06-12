import Decorate from './components/decorate/index.vue'
import Guide from './components/guide/index.vue'
import Next from './components/next/index.vue'
import Music from './components/music/index.vue'
import Pause from './components/pause/index.vue'
import Number from './components/number/index.vue'
import Point from './components/point/index.vue'
import Keyboard from './components/keyboard/index.vue'
import Logo from './components/logo/index.vue'
import Matrix from './components/matrix/index.vue'
import Devpanel from './components/devpanel/index.vue'
import Mission from './components/mission/index.vue'
import MissionFormal from './components/mission_formal/index.vue'
import MissionFormalNoFeedback from './components/mission_formal_no_feedback/index.vue'
import { mapState } from 'vuex'
import { transform, lastRecord, speeds, i18n, lan } from './unit/const'
import { visibilityChangeEvent, isFocus } from './unit/'
import states from './control/states'
import {getUrlParameter} from "./choose_practice";
import store from "./vuex/store";
export default {
  mounted() {
    this.render()
    window.addEventListener('resize', this.resize.bind(this), true)
  },
  data() {
    return {
      size: {},
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight,
      filling: '',
      ifDevMode:false,  // terry:开发者模式（是否显示开发仪表盘）
      ifPractice:false,
      ifShowLeaderboard:true
    }
  },
  components: {
    Decorate,
    Guide,
    Next,
    Music,
    Pause,
    Number,
    Point,
    Logo,
    Keyboard,
    Matrix,
    Devpanel,
    Mission,
    MissionFormal,
    MissionFormalNoFeedback
  },
  computed: {
    pContent() {
      return this.cur ? i18n.cleans[lan] : i18n.startLine[lan]
    },
    level: () => i18n.level[lan],
    nextText: () => i18n.next[lan],
    ...mapState([
      'matrix',
      'keyboard',
      'music',
      'pause',
      'next',
      'cur',
      'speedStart',
      'speedRun',
      'startLines',
      'clearLines',
      'points',
      'max',
      'reset',
      'drop',
      'realScore',
      'opponentScore',
      'selfScore',
      'leaderboardPath'
    ])
  },
  methods: {
    render() {
      let filling = 0
      const size = (() => {
        const w = this.w
        const h = this.h
        const ratio = h / w
        let scale
        let css = {}
        if (ratio < 1.5) {
          scale = h / 960
        } else {
          scale = w / 640
          filling = (h - 960 * scale) / scale / 3
          css = {
            'padding-top': Math.floor(filling) + 42 + 'px',
            'padding-bottom': Math.floor(filling) + 'px',
            'margin-top': Math.floor(-480 - filling * 1.5) + 'px'
          }
        }
        css[transform] = `scale(${scale})`
        return css
      })()
      this.size = size
      this.start()
      this.filling = filling
    },
    resize() {
      this.w = document.documentElement.clientWidth
      this.h = document.documentElement.clientHeight
      this.render()
    },
    start() {
      if (visibilityChangeEvent) {
        // 将页面的焦点变换写入store
        document.addEventListener(
          visibilityChangeEvent,
          () => {
            states.focus(isFocus())
          },
          false
        )
      }

      if (lastRecord) {
        // 读取记录
        if (lastRecord.cur && !lastRecord.pause) {
          // 拿到上一次游戏的状态, 如果在游戏中且没有暂停, 游戏继续
          const speedRun = this.$store.state.speedRun
          let timeout = speeds[speedRun - 1] / 2 // 继续时, 给予当前下落速度一半的停留时间
          // 停留时间不小于最快速的速度
          timeout =
            speedRun < speeds[speeds.length - 1]
              ? speeds[speeds.length - 1]
              : speedRun
          states.auto(timeout)
        }

        if (!lastRecord.cur) {
          states.overStart()
        }
      } else {
        states.overStart()
      }


      // terry:根据页面参数定义下降速度
      function getUrlParameter(name){
        name = name.replace(/[]/,"\[").replace(/[]/,"\[").replace(/[]/,"\\\]");
        var regexS = "[\\?&]"+name+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var results = regex.exec(window.parent.location.href );
        if( results == null ) return ""; else {
          return results[1];
        }
      };
      // terry: 将条件写入vuex的状态中
      if (['a', 'b', 'c', 'd', 'e', 'f'].indexOf(getUrlParameter("c")) > -1 ) {
        this.$store.state.speedCondition = getUrlParameter("c")
      }
      // terry: 将平衡顺序id写入vuex中
      if (getUrlParameter("se").length >= 1 ) {
        this.$store.state.sequenceCondition = getUrlParameter("se")
      }

      // 将是否练习页写进vuex
      // if (getUrlParameter("pra").length >= 1 ) {
      //   this.$store.state.ifPractice = 1
      // }
      // console.log(this.$store.state.ifPractice)

      // 练习页的初始速度永远=3
      this.$store.commit('speedStart2', 4)

      // 根据dev参数确定是否打开debug面板
      if (getUrlParameter('dev') === '1') {
        this.ifDevMode = true
        store.state.ifDevMode = true
      }

      // 根据pra参数确定是否打开练习mission面板
      if (getUrlParameter('pra') === '1') {
        this.ifPractice = true
        store.state.ifPractice = 1
      }

      // 根据condition确定是否显示排行榜
      if (getUrlParameter('c') === 'c') {
        this.ifShowLeaderboard = false
      }

    }
  }
}

