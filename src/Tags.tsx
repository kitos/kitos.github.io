import Link from 'next/link'

export let Tags = ({ locale, tags }: { tags: string[]; locale: string }) => (
  <ul className="flex flex-wrap gap-2">
    {tags.map((t) => (
      <li
        key={t}
        className="text-sm text-blue-700 dark:text-blue-300 hover:underline"
      >
        <Link href={`/blog/tags/${t}`} locale={locale}>
          <a>#{t}</a>
        </Link>
      </li>
    ))}
  </ul>
)
