'use client'
import { createContext, useContext, useEffect, useState } from 'react'

export type Language = 'en' | 'es'

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    appName: 'Daily Bible',
    home: 'Home',
    verse: 'Verse of the Day',
    plans: 'Reading Plans',
    journal: 'Journal',
    account: 'Account',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    signUp: 'Sign Up',
    verseOfTheDay: 'Verse of the Day',
    scripture: 'Scripture',
    inspirationToday: 'Inspiration for Today',
    translation: 'English Standard Version (ESV)',
    loadingVerse: 'Loading verse...',
    couldNotLoad: 'Could not load verse.',
    readingPlans: 'Reading Plans',
    readingPlansSubtitle: 'Choose a plan — tap any day to read the passage in ESV.',
    startPlan: 'Start Plan',
    continuePlan: 'Continue Plan',
    opening: 'Opening...',
    signInToSave: 'Sign in to save your progress.',
    journalTitle: 'Journal',
    journalSubtitle: 'Write down your reflections, prayers, and what God is teaching you.',
    newEntry: 'New Entry',
    titlePlaceholder: 'Title',
    bodyPlaceholder: 'Write your reflection...',
    saveEntry: 'Save Entry',
    saved: 'Saved!',
    pastEntries: 'Past Entries',
    noEntries: 'No entries yet. Write your first reflection above.',
    deleteEntry: 'Delete',
    signInToJournal: 'Sign in to access your journal.',
    accountTitle: 'Account',
    language: 'Language',
    english: 'English',
    spanish: 'Spanish',
    signedInAs: 'Signed in as',
    notSignedIn: 'Not signed in',
    readPassage: 'Read Passage (ESV)',
    markComplete: 'Mark Complete',
    saving: 'Saving...',
    signInToTrack: 'Sign in to track progress',
    backToPlans: '← Back to Plans',
    allReadings: 'All Readings',
    planComplete: 'Plan Complete!',
    planCompleteMsg: 'You have finished',
    wellDone: 'Well done!',
    day: 'Day',
  },
  es: {
    appName: 'Biblia Diaria',
    home: 'Inicio',
    verse: 'Versículo del Día',
    plans: 'Planes de Lectura',
    journal: 'Diario',
    account: 'Cuenta',
    signIn: 'Iniciar Sesión',
    signOut: 'Cerrar Sesión',
    signUp: 'Registrarse',
    verseOfTheDay: 'Versículo del Día',
    scripture: 'Escritura',
    inspirationToday: 'Inspiración de Hoy',
    translation: 'Reina-Valera 1960 (RVR60)',
    loadingVerse: 'Cargando versículo...',
    couldNotLoad: 'No se pudo cargar el versículo.',
    readingPlans: 'Planes de Lectura',
    readingPlansSubtitle: 'Elige un plan — toca cualquier día para leer el pasaje en RVR60.',
    startPlan: 'Comenzar Plan',
    continuePlan: 'Continuar Plan',
    opening: 'Abriendo...',
    signInToSave: 'Inicia sesión para guardar tu progreso.',
    journalTitle: 'Diario',
    journalSubtitle: 'Escribe tus reflexiones, oraciones y lo que Dios te está enseñando.',
    newEntry: 'Nueva Entrada',
    titlePlaceholder: 'Título',
    bodyPlaceholder: 'Escribe tu reflexión...',
    saveEntry: 'Guardar Entrada',
    saved: '¡Guardado!',
    pastEntries: 'Entradas Anteriores',
    noEntries: 'Sin entradas aún. Escribe tu primera reflexión arriba.',
    deleteEntry: 'Eliminar',
    signInToJournal: 'Inicia sesión para acceder a tu diario.',
    accountTitle: 'Cuenta',
    language: 'Idioma',
    english: 'Inglés',
    spanish: 'Español',
    signedInAs: 'Sesión iniciada como',
    notSignedIn: 'No has iniciado sesión',
    readPassage: 'Leer Pasaje (RVR60)',
    markComplete: 'Marcar Completo',
    saving: 'Guardando...',
    signInToTrack: 'Inicia sesión para seguir tu progreso',
    backToPlans: '← Volver a Planes',
    allReadings: 'Todas las Lecturas',
    planComplete: '¡Plan Completo!',
    planCompleteMsg: 'Has terminado',
    wellDone: '¡Bien hecho!',
    day: 'Día',
  },
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const saved = localStorage.getItem('dailybible-language') as Language | null
    if (saved === 'en' || saved === 'es') setLanguageState(saved)
  }, [])

  function setLanguage(lang: Language) {
    setLanguageState(lang)
    localStorage.setItem('dailybible-language', lang)
  }

  function t(key: string): string {
    return translations[language][key] ?? translations['en'][key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
