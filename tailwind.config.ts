import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		screens: {
			'xs': '400px',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1400px',
		},
		extend: {
			fontFamily: {
				// Poppins is the app font, matching fm-matrix-revamp's body face.
				// `sans` and `body` both point at it so nothing falls back to a
				// second family — the reference leaves `sans` on Inter, which is
				// why its body text and utility-classed text disagree.
				sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
				body: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
				poppins: ['Poppins', 'sans-serif'],
				// Available as explicit opt-ins, as in the reference repo.
				inter: ['Inter', 'sans-serif'],
				'work-sans': ['Work Sans', 'sans-serif'],
				mono: ['Fira Code', 'Consolas', 'monospace'],
			},
			colors: {
				// ========================================
				// LOCKATED BRAND COLORS - CSS Variable Mapping
				// These map to src/styles/theme.css variables
				// ========================================

				// Primary Brand Colors
				'brand': {
					DEFAULT: 'var(--color-primary)',
					hover: 'var(--color-primary-hover)',
					light: 'var(--color-primary-light)',
					selected: 'var(--color-primary-selected)',
				},
				'brand-bg': 'var(--color-bg)',
				'brand-text': 'var(--color-text)',
				'brand-text-light': 'var(--color-text-light)',

				// Secondary Colors
				'brand-green': {
					DEFAULT: 'var(--color-secondary-green)',
					light: 'var(--color-secondary-green-light)',
					bg: 'var(--color-secondary-green-bg)',
				},
				'brand-purple': {
					DEFAULT: 'var(--color-secondary-purple)',
					light: 'var(--color-secondary-purple-light)',
					bg: 'var(--color-secondary-purple-bg)',
				},
				'brand-teal': {
					DEFAULT: 'var(--color-secondary-teal)',
					light: 'var(--color-secondary-teal-light)',
					bg: 'var(--color-secondary-teal-bg)',
				},

				// Status Colors
				'brand-success': {
					DEFAULT: 'var(--color-success-solid)',
					light: 'var(--color-success)',
					bg: 'var(--color-success-bg)',
				},
				'brand-warning': {
					DEFAULT: 'var(--color-warning)',
					light: 'var(--color-warning-light)',
				},
				'brand-error': {
					DEFAULT: 'var(--color-error)',
					light: 'var(--color-danger-light)',
					bg: 'var(--color-error-bg)',
				},
				'brand-info': {
					DEFAULT: 'var(--color-info)',
				},

				// Surface Colors
				'brand-card': {
					DEFAULT: 'var(--color-card-white)',
					bg: 'var(--color-card-bg)',
					border: 'var(--color-card-border)',
				},
				'brand-border': {
					DEFAULT: 'var(--color-border-subtle)',
					card: 'var(--color-card-border)',
				},
				'brand-sidebar': {
					DEFAULT: 'var(--color-sidebar)',
					hover: 'var(--color-sidebar-hover)',
					active: 'var(--color-sidebar-active-bg)',
					border: 'var(--color-sidebar-border)',
				},
				'brand-muted': 'var(--color-muted)',
				'brand-disabled': 'var(--color-disabled)',

				// Semantic Colors (dashboard / charts)
				// Tabs & stat cards
				'brand-tab-active': 'var(--color-tab-active-bg)',
				'brand-stat': {
					DEFAULT: 'var(--color-stat-card-bg)',
					selected: 'var(--color-stat-card-selected-bg)',
					icon: 'var(--color-stat-icon-bg)',
				},

				'brand-tags': 'var(--color-tags)',
				'brand-danger': 'var(--color-danger)',
				'brand-growth': 'var(--color-growth-solid)',

				// ========================================
				// Shadcn / legacy token mappings
				// ========================================
				border: 'var(--color-border-subtle)',
				input: 'var(--color-border-subtle)',
				ring: 'var(--color-primary)',
				background: 'var(--color-bg)',
				foreground: 'var(--color-text)',
				primary: {
					DEFAULT: 'var(--color-primary)',
					foreground: '#FFFFFF',
					hover: 'var(--color-primary-hover)'
				},
				secondary: {
					DEFAULT: 'var(--color-secondary-green)',
					foreground: '#FFFFFF'
				},
				tertiary: {
					1: 'var(--color-border-subtle)',
					2: 'var(--color-card-border)',
					3: 'var(--color-secondary-teal)'
				},
				success: {
					DEFAULT: 'var(--color-success-solid)',
					foreground: '#FFFFFF'
				},
				warning: {
					DEFAULT: 'var(--color-warning)',
					foreground: 'var(--color-text)'
				},
				error: {
					DEFAULT: 'var(--color-error)',
					foreground: '#FFFFFF'
				},
				info: {
					DEFAULT: 'var(--color-info)',
					foreground: '#FFFFFF'
				},
				base: {
					white: 'var(--color-card-white)',
					black: 'var(--color-text)'
				},
				exception: 'var(--color-exception)',
				destructive: {
					DEFAULT: 'var(--color-error)',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: 'var(--color-muted)',
					foreground: 'var(--color-text-light)'
				},
				accent: {
					DEFAULT: 'var(--color-primary-selected)',
					foreground: 'var(--color-text)'
				},
				popover: {
					DEFAULT: 'var(--color-card-white)',
					foreground: 'var(--color-text)'
				},
				card: {
					DEFAULT: 'var(--color-card-white)',
					foreground: 'var(--color-text)'
				},
				sidebar: {
					DEFAULT: 'var(--color-sidebar)',
					foreground: 'var(--color-text)',
					primary: 'var(--color-primary)',
					'primary-foreground': '#FFFFFF',
					accent: 'var(--color-primary-selected)',
					'accent-foreground': 'var(--color-text)',
					border: 'var(--color-card-border)',
					ring: 'var(--color-primary)'
				}
			},
			fontSize: {
				// ========================================
				// COMPACT DEFAULT SCALE
				// Tailwind's own text-* keys are re-pointed onto the Lockated
				// type scale, one step smaller than stock Tailwind. Every
				// existing `text-sm` / `text-2xl` in the app shrinks with it,
				// so sizes stay on-scale without per-file edits.
				// ========================================
				'xs': ['10px', { lineHeight: '14px' }],
				'sm': ['12px', { lineHeight: '16px' }],
				'base': ['14px', { lineHeight: '20px' }],
				'lg': ['16px', { lineHeight: '22px' }],
				'xl': ['18px', { lineHeight: '24px' }],
				'2xl': ['20px', { lineHeight: '26px' }],
				'3xl': ['24px', { lineHeight: '30px' }],
				'4xl': ['26px', { lineHeight: '32px' }],
				'5xl': ['30px', { lineHeight: '36px' }],
				'6xl': ['36px', { lineHeight: '40px' }],
				'7xl': ['44px', { lineHeight: '48px' }],
				'8xl': ['56px', { lineHeight: '60px' }],
				'9xl': ['68px', { lineHeight: '72px' }],

				// Brand typography scale (responsive — shrinks on tablet/mobile)
				'brand-h1': 'var(--font-size-h1)',
				'brand-h2': 'var(--font-size-h2)',
				'brand-body-1': 'var(--font-size-body-1)',
				'brand-body-2': 'var(--font-size-body-2)',
				'brand-body-3': 'var(--font-size-body-3)',
				'brand-body-4': 'var(--font-size-body-4)',
				'brand-body-5': 'var(--font-size-body-5)',
				'brand-caption': 'var(--font-size-caption)',

				// Legacy semantic scale (kept for existing markup)
				'heading-1': ['var(--font-size-h1)', { lineHeight: '1.2', fontWeight: '600' }],
				'heading-2': ['var(--font-size-h2)', { lineHeight: '1.2', fontWeight: '600' }],
				'heading-3': ['var(--font-size-body-1)', { lineHeight: '1.2', fontWeight: '600' }],
				'heading-4': ['var(--font-size-body-2)', { lineHeight: '1.2', fontWeight: '600' }],
				'body-lg': ['var(--font-size-body-3)', { lineHeight: '1.5', fontWeight: '400' }],
				'body': ['var(--font-size-body-4)', { lineHeight: '1.5', fontWeight: '400' }],
				'body-sm': ['var(--font-size-body-5)', { lineHeight: '1.5', fontWeight: '400' }],
			},
			spacing: {
				'system-xs': 'var(--spacing-xs, 4px)',
				'system-sm': 'var(--spacing-sm, 8px)',
				'system-md': 'var(--spacing-md, 16px)',
				'system-lg': 'var(--spacing-lg, 24px)',
				'system-xl': 'var(--spacing-xl, 32px)',
				'system-2xl': 'var(--spacing-2xl, 48px)',
				'system-3xl': 'var(--spacing-3xl, 64px)'
			},
			borderRadius: {
				sm: 'var(--radius-sm, 4px)',
				md: 'var(--radius-md, 8px)',
				lg: 'var(--radius-lg, 12px)',
				xl: 'var(--radius-xl, 16px)'
			},
			boxShadow: {
				'system-sm': 'var(--shadow-sm)',
				'system-md': 'var(--shadow-md)',
				'system-lg': 'var(--shadow-lg)',
				'system-xl': 'var(--shadow-xl)',
				'brand-card': 'var(--shadow-card)',

				// Legacy aliases mapped onto brand shadows
				'card': 'var(--shadow-sm)',
				'card-hover': 'var(--shadow-md)',
				'dropdown': 'var(--shadow-lg)',
			},
			transitionTimingFunction: {
				brand: 'ease',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
