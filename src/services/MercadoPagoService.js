import axios from "axios";

const MERCADO_PAGO_ACCESS_TOKEN = "SUA_CHAVE_DE_ACESSO_AQUI";

export const createPayment = async (cartItems, total) => {
  try {
    const response = await axios.post(
      "https://api.mercadopago.com/v1/payments",
      {
        items: cartItems.map((item) => ({
          title: item.name,
          unit_price: item.price,
          quantity: item.quantity,
          currency_id: "BRL",
        })),
        payer: {
          email: "cliente@email.com",
        },
        back_urls: {
          success: "http://localhost:3000/payment-success",
          failure: "http://localhost:3000/payment-failure",
        },
        auto_return: "approved",
        total_amount: total,
      },
      {
        headers: {
          Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    throw error;
  }
};
