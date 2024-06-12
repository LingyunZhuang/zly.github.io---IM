import { i18n, lan } from '../../unit/const'
const DF = i18n.point[lan]
const ZDF = i18n.highestScore[lan]
const SLDF = i18n.lastRound[lan]
let Point = {
  timeout: null
}
import Number from '../number/index.vue'
export default {
  props: ['cur', 'point', 'max', 'realScore'],
  mounted() {
    this.onChange(this.$props)
  },
  components:{
    Number
  },
  data() {
    return {
      label: '',
      number: 0
    }
  },
  watch:{
    $props:{
      deep:true,
      handler(nextProps){
        this.onChange(nextProps);
      }
    }
  },
  methods: {
    onChange({cur, point, max, realScore} ) {
      clearInterval(Point.timeout)

      if (cur) {
        // 在游戏进行中
        // this.label = point >= max ? ZDF : DF
        this.label = DF  // terry:注释上一行，保证在游戏中远远显示“得分”
        // this.number = point
        this.number = realScore  // 改为显示真实得分
      } else {
        // 游戏未开始
        const toggle = () => {
          // 最高分与上轮得分交替出现
          // this.label = ZDF
          // this.number = point
          // Point.timeout = setTimeout(() => {
          //   this.label = ZDF
          //   this.number = max
          //   Point.timeout = setTimeout(toggle, 3000)
          // }, 3000)

          // terry 改为只出现最高分，后来又改成只出现真实得分
          this.label = DF
          this.number = realScore

        }

        if (point !== 0) {
          // 如果为上轮没玩, 也不用提示了
          toggle()
        } else {
          this.label=DF  // 从ZDF改为得分
          this.number=realScore  // 从max改为真实得分
        }
      }
    }
  }
}
