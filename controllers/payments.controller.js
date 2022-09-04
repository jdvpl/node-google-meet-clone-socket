const { response, request, json } = require("express");
const { Client, resources, Webhook } = require("coinbase-commerce-node");
const { COINBASE_API_KEY, COINBASE_WEBHOOK_SECRET } = require("../config");
Client.init(COINBASE_API_KEY);

const { Charge, Event } = resources;

const setPayment = async (req = request, res = response) => {
  const { amount } = req.body;

  try {
    const chargeData = {
      name: "Payment suscription",
      description: "My month suscription",
      organization_name: "ECCA",
      logo_url: "https://rapidfast-53b54.web.app/favicon.ico",
      local_price: {
        amount: amount,
        currency: "USD",
      },
      pricing_type: "fixed_price",
      metadata: {
        customer_id: "1077870326",
        customer_name: "Kakaroto",
      },
      redirect_url: `${process.env.URL_FRONTEND}/success-payment`,
      cancel_url: `${process.env.URL_FRONTEND}/cancel-payment`,
    };

    const charge = await Charge.create(chargeData);
    return res.status(200).json(charge);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getPaymentStatus = async (req, res) => {
  const rawBody = req.rawBody;
  const signature = req.headers["x-cc-webhook-signature"];
  const webhookSecret = COINBASE_WEBHOOK_SECRET;

  let event;
  try {
    event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);
    console.log(event.data.id);
    console.log(event.type);
    console.log(event.resource);
    console.log(event);
    Event.retrieve(
      "afc7f17b-507a-4e75-88cb-9f4e994f9f1f",
      function (err, response) {
        console.log("error: " + err);
        console.log("succcess" + JSON.stringify(response));
      }
    );
    if (event.type === "charge:pending") {
      console.log("pago pendiente");
    }
    if (event.type === "charge:failed") {
      console.log("pago failed");
    }
    if (event.type === "charge:confirmed") {
      console.log("pago confirmed");
    }
    return res.status(200).json(event.id);
  } catch (error) {
    return res.status(500).json({ mgs: error.message });
  }
};

module.exports = { setPayment, getPaymentStatus };
