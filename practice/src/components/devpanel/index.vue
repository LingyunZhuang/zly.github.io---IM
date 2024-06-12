<template>
  <div>
    <div class="dev-hint" v-show="ifPanel">
      <h3>Debug仪表盘</h3>
      <button @click="skipPractice">跳过练习</button> <button @click="skipFormalGame">跳过正式</button>
      <p>调速：<button class="speedControl" @click="addSpeed">+</button> <button class="speedControl" @click="subSpeed">-</button></p>
<!--      <button @click="skipFormalGame">跳过正式游戏</button>-->
      <p>当前速度值：{{$store.state.speedRun}}</p>
<!--      <p>当前速度值run：{{$store.state.speedRun}}</p>-->
      <p>当前所属条件：{{$store.state.speedCondition}}</p>
      <p>缓存消除行：{{$store.state.activeClearLines}}</p>
      <p>缓存累计方块数：{{$store.state.activeBrisk}}</p>
      <p>练习期间累计得分：{{$store.state.totalScore}}</p>
      <p>死亡次数：{{$store.state.deadCnt}}</p>
      <p>真实游戏时长：{{$store.state.realGameTime}}</p>
      <p>真实得分：{{$store.state.realScore}}</p>
      <p>累计方块数：{{$store.state.briskNum}}</p>
      <p>练习路径：{{$store.state.practice_path}}</p>
    </div>
  </div>
</template>

<script src="./index.js">
</script>

<style lang="less">
@import './index.less';
</style>
