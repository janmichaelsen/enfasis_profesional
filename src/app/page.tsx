"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { useState, useEffect, useRef } from "react"; // <--- Agregamos useEffect y useRef
import { signIn } from "next-auth/react";

// Importamos tus diccionarios
import es from "../../locales/es.json";
import en from "../../locales/en.json";

export default function Home() {
  const [lang, setLang] = useState("es");
  const [isOpen, setIsOpen] = useState(false);

  // El "Ref" es como un ancla para saber si el clic fue dentro del menú o fuera
  const menuRef = useRef<HTMLDivElement>(null);

  const t: any = lang === "es" ? es : en;

  // --- LÓGICA DEL USEEFFECT ---
  useEffect(() => {
    // Función que detecta el clic
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false); // Cierra el menú si el clic no fue en el menú
      }
    };

    // Activamos el "escuchador" de clics en toda la página
    document.addEventListener("mousedown", handleClickOutside);

    // Limpieza: cuando el componente se destruye, quitamos el escuchador
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Se ejecuta una sola vez al cargar
  // -----------------------------

  return (
    <div className={styles.appContainer}>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.navContent}>
            <Link href="/" className={styles.logo}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
              <span>Adquete</span>
            </Link>

            <div className={styles.navLinks}>

              {/* DROPDOWN CON REF */}
              <div ref={menuRef} style={{ position: 'relative', marginRight: '10px' }}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px'
                  }}
                >
                  🌐 {lang === 'es' ? 'Idioma' : 'Language'}
                  <span style={{ fontSize: '10px', opacity: 0.7 }}>{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '40px',
                    right: '0',
                    background: '#161b22',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    zIndex: 100,
                    width: '130px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                  }}>
                    <button
                      onClick={() => { setLang('es'); setIsOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '10px 15px',
                        background: lang === 'es' ? '#6366f1' : 'transparent',
                        color: 'white',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Español
                    </button>
                    <button
                      onClick={() => { setLang('en'); setIsOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '10px 15px',
                        background: lang === 'en' ? '#6366f1' : 'transparent',
                        color: 'white',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      English
                    </button>
                  </div>
                )}
              </div>

              <Link href="#features">{t.nav_features}</Link>
              <Link href="/login" className={styles.primaryButton}>{t.nav_login}</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero, Stats, Features y Footer se mantienen igual que el anterior... */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>{t.hero_badge}</div>
          <h1 className={styles.title}>{t.hero_title}</h1>
          <p className={styles.subtitle}>{t.hero_subtitle}</p>
          <div className={styles.ctaButtons}>
            <Link href="/dashboard/concierge" className={styles.primaryButton}>{t.btn_concierge}</Link>
            <Link href="/dashboard/resident" className={styles.secondaryButton}>{t.btn_resident}</Link>
          </div>
        </div>
      </section>

      {/* (Resto del código igual al paso anterior) */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <p className={styles.copyright}>{t.footer_copy}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}