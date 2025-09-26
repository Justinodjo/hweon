// WealthFormula.js - Implémentation de l'équation de richesse immobilière
// Richesse = (Problèmes × Urgence × Fréquence × Statut × Échelle) / Compétition

class WealthFormulaEngine {
  constructor() {
    this.coefficients = {
      problemes: 1.0,
      urgence: 1.2,
      frequence: 1.1,
      statut: 1.3,
      echelle: 1.4,
      competition: 0.8,
    };
  }

  // Analyse des problèmes immobiliers
  analyserProblemes(bienImmobilier, marche) {
    const problemes = {
      // Problèmes techniques (1-10)
      technique: this.evaluerProblemesTechniques(bienImmobilier),
      // Problèmes juridiques (1-10)
      juridique: this.evaluerProblemesJuridiques(bienImmobilier),
      // Problèmes de localisation (1-10)
      localisation: this.evaluerProblemesLocalisation(bienImmobilier),
      // Problèmes financiers (1-10)
      financier: this.evaluerProblemesFinanciers(bienImmobilier, marche),
      // Problèmes de gestion (1-10)
      gestion: this.evaluerProblemesGestion(bienImmobilier),
    };

    // Score composite des problèmes (plus de problèmes = plus d'opportunités)
    const scoreProblemes =
      Object.values(problemes).reduce((sum, score) => sum + score, 0) / 5;

    return {
      score: scoreProblemes,
      details: problemes,
      opportunites: this.identifierOpportunites(problemes),
    };
  }

  // Évaluation de l'urgence
  evaluerUrgence(bienImmobilier, contexte) {
    let scoreUrgence = 1;

    // Urgence temporelle
    if (contexte.delaiVente && contexte.delaiVente <= 30) scoreUrgence += 3;
    else if (contexte.delaiVente <= 90) scoreUrgence += 2;
    else if (contexte.delaiVente <= 180) scoreUrgence += 1;

    // Urgence financière du propriétaire
    if (contexte.situationFinanciere === "critique") scoreUrgence += 4;
    else if (contexte.situationFinanciere === "tendue") scoreUrgence += 2;

    // Urgence du marché
    if (contexte.tendanceMarche === "baisse") scoreUrgence += 2;
    else if (contexte.tendanceMarche === "stagnation") scoreUrgence += 1;

    // Urgence légale/réglementaire
    if (contexte.problemesLegaux) scoreUrgence += 3;

    return Math.min(scoreUrgence, 10);
  }

  // Analyse de la fréquence
  analyserFrequence(typeTransaction, zone, historique) {
    const frequences = {
      // Fréquence des transactions similaires
      transactionsSimilaires: this.calculerFrequenceTransactions(
        typeTransaction,
        zone
      ),
      // Fréquence des besoins clients
      besoinsClients: this.analyserBesoinsFrequents(zone, historique),
      // Fréquence des problèmes récurrents
      problemesRecurrents: this.identifierProblemesFrequents(
        zone,
        typeTransaction
      ),
      // Fréquence saisonnière
      saisonnalite: this.evaluerSaisonnalite(typeTransaction, zone),
    };

    const scoreFrequence =
      Object.values(frequences).reduce((sum, freq) => sum + freq, 0) / 4;

    return {
      score: scoreFrequence,
      details: frequences,
      patterns: this.identifierPatterns(frequences),
    };
  }

  // Évaluation du statut
  evaluerStatut(agent, bien, marche) {
    const statut = {
      // Statut professionnel de l'agent
      agentStatut: this.evaluerStatutAgent(agent),
      // Statut du bien sur le marché
      bienStatut: this.evaluerStatutBien(bien, marche),
      // Statut de l'agence/entreprise
      entrepriseStatut: this.evaluerStatutEntreprise(agent.entreprise),
      // Statut social dans la zone
      statutSocial: this.evaluerStatutSocial(agent, bien.zone),
    };

    const scoreStatut =
      Object.values(statut).reduce((sum, stat) => sum + stat, 0) / 4;

    return {
      score: scoreStatut,
      details: statut,
      leveragePoints: this.identifierLeveragePoints(statut),
    };
  }

