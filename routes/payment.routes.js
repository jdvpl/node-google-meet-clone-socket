const { Router } = require("express");
const { check } = require("express-validator");
const {
  setPayment,
  getPaymentStatus,
} = require("../controllers/payments.controller");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post(
  "/",
  [
    check("amount", "The amount must be numeric.").isNumeric(),
    check("amount", "The amount is required.").not().isEmpty(),
    validarCampos,
  ],
  setPayment
);

router.post("/payment-handler", getPaymentStatus);
module.exports = router;
