import { Order, IOrder } from "@/lib/models/Order";

/**
 * Calculates and updates order status progression dynamically based on elapsed time:
 * - 0 to 1 min: processing
 * - 1 to 3 mins: shipped
 * - > 3 mins: delivered
 *
 * Does not override orders marked as cancelled, return_requested, or returned.
 * Persists status progression directly to MongoDB.
 */
export async function syncAutoOrderStatus(order: IOrder): Promise<IOrder> {
  if (!order || !order.createdAt) return order;

  // Do not modify special terminal/return states
  if (
    order.orderStatus === "cancelled" ||
    order.orderStatus === "return_requested" ||
    order.orderStatus === "returned"
  ) {
    return order;
  }

  const createdTime = new Date(order.createdAt).getTime();
  const now = Date.now();
  const elapsedMs = now - createdTime;
  const elapsedMinutes = elapsedMs / (1000 * 60);

  let targetStatus: "processing" | "shipped" | "delivered" = "processing";
  if (elapsedMinutes >= 3) {
    targetStatus = "delivered";
  } else if (elapsedMinutes >= 1) {
    targetStatus = "shipped";
  }

  const statusPriority: Record<string, number> = {
    processing: 1,
    shipped: 2,
    delivered: 3,
  };

  const currentPriority = statusPriority[order.orderStatus] || 1;
  const targetPriority = statusPriority[targetStatus];

  if (targetPriority > currentPriority) {
    order.orderStatus = targetStatus;
    await Order.findByIdAndUpdate(order._id, { orderStatus: targetStatus });
  }

  return order;
}

export async function syncMultipleOrdersAutoStatus(orders: IOrder[]): Promise<IOrder[]> {
  if (!orders || orders.length === 0) return orders;
  return Promise.all(orders.map((o) => syncAutoOrderStatus(o)));
}
