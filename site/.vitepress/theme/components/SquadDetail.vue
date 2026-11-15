<script setup>
// 占位组件：把小队摘要里的数据都渲染出来，不做版式和样式，等小队详情车道重写。
// squad 的字段见 scripts/lib/squad-summary.mjs；copy 是权限和额度的说明文案（和 Bot 详情页同一份）。
import { computed } from 'vue'

const props = defineProps({
  squad: { type: Object, required: true },
  copy: { type: Object, default: () => ({ permissions: {}, quota: {} }) },
})
const names = computed(() => new Map(props.squad.members.map((member) => [member.bot, member.name])))
// flow 里的 you 代表用户本人。
const who = (slug) => slug === 'you' ? '你' : names.value.get(slug) || slug
</script>

<template>
  <main class="shelf-page squad-detail" data-testid="squad-detail" :data-slug="squad.slug">
    <a class="back-link" href="/">← 返回货架</a>
    <header data-testid="squad-header">
      <h1>{{ squad.name }}</h1>
      <p data-testid="squad-tagline">{{ squad.tagline }}</p>
      <p data-testid="squad-meta">
        <span data-testid="squad-formation">队形：{{ squad.formation }}</span>
        <span data-testid="squad-origin">来源：{{ squad.origin }}</span>
        <span>设计者：<a v-if="squad.author.link" data-testid="squad-author" :href="squad.author.link" target="_blank" rel="noopener noreferrer">{{ squad.author.name }}</a><span v-else data-testid="squad-author">{{ squad.author.name }}</span></span>
        <span>上架日期：<time :datetime="squad.addedAt">{{ squad.addedAt }}</time></span>
      </p>
    </header>

    <section data-testid="squad-members">
      <h2>成员（{{ squad.members.length }}）</h2>
      <ul>
        <li v-for="member in squad.members" :key="member.bot" data-testid="squad-member" :data-slug="member.bot" :data-lead="String(member.lead)">
          <h3><a :href="member.detailUrl">{{ member.name }}</a></h3>
          <p>
            <span data-testid="member-title">{{ member.title }}</span>
            <span v-if="member.lead">（队长）</span>
            <span v-if="member.optional">（可选）</span>
          </p>
          <p data-testid="member-does">{{ member.does }}</p>
          <p>{{ member.tagline }}</p>
          <p>
            <span>岗位：{{ member.category }}</span>
            <span>额度 {{ member.quotaCost }}</span>
            <span v-if="member.needsAccount">要连账号</span>
            <span v-if="member.selfRunning">会自己定时跑</span>
          </p>
          <a :href="member.templateUrl" target="_blank" rel="noopener noreferrer">一键导入</a>
        </li>
      </ul>
    </section>

    <section v-if="squad.flow.length" data-testid="squad-flow">
      <h2>怎么配合</h2>
      <ol>
        <li v-for="(step, index) in squad.flow" :key="index">{{ who(step.from) }} → {{ who(step.to) }}：{{ step.what }}</li>
      </ol>
    </section>

    <section v-if="squad.setup.length" data-testid="squad-setup">
      <h2>导入之后</h2>
      <ol>
        <li v-for="(step, index) in squad.setup" :key="index"><strong>{{ step.title }}</strong>：{{ step.detail }}</li>
      </ol>
    </section>

    <section v-if="squad.kickoff" data-testid="squad-kickoff">
      <h2>组队口令</h2>
      <p>发给队长：</p>
      <pre>{{ squad.kickoff }}</pre>
    </section>

    <section v-if="squad.tryout" data-testid="squad-tryout">
      <h2>组好以后先试这一句</h2>
      <p>{{ squad.tryout }}</p>
    </section>

    <section data-testid="squad-quota">
      <h2>额度消耗</h2>
      <p v-if="squad.quota.max">整队最高：{{ squad.quota.max }}　{{ copy.quota[squad.quota.max] }}</p>
      <ul>
        <li v-for="item in squad.quota.perMember" :key="item.bot">{{ who(item.bot) }}：{{ item.quotaCost }}</li>
      </ul>
    </section>

    <section data-testid="squad-permissions">
      <h2>会用到的权限</h2>
      <ul v-if="squad.permissions.length">
        <li v-for="item in squad.permissions" :key="item.permission">
          <strong>{{ item.permission }}</strong>：{{ copy.permissions[item.permission] }}（{{ item.bots.map(who).join('、') }}）
        </li>
      </ul>
      <p v-else>不需要额外权限</p>
    </section>

    <section v-if="squad.prerequisites.length" data-testid="squad-prereq">
      <h2>导入前准备</h2>
      <ul>
        <li v-for="entry in squad.prerequisites" :key="entry.bot">
          {{ who(entry.bot) }}
          <ul><li v-for="(item, index) in entry.items" :key="index">{{ item }}</li></ul>
        </li>
      </ul>
    </section>

    <section v-if="squad.notes.length" data-testid="squad-notes">
      <h2>要知道的事</h2>
      <ul><li v-for="(note, index) in squad.notes" :key="index">{{ note }}</li></ul>
    </section>

    <section v-if="squad.missing.length" data-testid="squad-missing">
      <h2>原套装里还有，本站没收</h2>
      <ul><li v-for="item in squad.missing" :key="item.name">{{ item.name }}：{{ item.does }}</li></ul>
    </section>
  </main>
</template>
