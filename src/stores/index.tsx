import { create } from 'zustand';
import { persist,  } from 'zustand/middleware';

export type Cart = {
  id: number,
  quantity: number,
  price: number
}

type State = {
  user: { email: string | null },
  cart: {
    total: number,
    data: Array<Cart>,
  },
}

type Action = {
  addProduct: (productId: number, price: number) => void,
  removeProduct: (productId: number) => void,
  removeAllProduct: () => void,
  increaseQuantity: (productId: number) => void,
  decreaseQuantity: (productId: number) => void,
  calculate: () => void,
}

const STORAGE_KEY = 'CART_USER_DATA';

export const useStore = create<
  State & Action, 
  [['zustand/persist', State & Action]]
>(persist((set) => ({
  user: { email: null },
  cart: {
    total: 0,
    data: [],
  },

  addProduct: (productId, price) => set((state) => ({
    ...state,
    cart: {
      ...state.cart,
      data: [
        {
          price,
          id: productId,
          quantity: 1,
        },
        ...state.cart.data,
      ],
    },
  })),

  decreaseQuantity: (productId) => set((state) => {
    const selectedProduct = state.cart.data.find(({ id }) => id === productId);
    
    if (!selectedProduct || selectedProduct.quantity <= 1)
      return state;
    
    return {
      ...state,
      cart: {
        ...state.cart,
        data: state.cart.data.map((item) => {
          if (item.id === productId)
            return  { ...item, quantity: item.quantity - 1 };

          return item;
        }),
      },
    };
  }),

  increaseQuantity: (productId) => set((state) => {
    const selectedProduct = state.cart.data.find(({ id }) => id === productId);
    
    if (!selectedProduct || selectedProduct.quantity >= 10)
      return state;
    
    return {
      ...state,
      cart: {
        ...state.cart,
        data: state.cart.data.map((item) => {
          if (item.id === productId)
            return  { ...item, quantity: item.quantity + 1 };

          return item;
        }),
      },
    };
  }),

  removeProduct: (productId) => set((state) => ({
    ...state,
    cart: {
      ...state.cart,
      data: state.cart.data.filter(({ id }) => id !== productId),
    },
  })),

  removeAllProduct: () => set((state) => ({
    ...state,
    cart: { total: 0, data: [] },
  })),
  
  calculate: () => set((state) => ({
    ...state,
    cart: {
      ...state.cart,
      total: state.cart.data.reduce((total, { price, quantity }) => total + price * quantity, 0),
    },
  })),
}), { name: STORAGE_KEY }));
