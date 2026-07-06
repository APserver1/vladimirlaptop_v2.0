import { motion } from 'framer-motion'
import {
  PhoneIcon, MailIcon, PinIcon, ClockIcon, ShieldIcon, BoltIcon,
  SparkleIcon, SupportIcon,
} from '../components/Icons'
import '../styles/Page.css'
import '../styles/Support.css'

const channels = [
  {
    Icon: PhoneIcon,
    title: 'Llámanos',
    line1: '+504 8978-9131',
    line2: 'Atención inmediata en horario laboral',
    action: { label: 'Llamar ahora', href: 'tel:+50489789131' },
  },
  {
    Icon: MailIcon,
    title: 'Correo electrónico',
    line1: 'vladimirlaptophn@gmail.com',
    line2: 'Respuesta en menos de 24 horas',
    action: { label: 'Enviar correo', href: 'mailto:vladimirlaptophn@gmail.com' },
  },
  {
    Icon: PinIcon,
    title: 'Visítanos',
    line1: 'Barrio Paz Barahona',
    line2: 'Frente a esquina del sabor, San Pedro Sula, Honduras',
    action: null,
  },
  {
    Icon: ClockIcon,
    title: 'Horario',
    line1: 'Lun - Sáb · 8:00 AM - 6:00 PM',
    line2: 'Cerrado domingos y feriados',
    action: null,
  },
]

const faqs = [
  {
    q: '¿Cuánto tarda una reparación típica?',
    a: 'Depende del tipo de equipo y la falla. Un mantenimiento preventivo se entrega en 24-48 horas, mientras que reparaciones complejas pueden requerir de 3 a 7 días hábiles. Te informamos el tiempo estimado al recibir el diagnóstico.',
  },
  {
    q: '¿Ofrecen garantía en sus servicios?',
    a: 'Sí. Todos nuestros productos nuevos cuentan con garantía del fabricante, y las reparaciones tienen garantía de 90 días por escrito. Si el problema persiste, lo resolvemos sin costo adicional.',
  },
  {
    q: '¿Puedo solicitar un presupuesto sin compromiso?',
    a: 'Por supuesto. El diagnóstico inicial es gratuito. Te entregamos un presupuesto formal detallado antes de proceder con cualquier trabajo.',
  },
  {
    q: '¿Trabajan con empresas?',
    a: 'Sí, ofrecemos planes especiales para empresas que incluyen mantenimiento preventivo, soporte prioritario, infraestructura de red y desarrollo de software a medida.',
  },
  {
    q: '¿Qué medios de pago aceptan?',
    a: 'Efectivo, transferencias bancarias (BAC, Atlántida, Banpaís), y pagos electrónicos mediante las principales plataformas locales.',
  },
  {
    q: '¿Hacen entregas a domicilio?',
    a: 'Sí, dentro de San Pedro Sula y zonas aledañas. Para el resto del país coordinamos envíos por encomienda con pago contra entrega disponible.',
  },
]

const Support = () => {
  return (
    <div className="page page-transition">
      <div className="container">
        <motion.div
          className="page-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="kicker">Estamos para ayudarte</span>
          <h1>Soporte y <span className="text-gradient">contacto</span></h1>
          <p>Estamos disponibles para resolver cualquier duda, cotizar un proyecto o asistirte con tu equipo.</p>
        </motion.div>

        <div className="support-channels">
          {channels.map((c, i) => (
            <motion.div
              key={c.title}
              className="support-channel glass"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="support-channel-icon">
                <c.Icon width="22" height="22" />
              </div>
              <h3>{c.title}</h3>
              <p className="support-channel-line1">{c.line1}</p>
              <p className="support-channel-line2">{c.line2}</p>
              {c.action && (
                <a href={c.action.href} className="support-channel-action">
                  {c.action.label}
                </a>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="support-promises glass-strong"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="support-promises-head">
            <SparkleIcon width="28" height="28" />
            <h2>Nuestro compromiso contigo</h2>
          </div>
          <div className="support-promises-grid">
            <div className="support-promise">
              <BoltIcon width="20" height="20" />
              <div>
                <strong>Respuesta inmediata</strong>
                <p>Atendemos tu solicitud en el menor tiempo posible.</p>
              </div>
            </div>
            <div className="support-promise">
              <ShieldIcon width="20" height="20" />
              <div>
                <strong>Garantía certificada</strong>
                <p>Todos nuestros servicios y productos están garantizados.</p>
              </div>
            </div>
            <div className="support-promise">
              <SupportIcon width="20" height="20" />
              <div>
                <strong>Asesoramiento experto</strong>
                <p>Te guiamos para tomar la mejor decisión tecnológica.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="support-faq"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-title">
            <span className="kicker">Preguntas frecuentes</span>
            <h2>Resolvemos tus dudas</h2>
          </div>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <motion.details
                key={i}
                className="faq-item glass"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <summary>
                  <span>{f.q}</span>
                  <span className="faq-icon">+</span>
                </summary>
                <p>{f.a}</p>
              </motion.details>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Support
