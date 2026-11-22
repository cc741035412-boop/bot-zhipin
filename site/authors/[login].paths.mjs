import { buildAuthors } from '../../scripts/lib/authors.mjs'
import { shelfData } from '../.vitepress/data/bots.mjs'

export default {
  paths: () => buildAuthors(shelfData()).map(author => ({ params: { login: author.key, author } })),
}
