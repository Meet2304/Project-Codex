// Entity types from data-model.md

export interface Person {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  avatar_url?: string;
}

export interface Principle {
  id: string;
  title: string;
  summary: string;
  order_index: number;
  published: boolean;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  hero_media_url?: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  tags?: Tag[];
}

export interface ProjectDetail extends Project {
  description: string;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  order_index: number;
  visible: boolean;
}

export interface SiteSettings {
  id: string;
  site_title: string;
  primary_cta_label: string;
  language: string;
  updated_at: string;
}

export interface ThemeConfig {
  id: string;
  default_mode: 'dark' | 'light';
  gradient_from: string;
  gradient_to: string;
  gradient_origin: string;
  noise_opacity: number;
}