  // Analyse de l'échelle
  analyserEchelle(operation, marche, reseau) {
    const echelles = {
      // Échelle géographique
      geographique: this.evaluerEchelleGeographique(operation.zone, marche),
      // Échelle financière
      financiere: this.evaluerEchelleFinanciere(operation.montant, marche),
      // Échelle temporelle
      temporelle: this.evaluerEchelleTemporelle(operation.duree),
      // Échelle de réseau
      reseau: this.evaluerEchelleReseau(reseau, operation),
      // Échelle d'impact
      impact: this.evaluerEchelleImpact(operation, marche),
    };

    const scoreEchelle =
      Object.values(echelles).reduce((sum, ech) => sum + ech, 0) / 5;

    return {
      score: scoreEchelle,
      details: echelles,
      opportunitesEchelle: this.identifierOpportunitesEchelle(echelles),
    };
  }

  // Analyse de la compétition
  analyserCompetition(zone, typeService, marche) {
    const competition = {
      // Densité des concurrents
      densite: this.calculerDensiteConcurrents(zone),
      // Qualité moyenne des concurrents
      qualite: this.evaluerQualiteConcurrents(zone, typeService),
      // Agressivité tarifaire
      tarifs: this.analyserTarifsConcurrents(zone, typeService),
      // Barrières à l'entrée
      barrieres: this.evaluerBarrieresEntree(zone, typeService),
      // Innovation des concurrents
      innovation: this.evaluerInnovationConcurrents(zone),
    };

    const scoreCompetition =
      Object.values(competition).reduce((sum, comp) => sum + comp, 0) / 5;

    return {
      score: Math.max(scoreCompetition, 0.1), // Éviter division par zéro
      details: competition,
      avantagesCompetitifs: this.identifierAvantagesCompetitifs(competition),
    };
  }

  // Calcul principal de la richesse
  calculerRichesse(parametres) {
    const { bienImmobilier, contexte, agent, marche, reseau, operation } =
      parametres;

    // Calcul des composants
    const problemes = this.analyserProblemes(bienImmobilier, marche);
    const urgence = this.evaluerUrgence(bienImmobilier, contexte);
    const frequence = this.analyserFrequence(
      operation.type,
      bienImmobilier.zone,
      marche.historique
    );
    const statut = this.evaluerStatut(agent, bienImmobilier, marche);
    const echelle = this.analyserEchelle(operation, marche, reseau);
    const competition = this.analyserCompetition(
      bienImmobilier.zone,
      operation.type,
      marche
    );

    // Application de la formule
    const numerateur =
      problemes.score *
      this.coefficients.problemes *
      urgence *
      this.coefficients.urgence *
      frequence.score *
      this.coefficients.frequence *
      statut.score *
      this.coefficients.statut *
      echelle.score *
      this.coefficients.echelle;

    const denominateur = competition.score * this.coefficients.competition;

    const richessePotentielle = numerateur / denominateur;

    return {
      richessePotentielle,
      scoreNumerique: Math.round(richessePotentielle * 100) / 100,
      rang: this.determinerRang(richessePotentielle),
      composants: {
        problemes,
        urgence: { score: urgence },
        frequence,
        statut,
        echelle,
        competition,
      },
      recommandations: this.genererRecommandations({
        problemes,
        urgence,
        frequence,
        statut,
        echelle,
        competition,
      }),
      planAction: this.genererPlanAction({
        problemes,
        urgence,
        frequence,
        statut,
        echelle,
        competition,
      }),
    };
  }

  // Méthodes d'évaluation détaillées
  evaluerProblemesTechniques(bien) {
    let score = 0;
    if (!bien.etatBien || bien.etatBien === "mauvais") score += 3;
    if (bien.anneeConstruction && 2024 - bien.anneeConstruction > 30)
      score += 2;
    if (!bien.diagnostics || bien.diagnostics.length === 0) score += 2;
    if (bien.travauxNecessaires && bien.travauxNecessaires.length > 0) {
      score += Math.min(bien.travauxNecessaires.length, 3);
    }
    return Math.min(score, 10);
  }

