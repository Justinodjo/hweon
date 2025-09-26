// store/modules/biensImmobiliers.js - Store Vuex avec analyse de richesse

import { API_URLS } from "@/config/api";
import { getToken } from "@/helpers/auth";

const state = {
    biens: [],
    currentBien: null,
    loading: false,
    error: null,
    
    // Nouvelles données pour l'analyse de richesse
    wealthAnalyses: [],
    marketData: {
        trends: [],
        averagePrices: {},
        competitionLevels: {},
        demandPatterns: []
    },
    businessIntelligence: {
        highPotentialProperties: [],
        riskAssessments: [],
        profitabilityForecasts: [],
        marketOpportunities: []
    }
};

const mutations = {
    SET_LOADING(state, loading) {
        state.loading = loading;
    },
    
    SET_ERROR(state, error) {
        state.error = error;
    },
    
    SET_BIENS(state, biens) {
        state.biens = biens;
    },
    
    ADD_BIEN(state, bien) {
        state.biens.push(bien);
    },
    
    UPDATE_BIEN(state, updatedBien) {
        const index = state.biens.findIndex(b => b.id === updatedBien.id);
        if (index !== -1) {
            state.biens.splice(index, 1, updatedBien);
        }
    },
    
    DELETE_BIEN(state, bienId) {
        state.biens = state.biens.filter(b => b.id !== bienId);
    },
    
    SET_CURRENT_BIEN(state, bien) {
        state.currentBien = bien;
    },
    
    // Nouvelles mutations pour l'analyse de richesse
    ADD_WEALTH_ANALYSIS(state, analysis) {
        state.wealthAnalyses.push(analysis);
    },
    
    UPDATE_MARKET_DATA(state, marketData) {
        state.marketData = { ...state.marketData, ...marketData };
    },
    
    SET_BUSINESS_INTELLIGENCE(state, businessIntelligence) {
        state.businessIntelligence = { ...state.businessIntelligence, ...businessIntelligence };
    },
    
    UPDATE_PROPERTY_WEALTH_SCORE(state, { propertyId, wealthScore, analysis }) {
        const property = state.biens.find(b => b.id === propertyId);
        if (property) {
            property.wealthScore = wealthScore;
            property.wealthAnalysis = analysis;
            property.lastAnalysisDate = new Date().toISOString();
        }
    }
};

