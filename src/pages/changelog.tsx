import type { FC } from 'react'
import type { InferGetStaticPropsType } from 'next'
import { join } from 'path'
import { promises as fs } from 'fs'
import { markdownToHtml } from '../markdownRender'

let ChangelogPage: FC<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => <div className="prose" dangerouslySetInnerHTML={props} />

export let getStaticProps = async () => {
  let changelog = await fs.readFile(join(process.cwd(), 'CHANGELOG.md'), 'utf8')
  let __html = await markdownToHtml(changelog)

  return { props: { __html } }
}

export default ChangelogPage
