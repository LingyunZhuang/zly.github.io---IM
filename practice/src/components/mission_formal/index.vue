<template>
  <div>
    <div class="leaderboard">

      <div class="main">
        <div class="result">
          <div class="tpic"><img src="static/icon01.png" alt=""></div>
          <div class="compare">
            <p class="ele_p">
              <span class="ele_span"><em><img src="static/icon02.png" alt="" class="yellow" ></em><i style="font-size: 20px">你</i></span>
              <b id="vs" class="ele_b">vs</b>
              <span class="ele_span"><i style="font-size: 20px">对手</i><em><img src="static/icon02.png" alt="" class="blue"></em></span>
            </p>
            <h3 id="status_statement" v-show="$store.state.ifShowCompetitionStatement" style="font-size: 28px">你当前{{competition_status}} {{score_diff}} {{fen}}</h3>
            <div class="score">
              <em class="icon"><i>vs</i></em>
              <!-- <img src="images/icon04.png" alt=""> -->
              <div class="num" id="self_point">{{$store.state.selfScore}}</div>
              <div class="num" id="opponent_point" >{{$store.state.opponentScore}}</div>

            </div>
          </div>
          <h6 id="bottom_hint" style="color: yellow; font-weight: bold; font-size: 24px">{{bottomHint}}</h6>
          <div style="clear:both"></div>
        </div>
      </div>

    </div>



  </div>
</template>

<script src="./index.js">
</script>

<style lang="less">
@import './index.css';
</style>
