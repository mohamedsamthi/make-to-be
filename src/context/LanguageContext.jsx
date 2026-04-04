import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import en from '../locales/en.json'
import ta from '../locales/ta.json'
import si from '../locales/si.json'

const STORAGE_KEY = 'makeToBeLanguage'

const locales = { en, ta, si }

function getByPath(obj, path) {
  if (!obj || !path) return undefined
  return path.split('.').reduce((o, key) => (o == null ? undefined : o[key]), obj)
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY)
      if (s && locales[s]) return s
    } catch {
      /* ignore */
    }
    return 'en'
  })

  const dict = locales[language] || locales.en
  const fallback = locales.en

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      /* ignore */
    }
    const htmlLang = language === 'ta' ? 'ta' : language === 'si' ? 'si' : 'en'
    document.documentElement.lang = htmlLang
    document.documentElement.setAttribute('data-lang', language)
  }, [language])

  const setLanguage = useCallback((lang) => {
    if (locales[lang]) setLanguageState(lang)
  }, [])

  const t = useCallback(
    (key, vars) => {
      let str = getByPath(dict, key) ?? getByPath(fallback, key) ?? key
      if (typeof str !== 'string') return key
      if (vars && typeof str === 'string') {
        Object.keys(vars).forEach((k) => {
          str = str.replaceAll(`{${k}}`, String(vars[k]))
        })
      }
      return str
    },
    [dict]
  )

  const messages = useMemo(() => dict, [dict])

  const value = useMemo(
    () => ({ language, setLanguage, t, messages }),
    [language, setLanguage, t, messages]
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
}
