export type FragranceCategory =
  | 'Amber Woody'
  | 'Oriental Floral'
  | 'Aquatic'
  | 'Leather Smoke'
  | 'Citrus Musk'

export type Audience = 'Men' | 'Women' | 'Unisex'

export interface FragranceSize {
  ml: number
  price: number // in INR (paise omitted)
}

export interface Fragrance {
  id: string
  slug: string
  index: string // "01", "02"
  name: string
  tagline: string
  category: FragranceCategory
  audience: Audience
  fragranceFamily: string
  description: string
  story: string
  topNotes: string[]
  heartNotes: string[]
  baseNotes: string[]
  image: string
  gallery: string[]
  accent: string
  intensity: number // 1..5
  longevity: number // 1..5 (hours proxied)
  bestFor: string // "Evenings", "Everyday", …
  sizes: FragranceSize[]
  currency: '₹'
  featured?: boolean
  isNew?: boolean
  available?: boolean
}

const inr = (n: number) => n

export const fragrances: Fragrance[] = [
  {
    id: 'noir-01',
    slug: 'nuit-dombre',
    index: '01',
    name: 'Nuit d’Ombre',
    tagline: 'Shadow of the Night',
    category: 'Amber Woody',
    audience: 'Unisex',
    fragranceFamily: 'Amber · Oud · Cedar',
    description:
      'A slow-burning composition of smoked amber and Himalayan cedar, resting on a warm bed of vetiver and vanilla absolute.',
    story:
      'Composed for the hour between sunset and streetlight — when a room becomes a private theatre.',
    topNotes: ['Bergamot', 'Pink Pepper', 'Saffron'],
    heartNotes: ['Rose Absolute', 'Iris', 'Cardamom'],
    baseNotes: ['Oud', 'Amber', 'Musk', 'Vetiver'],
    image:
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1615368144592-35d9fe3a52f9?auto=format&fit=crop&w=1400&q=80'
    ],
    accent: '#c9a878',
    intensity: 4,
    longevity: 5,
    bestFor: 'Evenings',
    sizes: [
      { ml: 30, price: inr(1699) },
      { ml: 50, price: inr(2499) },
      { ml: 100, price: inr(4199) }
    ],
    currency: '₹',
    featured: true,
    available: true
  },
  {
    id: 'noir-02',
    slug: 'velours-rouge',
    index: '02',
    name: 'Velours Rouge',
    tagline: 'Crimson Velvet',
    category: 'Oriental Floral',
    audience: 'Women',
    fragranceFamily: 'Rose · Jasmine · Suede',
    description:
      'Turkish rose petals steeped in warm resins, wrapped around a heart of jasmine and finished with a whisper of leather.',
    story:
      'A private letter written on velvet — worn where it can still be smelled after you have left.',
    topNotes: ['Blackcurrant', 'Bergamot', 'Pink Pepper'],
    heartNotes: ['Turkish Rose', 'Jasmine Sambac', 'Ylang-Ylang'],
    baseNotes: ['Patchouli', 'Suede', 'Benzoin'],
    image:
      'https://images.unsplash.com/photo-1615368144592-35d9fe3a52f9?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1615368144592-35d9fe3a52f9?auto=format&fit=crop&w=1400&q=80'
    ],
    accent: '#b06655',
    intensity: 3,
    longevity: 4,
    bestFor: 'Dinners',
    sizes: [
      { ml: 50, price: inr(2799) },
      { ml: 100, price: inr(3499) }
    ],
    currency: '₹',
    isNew: true,
    available: true
  },
  {
    id: 'noir-03',
    slug: 'sillage-blanc',
    index: '03',
    name: 'Sillage Blanc',
    tagline: 'The White Trail',
    category: 'Citrus Musk',
    audience: 'Women',
    fragranceFamily: 'White Tea · Iris · Musk',
    description:
      'A cool ribbon of white tea and orris, softened by clean musks — the fragrance of linen dried under morning light.',
    story:
      'A daylight parfum. Quiet, clear, and uncomplicated — like the first hour of a good day.',
    topNotes: ['Lemon Zest', 'White Tea', 'Neroli'],
    heartNotes: ['Orris', 'Lily', 'Green Fig'],
    baseNotes: ['White Musk', 'Cashmeran', 'Sandalwood'],
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=80'
    ],
    accent: '#c8bfa9',
    intensity: 2,
    longevity: 3,
    bestFor: 'Everyday',
    sizes: [
      { ml: 30, price: inr(1799) },
      { ml: 50, price: inr(2799) }
    ],
    currency: '₹',
    available: true
  },
  {
    id: 'noir-04',
    slug: 'cuir-de-minuit',
    index: '04',
    name: 'Cuir de Minuit',
    tagline: 'Midnight Leather',
    category: 'Leather Smoke',
    audience: 'Men',
    fragranceFamily: 'Leather · Tobacco · Oak',
    description:
      'Birch tar and tobacco leaves in a low-lit study — a fragrance for those who never explain themselves.',
    story:
      'A parfum written in tobacco smoke — the fragrance of the library after everyone else has gone.',
    topNotes: ['Bergamot', 'Elemi', 'Black Pepper'],
    heartNotes: ['Tobacco', 'Immortelle', 'Cinnamon'],
    baseNotes: ['Leather', 'Birch Tar', 'Labdanum', 'Oakmoss'],
    image:
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=1400&q=80'
    ],
    accent: '#8a6a4a',
    intensity: 5,
    longevity: 5,
    bestFor: 'Winter',
    sizes: [
      { ml: 50, price: inr(3299) },
      { ml: 100, price: inr(3899) }
    ],
    currency: '₹',
    featured: true,
    available: true
  },
  {
    id: 'noir-05',
    slug: 'onde-salee',
    index: '05',
    name: 'Onde Salée',
    tagline: 'Salt Tide',
    category: 'Aquatic',
    audience: 'Unisex',
    fragranceFamily: 'Sea Salt · Ambroxan · Driftwood',
    description:
      'Sea spray on warm stone at dusk. Ambroxan and salt crystals thread through driftwood and pale amber.',
    story:
      'Composed after a long walk on wet pebbles. A parfum with the coast in it.',
    topNotes: ['Sea Salt', 'Grapefruit', 'Aldehydes'],
    heartNotes: ['Ambergris Accord', 'Immortelle', 'Cypress'],
    baseNotes: ['Ambroxan', 'Driftwood', 'Vetiver'],
    image:
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1400&q=80'
    ],
    accent: '#7b8a92',
    intensity: 3,
    longevity: 3,
    bestFor: 'Summer',
    sizes: [
      { ml: 50, price: inr(2599) },
      { ml: 100, price: inr(3799) }
    ],
    currency: '₹',
    isNew: true,
    available: true
  },
  {
    id: 'noir-06',
    slug: 'poudre-dor',
    index: '06',
    name: 'Poudre d’Or',
    tagline: 'Golden Powder',
    category: 'Oriental Floral',
    audience: 'Unisex',
    fragranceFamily: 'Vanilla · Iris · Sandalwood',
    description:
      'Warm iris powder wrapped around vanilla absolute and a soft sandalwood base — skin, but slower.',
    story:
      'A parfum that behaves like a good coat. Understated, warm, and quietly expensive.',
    topNotes: ['Bergamot', 'Aldehydes', 'Pear'],
    heartNotes: ['Iris', 'Heliotrope', 'Ambrette'],
    baseNotes: ['Vanilla Absolute', 'Sandalwood', 'Tonka'],
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=80'
    ],
    accent: '#d4b48a',
    intensity: 3,
    longevity: 4,
    bestFor: 'Autumn',
    sizes: [
      { ml: 50, price: inr(2999) },
      { ml: 100, price: inr(4599) }
    ],
    currency: '₹',
    available: true
  }
]

export const signatureFragrance = fragrances[0]

// Reusable price formatter — swap for Intl.NumberFormat if fractional needed.
export const formatPrice = (price: number, currency: '₹' = '₹') =>
  `${currency}${price.toLocaleString('en-IN')}`

export const audiences: Audience[] = ['Men', 'Women', 'Unisex']
export const categories: FragranceCategory[] = [
  'Amber Woody',
  'Oriental Floral',
  'Aquatic',
  'Leather Smoke',
  'Citrus Musk'
]
