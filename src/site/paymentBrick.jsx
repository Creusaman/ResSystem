import preferenceId from './Components/mpPreference_ID' 

const initialization = {
    amount: 100,
    preferenceId: preferenceId,
   };
   const customization = {
    paymentMethods: {
      ticket: "all",
      bankTransfer: "all",
      creditCard: "all",
      debitCard: "all",
      mercadoPago: "all",
    },
   };
   const onSubmit = async (
    { selectedPaymentMethod, formData }
   ) => {
    // callback called when clicking the submit data button
    return new Promise((resolve, reject) => {
      fetch("/process_payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((response) => {
          // receive payment result
          resolve();
        })
        .catch((error) => {
          // handle error response when trying to create payment
          reject();
        });
    });
   };
   const onError = async (error) => {
    // callback called for all Brick error cases
    console.log(error);
   };
   const onReady = async () => {
    /*
      Callback called when Brick is ready.
      Here you can hide loadings from your site, for example.
    */
   };
   
   function Payment() {
    <Payment
    initialization={initialization}
    customization={customization}
    onSubmit={onSubmit}
    onReady={onReady}
    onError={onError}
  />
   }

   export default Payment;
  