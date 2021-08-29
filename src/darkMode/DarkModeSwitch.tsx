import type React from 'react'
import { useEffect, useState } from 'react'
import classes from './DarkModeSwitch.module.css'

let Radio = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => (
  <input
    type="radio"
    className={classes.switcher__radio}
    name="color-scheme"
    aria-label={props.value as string}
    {...props}
  />
)

const LS_KEY = 'darkMode'

let isSystemModeDark = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches

let savedMode =
  typeof window != 'undefined' ? localStorage.getItem(LS_KEY) : null

export let DarkModeSwitch = ({ className }: { className?: string }) => {
  let [mode, set] = useState<string>()

  useEffect(() => {
    set(savedMode ? (savedMode === 'dark' ? 'dark' : 'light') : 'system')
  }, [])

  useEffect(() => {
    let cl = document.documentElement.classList

    if (mode === 'system' ? isSystemModeDark() : mode === 'dark') {
      cl.add('dark')
    } else {
      cl.remove('dark')
    }

    switch (mode) {
      case 'light':
        return localStorage.setItem(LS_KEY, 'light')
      case 'dark':
        return localStorage.setItem(LS_KEY, 'dark')
      // system
      default:
        localStorage.removeItem(LS_KEY)
    }
  }, [mode])

  return (
    <fieldset
      className={classes.switcher + ' ' + className}
      onChange={(e: any) => set(e.target.value)}
    >
      <legend className="sr-only">Dark mode switch</legend>
      <Radio value="light" checked={mode === 'light'} />
      <Radio value="system" checked={mode === 'system'} />
      <Radio value="dark" checked={mode === 'dark'} />
      <div className={classes.switcher__status} />
    </fieldset>
  )
}
