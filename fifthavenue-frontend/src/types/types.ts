export type User = {
  [x: string]: string;
 
  name: string;
  email: string;
  gender: string;
  role: string;
  dob: string;
};

export type RegisteredUser = {
  [x: string]: string;

  email: string;
  password: string;
};

export type Product = {
  name: string;
  price: number;
  stock: number;
  category: string;
  subCategory1: string;
  subCategory2: string;
  photos: string[];
  video?: string;
  sizes: string[];
  _id: string;
  description :string;
};

export type ShippingInfo = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
};

export type CartItem = {
  productId: string;
  photos: string[];
  // video: string;
  name: string;
  price: number;
  size: string | null;
  quantity: number;
  stock: number;
};
export type OrderItem = Omit<CartItem, "stock"> & { _id: string };

export type Order = {
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  user: {
    name: string;
    _id: string;
  };
  _id: string;
};

type CountAndChange = {
  revenue: number;
  product: number;
  user: number;
  order: number;
};

type LatestTransaction = {
  _id: string;
  amount: number;
  discount: number;
  quantity: number;
  status: string;
};

export type Stats = {
  categoryCount: Record<string, number>[];
  changePercent: CountAndChange;
  count: CountAndChange;
  chart: {
    order: number[];
    revenue: number[];
  };
  userRatio: {
    male: number;
    female: number;
  };
  latestTransaction: LatestTransaction[];
};

type OrderFullfillment = {
  processing: number;
  shipped: number;
  delivered: number;
};

type RevenueDistribution = {
  netMargin: number;
  discount: number;
  productionCost: number;
  burnt: number;
  marketingCost: number;
};

type UsersAgeGroup = {
  teen: number;
  adult: number;
  old: number;
};

export type Pie = {
  orderFullfillment: OrderFullfillment;
  productCategories: Record<string, number>[];
  stockAvailablity: {
    inStock: number;
    outOfStock: number;
  };
  revenueDistribution: RevenueDistribution;
  usersAgeGroup: UsersAgeGroup;
  adminCustomer: {
    admin: number;
    customer: number;
  };
};

export type Bar = {
  users: number[];
  products: number[];
  orders: number[];
};
export type Line = {
  users: number[];
  products: number[];
  discount: number[];
  revenue: number[];
};

export interface Currency {
  code: string;
  symbol: string;
}