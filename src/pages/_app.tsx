import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import Link from 'next/link'
import type { FC } from 'react'
import { useRouter } from 'next/router'

let NavLink: FC<{ href: string }> = ({ href, children }) => {
  let { asPath } = useRouter()
  let isActive = href === asPath

  return (
    <Link href={href}>
      <a
        href="#"
        className={
          'px-3 py-2 rounded-md text-sm font-medium ' +
          (isActive
            ? 'bg-gray-900 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white')
        }
      >
        {children}
      </a>
    </Link>
  )
}

let Nav = () => (
  <nav className="bg-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <img
              className="h-8 w-8"
              src="/icon.png"
              alt="Nikita Kirsanov logo"
            />
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink href="/">home</NavLink>
              <NavLink href="/blog">blog</NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/*<div className="md:hidden" id="mobile-menu">*/}
    {/*  <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">*/}
    {/*    {tabs.map((i) => (*/}
    {/*      <a*/}
    {/*        href="#"*/}
    {/*        className={*/}
    {/*          i === 'posts'*/}
    {/*            ? 'bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium'*/}
    {/*            : 'text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'*/}
    {/*        }*/}
    {/*      >*/}
    {/*        {i}*/}
    {/*      </a>*/}
    {/*    ))}*/}
    {/*  </div>*/}
    {/*</div>*/}
  </nav>
)

let MyApp = ({ Component, pageProps }: AppProps) => (
  <div>
    <Nav />

    <main>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Component {...pageProps} />
        </div>
      </div>
    </main>
  </div>
)

export default MyApp
