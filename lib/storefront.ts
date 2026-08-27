export const STORE_NAME = "Aurelia Jewels";
export const PAYMENT_MODE = "preview-only" as const;

export function isPaymentProcessingEnabled(): false {
  return false;
}

export function normaliseSearch(value: string): string {
  return value.trim().toLocaleLowerCase();
}

export const REVIEW_STATE = "real-customer-content-required" as const;

export function canRenderCustomerReview(hasVerifiedCustomerContent: boolean): boolean {
  return hasVerifiedCustomerContent;
}

export function deliveryPreviewNotice(method: "insured" | "appointment" | "collection"): string {
  return `${method} delivery is a preview only; it cannot create a shipment.`;
}
