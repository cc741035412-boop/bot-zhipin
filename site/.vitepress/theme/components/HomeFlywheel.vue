<!--
  首页最后一块「飞轮」：找到 Bot → 用起来 → 投稿上架 → 被更多人看见 → 回到找到 Bot。文字在 meta.mjs 的 FLYWHEEL。
  每一步站一只分组吉祥物（和分组组头同一种头像砖、活的 Bot）；第三步带「我要投稿」，原来页尾那枚按钮挪到了这里。
  宽屏四步排一行，步与步之间一个箭头，下面一道弧线从第四步绕回第一步；窄屏排成两行两列、顺时针一圈（1 2 / 4 3）。
-->
<script setup lang="ts">
import { CONTRIBUTE_URL, FLYWHEEL, HERO_MASCOTS, SHELF_COPY } from '../../meta.mjs'
import { botPalette } from '../color'
import { shapeRadii } from '../face'
import BzIcon from './BzIcon.vue'
import LiveBot from './LiveBot.vue'

const mascots = new Map(HERO_MASCOTS.map((mascot) => [mascot.key, mascot]))
const steps = FLYWHEEL.steps.map((step) => ({ ...step, mascot: mascots.get(step.mascot)! }))
</script>

<template>
  <section class="shelf-section flywheel" data-testid="flywheel" aria-labelledby="flywheel-title">
    <header class="bz-section-head"><div><h2 id="flywheel-title">{{ FLYWHEEL.title }}</h2></div></header>
    <div class="flywheel-ring">
      <ol class="flywheel-steps">
        <li v-for="(step, i) in steps" :key="step.title" class="flywheel-step" :data-step="i + 1" data-testid="flywheel-step">
          <div class="flywheel-top">
            <span class="bz-tile s40 bz-bot-scope" :style="botPalette(step.mascot.color)" aria-hidden="true">
              <LiveBot :radii="shapeRadii(step.mascot.shape)" :color="step.mascot.color" :shape-id="step.mascot.shape" rest="idle" />
            </span>
            <span class="flywheel-num" aria-hidden="true">{{ i + 1 }}</span>
          </div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
          <a v-if="i === 2" data-testid="contribute-link" class="bz-btn flywheel-cta" :href="CONTRIBUTE_URL"><BzIcon name="plus" />{{ SHELF_COPY.contribute }}</a>
          <span class="flywheel-arrow" aria-hidden="true"><BzIcon name="arrow-right" /></span>
        </li>
      </ol>
      <!-- 回到第一步的那道弧线：宽屏才有；窄屏两行两列本身就是一圈 -->
      <span class="flywheel-return" aria-hidden="true"><span class="flywheel-arrow flywheel-back"><BzIcon name="arrow-right" /></span></span>
    </div>
  </section>
</template>
