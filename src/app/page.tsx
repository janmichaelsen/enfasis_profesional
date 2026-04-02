import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.appContainer}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.navContent}>
            <Link href="/" className={styles.logo}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                <path d="m3.3 7 8.7 5 8.7-5"/>
                <path d="M12 22V12"/>
              </svg>
              <span>Adquete</span>
            </Link>
            <div className={styles.navLinks}>
              <Link href="#features">Funcionalidades</Link>
              <Link href="/login" className={styles.primaryButton}>Iniciar Sesión</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>TICS420 · P05 · Administración de Paquetes</div>
          <h1 className={styles.title}>Administra los paquetes<br />de tu edificio, sin complicaciones.</h1>
          <p className={styles.subtitle}>
            Adquete centraliza la recepción, seguimiento y entrega segura de encomiendas en edificios residenciales modernos.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/dashboard/concierge" className={styles.primaryButton}>Probar como Conserje</Link>
            <Link href="/dashboard/resident" className={styles.secondaryButton}>Ver Demo Residente</Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <h3>+500</h3>
              <p>Edificios Activos</p>
            </div>
            <div className={styles.statItem}>
              <h3>1.2M</h3>
              <p>Paquetes Gestionados</p>
            </div>
            <div className={styles.statItem}>
              <h3>99.9%</h3>
              <p>Entregas Seguras</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Construido para la eficiencia</h2>
            <p className={styles.subtitle}>Todo lo que un conserje y un residente necesitan para una convivencia digital.</p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.iconBox}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <h3>Registro de Entregas</h3>
              <p>Ingreso rápido de encomiendas con número de departamento y notificación automática al residente.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.iconBox}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3>Historial Detallado</h3>
              <p>Registro completo con fechas exactas de recepción y retiro. Trazabilidad total de cada paquete.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.iconBox}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
              </div>
              <h3>Retiro con QR</h3>
              <p>Seguridad máxima mediante códigos QR únicos para que solo el residente autorizado retire su entrega.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.iconBox}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>
                  <path d="M9 21V9"/>
                </svg>
              </div>
              <h3>Panel de Control</h3>
              <p>Dashboard en tiempo real para conserjes con estado de paquetes pendientes y gestión de reclamos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <Link href="/" className={styles.logo}>
              <span>Adquete</span>
            </Link>
            <p className={styles.copyright}>
              © 2026 TICS420 - Adquete · Administración de Paquetes. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
