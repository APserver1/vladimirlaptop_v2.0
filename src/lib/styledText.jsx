// Parser for inline text styling in product descriptions
// Syntax: "N/Texto" → <strong>Texto</strong>
//         "S/Texto" → <u>Texto</u>
//         "N,S/Texto" → multiple effects (bold + underline)
// Supports: N (Negrita/Bold), S (Subrayado/Underline), I (Itálica),
//           T (Tachado/Strike), M (Marcado/Highlight), C (Color morado),
//           G (Grande/Large), P (Pequeño/Small), U (Mayúsculas/Uppercase),
//           W (Minúsculas/Lowercase), K (Código/Code), B (Negrita color)

// Pattern matches: "X[,Y]/text" where X,Y are single-letter codes
// The match must be inside quotes (straight quotes only)
const STYLE_PATTERN = /"([NSITMCGPUWB,]+)\/([^"]+)"/g

const styles = {
  N: (text) => <strong key={Math.random()}>{text}</strong>,
  S: (text) => <u key={Math.random()}>{text}</u>,
  I: (text) => <em key={Math.random()}>{text}</em>,
  T: (text) => <s key={Math.random()}>{text}</s>,
  M: (text) => <mark key={Math.random()}>{text}</mark>,
  C: (text) => <span key={Math.random()} className="styled-c">{text}</span>,
  G: (text) => <span key={Math.random()} className="styled-g">{text}</span>,
  P: (text) => <span key={Math.random()} className="styled-p">{text}</span>,
  U: (text) => <span key={Math.random()} className="styled-u">{text.toUpperCase()}</span>,
  W: (text) => <span key={Math.random()} className="styled-w">{text.toLowerCase()}</span>,
  K: (text) => <code key={Math.random()} className="styled-k">{text}</code>,
  B: (text) => <span key={Math.random()} className="styled-b">{text}</span>,
}

let keyCounter = 0
const nextKey = () => `s${++keyCounter}`

const applyStyle = (codes, text) => {
  const codeList = codes.split(',').map((c) => c.trim().toUpperCase()).filter(Boolean)
  let result = text
  for (const code of codeList) {
    if (styles[code]) {
      result = styles[code](result)
    }
  }
  return result
}

// Parses a string and returns an array of React nodes with styled spans
export const parseStyledText = (input) => {
  if (!input) return null

  // Reset counter per call to keep keys stable
  keyCounter = 0

  const parts = []
  let lastIndex = 0
  let match

  STYLE_PATTERN.lastIndex = 0
  while ((match = STYLE_PATTERN.exec(input)) !== null) {
    if (match.index > lastIndex) {
      parts.push(input.slice(lastIndex, match.index))
    }
    const codes = match[1]
    const text = match[2]
    parts.push(applyStyle(codes, text))
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < input.length) {
    parts.push(input.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [input]
}

// Helper: renders each line of multiline text with style parsing
export const parseStyledLines = (input) => {
  if (!input) return []
  return input.split('\n').map((line, i) => (
    <p key={i}>{parseStyledText(line)}</p>
  ))
}

// Available style codes reference (for the admin UI hint)
export const STYLE_CODES = [
  { code: 'N', label: 'Negrita', example: '"N/Texto"' },
  { code: 'S', label: 'Subrayado', example: '"S/Texto"' },
  { code: 'I', label: 'Itálica', example: '"I/Texto"' },
  { code: 'T', label: 'Tachado', example: '"T/Texto"' },
  { code: 'M', label: 'Resaltado', example: '"M/Texto"' },
  { code: 'C', label: 'Color morado', example: '"C/Texto"' },
  { code: 'G', label: 'Grande', example: '"G/Texto"' },
  { code: 'P', label: 'Pequeño', example: '"P/Texto"' },
  { code: 'U', label: 'MAYÚSCULAS', example: '"U/Texto"' },
  { code: 'W', label: 'minúsculas', example: '"W/Texto"' },
  { code: 'K', label: 'Código', example: '"K/console.log()"' },
  { code: 'B', label: 'Negrita color', example: '"B/Texto"' },
]

export const STYLE_HELP = 'Códigos disponibles (sepáralos con coma para combinar): ' +
  STYLE_CODES.map((c) => `${c.code}=${c.label} → ${c.example}`).join(' · ')
