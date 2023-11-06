import { Product, category, product } from '@/data/index';

export const getAllCategory = () => category;

export function getProducts(
  length: number = product.length,
  filter?: (item: Product) => boolean
) {
  const copyProduct = filter ? product.filter(filter) : [...product];

  if (length > 1) {
    for (let i = copyProduct.length - 1; i >= 0; i--) {
      const randomIndex = Math.floor(Math.random() * copyProduct.length);
  
      [copyProduct[randomIndex], copyProduct[i]] = [copyProduct[i], copyProduct[randomIndex]];
    }

    return copyProduct.slice(0, length);
  }

  return copyProduct[0];
}
