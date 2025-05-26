
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
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#C72030',
					foreground: '#FFFFFF',
					hover: '#A01825'
				},
				secondary: {
					DEFAULT: '#101518',
					foreground: '#FFFFFF'
				},
				tertiary: {
					1: '#DDDEDF',
					2: '#C7A27C',
					3: '#B0C4C3'
				},
				success: {
					DEFAULT: '#4AF3E7',
					foreground: '#006B5F'
				},
				warning: {
					DEFAULT: '#F3C94A',
					foreground: '#8B5A00'
				},
				error: {
					DEFAULT: '#E74C3C',
					foreground: '#FFFFFF'
				},
				base: {
					white: '#F9F9F9',
					black: '#060504'
				},
				exception: '#8AB5C5',
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				sans: ['Work Sans', 'system-ui', 'sans-serif'],
				body: ['Work Sans', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				'heading-1': ['2rem', { lineHeight: '1.2', fontWeight: '600' }],
				'heading-2': ['1.5rem', { lineHeight: '1.2', fontWeight: '600' }],
				'heading-3': ['1.25rem', { lineHeight: '1.2', fontWeight: '600' }],
				'heading-4': ['1.125rem', { lineHeight: '1.2', fontWeight: '600' }],
				'body-lg': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
				'body': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
				'body-sm': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
				'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				'dropdown': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
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
