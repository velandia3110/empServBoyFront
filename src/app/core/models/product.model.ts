export interface ProductImage {
  imageId: string;
  imageurl: string;
  alt: string;
  productId: string;
  created_at: string;
  updated_at: string;
}

export interface ProductWithImages {
  productId: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
}
