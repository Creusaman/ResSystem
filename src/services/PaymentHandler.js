import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.REACT_APP_MP_ACCESS_TOKEN,
});

export const PaymentHandler = {
  async createPayment(cartItems, userId, totalWithDiscount) {
    try {
      const preference = {
        items: cartItems.map((item) => ({
          title: item.name,
          unit_price: item.price,
          quantity: item.quantity,
          currency_id: "BRL",
        })),
        payer: {
          id: userId,
        },
        back_urls: {
          success: "http://localhost:3000/payment-success",
          failure: "http://localhost:3000/payment-failure",
        },
        auto_return: "approved",
        total_amount: totalWithDiscount,
      };

      const response = await mercadopago.preferences.create(preference);
      return response.body.init_point;
    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
      throw error;
    }
  },
};
