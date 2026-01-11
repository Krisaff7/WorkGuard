# WorkGuard 🛡️

**WorkGuard** est une solution mobile moderne développée avec **React Native** et **Expo**, conçue pour offrir un suivi rigoureux et automatisé du temps de travail annuel. L'application est optimisée pour la gestion des plafonds d'heures (quota de 964h) avec une interface premium et fluide.

---

## ✨ Fonctionnalités Avancées

### 📊 Tableau de Bord Intelligent
- **Compteur Dynamique** : Visualisation en temps réel des heures effectuées sur le mois en cours.
- **Barre de Progression Annuelle** : Suivi graphique de votre avancement vers la limite des 964 heures.
- **Calcul Automatisé** : Estimation instantanée des heures restantes pour l'année civile.

### 📅 Gestion du Temps
- **Ajout Rapide "Aujourd'hui"** : Enregistrez une journée standard (12h) en une seule pression.
- **Ajout Manuel & Rétroactif** : Formulaire dédié pour ajouter des heures à des dates passées avec un sélecteur de date intégré.
- **Historique par Accordéon** : Vos entrées sont automatiquement groupées par mois. Chaque mois peut être déplié pour voir le détail ou réduit pour plus de clarté.

### 🛡️ Robustesse & Design
- **Base de Données Locale** : Utilisation de **SQLite** via `expo-sqlite` pour une persistance des données ultra-rapide et sécurisée, même sans connexion internet.
- **Design System** : Interface épurée avec un thème bleu professionnel, des icônes intuitives (Ionicons) et une police moderne.
- **Animations Fluides** : Utilisation de `LayoutAnimation` pour des transitions douces lors de la consultation de l'historique.

---

## 🛠️ Architecture Technique

- **Frontend** : React Native (SDK 54), Expo Router (Navigation basée sur les fichiers).
- **Stockage** : SQLite (Singleton pattern pour la gestion des connexions).
- **Stylisation** : StyleSheet de React Native avec un système de constantes de couleurs centralisé.
- **Assets** : Icônes adaptatives et splash screen générés sur mesure.

---

## 🚀 Installation & Déploiement

### 📦 Installation Locale

1. **Prérequis** :
   - Node.js LTS.
   - Mobile avec l'application **Expo Go** (disponible sur Play Store / App Store).

2. **Configuration** :
   ```bash
   # Cloner le dépôt
   git clone <url-du-depot>
   cd WorkGuard/workguard

   # Installer les dépendances
   npm install
   ```

3. **Lancement** :
   ```bash
   npx expo start
   ```

### 📱 Génération de l'APK (Production)

L'application est prête pour le déploiement via **EAS (Expo Application Services)**.

```bash
# Se connecter à Expo
npx eas login

# Lancer la génération de l'APK
npx eas build --profile preview --platform android
```
*Le profil `preview` est configuré dans `eas.json` pour générer un fichier APK directement installable.*

---

## 🔒 Confidentialité & Sécurité

Toutes vos données de travail sont stockées **localement sur votre appareil** dans une base de données SQLite privée. Aucune donnée n'est envoyée vers des serveurs externes, garantissant une confidentialité totale de votre emploi du temps.

---
*WorkGuard - Maîtrisez votre temps, sécurisez votre carrière.*
