// index.js (Serveur principal)
const { sendPayout } = require("./payout");

// Webhook FedaPay
app.post("/fedapay-webhook", async (req, res) => {
  const event = req.body;

  console.log("📩 Webhook reçu :", JSON.stringify(event));

  if (event.type === "transaction.status_changed") {
    const transaction = event.object;

    if (transaction.status === "approved") {
      const amount = transaction.amount;

      // ⚠️ Ces infos doivent venir de ta base ou logiquement de la transaction
      const recipientName = "Client Y";
      const recipientPhone = "+22998000000";

      try {
        await sendPayout(amount, recipientPhone, recipientName);
        console.log("✅ Virement effectué automatiquement !");
      } catch (err) {
        console.error("❌ Le virement a échoué :", err.message);
      }
    }
  }

  res.sendStatus(200); // Toujours répondre rapidement
});
