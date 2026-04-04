import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

export default function NotFoundPage() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4 py-16">
      <div className="text-center">
        <h1 className="gradient-text mb-4 text-7xl font-black sm:text-8xl">404</h1>
        <p className="mb-6 text-fluid-lg text-[var(--color-text-secondary)]">{t('notFound.title')}</p>
        <Link to="/" className="btn-primary">
          {t('notFound.goHome')}
        </Link>
      </div>
    </div>
  )
}
