import { promptData } from '../.vitepress/data/library.mjs'

// /prompts/<slug>：参数里是完整的一条（带正文），列表数据里没有正文。
export default {
  paths() {
    return promptData().map((prompt) => ({ params: { slug: prompt.slug, prompt } }))
  },
}
