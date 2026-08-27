import { describe, expect, it } from "vitest";
import { canRenderCustomerReview, deliveryPreviewNotice, isPaymentProcessingEnabled, normaliseSearch, PAYMENT_MODE, REVIEW_STATE, STORE_NAME } from "./storefront";

describe("Aurelia storefront configuration", () => {
  it("keeps the storefront payment flow in non-processing preview mode", () => {
    expect(PAYMENT_MODE).toBe("preview-only");
    expect(isPaymentProcessingEnabled()).toBe(false);
  });

  it("normalises search terms for an eventual catalogue data source", () => {
    expect(normaliseSearch("  Emerald Rings  ")).toBe("emerald rings");
    expect(STORE_NAME).toBe("Aurelia Jewels");
  });

  it("does not render invented customer reviews or testimonials", () => {
    expect(REVIEW_STATE).toBe("real-customer-content-required");
    expect(canRenderCustomerReview(false)).toBe(false);
    expect(canRenderCustomerReview(true)).toBe(true);
  });

  it("labels every delivery method as a non-processing preview", () => {
    expect(deliveryPreviewNotice("insured")).toContain("preview only");
    expect(deliveryPreviewNotice("appointment")).toContain("cannot create a shipment");
  });
});
