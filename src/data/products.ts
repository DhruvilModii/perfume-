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

export interface Review {
  id: string
  author: string
  rating: number // 1..5
  title?: string
  text: string
  date: string // ISO
  /** Marks demo data — do not present as verified customer reviews */
  sample?: true
}

export interface Fragrance {
  id: string
  slug: string
  index: string // "01", "02"
  name: string
  brand: string
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
  /** Percentage discount off originalPrice (e.g. 15 → 15% off) */
  discount?: number
  /** Original price shown struck-through (for the smallest size). */
  originalPrice?: number
  rating: number // average 1..5
  reviewCount: number
  reviews: Review[]
  stock: number
  featured?: boolean
  isNew?: boolean
  available?: boolean
}

const inr = (n: number) => n

const sampleReviews = (
  prefix: string,
  entries: Array<[string, number, string, string, string]>
): Review[] =>
  entries.map(([author, rating, title, text, date], i) => ({
    id: `${prefix}-r${i + 1}`,
    author,
    rating,
    title,
    text,
    date,
    sample: true
  }))

export const fragrances: Fragrance[] = [
  {
    id: 'noir-01',
    slug: 'nuit-dombre',
    index: '01',
    name: 'Nuit d’Ombre',
    brand: 'Maison Noir',
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
      'https://images.unsplash.com/photo-1615368144592-35d9fe3a52f9?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=1400&q=80'
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
    discount: 15,
    originalPrice: 1999,
    rating: 4.7,
    reviewCount: 148,
    reviews: sampleReviews('noir-01', [
      [
        'A. Mehta',
        5,
        'A quiet fire',
        'Composed and expensive-feeling. Sits beautifully on skin for an entire evening.',
        '2025-06-14'
      ],
      [
        'Rhea K.',
        5,
        'Signature material',
        'The oud is deep but never smothering. My most complimented parfum this year.',
        '2025-05-02'
      ],
      [
        'J. Rao',
        4,
        'Elegant',
        'Warm cedar and amber on a smooth base. Wish the top notes lingered longer.',
        '2025-04-19'
      ]
    ]),
    stock: 24,
    featured: true,
    available: true
  },
  {
    id: 'noir-02',
    slug: 'velours-rouge',
    index: '02',
    name: 'Velours Rouge',
    brand: 'Maison Noir',
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
      'https://images.unsplash.com/photo-1615368144592-35d9fe3a52f9?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=80'
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
    rating: 4.5,
    reviewCount: 92,
    reviews: sampleReviews('noir-02', [
      [
        'Sanya D.',
        5,
        'Romantic and unusual',
        'Rose done with restraint. The suede base saves it from ever being sweet.',
        '2025-07-01'
      ],
      [
        'M. Iyer',
        4,
        'A slow bloom',
        'Opens sharp, softens over an hour into something velvety.',
        '2025-06-08'
      ]
    ]),
    stock: 18,
    isNew: true,
    available: true
  },
  {
    id: 'noir-03',
    slug: 'sillage-blanc',
    index: '03',
    name: 'Sillage Blanc',
    brand: 'Maison Noir',
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
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1400&q=80'
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
    rating: 4.3,
    reviewCount: 61,
    reviews: sampleReviews('noir-03', [
      [
        'Ira N.',
        4,
        'Clean but interesting',
        'Perfect for meetings and long summer days. Doesn’t announce itself.',
        '2025-05-27'
      ],
      [
        'K. Bose',
        5,
        'Skin scent',
        'Melts into the skin. Feels like fresh linen and quiet light.',
        '2025-04-10'
      ]
    ]),
    stock: 30,
    available: true
  },
  {
    id: 'noir-04',
    slug: 'cuir-de-minuit',
    index: '04',
    name: 'Cuir de Minuit',
    brand: 'Maison Noir',
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
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1400&q=80'
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
    discount: 10,
    originalPrice: 3699,
    rating: 4.8,
    reviewCount: 116,
    reviews: sampleReviews('noir-04', [
      [
        'V. Prasad',
        5,
        'A cold library',
        'This is what a well-worn leather jacket smells like at 1am. Unreal.',
        '2025-07-15'
      ],
      [
        'D. Malhotra',
        5,
        'Serious and adult',
        'Powerful but never sharp. Best on cold evenings.',
        '2025-06-22'
      ]
    ]),
    stock: 12,
    featured: true,
    available: true
  },
  {
    id: 'noir-05',
    slug: 'onde-salee',
    index: '05',
    name: 'Onde Salée',
    brand: 'Maison Noir',
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
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1615368144592-35d9fe3a52f9?auto=format&fit=crop&w=1400&q=80'
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
    rating: 4.4,
    reviewCount: 74,
    reviews: sampleReviews('noir-05', [
      [
        'T. Fernandes',
        5,
        'The coast in a bottle',
        'Salt and driftwood without the usual aquatic clichés. Excellent projection.',
        '2025-06-30'
      ],
      [
        'N. Shetty',
        4,
        'Perfect for humid days',
        'Cool, but grown-up. Ambroxan lasts on me for hours.',
        '2025-05-12'
      ]
    ]),
    stock: 22,
    isNew: true,
    available: true
  },
  {
    id: 'noir-06',
    slug: 'poudre-dor',
    index: '06',
    name: 'Poudre d’Or',
    brand: 'Maison Noir',
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
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1400&q=80'
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
    rating: 4.6,
    reviewCount: 88,
    reviews: sampleReviews('noir-06', [
      [
        'P. Bhagat',
        5,
        'Warm and quiet',
        'Iris and vanilla in perfect balance. Reads as skin scent up close.',
        '2025-05-20'
      ],
      [
        'S. Kaul',
        4,
        'A soft coat',
        'Cozy and elegant without being sweet. Great in autumn.',
        '2025-04-06'
      ]
    ]),
    stock: 0,
    available: true
  }
]

export const signatureFragrance = fragrances[0]

/** Reusable price formatter — swap for Intl.NumberFormat if fractional needed. */
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

/** Every brand present in the current catalogue. */
export const brands: string[] = Array.from(
  new Set(fragrances.map((f) => f.brand))
).sort()

export const getFragranceBySlug = (slug: string): Fragrance | undefined =>
  fragrances.find((f) => f.slug === slug)

export const getRelated = (f: Fragrance, count = 3): Fragrance[] =>
  fragrances
    .filter((o) => o.id !== f.id)
    .sort((a, b) => {
      const ca = a.category === f.category ? -1 : 0
      const cb = b.category === f.category ? -1 : 0
      return ca - cb
    })
    .slice(0, count)

export const minSizePrice = (f: Fragrance): number =>
  Math.min(...f.sizes.map((s) => s.price))
