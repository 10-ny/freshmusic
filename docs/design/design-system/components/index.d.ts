import * as React from 'react';

/**
 * The default Linear marketing CTA. Lavender primary used scarcely; secondary/tertiary for everything else.
 */
export interface ButtonProps {
  /** Visual style. @default 'primary' */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'inverse';
  /** Size. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  /** Render as a link (<a>) instead of a <button>. */
  href?: string;
  disabled?: boolean;
  /** Optional leading icon node (e.g. a Lucide <i>). */
  iconLeft?: React.ReactNode;
  /** Optional trailing icon node. */
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
export function Button(props: ButtonProps): JSX.Element;

/**
 * The Linear marketing surface card — depth from surface lift + hairline, never shadow.
 */
export interface CardProps {
  /** Card taxonomy — sets surface lift, radius & padding. @default 'feature' */
  variant?: 'feature' | 'pricing' | 'pricing-featured' | 'product-screenshot' | 'testimonial' | 'cta-banner';
  /** Lift to surface-2 + strong hairline on hover. @default false */
  interactive?: boolean;
  /** Faint white top-edge highlight on the lifted surface. @default true */
  edgeHighlight?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Card(props: CardProps): JSX.Element;

export interface BadgeProps {
  /** Color tone. @default 'neutral' */
  tone?: 'neutral' | 'success' | 'brand';
  /** Show a leading status dot. @default false */
  dot?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
/** Small status pill — surface-2 fill, pill radius. Success green is the only semantic tone. */
export function Badge(props: BadgeProps): JSX.Element;

export interface TagProps {
  /** Render label in mono (for IDs / shortcuts). @default false */
  mono?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
/** Small inline tag/chip — surface-1 fill, hairline border, 6px corners. */
export function Tag(props: TagProps): JSX.Element;

export interface AvatarProps {
  /** Image URL. Falls back to initials when omitted. */
  src?: string | null;
  /** Full name — used for initials + tooltip. */
  name?: string;
  /** Diameter in px. @default 36 */
  size?: number;
  style?: React.CSSProperties;
}
/** Circular avatar (32–40px) for testimonial cards — image or initials on a surface-2 disc. */
export function Avatar(props: AvatarProps): JSX.Element;

/**
 * Linear marketing form field — surface-1 fill, hairline border, 2px lavender focus ring.
 */
export interface InputProps {
  /** Render as input or textarea. @default 'input' */
  as?: 'input' | 'textarea';
  /** Field label above the control. */
  label?: React.ReactNode;
  /** Helper text below the control. */
  hint?: React.ReactNode;
  /** Error styling. @default false */
  invalid?: boolean;
  id?: string;
  placeholder?: string;
  value?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  style?: React.CSSProperties;
}
export function Input(props: InputProps): JSX.Element;

export interface PricingTab {
  label: React.ReactNode;
  value: string;
}
export interface PricingTabsProps {
  /** Tabs — strings or { label, value } objects. */
  tabs: Array<PricingTab | string>;
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
/** Pill-toggle from /pricing — selected tab lifts to surface-2. */
export function PricingTabs(props: PricingTabsProps): JSX.Element;
