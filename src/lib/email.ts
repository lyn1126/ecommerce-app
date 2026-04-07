import { Resend } from "resend";

type EmailOrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type SendOrderConfirmationInput = {
  orderNumber: string;
  email: string;
  total: number;
  items: EmailOrderItem[];
};

export async function sendOrderConfirmationEmail(input: SendOrderConfirmationInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return;
  }

  const resend = new Resend(apiKey);
  const itemsHtml = input.items
    .map(
      (item) =>
        `<li>${item.name} x ${item.quantity} - ${item.price.toLocaleString("vi-VN")} VND</li>`,
    )
    .join("");

  await resend.emails.send({
    from,
    to: input.email,
    subject: `Xác nhận đơn hàng #${input.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Cảm ơn bạn đã đặt hàng!</h2>
        <p>Mã đơn hàng: <strong>${input.orderNumber}</strong></p>
        <p>Chi tiết đơn hàng:</p>
        <ul>${itemsHtml}</ul>
        <p><strong>Tổng cộng: ${input.total.toLocaleString("vi-VN")} VND</strong></p>
      </div>
    `,
  });
}
