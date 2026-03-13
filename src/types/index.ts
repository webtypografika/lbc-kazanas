export interface User {
  id: number;
  username: string;
  password_hash: string;
}

export interface Category {
  id: number;
  name_el: string;
  name_en: string;
  slug: string;
}

export interface Project {
  id: number;
  title_el: string;
  title_en: string;
  description_el: string;
  description_en: string;
  slug: string;
  category_id: number;
  location: string;
  area: string;
  year: string;
  featured: boolean;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface ProjectWithCategory extends Project {
  category_name_el: string;
  category_name_en: string;
  category_slug: string;
}

export interface ProjectImage {
  id: number;
  project_id: number;
  url: string;
  thumb_url: string;
  alt_text: string;
  sort_order: number;
  is_cover: boolean;
}

export interface SessionData {
  userId?: number;
  username?: string;
  isLoggedIn?: boolean;
}
