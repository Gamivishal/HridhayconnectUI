import { post } from './BaseService';

export interface WishlistItem {
  Id: number;
  ProductId: number;
  ProductName: string;
  VariantId: number;
  VariantAttributeValues_Only: string;
  VariantAttributeValues_Id?: string;
  CategoryId: number;
  CategoryName: string;
  Price: number;
  DiscountPercent: number;
  SellPrice: number;
  SKU: string;
  ImagePath: string;
  TotalAvailableStock: number;
  CreatedDate: string;
  PackingType?: string;
}

export interface WishlistGetAllResponse {
  data: {
    table1: { TotalRecords: number }[];
    table2: WishlistItem[];
  };
}

export const wishlistService = {
  getAll: async (): Promise<WishlistItem[]> => {
    try {
      const response = await post('/Wishlist/GetAll', {});
      const items: WishlistItem[] = response?.data?.table2 || [];
      return items.map(item => {
        if (item.VariantAttributeValues_Id && (item.VariantAttributeValues_Id.startsWith("13:") || item.VariantAttributeValues_Id === "13")) {
          return {
            ...item,
            VariantAttributeValues_Only: item.VariantAttributeValues_Only.replace(/Weight\s*:\s*/i, "").trim()
          };
        }
        return item;
      });
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
      return [];
    }
  },

  add: async (productId: number, variantId: number, packingType?: string) => {
    const customerIdStr = localStorage.getItem("customerId");
    const customerId = customerIdStr ? Number(customerIdStr) : 0;
    
    return post('/Wishlist/Add', {
      customerId,
      productId,
      variantId,
      packingType
    });
  },

  remove: async (wishlistId: number) => {
    return post(`/Wishlist/Remove?id=${wishlistId}`, {});
  }
};
