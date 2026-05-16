export type DBProduct = {
  id: string;
  name_ar: string;
  description_ar?: string | null;
  category_id?: string | null;
  price: number;
  sale_price?: number | null;
  image_url: string;
  images?: any;
  sizes?: any;
  colors?: any;
  stock?: number;
  badge?: string | null;
  rating?: number | null;
  reviews_count?: number | null;
  gender?: string | null;
  active?: boolean;
  sold?: boolean;
  reserved_until?: string | null;
  reserved_order_id?: string | null;
};

export type Category = {
  id: string;
  slug: string;
  name_ar: string;
  name_en?: string | null;
  display_order?: number;
};
