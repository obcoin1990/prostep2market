'use client'

import Link from 'next/link'
import { X, Globe } from 'lucide-react'
import { useT } from '@/contexts/LanguageContext'

export function Footer() {
  const t = useT()

  const productLinks = [
    { href: '/#features', label: t('marketing.footerFeatures') },
    { href: '/pricing', label: t('marketing.footerPricing') },
  ]

  const resourcesLinks = [
    { href: '/faq', label: t('marketing.footerFAQ') },
  ]

  const companyLinks = [
    { href: '/company/about', label: t('marketing.footerAbout') },
    { href: '/company/leadership', label: t('marketing.footerLeadership') },
    { href: '/company/mission', label: t('marketing.footerMission') },
    { href: '/company/careers', label: t('marketing.footerCareers') },
    { href: '/company/press', label: t('marketing.footerPress') },
    { href: '/company/media-kit', label: t('marketing.footerMediaKit') },
    { href: '/company/investors', label: t('marketing.footerInvestors') },
  ]

  const legalLinks = [
    { href: '/legal/terms', label: t('marketing.footerTerms') },
    { href: '/legal/privacy', label: t('marketing.footerPrivacy') },
    { href: '/legal/disclaimer', label: t('marketing.footerDisclaimer') },
  ]

  return (
    <footer className="bg-[#0B0B0B] text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-4">{t('marketing.footerProduct')}</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-4">{t('marketing.footerResources')}</h3>
            <ul className="space-y-3">
              {resourcesLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-4">{t('marketing.footerCompany')}</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-4">{t('marketing.footerLegal')}</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-4">{t('marketing.footerConnect')}</h3>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400 text-center">{t('marketing.footerCopyright')}</p>
        </div>
      </div>
    </footer>
  )
}
