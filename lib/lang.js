import { createContext, useCallback, useContext, useEffect, useState } from 'react';

// English / Japanese switch. The page is built in English first, then switches
// to the visitor's saved choice (or Japanese if their browser is set to Japanese).
// Use it as: const { t } = useLang(); t('Hello', 'こんにちは')

const KEY = 'kt-lang';
const LangContext = createContext({ lang: 'en', setLang: () => {}, t: (en) => en });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState('en');

  useEffect(() => {
    let saved = null;
    try { saved = window.localStorage.getItem(KEY); } catch (e) {}
    if (saved === 'en' || saved === 'ja') setLangState(saved);
    else if ((navigator.language || '').toLowerCase().startsWith('ja')) setLangState('ja');
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l) => {
    setLangState(l);
    try { window.localStorage.setItem(KEY, l); } catch (e) {}
  }, []);

  // ja may be missing (not translated yet): fall back to English.
  const t = useCallback((en, ja) => (lang === 'ja' && ja != null ? ja : en), [lang]);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