const actions = {
    // Action existante pour créer un bien
    async create({ commit, dispatch }, bienData) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        try {
            const response = await fetch(API_URLS.CREATE_BIEN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(bienData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const newBien = await response.json();
            commit('ADD_BIEN', newBien);
            
            return newBien;
        } catch (error) {
            commit('SET_ERROR', error.message);
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },
    
    // Nouvelle action pour créer avec analyse de richesse
    async createWithWealthAnalysis({ commit, dispatch }, bienData) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        try {
            // Créer le bien avec l'analyse
            const response = await fetch(API_URLS.CREATE_BIEN_WITH_WEALTH, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(bienData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            const newBien = result.bien;
            const wealthAnalysis = result.analyseRichesse;
            
            // Ajouter le bien avec son analyse
            commit('ADD_BIEN', newBien);
            commit('ADD_WEALTH_ANALYSIS', {
                bienId: newBien.id,
                analysis: wealthAnalysis,
                dateAnalyse: new Date().toISOString()
            });
            
            // Mettre à jour les données de Business Intelligence
            dispatch('updateBusinessIntelligence', {
                newProperty: newBien,
                wealthAnalysis: wealthAnalysis
            });
            
            // Analyser l'impact sur le marché
            dispatch('analyzeMarketImpact', {
                property: newBien,
                analysis: wealthAnalysis
            });
            
            return result;
        } catch (error) {
            commit('SET_ERROR', error.message);
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },
    
    // Analyse de richesse pour un bien existant
    async analyzePropertyWealth({ commit, state }, { propertyId, contextData }) {
        commit('SET_LOADING', true);
        
        try {
            const response = await fetch(API_URLS.ANALYZE_WEALTH, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    propertyId,
                    contextData
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const analysis = await response.json();
            
            commit('ADD_WEALTH_ANALYSIS', {
                bienId: propertyId,
                analysis: analysis,
                dateAnalyse: new Date().toISOString()
            });
            
            commit('UPDATE_PROPERTY_WEALTH_SCORE', {
                propertyId,
                wealthScore: analysis.scoreNumerique,
                analysis: analysis
            });
            
            return analysis;
        } catch (error) {
            commit('SET_ERROR', error.message);
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },
    
    // Mise à jour du Business Intelligence
    async updateBusinessIntelligence({ commit, state }, { newProperty, wealthAnalysis }) {
        const businessIntelligence = { ...state.businessIntelligence };
        
        // Identifier les biens à haut potentiel
        if (wealthAnalysis.scoreNumerique >= 7) {
            businessIntelligence.highPotentialProperties.push({
                id: newProperty.id,
                nom: newProperty.nom,
                score: wealthAnalysis.scoreNumerique,
                potentiel: wealthAnalysis.rang,
                dateAnalyse: new Date().toISOString(),
                recommandationsPrioritaires: wealthAnalysis.recommandations?.slice(0, 3) || []
            });
        }
        
        // Évaluation des risques
        const riskLevel = this.calculateRiskLevel(wealthAnalysis);
        businessIntelligence.riskAssessments.push({
            propertyId: newProperty.id,
            riskLevel: riskLevel,
            factors: this.extractRiskFactors(wealthAnalysis),
            mitigation: this.generateMitigationStrategies(wealthAnalysis)
        });
        
        // Prévisions de rentabilité
        const profitabilityForecast = this.calculateProfitabilityForecast(newProperty, wealthAnalysis);
        businessIntelligence.profitabilityForecasts.push(profitabilityForecast);
        
        commit('SET_BUSINESS_INTELLIGENCE', businessIntelligence);
    },
    
    // Analyse de l'impact sur le marché
    async analyzeMarketImpact({ commit, state }, { property, analysis }) {
        const marketData = { ...state.marketData };
        
        // Mise à jour des tendances de prix
        const zone = `${property.departement?.libelle || property.departement?.id}_${property.commune?.libelle || property.commune?.id}`;
        
        if (!marketData.averagePrices[zone]) {
            marketData.averagePrices[zone] = [];
        }
        
        marketData.averagePrices[zone].push({
            prix: property.prix,
            superficie: property.superficie,
            prixM2: property.prix / property.superficie,
            type: property.typeBiensImmobiliere.nomTypeBiensImmo || property.typeBiensImmobiliere.id,
            date: new Date().toISOString(),
            wealthScore: analysis.scoreNumerique
        });
        
        // Analyse de la compétition
        const competitionScore = analysis.composants.competition.score;
        marketData.competitionLevels[zone] = {
            niveau: this.categorizeCompetitionLevel(competitionScore),
            score: competitionScore,
            opportunites: analysis.composants.competition.avantagesCompetitifs || [],
            lastUpdate: new Date().toISOString()
        };
        
        // Patterns de demande
        const demandPattern = {
            zone: zone,
            typeProperty: property.typeBiensImmobiliere.nomTypeBiensImmo,
            frequence: analysis.composants.frequence.score,
            urgence: analysis.composants.urgence.score,
            saisonnalite: analysis.composants.frequence.details?.saisonnalite || 'stable',
            date: new Date().toISOString()
        };
        
        marketData.demandPatterns.push(demandPattern);
        
        commit('UPDATE_MARKET_DATA', marketData);
    },
    
    // Génération de recommandations stratégiques
    async generateStrategicRecommendations({ state }, { timeframe = '3months' }) {
        const recommendations = {
            immediate: [],
            shortTerm: [],
            mediumTerm: [],
            longTerm: []
        };
        
        // Analyse des biens à haut potentiel
        const highPotentialProperties = state.businessIntelligence.highPotentialProperties
            .sort((a, b) => b.score - a.score)
            .slice(0,)