'use client';

import Link from 'next/link'
import { motion } from 'framer-motion'
import LocalDetails from '@/components/LocalDetails'
import { useLanguage } from '@/context/LanguageContext'

export default function HomePage() {
  const { t } = useLanguage()

  const features = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      label: t.feat1Label,
      title: t.feat1Title,
      description: t.feat1Desc,
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      label: t.feat2Label,
      title: t.feat2Title,
      description: t.feat2Desc,
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
      label: t.feat3Label,
      title: t.feat3Title,
      description: t.feat3Desc,
    },
  ]

  const steps = [
    { n: '01', text: t.step1 },
    { n: '02', text: t.step2 },
    { n: '03', text: t.step3 },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-32 flex justify-center"
        >
          <div className="h-[500px] w-[900px] rounded-full bg-green-100 dark:bg-green-900/20 opacity-40 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-3.5 py-1.5 text-xs font-medium text-green-700 dark:text-green-400 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            {t.heroTagline}
          </div>

          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.03, textShadow: "0px 15px 30px rgba(0,0,0,0.1)" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-slate-900 dark:text-white leading-[1.05] tracking-tight mb-6 cursor-default inline-block"
          >
            {t.heroTitle1}<br />
            <span className="text-gradient">{t.heroTitle2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed mb-10"
          >
            {t.heroDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link
                href="/upload"
                className="btn-glow inline-flex w-full items-center justify-center gap-2 px-7 py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-green-200 dark:shadow-green-900/30 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="16 16 12 12 8 16" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
                {t.heroCta}
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <a
                href="#local-details"
                className="inline-flex w-full items-center justify-center gap-2 px-7 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-sm border border-slate-200 dark:border-slate-700 shadow-sm transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {t.heroCtaSub}
              </a>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-5 text-xs text-slate-400 dark:text-slate-500"
          >
            {t.heroResearch}
          </motion.p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-slate-900 dark:bg-slate-800/80 p-8 sm:p-10"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">{t.howTitle}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex gap-4 items-start p-3 -m-3 rounded-xl hover:bg-slate-800/50 cursor-default"
              >
                <span className="font-display text-3xl font-semibold text-green-500 leading-none flex-shrink-0">{s.n}</span>
                <p className="text-sm text-slate-300 leading-relaxed pt-1">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">{t.whyTitle}</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white">{t.whyHeading}</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-6 hover:border-green-300 dark:hover:border-green-700 hover:shadow-xl hover:shadow-green-100 dark:hover:shadow-green-900/20 transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-4 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                {f.icon}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 dark:text-green-400 mb-1.5">{f.label}</p>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-[15px] mb-2 leading-snug">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Local Details ── */}
      <section id="local-details" className="max-w-5xl mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">{t.localLabel}</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white">{t.localHeading}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">{t.localDesc}</p>
        </motion.div>
        <LocalDetails />
      </section>

      {/* ── Footer ── */}
      <footer className="text-center py-8 text-sm text-slate-400 dark:text-slate-600 border-t border-slate-100 dark:border-slate-800">
        {t.footer}
      </footer>
    </div>
  )
}
