import {getUrlParameter} from "../../choose_practice";
import store from "../../vuex/store";

export default {
  name: 'MissionFormalNoFeedback',
  data() {

    var temp_title = ""
    var temp_word = ""
    var bottom_hint = "排行榜数据每1分钟更新一次"

    // 根据url参数来确定目标内容
    function getUrlParameter(name){
      name = name.replace(/[]/,"\[").replace(/[]/,"\[").replace(/[]/,"\\\]");
      var regexS = "[\\?&]"+name+"=([^&#]*)";
      var regex = new RegExp( regexS );
      var results = regex.exec(window.parent.location.href );
      if( results == null ) return ""; else {
        return results[1];
      }
    };

    if (getUrlParameter('cp') === '0'){
      temp_title = "非竞争环节"
      temp_word = "在本环节，你有随机可能性获得20元额外奖励";
    }
    else {
      temp_title = "竞争环节"
      temp_word = "在本环节，你们二人中最终得分更高者可获得20元额外奖励"
    }

    console.log('ifff',  store.state.ifPractice)
    if (getUrlParameter('pra') === '1') {
      bottom_hint = "练习阶段中对手分数只是案例数据"
    }

    return {
      misiionTitle: temp_title,
      missionWord: temp_word,
      bottomHint: bottom_hint,
      // score_diff: store.state.selfScore - store.state.opponentScore
    }
  },
  computed: {
    // linkTitle: () => i18n.linkTitle[lan],
    score_diff () {
      if (store.state.selfScore === store.state.opponentScore) {return ""}
      else {return Math.abs(store.state.selfScore - store.state.opponentScore)}
    },
    competition_status () {
      if (store.state.selfScore > store.state.opponentScore) {return "领先"}
      else if (store.state.selfScore < store.state.opponentScore) {return "落后"}
      else {return "持平对手"}
    },
    fen () {
      if (store.state.selfScore === store.state.opponentScore) {return ""}
      else {return "分"}
    }

  },
  mounted() {
    // window.addEventListener('resize', this.resize.bind(this), true)
  },
  methods: {
  }
}

