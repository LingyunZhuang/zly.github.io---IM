<template>
  <div class="app" :style="size">

    <div class="rect" :class="drop?'drop':''">
      <Decorate/>
      <div class="screen">
        <div class="panel">
          <Matrix :propMatrix="matrix" :cur="cur" :reset="reset" />
          <Logo :cur="!!cur" :reset="reset" />
          <div class="state">
            <Point :cur="!!cur" :max="max" :point="points" :realScore="realScore"/>
<!--            terry 修改：去除起始行和级别-->
<!--            <p>{{pContent}}</p>-->
<!--            <Number :number='cur ? clearLines : startLines' />-->
<!--            <p>{{level}}</p>-->
<!--            <Number :number='cur?speedRun:speedStart' :length="1" />-->
            <p>{{nextText}}</p>
            <Next :data="next" />
            <div class="bottom">
              <Music :data="music" />
              <Pause :data="pause" />
<!--              terry修改，去除时间-->
<!--              <Number :propTime="true" />-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <Keyboard :filling='filling' />
    <Guide/>
    <Devpanel v-if="ifDevMode"/>
    <Mission v-if="ifPractice"/>
    <MissionFormal v-if="ifShowLeaderboard"/>
    <MissionFormalNoFeedback v-if="!ifShowLeaderboard && !ifPractice"/>

  </div>
</template>

<style lang="less">
@import './app.less';
@import './loader.less';
</style>

<script src="./app.js"></script>

