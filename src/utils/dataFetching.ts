import { category, product } from '@/data/index';

export const getAllCategory = () => category;

export function getProducts(length: number = product.length, categoryId: number | null = null) {
  let copyProduct = [...product];

  if (categoryId)
    copyProduct = product.filter((item) => item.category.includes(categoryId));

  for (let i = copyProduct.length - 1; i >= 0; i--) {
    const randomIndex = Math.floor(Math.random() * copyProduct.length);

    [copyProduct[randomIndex], copyProduct[i]] = [copyProduct[i], copyProduct[randomIndex]];
  }

  return copyProduct.slice(0, length);
}
