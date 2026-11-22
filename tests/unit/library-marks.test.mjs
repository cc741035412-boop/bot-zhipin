import { expect, it } from 'vitest'
import { libraryMarks } from '../../site/.vitepress/theme/library-marks.ts'
import { loadLibraryEnums } from '../../scripts/lib/load-prompts-skills.mjs'

it.each(['prompt', 'skill'])('%s 每个 schema 分类恰有一份配色和图形', (kind) => {
  const marks = libraryMarks[kind]
  expect(Object.keys(marks).sort()).toEqual([...loadLibraryEnums()[kind].categories].sort())
  for (const key of ['color', 'path']) expect(new Set(Object.values(marks).map(m => m[key])).size).toBe(Object.keys(marks).length)
  if (kind === 'prompt') expect(marks.出图.color).toBe('#f43f5e')
  for (const { color, path } of Object.values(marks)) {
    expect(color).toMatch(/^#[0-9a-f]{6}$/i)
    expect(path).toMatch(/^M\d/)
  }
})
