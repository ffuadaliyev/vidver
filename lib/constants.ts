// Token costs
export const TOKEN_COST = {
  IMAGE_MODIFY: 20,
  VIDEO_GENERATE: 50,
} as const

// Asset types
export const ASSET_TYPE = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
} as const

// Asset sides
export const ASSET_SIDE = {
  FRONT: 'FRONT',
  REAR: 'REAR',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
} as const

// Job status
export const JOB_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  DONE: 'DONE',
  FAILED: 'FAILED',
} as const

// Job kind
export const JOB_KIND = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
} as const

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm']

// Default token balance
export const DEFAULT_TOKEN_BALANCE = 100

// Tuning categories
export const TUNING_CATEGORIES = [
  { key: 'body_kit', title: 'Body Kit' },
  { key: 'bumpers', title: 'Tamponlar' },
  { key: 'hood', title: 'Kapot' },
  { key: 'spoiler', title: 'Spoyler/Antiquet' },
  { key: 'wheels', title: 'Disk/Rim' },
  { key: 'tire_size', title: 'Təkər ölçüsü' },
  { key: 'suspension', title: 'Asqı hündürlüyü' },
  { key: 'lights', title: 'Fənərlər' },
  { key: 'diffuser', title: 'Difuzor' },
  { key: 'side_skirts', title: 'Yan ətəklik' },
  { key: 'vinyl_wrap', title: 'Vinil/Wrap' },
  { key: 'color_finish', title: 'Rəng/Finish' },
  { key: 'accessories', title: 'Əlavə aksesuarlar' },
] as const

// Video effects
export const VIDEO_EFFECTS = [
  {
    key: '360_spin',
    title: '360° Spin',
    description: 'Avtomobilin tam dövrə fırlanması',
    thumbnail: '/demo/effects/360-spin.jpg',
  },
  {
    key: 'neon_driveby',
    title: 'Neon Drive-by',
    description: 'Neon işıqlar ilə keçid effekti',
    thumbnail: '/demo/effects/neon-driveby.jpg',
  },
  {
    key: 'light_sweep',
    title: 'Light Sweep',
    description: 'İşıq süpürmə animasiyası',
    thumbnail: '/demo/effects/light-sweep.jpg',
  },
  {
    key: 'showroom_pan',
    title: 'Showroom Pan',
    description: 'Salon kamera hərəkəti',
    thumbnail: '/demo/effects/showroom-pan.jpg',
  },
  {
    key: 'zoom_reveal',
    title: 'Zoom Reveal',
    description: 'Zoom ilə açılış',
    thumbnail: '/demo/effects/zoom-reveal.jpg',
  },
  {
    key: 'spec_highlight',
    title: 'Spec Highlight',
    description: 'Xüsusiyyətləri vurğulama',
    thumbnail: '/demo/effects/spec-highlight.jpg',
  },
] as const
