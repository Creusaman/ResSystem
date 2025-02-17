import mercadopago from "mercadopago";

// Create a preference object
let preference = {
  // o "purpose": "wallet_purchase" only allows logged payments
  // to allow guest payments you can omit this property
//   "purpose": "wallet_purchase",
  "items": [
    {
      "id": "QuartoHidroCasal",
      "title": "Quarto de Casal com Hidro Pousada Dunas",
      "quantity": 1,
      "unit_price": 600.00
    }
  ]
};
export default function preferenceId () {
  mercadopago.preferences.create(preference)
  .then(function (response) {
    // This value is the preferenceId that will be sent to the Brick at startup
    const preferenceId = response.body.id;
    return preferenceId
  }).catch(function (error) {
    console.log(error);
  });
}