  evaluerProblemesJuridiques(bien) {
    let score = 0;
    if (!bien.titresPropriete || bien.titresPropriete.statut !== "valide")
      score += 4;
    if (bien.contentieux && bien.contentieux.length > 0) score += 3;
    if (
      !bien.permisConstructions ||
      bien.permisConstructions.statut !== "valide"
    )
      score += 2;
    if (bien.servitudes && bien.servitudes.length > 0) score += 1;
    return Math.min(score, 10);
  }

  evaluerProblemesLocalisation(bien) {
    let score = 0;
    if (!bien.accessibilite || bien.accessibilite < 5) score += 2;
    if (!bien.commodites || bien.commodites.length < 3) score += 2;
    if (bien.nuisances && bien.nuisances.length > 0)
      score += bien.nuisances.length;
    if (!bien.transportsPublics || bien.transportsPublics.distance > 1000)
      score += 1;
    return Math.min(score, 10);
  }

  evaluerProblemesFinanciers(bien, marche) {
    let score = 0;
    const prixMarche = marche.prixMoyenZone * bien.superficie;
    const ecartPrix = Math.abs(bien.prix - prixMarche) / prixMarche;

    if (ecartPrix > 0.2) score += 3;
    if (!bien.financementPossible) score += 2;
    if (bien.charges && bien.charges > bien.prix * 0.1) score += 2;
    if (bien.dette && bien.dette > 0) score += 1;
    return Math.min(score, 10);
  }

  evaluerProblemesGestion(bien) {
    let score = 0;
    if (bien.locataires && bien.locataires.some((l) => l.retardPaiement))
      score += 3;
    if (!bien.gestionnaire || bien.gestionnaire.qualite < 5) score += 2;
    if (bien.maintenanceDifferee && bien.maintenanceDifferee.length > 0)
      score += 2;
    if (!bien.assurance || bien.assurance.statut !== "active") score += 1;
    return Math.min(score, 10);
  }

  // Méthodes d'opportunités et recommandations
  identifierOpportunites(problemes) {
    const opportunites = [];

    if (problemes.technique > 6) {
      opportunites.push({
        type: "renovation",
        potentiel: "Haut",
        description: "Opportunité de rénovation avec forte plus-value",
      });
    }

    if (problemes.juridique > 5) {
      opportunites.push({
        type: "regularisation",
        potentiel: "Moyen",
        description: "Régularisation juridique pour débloquer la vente",
      });
    }

    if (problemes.financier > 7) {
      opportunites.push({
        type: "negociation",
        potentiel: "Très Haut",
        description: "Forte marge de négociation sur le prix",
      });
    }

    return opportunites;
  }

  genererRecommandations(composants) {
    const recommandations = [];

    // Recommandations basées sur les problèmes
    if (composants.problemes.score > 7) {
      recommandations.push({
        priorite: "Haute",
        action: "Négocier une réduction de prix significative",
        impact: "Augmentation de 20-30% de la marge",
      });
    }

    // Recommandations basées sur l'urgence
    if (composants.urgence.score > 8) {
      recommandations.push({
        priorite: "Critique",
        action: "Accélérer le processus de transaction",
        impact: "Capture d'une opportunité à forte valeur",
      });
    }

    // Recommandations basées sur la compétition
    if (composants.competition.score < 3) {
      recommandations.push({
        priorite: "Haute",
        action: "Augmenter les prix/commissions",
        impact: "Maximisation des revenus",
      });
    }

    return recommandations;
  }

