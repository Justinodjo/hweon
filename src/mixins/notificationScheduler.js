export class NotificationScheduler {
  constructor(store) {
    this.store = store;
    this.checkIntervals = {
      contracts: 3600000, // 1 heure
      payments: 86400000, // 24 heures
    };
  }

  async checkExpiringContracts() {
    try {
      const contrats = await this.store.dispatch("contrats/getAll", {
        status: "ACTIF",
      });

      const today = new Date();
      const notifications = [];

      for (const contrat of contrats) {
        const dateFin = new Date(contrat.dateFin);
        const daysUntilExpiry = Math.ceil(
          (dateFin - today) / (1000 * 60 * 60 * 24)
        );

        // Rappels à 30, 15 et 7 jours
        if ([30, 15, 7].includes(daysUntilExpiry)) {
          notifications.push(this.sendExpiryReminder(contrat, daysUntilExpiry));
        }
      }

      await Promise.all(notifications);
      console.log(
        `✅ Vérification échéances: ${notifications.length} rappels envoyés`
      );
    } catch (error) {
      console.error("❌ Erreur vérification échéances:", error);
    }
  }

  async sendExpiryReminder(contrat, daysUntilExpiry) {
    const priority = daysUntilExpiry <= 7 ? "URGENT" : "MEDIUM";

    // Notifier le locataire
    await this.store.dispatch("notifications/createRappelEcheance", {
      contrat: contrat,
      recipientId: contrat.locataireId,
    });

    // Notifier le propriétaire
    await this.store.dispatch("notifications/createNotification", {
      userId: contrat.proprietaireId,
      type: "RAPPEL",
      title: "Contrat arrivant à échéance",
      message: `Le contrat ${contrat.referenceContrat} expire dans ${daysUntilExpiry} jours`,
      data: {
        contratId: contrat.id,
        contratRef: contrat.referenceContrat,
        locataireNom: contrat.locataire?.nom,
      },
      priority: priority,
    });
  }

  async checkLatePayments() {
    try {
      const today = new Date();
      const contrats = await this.store.dispatch("contrats/getAll", {
        status: "ACTIF",
      });

      const notifications = [];

      for (const contrat of contrats) {
        const lastPaiement = await this.store.dispatch(
          "paiements/getLastPaiement",
          contrat.id
        );

        if (this.isPaymentLate(lastPaiement, today)) {
          notifications.push(this.sendLatePaymentReminder(contrat));
        }
      }

      await Promise.all(notifications);
      console.log(
        `✅ Vérification paiements: ${notifications.length} rappels envoyés`
      );
    } catch (error) {
      console.error("❌ Erreur vérification paiements:", error);
    }
  }

  isPaymentLate(lastPaiement, today) {
    if (!lastPaiement) return true;

    const lastPaymentDate = new Date(lastPaiement.datePaiement);
    const daysSinceLastPayment = Math.ceil(
      (today - lastPaymentDate) / (1000 * 60 * 60 * 24)
    );

    return daysSinceLastPayment > 35; // 1 mois + 5 jours de grâce
  }

  async sendLatePaymentReminder(contrat) {
    // Notifier le locataire
    await this.store.dispatch("notifications/createNotification", {
      userId: contrat.locataireId,
      type: "PAIEMENT",
      title: "Rappel de paiement",
      message: `Votre loyer de ${contrat.montantLoyer} XOF est en retard`,
      data: {
        contratId: contrat.id,
        montant: contrat.montantLoyer,
      },
      priority: "URGENT",
    });

    // Notifier le propriétaire
    await this.store.dispatch("notifications/createNotification", {
      userId: contrat.proprietaireId,
      type: "PAIEMENT",
      title: "Paiement en retard",
      message: `Le paiement du contrat ${contrat.referenceContrat} est en retard`,
      data: {
        contratId: contrat.id,
        locataireNom: contrat.locataire?.nom,
      },
      priority: "HIGH",
    });
  }
}
