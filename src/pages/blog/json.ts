import { GetServerSidePropsContext } from 'next'
import { ILang } from '../../posts'
import { generate } from '../../feed'

let Rss = () => {}
export default Rss

export let getServerSideProps = async ({
  res,
  locale,
}: GetServerSidePropsContext) => {
  let feed = await generate(locale as ILang)

  res.setHeader('Content-Type', 'application/json')
  res.write(feed.json1())
  res.end()

  return { props: {} }
}
