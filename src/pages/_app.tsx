import type { AppProps } from 'next/app'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import type { FC } from 'react'

import '../main.css'

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
  <nav className="bg-gray-800 mb-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <a href="https://nikitakirsanov.com">
              <Image
                className="object-cover rounded-full"
                src="/avatar.jpg"
                width={32}
                height={32}
                alt="Nikita Kirsanov logo"
              />
            </a>
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

let FLink: FC<{ href: string }> = ({ href, children }) => (
  <a className="hover:underline" href={href}>
    {children}
  </a>
)

let MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <link
        rel="webmention"
        href="https://webmention.io/nikitakirsanov.com/webmention"
      />
      <link
        rel="pingback"
        href="https://webmention.io/nikitakirsanov.com/xmlrpc"
      />
    </Head>

    <Nav />

    <Component {...pageProps} />

    <footer className="page mt-12">
      <hr />
      <div className="flex justify-between my-8 text-gray-500">
        <p>
          © {new Date().getFullYear()}{' '}
          <FLink href="https://nikitakirsanov.com">nikitakirsanov.com</FLink>
        </p>

        <div className="flex gap-4">
          <FLink href="https://twitter.com/kitos_kirsanov">Twitter</FLink>
          <FLink href="https://github.com/kitos">GitHub</FLink>
          <FLink href="https://www.linkedin.com/in/kitos-kirsanov/">
            LinkedIn
          </FLink>
        </div>
      </div>
    </footer>
  </>
)

export default MyApp
