import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'

import type { IPost } from './posts'

export let PostCard = ({
  className,
  post: { lang, slug, title, date, thumbnail, preface, tags, readingTime },
}: {
  className?: string
  post: IPost
}) => (
  <section
    className={
      'flex flex-col bg-white shadow-lg hover:shadow-2xl rounded-md ' +
      className
    }
  >
    <Link href={`/${lang}/blog/${slug}`}>
      <a className="h-48 w-full relative">
        <Image
          src={thumbnail.img}
          layout="fill"
          className="object-cover rounded-t-md overflow-hidden"
        />
      </a>
    </Link>

    <div className="p-6">
      <ul className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <li key={t} className="text-sm text-violet-900 hover:underline">
            <Link href={`/blog/tags/${t}`}>
              <a>#{t}</a>
            </Link>
          </li>
        ))}
      </ul>

      <Link href={`/${lang}/blog/${slug}`}>
        <a>
          <div className="text-2xl font-medium text-gray-700 pt-2 hover:underline">
            {title}
          </div>
        </a>
      </Link>

      <p className="font-medium text-gray-500 pt-2">
        {format(new Date(date), 'PP')} • {readingTime}
      </p>

      <p className="text-md text-gray-700 pt-4">{preface}</p>
    </div>
  </section>
)
