import type { AppProps } from 'next/app'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import type { FC } from 'react'

import '../main.css'

import avatarSrc from '../../public/avatar.jpg'
import { DarkModeSwitch } from '../darkMode/DarkModeSwitch'

let NavLink: FC<{ href: string; isActive?: (p: string) => boolean }> = ({
  href,
  isActive,
  children,
}) => {
  let { asPath } = useRouter()

  return (
    <Link href={href}>
      <a
        className={
          'px-3 py-2 rounded-md text-sm font-medium ' +
          (isActive?.(asPath) ?? href === asPath
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
        <div className="flex items-center flex-1">
          <div className="flex-shrink-0">
            <a href="https://nikitakirsanov.com">
              <Image
                className="object-cover rounded-full"
                src={avatarSrc}
                width={32}
                height={32}
                alt="Nikita Kirsanov logo"
              />
            </a>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink href="/">home</NavLink>
              <NavLink href="/blog/" isActive={(p) => p.startsWith('/blog')}>
                blog
              </NavLink>
            </div>
          </div>

          <DarkModeSwitch className="ml-auto" />
        </div>
      </div>
    </div>
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
      <script>
        {`if(localStorage.getItem('darkMode')==='dark'){document.documentElement.classList.add('dark')}`}
      </script>
    </Head>

    <Nav />

    <main className="px-8 2xl:px-0">
      <Component {...pageProps} />
    </main>

    <footer className="page mt-12 px-8 2xl:px-0">
      <hr className="dark:border-gray-700" />
      <div className="flex justify-between py-8 text-gray-500 dark:text-gray-400">
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
