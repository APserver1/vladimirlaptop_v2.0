import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  ComputerIcon, LaptopIcon, PeripheralsIcon, WebIcon, PhotoIcon, SoftwareIcon,
  BoltIcon, ShieldIcon, SparkleIcon, MailIcon, PhoneIcon, PinIcon, ClockIcon, ArrowRightIcon,
} from '../components/Icons'
import '../styles/Home.css'

const services = [
  {
    Icon: ComputerIcon,
    title: 'Equipos de Alta Gama',
    desc: 'PCs, laptops, monitores y periféricos para gamers y profesionales que exigen lo mejor. Trabajamos con las marcas líderes del mercado.',
  },
  {
    Icon: SoftwareIcon,
    title: 'Mantenimiento Experto',
    desc: 'Reparación de equipos tecnológicos con precisión milimétrica. Diagnóstico, limpieza, optimización y recuperación de datos.',
  },
  {
    Icon: WebIcon,
    title: 'Infraestructura de Red',
    desc: 'Servidores robustos y soluciones de red cableadas e inalámbricas para tu negocio u hogar inteligente.',
  },
  {
    Icon: SparkleIcon,
    title: 'Páginas Web',
    desc: 'Desarrollo web a medida, interfaces modernas, fluidas y optimizadas para destacar tu marca en el mundo digital.',
  },
  {
    Icon: PhotoIcon,
    title: 'Edición de Video',
    desc: 'Producción audiovisual profesional con efectos, corrección de color y postproducción de alto nivel.',
  },
  {
    Icon: SoftwareIcon,
    title: 'Software a Medida',
    desc: 'Sistemas personalizados para optimizar tus procesos empresariales. Soluciones escalables y seguras.',
  },
]

const pillars = [
  {
    Icon: BoltIcon,
    title: 'Velocidad',
    desc: 'Respuestas inmediatas a todas tus solicitudes de servicio. Tu tiempo es invaluable.',
  },
  {
    Icon: ShieldIcon,
    title: 'Garantía',
    desc: 'Todos nuestros productos y reparaciones están certificados con garantía formal.',
  },
  {
    Icon: SparkleIcon,
    title: 'Innovación',
    desc: 'Trabajamos con lo último en tecnología del mercado. Siempre un paso adelante.',
  },
]

const stats = [
  { value: '500+', label: 'Clientes satisfechos' },
  { value: '1200+', label: 'Equipos reparados' },
  { value: '50+', label: 'Proyectos web' },
  { value: '24/7', label: 'Soporte técnico' },
]

