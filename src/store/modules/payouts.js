// payout.js
require("dotenv").config();
const axios = require("axios");

const BASE_URL = process.env.FEDAPAY_BASE_URL;
const API_KEY = process.env.FEDAPAY_API_KEY;

/**
 * Effectue un virement automatique vers Client Y
 * @param {number} amount - Montant en FCFA
 * @param {string} phoneNumber - Téléphone Mobile Money
 * @param {string} name - Nom du bénéficiaire
 */
async function sendPayout(amount, phoneNumber, name) {
  try {
    const res = await axios.post(
      `${BASE_URL}/payouts`,
      {
        amount,
        description: "Virement automatique vers Client Y",
        payment_method: "mtn", // ou 'moov', 'bank'
        recipient: {
          name,
          phone_number: phoneNumber,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Virement réussi :", res.data);
    return res.data;
  } catch (error) {
    console.error(
      "❌ Erreur de virement :",
      error.response?.data || error.message
    );
    throw error;
  }
}

module.exports = { sendPayout };
