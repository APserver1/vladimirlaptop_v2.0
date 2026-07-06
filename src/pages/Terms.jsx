import { motion } from 'framer-motion'
import '../styles/Page.css'

const sections = [
  {
    title: '1. Aceptación de los términos',
    content: 'Al acceder y utilizar el sitio web de Vladimir Laptop, aceptas cumplir con los presentes términos y condiciones. Si no estás de acuerdo con alguno de ellos, te recomendamos no utilizar el sitio.',
  },
  {
    title: '2. Servicios ofrecidos',
    content: 'Vladimir Laptop ofrece servicios de venta de equipos tecnológicos, mantenimiento, reparación, infraestructura de red, desarrollo web, edición de video y software a medida. Las condiciones específicas de cada servicio se acuerdan previamente con el cliente.',
  },
  {
    title: '3. Garantía',
    content: 'Todos nuestros productos y servicios cuentan con garantía. La duración y alcance varía según el tipo de producto o servicio. Los detalles se entregan por escrito al momento de la compra o contratación.',
  },
  {
    title: '4. Precios y pagos',
    content: 'Los precios publicados pueden variar sin previo aviso. Para servicios personalizados se emite cotización formal. Aceptamos efectivo, transferencias bancarias y los principales medios de pago electrónicos.',
  },
  {
    title: '5. Política de devoluciones',
    content: 'Se aceptan devoluciones dentro de los primeros 7 días para productos sin uso y en su empaque original. Los servicios ya ejecutados no son reembolsables, salvo defectos comprobables del trabajo realizado.',
  },
  {
    title: '6. Privacidad y datos',
    content: 'Respetamos tu privacidad. Los datos personales proporcionados son tratados conforme a nuestra política de privacidad y la legislación aplicable de Honduras. Nunca compartimos tu información con terceros sin tu consentimiento.',
  },
  {
    title: '7. Propiedad intelectual',
    content: 'Todo el contenido del sitio (textos, imágenes, logos, código) es propiedad de Vladimir Laptop o de sus respectivos titulares. Queda prohibida su reproducción total o parcial sin autorización escrita.',
  },
  {
    title: '8. Limitación de responsabilidad',
    content: 'Vladimir Laptop no se hace responsable por daños indirectos derivados del uso de nuestros productos o servicios. Nuestra responsabilidad se limita al valor del producto o servicio contratado.',
  },
  {
    title: '9. Modificaciones',
    content: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos desde su publicación en el sitio. Es responsabilidad del usuario revisarlos periódicamente.',
  },
  {
    title: '10. Ley aplicable',
    content: 'Estos términos se rigen por las leyes de la República de Honduras. Cualquier controversia será resuelta por los tribunales competentes de San Pedro Sula, Cortés.',
  },
  {
    title: '11. Contacto',
    content: 'Para consultas sobre estos términos, contáctanos al +504 8978-9131 o al correo vladimirlaptophn@gmail.com.',
  },
]

const Terms = () => {
  return (
    <div className="page page-transition">
      <div className="container">
        <motion.div
          className="page-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="kicker">Legal</span>
          <h1>Términos y <span className="text-gradient">Condiciones</span></h1>
          <p>Última actualización: {new Date().toLocaleDateString('es-HN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </motion.div>

        <motion.div
          className="page-card glass-strong"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="page-intro">
            Bienvenido a Vladimir Laptop. Te recomendamos leer detenidamente estos términos y
            condiciones antes de utilizar nuestro sitio web o contratar cualquiera de nuestros
            servicios. El uso del sitio implica la aceptación plena de los mismos.
          </p>

          <div className="terms-list">
            {sections.map((s, i) => (
              <motion.div
                key={s.title}
                className="term-section"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <h2>{s.title}</h2>
                <p>{s.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Terms
