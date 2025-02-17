import mercadopago from 'mercadopago';

// MercadoPago Configuration using environment variables
const mpconfig = {
  publicKey: process.env.REACT_APP_MP_PUBLIC_KEY,
  accessToken: process.env.REACT_APP_MP_ACCESS_TOKEN,
  urlRoot: process.env.REACT_APP_MP_URL_ROOT,
};

// SDK Initialization
mercadopago.configure({
  access_token: mpconfig.accessToken,
});

export default mpconfig;
