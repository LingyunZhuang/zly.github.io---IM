import {getUrlParameter} from "../../choose_practice";
import store from "../../vuex/store";

// 记录该页面开始的时间
const timestamp = (new Date()).valueOf();

export default {
  name: 'Devpanel',
  data() {
    return {
      ifPanel: true
    }
  },
  computed: {
    // linkTitle: () => i18n.linkTitle[lan],
  },
  mounted() {
    // window.addEventListener('resize', this.resize.bind(this), true)
  },
  methods: {
    skipPractice() {
      function getUrlParameter(name){
        name = name.replace(/[]/,"\[").replace(/[]/,"\[").replace(/[]/,"\\\]");
        var regexS = "[\\?&]"+name+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var results = regex.exec(window.parent.location.href );
        if( results == null ) return ""; else {
          return results[1];
        }
      };

      let ext = getUrlParameter('ext') + '_' + this.$store.state.realGameTime + '_' + this.$store.state.briskNum

      let a = '../../pre/guide-2.html?c=' + this.$store.state.speedCondition + '&ext=' + ext
              + '&tchain=' + getUrlParameter('tchain') + '_' + timestamp
      if (getUrlParameter('dev') === '1') {
        a = a + '&dev=1'
      }
      setTimeout(function() {window.location.href = a}, 600);
    },


    skipFormalGame() {

      function getUrlParameter(name){
        name = name.replace(/[]/,"\[").replace(/[]/,"\[").replace(/[]/,"\\\]");
        var regexS = "[\\?&]"+name+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var results = regex.exec(window.parent.location.href );
        if( results == null ) return ""; else {
          return results[1];
        }
      };

      let a = ''


      let ext = getUrlParameter('ext') + '_xxx' + '_' + this.$store.state.speedRun + '_' + this.$store.state.max + '_'
        + this.$store.state.totalScore + '_rs' + '_' + this.$store.state.realScore + '_' + this.$store.state.deadCnt + '_' + this.$store.state.realGameTime
        + '_' + this.$store.state.briskNum + '_' + this.$store.state.practice_path + '_' + this.$store.state.leaderboardPath + '_vr' + (store.state.selfScore/10+2)
      const speedCondition = getUrlParameter('c')
      let nth_game = getUrlParameter('f')

      a = '../../pre/guide-3.html' + '?c=' + speedCondition + '&s=' + this.$store.state.realScore
          + '&os=' + this.$store.state.opponentScore + '&ext=' + ext
          + '&tchain=' + getUrlParameter('tchain') + '_' + timestamp
      if (getUrlParameter('dev') === '1') {
        a = a + '&dev=1'
      }

      window.open(a,"_self")

    },
    addSpeed() {
      this.$store.commit('speedRun', Math.min(12, this.$store.state.speedRun + 1))
    },
    subSpeed() {
      this.$store.commit('speedRun', Math.max(1, this.$store.state.speedRun - 1))
    },
  }
}

