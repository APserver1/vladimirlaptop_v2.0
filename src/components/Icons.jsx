// Elegant line-based SVG icons in purple/white theme
// All icons are 24x24 viewBox, stroke-based, currentColor

const baseProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const HomeIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M3 10.5L12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
  </svg>
)

export const CatalogIcon = (props) => (
  <svg {...baseProps} {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
)

export const ComputerIcon = (props) => (
  <svg {...baseProps} {...props}>
    <rect x="2" y="4" width="20" height="13" rx="2" />
    <path d="M8 21h8" />
    <path d="M12 17v4" />
  </svg>
)

export const LaptopIcon = (props) => (
  <svg {...baseProps} {...props}>
    <rect x="4" y="5" width="16" height="11" rx="1.5" />
    <path d="M2 19h20" />
    <path d="M9 19l1 1h4l1-1" />
  </svg>
)

export const PeripheralsIcon = (props) => (
  <svg {...baseProps} {...props}>
    <rect x="6" y="2" width="12" height="8" rx="3" />
    <path d="M12 10v3" />
    <path d="M4 13h16" />
    <path d="M6 16h2" />
    <path d="M16 16h2" />
  </svg>
)

export const CameraIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L16.5 6H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
    <circle cx="12" cy="13" r="3.5" />
    <circle cx="18" cy="9" r="0.6" fill="currentColor" />
  </svg>
)

export const WebIcon = (props) => (
  <svg {...baseProps} {...props}>
    <rect x="2" y="4" width="20" height="14" rx="2" />
    <path d="M2 9h20" />
    <circle cx="5.5" cy="6.5" r="0.5" fill="currentColor" />
    <circle cx="7.5" cy="6.5" r="0.5" fill="currentColor" />
    <path d="M8 13l2 2 4-4" />
  </svg>
)

export const SoftwareIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M8 4l-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6l-2-2H8z" />
    <path d="M8 4v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4" />
    <path d="M10 12h4" />
    <path d="M10 16h4" />
  </svg>
)

export const PhotoIcon = (props) => (
  <svg {...baseProps} {...props}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M7 5V3h10v2" />
  </svg>
)

export const CartIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M3 4h2l2.5 12h11l2-9H6" />
    <circle cx="9" cy="20" r="1.3" />
    <circle cx="18" cy="20" r="1.3" />
  </svg>
)

export const SupportIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M21 12a9 9 0 1 0-9 9" />
    <path d="M21 12v-3" />
    <path d="M18 9l3-3 3 3" />
    <path d="M3 12v3" />
    <path d="M6 15l-3 3-3-3" />
  </svg>
)

export const TermsIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z" />
    <path d="M14 3v6h6" />
    <path d="M8 13h8" />
    <path d="M8 17h5" />
  </svg>
)

export const SettingsIcon = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
)

export const ProductIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M12 3l8 4v10l-8 4-8-4V7l8-4z" />
    <path d="M4 7l8 4 8-4" />
    <path d="M12 11v10" />
  </svg>
)

export const MenuIcon = (props) => (
  <svg {...baseProps} {...props}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

export const CloseIcon = (props) => (
  <svg {...baseProps} {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export const ChevronDownIcon = (props) => (
  <svg {...baseProps} {...props}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

export const ChevronRightIcon = (props) => (
  <svg {...baseProps} {...props}>
    <polyline points="9 6 15 12 9 18" />
  </svg>
)

export const ArrowRightIcon = (props) => (
  <svg {...baseProps} {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

export const PlusIcon = (props) => (
  <svg {...baseProps} {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

export const MinusIcon = (props) => (
  <svg {...baseProps} {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

export const TrashIcon = (props) => (
  <svg {...baseProps} {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
)

export const UploadIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

export const SearchIcon = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

export const UserIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export const LogoutIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

export const MailIcon = (props) => (
  <svg {...baseProps} {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2 7 12 13 22 7" />
  </svg>
)

export const PhoneIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

export const PinIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export const ClockIcon = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 14" />
  </svg>
)

export const ShieldIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)

export const BoltIcon = (props) => (
  <svg {...baseProps} {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

export const SparkleIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
  </svg>
)

export const CheckIcon = (props) => (
  <svg {...baseProps} {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export const StarIcon = (props) => (
  <svg {...baseProps} {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

export const InfoIcon = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="11" x2="12" y2="16" />
    <circle cx="12" cy="8" r="0.6" fill="currentColor" />
  </svg>
)

export const WarningIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M10.3 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" />
  </svg>
)

export const EditIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
)

export const SendIcon = (props) => (
  <svg {...baseProps} {...props}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

export const ChatIcon = (props) => (
  <svg {...baseProps} {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)