  genererPlanAction(composants) {
    const plan = {
      immediat: [], // 0-7 jours
      courtTerme: [], // 1-4 semaines
      moyenTerme: [], // 1-3 mois
      longTerme: [], // 3+ mois
    };

    // Actions immédiates
    if (composants.urgence.score > 8) {
      plan.immediat.push("Contacter immédiatement le propriétaire/vendeur");
      plan.immediat.push("Préparer une offre compétitive");
    }

    // Actions court terme
    if (composants.problemes.score > 6) {
      plan.courtTerme.push("Effectuer un audit technique complet");
      plan.courtTerme.push(
        "Négocier les conditions basées sur les problèmes identifiés"
      );
    }

    // Actions moyen terme
    if (composants.echelle.score > 7) {
      plan.moyenTerme.push("Développer une stratégie de scaling");
      plan.moyenTerme.push("Créer des partenariats stratégiques");
    }

    // Actions long terme
    if (composants.statut.score < 5) {
      plan.longTerme.push(
        "Investir dans l'amélioration du statut professionnel"
      );
      plan.longTerme.push("Développer la notoriété dans la zone");
    }

    return plan;
  }

  determinerRang(richesse) {
    if (richesse >= 8) return "Opportunité Exceptionnelle";
    if (richesse >= 6) return "Très Bonne Opportunité";
    if (richesse >= 4) return "Bonne Opportunité";
    if (richesse >= 2) return "Opportunité Modérée";
    return "Opportunité Faible";
  }

  // Méthodes utilitaires supplémentaires
  calculerROI(richesse, investissement) {
    return (richesse * 1000) / investissement; // ROI estimé en %
  }

  simulerScenarios(parametres) {
    const scenarioOptimiste = { ...parametres };
    const scenarioPessimiste = { ...parametres };

    // Ajustements pour scénario optimiste
    scenarioOptimiste.contexte.urgence *= 1.2;
    scenarioOptimiste.competition *= 0.8;

    // Ajustements pour scénario pessimiste
    scenarioPessimiste.contexte.urgence *= 0.8;
    scenarioPessimiste.competition *= 1.3;

    return {
      base: this.calculerRichesse(parametres),
      optimiste: this.calculerRichesse(scenarioOptimiste),
      pessimiste: this.calculerRichesse(scenarioPessimiste),
    };
  }
}

// Classe d'intégration pour Vue.js
class WealthFormulaVueIntegration {
  constructor() {
    this.engine = new WealthFormulaEngine();
  }

  // Méthode pour intégrer dans votre composant Vue
  integrerDansFormulaire(formData) {
    const parametres = this.transformerFormDataEnParametres(formData);
    return this.engine.calculerRichesse(parametres);
  }

  transformerFormDataEnParametres(form) {
    return {
      bienImmobilier: {
        ...form,
        zone: {
          departement: form.departementId,
          commune: form.communeId,
          arrondissement: form.arrondissementId,
        },
      },
      contexte: {
        delaiVente: form.delaiVente || 90,
        situationFinanciere: form.situationFinanciere || "normale",
        tendanceMarche: form.tendanceMarche || "stable",
      },
      agent: {
        experience: form.agentExperience || 5,
        reputation: form.agentReputation || 5,
        entreprise: {
          taille: form.entrepriseTaille || "moyenne",
          reputation: form.entrepriseReputation || 5,
        },
      },
      marche: {
        prixMoyenZone: form.prixMoyenZone || 100000,
        historique: form.historiqueMarche || [],
      },
      reseau: {
        taille: form.reseauTaille || "moyen",
        qualite: form.reseauQualite || 5,
      },
      operation: {
        type: form.typeOperation || "vente",
        montant: form.prix,
        duree: form.dureeEstimee || 90,
        zone: form.zone,
      },
    };
  }

  // Méthode pour Vue computed
  creerComputedPourVue() {
    return {
      analyseRichesse() {
        if (!this.form || !this.isFormValid) return null;
        return this.integrerDansFormulaire(this.form);
      },

      scoreRichesse() {
        return this.analyseRichesse?.scoreNumerique || 0;
      },

      rangOpportunite() {
        return this.analyseRichesse?.rang || "Non évaluée";
      },

      recommandationsPrioritaires() {
        return this.analyseRichesse?.recommandations?.slice(0, 3) || [];
      },
    };
  }
}

export { WealthFormulaEngine, WealthFormulaVueIntegration };
