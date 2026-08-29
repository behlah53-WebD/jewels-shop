export function generateInvoiceHTML(order: any, isPrintDownload = false): string {
  const invoice = order.invoice || {};
  const invoiceNum = invoice.invoiceNumber || `AUR-INV-${order._id.substring(0, 8).toUpperCase()}`;
  const invoiceDate = invoice.invoiceDate 
    ? new Date(invoice.invoiceDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const addr = order.shippingAddress || {};
  const customerName = addr.name || "Valued Patron";
  const customerEmail = addr.email || invoice.customerEmail || "N/A";
  const customerPhone = addr.phone || "N/A";
  const customerStreet = addr.street || "";
  const customerCityState = `${addr.city || ""}, ${addr.state || ""} ${addr.postalCode || ""}`.trim();
  const customerCountry = addr.country || "India";

  const items = order.items || [];
  const subtotal = order.subtotal || 0;
  const shippingCost = order.shippingCost || 0;
  const taxAmount = invoice.taxAmount || Math.round(subtotal * 0.03); // 3% GST
  const discountAmount = invoice.discountAmount || 0;
  const total = order.total || (subtotal + shippingCost);

  const paymentId = order.razorpayPaymentId || "N/A";
  const paymentStatus = (order.paymentStatus || "paid").toUpperCase();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice #${invoiceNum} - Aurelia Fine Jewellery</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap');

    :root {
      --ink: #0b1a14;
      --deep-green: #0d251d;
      --gold: #d5ad67;
      --gold-dark: #b88e4c;
      --cream: #fbf7ee;
      --muted: #6b7c72;
      --border: #e2d5bf;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #f4efe6;
      color: #1c2b23;
      line-height: 1.5;
      font-size: 14px;
      padding: 30px 15px;
    }

    .invoice-wrapper {
      max-width: 840px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(13, 37, 29, 0.08);
      overflow: hidden;
    }

    /* Print toolbar */
    .no-print-bar {
      background: var(--deep-green);
      color: var(--cream);
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(213, 173, 103, 0.3);
    }
    .no-print-bar span { font-size: 13px; font-weight: 500; letter-spacing: 0.05em; color: var(--gold); }
    .print-btn {
      background: linear-gradient(135deg, var(--gold), var(--gold-dark));
      color: #0d251d;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: transform 0.15s ease;
    }
    .print-btn:hover { transform: translateY(-1px); }

    .invoice-header {
      background: linear-gradient(135deg, #0d251d 0%, #153328 100%);
      color: #ffffff;
      padding: 40px 45px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      position: relative;
    }

    .brand-logo {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 600;
      letter-spacing: 0.12em;
      color: var(--gold);
      text-transform: uppercase;
      text-decoration: none;
      display: block;
      margin-bottom: 6px;
    }

    .company-details {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
    }

    .invoice-title-block {
      text-align: right;
    }

    .invoice-badge {
      display: inline-block;
      background: rgba(213, 173, 103, 0.15);
      border: 1px solid var(--gold);
      color: var(--gold);
      padding: 4px 12px;
      border-radius: 50px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .invoice-num {
      font-family: monospace;
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.05em;
    }

    .invoice-date {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.65);
      margin-top: 4px;
    }

    .invoice-body {
      padding: 40px 45px;
    }

    .billing-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 35px;
      padding-bottom: 25px;
      border-bottom: 1px solid #efe6d8;
    }

    .section-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--gold-dark);
      margin-bottom: 8px;
    }

    .person-name {
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      font-weight: 600;
      color: var(--ink);
      margin-bottom: 4px;
    }

    .address-line {
      font-size: 13px;
      color: var(--muted);
      line-height: 1.6;
    }

    .payment-badge-paid {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      color: #047857;
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      margin-top: 6px;
    }

    /* Table */
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }

    .items-table th {
      background: #faf6f0;
      color: var(--deep-green);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 12px 16px;
      text-align: left;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
    }

    .items-table td {
      padding: 16px;
      border-bottom: 1px solid #f2e9dc;
      vertical-align: middle;
    }

    .item-product-name {
      font-family: 'Playfair Display', serif;
      font-size: 15px;
      font-weight: 600;
      color: var(--ink);
    }

    .item-specs {
      font-size: 11px;
      color: var(--muted);
      margin-top: 2px;
    }

    .text-right { text-align: right; }
    .text-center { text-align: center; }

    /* Summary block */
    .summary-container {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 40px;
    }

    .summary-table {
      width: 320px;
      border-collapse: collapse;
    }

    .summary-table td {
      padding: 8px 12px;
      font-size: 13px;
    }

    .summary-label {
      color: var(--muted);
    }

    .summary-val {
      text-align: right;
      font-weight: 600;
      color: var(--ink);
    }

    .summary-total-row td {
      border-top: 2px solid var(--gold);
      border-bottom: 2px solid var(--gold);
      padding: 14px 12px;
    }

    .summary-total-label {
      font-family: 'Playfair Display', serif;
      font-size: 16px;
      font-weight: 700;
      color: var(--deep-green);
    }

    .summary-total-val {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      font-weight: 700;
      color: var(--deep-green);
      text-align: right;
    }

    .guarantee-box {
      background: #faf6f0;
      border: 1px dashed var(--gold);
      border-radius: 10px;
      padding: 18px 24px;
      margin-bottom: 35px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .guarantee-icon {
      font-size: 24px;
      color: var(--gold-dark);
      flex-shrink: 0;
    }

    .guarantee-text h4 {
      font-size: 13px;
      font-weight: 700;
      color: var(--deep-green);
      margin-bottom: 2px;
    }

    .guarantee-text p {
      font-size: 12px;
      color: var(--muted);
    }

    .invoice-footer {
      border-top: 1px solid var(--border);
      padding-top: 25px;
      text-align: center;
      font-size: 12px;
      color: var(--muted);
    }

    .invoice-footer b {
      color: var(--deep-green);
    }

    @media print {
      @page {
        size: portrait;
        margin: 10mm;
      }
      
      html, body {
        background: #f4efe6 !important;
        padding: 0 !important;
        margin: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }

      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }

      .no-print-bar { 
        display: none !important; 
      }

      .invoice-wrapper { 
        border: 1px solid #e2d5bf !important; 
        box-shadow: none !important; 
        max-width: 100% !important; 
        background: #ffffff !important;
        border-radius: 12px !important;
        overflow: hidden !important;
      }

      .invoice-header {
        background: linear-gradient(135deg, #0d251d 0%, #153328 100%) !important;
        color: #ffffff !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .invoice-badge {
        background: rgba(213, 173, 103, 0.15) !important;
        border: 1px solid #d5ad67 !important;
        color: #d5ad67 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .payment-badge-paid {
        background: #ecfdf5 !important;
        border: 1px solid #a7f3d0 !important;
        color: #047857 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .items-table th {
        background: #faf6f0 !important;
        color: #0d251d !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .guarantee-box {
        background: #faf6f0 !important;
        border: 1px dashed #d5ad67 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  </style>
</head>
<body>

  <div class="invoice-wrapper">
    <!-- Action Bar for Browser View -->
    <div class="no-print-bar">
      <span>✦ Official Insured Invoice Document</span>
      <button class="print-btn" onclick="window.print()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
        Print / Save PDF
      </button>
    </div>

    <!-- Header -->
    <div class="invoice-header">
      <div>
        <span class="brand-logo">Aurelia</span>
        <div class="company-details">
          <b>Aurelia Fine Jewellery Ltd.</b><br>
          12 Atelier Blvd, Bandra West, Mumbai 400050, MH, India<br>
          GSTIN: 27AABCA1234F1Z9 | Customer Concierge: +91 22 8765 4321<br>
          Email: concierge@aureliajewels.com
        </div>
      </div>
      <div class="invoice-title-block">
        <span class="invoice-badge">Tax Invoice</span>
        <div class="invoice-num">#${invoiceNum}</div>
        <div class="invoice-date">Date: ${invoiceDate}</div>
        <div class="payment-badge-paid">
          <span>✓</span> Payment Verified (${paymentStatus})
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="invoice-body">
      <!-- Billing & Shipping Grid -->
      <div class="billing-grid">
        <div>
          <div class="section-label">Billed & Shipped To</div>
          <div class="person-name">${customerName}</div>
          <div class="address-line">
            ${customerStreet ? customerStreet + "<br>" : ""}
            ${customerCityState ? customerCityState + "<br>" : ""}
            ${customerCountry}<br>
            <b>Email:</b> ${customerEmail}<br>
            <b>Phone:</b> ${customerPhone}
          </div>
        </div>
        <div>
          <div class="section-label">Order & Payment Summary</div>
          <div class="address-line">
            <b>Order Reference:</b> #${order._id}<br>
            <b>Razorpay Payment ID:</b> ${paymentId}<br>
            <b>Payment Method:</b> Razorpay Insured Gateway<br>
            <b>Status:</b> ${paymentStatus} (Fulfilled)
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <table class="items-table">
        <thead>
          <tr>
            <th style="width: 50%;">Product Description</th>
            <th class="text-center" style="width: 15%;">Qty</th>
            <th class="text-right" style="width: 17%;">Unit Price</th>
            <th class="text-right" style="width: 18%;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item: any) => `
            <tr>
              <td>
                <div class="item-product-name">${item.name}</div>
                <div class="item-specs">
                  ${item.size ? `Size: ${item.size}` : ""} ${item.material ? ` · Material: ${item.material}` : " · 18K Certified Gold"}
                </div>
              </td>
              <td class="text-center"><b>${item.quantity}</b></td>
              <td class="text-right">₹${(item.price || 0).toLocaleString("en-IN")}</td>
              <td class="text-right"><b>₹${((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}</b></td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <!-- Summary Breakdown -->
      <div class="summary-container">
        <table class="summary-table">
          <tr>
            <td class="summary-label">Subtotal</td>
            <td class="summary-val">₹${subtotal.toLocaleString("en-IN")}</td>
          </tr>
          <tr>
            <td class="summary-label">Insured Shipping</td>
            <td class="summary-val">${shippingCost > 0 ? `₹${shippingCost.toLocaleString("en-IN")}` : "FREE"}</td>
          </tr>
          <tr>
            <td class="summary-label">GST Tax (3% Included)</td>
            <td class="summary-val">₹${taxAmount.toLocaleString("en-IN")}</td>
          </tr>
          ${discountAmount > 0 ? `
          <tr>
            <td class="summary-label">Discount</td>
            <td class="summary-val">-₹${discountAmount.toLocaleString("en-IN")}</td>
          </tr>
          ` : ""}
          <tr class="summary-total-row">
            <td class="summary-total-label">Total Amount Paid</td>
            <td class="summary-total-val">₹${total.toLocaleString("en-IN")}</td>
          </tr>
        </table>
      </div>

      <!-- Trust Seal -->
      <div class="guarantee-box">
        <div class="guarantee-icon">✦</div>
        <div class="guarantee-text">
          <h4>100% Certified Authentic Jewellery</h4>
          <p>Every piece from Aurelia is hallmark certified for purity and accompanied by our lifetime craftsmanship guarantee & complimentary cleaning services.</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="invoice-footer">
        Thank you for choosing <b>Aurelia Fine Jewellery</b>. For assistance, contact concierge@aureliajewels.com.<br>
        <i>This is a computer-generated tax invoice and requires no physical signature.</i>
      </div>
    </div>
  </div>

  ${isPrintDownload ? `<script>window.onload = function() { setTimeout(function(){ window.print(); }, 500); }</script>` : ""}
</body>
</html>`;
}

/**
 * Specifically tailored for Gmail & Email client renderers using pure inline styles & tables
 */
export function generateEmailBodyHTML(order: any): string {
  const invoice = order.invoice || {};
  const invoiceNum = invoice.invoiceNumber || `AUR-INV-${order._id.substring(0, 8).toUpperCase()}`;
  const invoiceDate = invoice.invoiceDate 
    ? new Date(invoice.invoiceDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const addr = order.shippingAddress || {};
  const customerName = addr.name || "Valued Patron";
  const items = order.items || [];
  const subtotal = order.subtotal || 0;
  const shippingCost = order.shippingCost || 0;
  const total = order.total || (subtotal + shippingCost);
  const paymentId = order.razorpayPaymentId || "N/A";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Aurelia Order & Tax Invoice</title>
</head>
<body style="margin:0; padding:0; background-color:#f4efe6; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing:antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4efe6; padding:30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e2d5bf; box-shadow:0 6px 24px rgba(13,37,29,0.06);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color:#0d251d; padding:36px 40px; text-align:center;">
              <div style="font-family:Georgia, serif; font-size:26px; font-weight:bold; letter-spacing:3px; color:#d5ad67; text-transform:uppercase; margin-bottom:6px;">AURELIA</div>
              <div style="font-size:11px; letter-spacing:2px; color:#ffffff; text-transform:uppercase; opacity:0.8;">FINE JEWELLERY · OFFICIAL INVOICE</div>
            </td>
          </tr>

          <!-- Confirmation Banner -->
          <tr>
            <td style="background-color:#faf6f0; padding:20px 40px; border-bottom:1px solid #efe6d8;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size:14px; font-weight:bold; color:#0d251d;">
                    Order Confirmed & Payment Verified ✓
                  </td>
                  <td align="right" style="font-size:12px; font-weight:bold; color:#b88e4c; font-family:monospace;">
                    #${invoiceNum}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="font-size:15px; color:#1c2b23; margin:0 0 16px; line-height:1.6;">
                Dear <b>${customerName}</b>,
              </p>
              <p style="font-size:14px; color:#5a685f; margin:0 0 24px; line-height:1.6;">
                Thank you for acquiring fine jewellery from <b>Aurelia</b>. Your payment of <b>₹${total.toLocaleString("en-IN")}</b> via Razorpay is successfully verified. Your order is now being processed by our master artisans.
              </p>

              <!-- Order Summary Meta Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="12" style="background-color:#faf7f0; border-radius:8px; border:1px solid #e8dfcf; margin-bottom:28px;">
                <tr>
                  <td style="font-size:12px; color:#6b7c72;"><b>Invoice Date:</b> ${invoiceDate}</td>
                  <td align="right" style="font-size:12px; color:#6b7c72;"><b>Razorpay ID:</b> ${paymentId}</td>
                </tr>
              </table>

              <!-- Items Table -->
              <div style="font-size:12px; font-weight:bold; letter-spacing:1px; color:#b88e4c; text-transform:uppercase; margin-bottom:12px;">Purchased Items</div>
              <table width="100%" border="0" cellspacing="0" cellpadding="12" style="border-collapse:collapse; margin-bottom:28px;">
                <thead>
                  <tr style="background-color:#0d251d; color:#ffffff;">
                    <th align="left" style="font-size:11px; text-transform:uppercase; letter-spacing:1px; padding:10px 12px;">Item</th>
                    <th align="center" style="font-size:11px; text-transform:uppercase; letter-spacing:1px; padding:10px 12px;">Qty</th>
                    <th align="right" style="font-size:11px; text-transform:uppercase; letter-spacing:1px; padding:10px 12px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map((item: any) => `
                    <tr style="border-bottom:1px solid #efe6d8;">
                      <td style="padding:12px; font-size:14px; color:#0d251d; font-weight:600;">
                        ${item.name}
                        ${item.size ? `<div style="font-size:11px; color:#6b7c72; font-weight:normal; margin-top:2px;">Size: ${item.size}</div>` : ""}
                      </td>
                      <td align="center" style="padding:12px; font-size:13px; color:#1c2b23;">${item.quantity}</td>
                      <td align="right" style="padding:12px; font-size:14px; color:#0d251d; font-weight:bold;">₹${((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>

              <!-- Total Breakdown -->
              <table width="100%" border="0" cellspacing="0" cellpadding="6" style="margin-bottom:30px;">
                <tr>
                  <td align="right" style="font-size:13px; color:#6b7c72; width:70%;">Subtotal:</td>
                  <td align="right" style="font-size:13px; color:#1c2b23; font-weight:bold; width:30%;">₹${subtotal.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td align="right" style="font-size:13px; color:#6b7c72;">Insured Shipping:</td>
                  <td align="right" style="font-size:13px; color:#1c2b23; font-weight:bold;">${shippingCost > 0 ? `₹${shippingCost.toLocaleString("en-IN")}` : "FREE"}</td>
                </tr>
                <tr>
                  <td align="right" style="font-size:15px; color:#0d251d; font-weight:bold; padding-top:10px; border-top:2px solid #d5ad67;">Total Amount Paid:</td>
                  <td align="right" style="font-size:18px; color:#0d251d; font-weight:bold; padding-top:10px; border-top:2px solid #d5ad67;">₹${total.toLocaleString("en-IN")}</td>
                </tr>
              </table>

              <!-- PDF Attachment Notice Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="16" style="background-color:#faf6f0; border-left:4px solid #d5ad67; border-radius:4px;">
                <tr>
                  <td style="font-size:13px; color:#0d251d; line-height:1.5;">
                    <b>📎 Official Tax Invoice Attached</b><br>
                    Your full official printable Tax Invoice file (<code>Invoice_${invoiceNum}.html</code>) is attached to this email. You can also view or download it directly anytime from your <a href="http://localhost:3002/account" style="color:#b88e4c; font-weight:bold; text-decoration:underline;">Aurelia Account Dashboard</a>.
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0d251d; padding:24px 40px; text-align:center; color:#a4b0a8; font-size:12px; line-height:1.6;">
              <div style="color:#d5ad67; font-weight:bold; font-size:13px; margin-bottom:4px;">AURELIA FINE JEWELLERY</div>
              12 Atelier Blvd, Bandra West, Mumbai 400050, India · Concierge: +91 22 8765 4321<br>
              © 2026 Aurelia Fine Jewellery Ltd. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
