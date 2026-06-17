import { products, Product } from "../data/products";
import { API_BASE_URL } from "./config";

export interface ApiProductImage {
  imagePath: string;
  isPrimary: boolean;
}

export interface ApiProduct {
  ProductId: number;
  ProductDescription: string;
  VarientId: number;
  ProductName: string;
  CategoryId: number;
  CategoryName: string;
  ParentCategoryId: number;
  IsWishlist: boolean;
  VariantAttributeValues_Only: any;
  VariantAttributes: any;
  SKU: string;
  Price: number;
  ImagePath: any;
  Images: ApiProductImage[];
  TotalAvailableStock: number;
}

export interface ApiResponse {
  data: {
    table1: Array<{ TotalRecords: number; FilteredRecords: number }>;
    table2: ApiProduct[];
  };
}

// Function to normalize strings for comparison (e.g. "Beet Radiance" -> "beet-radiance")
export function normalizeSlug(str: string): string {
  if (!str) return "";
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Robust case-insensitive helper to retrieve properties from an API object.
 * Handles exact matches, common CamelCase/PascalCase variations, and fallback to case-insensitive key scanning.
 */
export function getCaseInsensitiveProperty<T = any>(obj: any, key: string): T | undefined {
  if (!obj || typeof obj !== "object") return undefined;

  // Try direct access first (fastest)
  if (obj[key] !== undefined) return obj[key];

  // Try standard camelCase / PascalCase variations
  const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
  if (obj[camelKey] !== undefined) return obj[camelKey];

  const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
  if (obj[pascalKey] !== undefined) return obj[pascalKey];

  // Fallback to searching keys case-insensitively
  const lowerTarget = key.toLowerCase();
  const foundKey = Object.keys(obj).find(k => k.toLowerCase() === lowerTarget);
  return foundKey ? obj[foundKey] : undefined;
}

/**
 * Robustly parses API response structure to find the table2 products array.
 * Supports wrapped "data"/"Data" and lowercase/PascalCase tables.
 */
export function getApiProducts(result: any): any[] {
  if (!result || typeof result !== "object") return [];

  // Get data object (which might be wrapped in data/Data or be the root result itself)
  const data = getCaseInsensitiveProperty(result, "data") || result;

  // Get table2 array (supports table2 / Table2 / Table1 vs Table2)
  const table2 = getCaseInsensitiveProperty(data, "table2");
  if (Array.isArray(table2)) return table2;

  // If table2 is not found directly, scan all array properties for any table2 matching name
  for (const key of Object.keys(data)) {
    if (Array.isArray(data[key]) && key.toLowerCase().includes("table2")) {
      return data[key];
    }
  }

  // Fallback to finding any array that is not table1/Table1
  for (const key of Object.keys(data)) {
    if (Array.isArray(data[key]) && !key.toLowerCase().includes("table1")) {
      return data[key];
    }
  }

  // Finally, if the data object itself is an array, return it
  if (Array.isArray(data)) return data;

  return [];
}

/**
 * Resolves a raw image path from the API into a full URL.
 * Handles absolute URLs, relative paths, and fallback to a no-image placeholder.
 */
export function resolveImageUrl(rawPath: string | undefined | null): string {
  if (rawPath && typeof rawPath === "string" && rawPath.trim()) {
    const pathStr = rawPath.trim();
    if (pathStr.startsWith("http://") || pathStr.startsWith("https://")) {
      return pathStr;
    } else {
      const cleanPath = pathStr.replace(/\\/g, "/").replace(/^\/+/, "");
      return `https://localhost:7103/${cleanPath}`;
    }
  }
  return "https://localhost:7103/Uploads/Product/no-image.png";
}

/**
 * Extracts all resolved image URLs from a variant's Images array.
 * Returns images sorted with isPrimary=true first.
 * Falls back to the legacy single ImagePath field if Images array is empty.
 */
function extractImagesFromVariant(apiVar: any): string[] {
  const imagesArray = getCaseInsensitiveProperty<any[]>(apiVar, "Images");

  if (Array.isArray(imagesArray) && imagesArray.length > 0) {
    // Sort: primary images first
    const sorted = [...imagesArray].sort((a, b) => {
      const aP = a.isPrimary || a.IsPrimary ? 1 : 0;
      const bP = b.isPrimary || b.IsPrimary ? 1 : 0;
      return bP - aP;
    });

    return sorted
      .map((img: any) => {
        const path = img.imagePath || img.ImagePath || "";
        return resolveImageUrl(path);
      })
      .filter((url: string) => url !== "https://localhost:7103/Uploads/Product/no-image.png");
  }

  // Fallback to legacy single ImagePath field
  const legacyPath = getCaseInsensitiveProperty<string>(apiVar, "ImagePath") || "";
  const resolved = resolveImageUrl(legacyPath);
  if (resolved !== "https://localhost:7103/Uploads/Product/no-image.png") {
    return [resolved];
  }

  return [];
}

/**
 * Fetches products for a specific category ID from the backend API.
 * Maps and merges them with the local high-fidelity products metadata.
 */
export async function fetchProductsFromApi(categoryId: number): Promise<Product[]> {
  const url = `${API_BASE_URL}/Product/GetAll`;
  const body = {
    id: -2,
    categoryId: categoryId,
    search: ""
  };
  console.log(`[API Request] Fetching from ${url}`, body);

  try {
    const token = localStorage.getItem("authToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API returned status ${response.status} (${response.statusText})`);
    }

    const result = await response.json();
    console.log(`[API Response] Successfully fetched categoryId ${categoryId} data:`, result);
    const apiProducts = getApiProducts(result);

    if (apiProducts.length === 0) {
      return [];
    }

    // Group the API products by ProductId to collect variants
    const groupedProducts: Record<number, any[]> = {};
    apiProducts.forEach(apiProd => {
      const prodId = getCaseInsensitiveProperty<number>(apiProd, "ProductId");
      if (prodId !== undefined && prodId !== null) {
        const prodIdNum = Number(prodId);
        if (!groupedProducts[prodIdNum]) {
          groupedProducts[prodIdNum] = [];
        }
        groupedProducts[prodIdNum].push(apiProd);
      }
    });

    // Map each group to a single Product with a variants array
    return Object.keys(groupedProducts).map((prodIdStr) => {
      const group = groupedProducts[Number(prodIdStr)];
      const primaryApiProd = group[0]; // Use first variant as default details

      const prodName = getCaseInsensitiveProperty<string>(primaryApiProd, "ProductName") || "";
      const prodSku = getCaseInsensitiveProperty<string>(primaryApiProd, "SKU") || "";
      const prodId = getCaseInsensitiveProperty<number>(primaryApiProd, "ProductId");
      const prodDesc = getCaseInsensitiveProperty<string>(primaryApiProd, "ProductDescription") || "";
      const categoryIdVal = getCaseInsensitiveProperty<number>(primaryApiProd, "CategoryId");
      const categoryNameVal = getCaseInsensitiveProperty<string>(primaryApiProd, "CategoryName") || "";
      const priceVal = getCaseInsensitiveProperty<number>(primaryApiProd, "Price") || 0;
      const totalStock = getCaseInsensitiveProperty<number>(primaryApiProd, "TotalAvailableStock") || 0;

      const apiSlug = normalizeSlug(prodName);
      const apiSkuSlug = normalizeSlug(prodSku);

      // Find a matching static product in local storage to enrich
      const localProduct = products.find((p) => {
        const localSlug = normalizeSlug(p.name);
        const localId = normalizeSlug(p.id);
        return (
          localId === apiSlug ||
          localId === apiSkuSlug ||
          localSlug === apiSlug ||
          localSlug === apiSkuSlug ||
          p.id.replace(/-100|-200/g, "") === apiSlug ||
          p.id.replace(/-100|-200/g, "") === apiSkuSlug
        );
      });

      // Map the variants
      const variants = group.map(apiVar => {
        const varientId = getCaseInsensitiveProperty<number>(apiVar, "VarientId") || 0;
        const variantAttributeValues_Only = getCaseInsensitiveProperty<string>(apiVar, "VariantAttributeValues_Only") || "";
        const variantAttributes = getCaseInsensitiveProperty<string>(apiVar, "VariantAttributes") || "";
        const sku = getCaseInsensitiveProperty<string>(apiVar, "SKU") || "";
        const price = getCaseInsensitiveProperty<number>(apiVar, "Price") || 0;
        const totalAvailableStock = getCaseInsensitiveProperty<number>(apiVar, "TotalAvailableStock") || 0;

        // Extract images from the new Images array format
        const variantImageUrls = extractImagesFromVariant(apiVar);

        return {
          varientId,
          variantAttributeValues_Only,
          variantAttributes,
          sku,
          price,
          imagePath: variantImageUrls[0] || "https://localhost:7103/Uploads/Product/no-image.png",
          totalAvailableStock
        };
      });

      // Gather product images from the first variant's Images array
      // (all variants for the same product share the same images)
      const productImages = extractImagesFromVariant(primaryApiProd);

      // Also collect any unique variant-specific images as fallback
      const variantOnlyImages = variants.map(v => v.imagePath).filter(Boolean);
      const allImages = Array.from(new Set([...productImages, ...variantOnlyImages]))
        .filter(url => url !== "https://localhost:7103/Uploads/Product/no-image.png");

      return {
        id: localProduct?.id || apiSlug || apiSkuSlug || String(prodId),
        name: prodName || (localProduct?.name ?? ""),
        price: priceVal,
        originalPrice: localProduct?.originalPrice ?? Math.round(priceVal * 1.8),
        discount: localProduct?.discount ?? `${Math.round((1 - priceVal / (priceVal * 1.8)) * 100)}% OFF`,
        tag: localProduct?.tag ?? "",
        images: allImages.length > 0 ? allImages : ["https://localhost:7103/Uploads/Product/no-image.png"],
        category: (localProduct?.category ?? (categoryIdVal === 17 ? "mukhwas" : "soap")) as any,
        tagline: localProduct?.tagline ?? prodDesc ?? "",
        rating: localProduct?.rating ?? 4.8,
        ratingCount: localProduct?.ratingCount ?? 120,
        desc: prodDesc || (localProduct?.desc ?? ""),
        longDesc: localProduct?.longDesc ?? prodDesc ?? "",
        benefits: localProduct?.benefits ?? [
          "Deeply nourishes & brightens skin",
          "Keeps skin soft, plump & hydrated"
        ],
        ingredients: localProduct?.ingredients ?? [],
        usage: localProduct?.usage ?? [],
        highlights: localProduct?.highlights ?? [],
        reviews: localProduct?.reviews ?? [],
        faqs: localProduct?.faqs ?? [],
        variants: variants,
        totalAvailableStock: totalStock,
        productId: prodId ? Number(prodId) : undefined,
        categoryName: categoryNameVal
      };
    });
  } catch (error) {
    console.error(`Error fetching products for categoryId ${categoryId}:`, error);
    return [];
  }
}
