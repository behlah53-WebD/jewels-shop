import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Auth", "SiteContent", "Categories", "Products", "Cart", "Wishlist", "Orders"],
  keepUnusedDataFor: 300, // Keep cached data for 5 minutes by default
  endpoints: (builder) => ({
    // Auth user check
    getMe: builder.query<any, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),

    // Site Content
    getSiteContent: builder.query<any, void>({
      query: () => "/site-content",
      providesTags: ["SiteContent"],
    }),

    // Categories
    getCategories: builder.query<any, void>({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),

    // Products list with optional search & filter params string
    getProducts: builder.query<any, string | void>({
      query: (queryString = "") => `/products${queryString ? `?${queryString}` : ""}`,
      providesTags: (result) =>
        result && result.products
          ? [
              ...result.products.map(({ _id, id, slug }: any) => ({
                type: "Products" as const,
                id: _id || id || slug,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    // Single product by slug or id
    getProductBySlug: builder.query<any, string>({
      query: (slug) => `/products/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Products", id: slug }],
    }),

    // Cart Query & Mutation
    getCart: builder.query<any, void>({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),

    updateCart: builder.mutation<any, { items: any[] }>({
      query: (body) => ({
        url: "/cart",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    // Wishlist Query & Mutation
    getWishlist: builder.query<any, void>({
      query: () => "/wishlist",
      providesTags: ["Wishlist"],
    }),

    updateWishlist: builder.mutation<any, { products: string[] }>({
      query: (body) => ({
        url: "/wishlist",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // User Orders
    getOrders: builder.query<any, void>({
      query: () => "/orders",
      providesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetSiteContentQuery,
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetCartQuery,
  useUpdateCartMutation,
  useGetWishlistQuery,
  useUpdateWishlistMutation,
  useGetOrdersQuery,
} = apiSlice;