const SectionHeading = ({ kicker, title, subtitle }) => (
  <div className="section-title">
    {kicker && <span className="kicker">{kicker}</span>}
    <h2 className={title?.includes('Vladimir') ? 'text-gradient' : ''}>{title}</h2>
    {subtitle && <p>{subtitle}</p>}
  </div>
)

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="home page-transition">
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="kicker">Tecnología · Diseño · Innovación</span>
            <h1 className="hero-title">
              Soluciones <span className="text-gradient">integrales</span> para el mundo digital.
            </h1>
            <p className="hero-subtitle">
              Desde hardware de última generación hasta mantenimiento experto y desarrollo de software.
              Potenciamos tu presente y construimos tu futuro digital.
            </p>
            <div className="hero-actions">
              <Link to="/catalogo" className="btn btn-primary">
                Explorar catálogo
                <ArrowRightIcon width="16" height="16" />
              </Link>
              <Link to="/soporte" className="btn btn-ghost">
                Contáctanos
              </Link>
            </div>

            <div className="hero-meta">
              <a href="tel:+50489789131" className="hero-meta-item">
                <span className="hero-meta-icon"><PhoneIcon width="18" height="18" /></span>
                <div>
                  <small>Teléfono</small>
                  <strong>+504 8978-9131</strong>
                </div>
              </a>
              <a href="mailto:vladimirlaptophn@gmail.com" className="hero-meta-item">
                <span className="hero-meta-icon"><MailIcon width="18" height="18" /></span>
                <div>
                  <small>Correo</small>
                  <strong>vladimirlaptophn@gmail.com</strong>
                </div>
              </a>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-logo-wrap glass">
              <img src="/logo.jpeg" alt="Vladimir Laptop" className="hero-logo" />
              <div className="hero-logo-ring" />
              <div className="hero-logo-ring r2" />
            </div>
            <div className="hero-badges">
              <span className="hero-badge"><BoltIcon width="14" height="14" /> Velocidad</span>
              <span className="hero-badge"><ShieldIcon width="14" height="14" /> Garantía</span>
              <span className="hero-badge"><SparkleIcon width="14" height="14" /> Innovación</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="section stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="stat-card glass"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="stat-value text-gradient">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="section">
        <div className="container">
          <SectionHeading
            kicker="Por qué elegirnos"
            title="Nuestros pilares fundamentales"
            subtitle="Tres compromisos que respaldan cada proyecto, cada equipo reparado, cada solución entregada."
          />
          <div className="pillars-grid">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                className="pillar-card glass"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -8 }}
              >
                <div className="pillar-icon-wrap">
                  <p.Icon width="28" height="28" />
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section">
        <div className="container">
          <SectionHeading
            kicker="Nuestros servicios"
            title="Todo lo que tu mundo digital necesita"
            subtitle="Una suite completa de servicios tecnológicos, diseñada para particulares, profesionales y empresas que no se conforman con menos."
          />
          <div className="services-grid">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                className="service-card glass"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <div className="service-glow" />
                <div className="service-icon">
                  <s.Icon width="24" height="24" />
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <Link to="/catalogo" className="service-link">
                  Conocer más <ArrowRightIcon width="14" height="14" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section">
        <div className="container">
          <div className="about-grid">
            <motion.div
              className="about-content"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="kicker">Sobre nosotros</span>
              <h2>Una década potenciando el <span className="text-gradient">talento digital</span> de Honduras</h2>
              <p>
                En <strong>Vladimir Laptop</strong> nacimos con una misión clara: democratizar el acceso a
                tecnología de alto rendimiento y soluciones digitales de calidad profesional.
                Desde nuestros inicios hemos acompañado a cientos de clientes en San Pedro Sula y
                toda Honduras, equipando sus hogares, oficinas y proyectos con lo mejor del mercado.
              </p>
              <p>
                Combinamos experiencia técnica, pasión por la innovación y un trato cercano para
                ofrecerte resultados que superan expectativas. Cada equipo que reparamos, cada
                sitio web que desarrollamos y cada red que desplegamos lleva nuestro sello:
                compromiso, calidad y garantía.
              </p>
              <div className="about-features">
                <div className="about-feature">
                  <span><CheckBadge /></span> Diagnóstico gratuito
                </div>
                <div className="about-feature">
                  <span><CheckBadge /></span> Repuestos originales
                </div>
                <div className="about-feature">
                  <span><CheckBadge /></span> Soporte post-venta
                </div>
                <div className="about-feature">
                  <span><CheckBadge /></span> Asesoramiento personalizado
                </div>
              </div>
            </motion.div>
            <motion.div
              className="about-visual"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="about-card glass-strong">
                <div className="about-card-row">
                  <div className="about-card-icon"><PhoneIcon width="20" height="20" /></div>
                  <div>
                    <small>Teléfono</small>
                    <strong>+504 8978-9131</strong>
                  </div>
                </div>
                <div className="about-card-row">
                  <div className="about-card-icon"><MailIcon width="20" height="20" /></div>
                  <div>
                    <small>Correo</small>
                    <strong>vladimirlaptophn@gmail.com</strong>
                  </div>
                </div>
                <div className="about-card-row">
                  <div className="about-card-icon"><PinIcon width="20" height="20" /></div>
                  <div>
                    <small>Dirección</small>
                    <strong>Frente a esquina del sabor, Barrio Paz Barahona, San Pedro Sula, Honduras</strong>
                  </div>
                </div>
                <div className="about-card-row">
                  <div className="about-card-icon"><ClockIcon width="20" height="20" /></div>
                  <div>
                    <small>Horario</small>
                    <strong>Lun - Sáb · 8:00 AM - 6:00 PM</strong>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <motion.div
            className="cta-card glass-strong"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="cta-glow" />
            <h2>¿Listo para llevar tu <span className="text-gradient">tecnología</span> al siguiente nivel?</h2>
            <p>
              Solicita una cotización sin compromiso o visítanos en nuestro local.
              Estamos aquí para hacer realidad tu próximo proyecto digital.
            </p>
            <div className="cta-actions">
              <a href="tel:+50489789131" className="btn btn-primary">Llamar ahora</a>
              <a href="mailto:vladimirlaptophn@gmail.com" className="btn btn-ghost">Enviar correo</a>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Link to="/" className="footer-brand">
                <img src="/logo.jpeg" alt="Vladimir Laptop" />
                <span><span className="text-gradient">Vladimir</span> LAPTOP</span>
              </Link>
              <p>Soluciones integrales para el mundo digital. Potenciamos hogares, profesionales y empresas.</p>
            </div>
            <div>
              <h4>Navegación</h4>
              <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/catalogo">Catálogo</Link></li>
                <li><Link to="/soporte">Soporte</Link></li>
                <li><Link to="/terminos">Términos</Link></li>
                <li><Link to="/configuracion">Configuración</Link></li>
              </ul>
            </div>
            <div>
              <h4>Contacto</h4>
              <ul>
                <li><PhoneIcon width="14" height="14" /> +504 8978-9131</li>
                <li><MailIcon width="14" height="14" /> vladimirlaptophn@gmail.com</li>
                <li><PinIcon width="14" height="14" /> San Pedro Sula, Honduras</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Vladimir Laptop. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const CheckBadge = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default Home
