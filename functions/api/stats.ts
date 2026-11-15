import type { PagesFunction } from '@cloudflare/workers-types'
import { readStats } from '../_lib/clicks'
import { handleApi, json, methodNotAllowed } from '../_lib/http'
import type { Env } from '../_lib/types'

export const onRequestGet: PagesFunction<Env> = (context) => handleApi(context, async () => json(await readStats(context.env.DB)))

export const onRequest: PagesFunction<Env> = (context) => handleApi(context, () => methodNotAllowed('GET'))
