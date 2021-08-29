import Link from 'next/link'
import { format } from 'date-fns'
import { IPost } from './posts'

export let PostLink = ({ slug, lang, title, date, readingTime }: IPost) => (
  <div>
    <h3 className="text-xl text-blue-800 font-bold hover:underline">
      <Link href={`/blog/${slug}`} locale={lang}>
        <a>{title}</a>
      </Link>
    </h3>

    <span className="text-sm text-gray-700">
      {format(new Date(date), 'LLLL d')} • {readingTime}
    </span>
  </div>
)
