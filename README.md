# Jev Mistral Reflex

**Aiguille les décisions bornées vers Jev et confie les demandes ouvertes à un répondant compatible Mistral.**

[![Tests](https://github.com/gbesse/jev-mistral-reflex/actions/workflows/test.yml/badge.svg)](https://github.com/gbesse/jev-mistral-reflex/actions/workflows/test.yml) [MIT](LICENSE) · Node.js 22+ · v0.1.1 · Documentation française

Cette petite cascade permet à Jev de choisir parmi des outils ou actions déclarés. Les demandes incertaines ou ouvertes sont transmises à un répondant compatible avec l’API Mistral.

## Démarrage rapide

```sh
git clone https://github.com/gbesse/jev-mistral-reflex.git
cd jev-mistral-reflex
npm install
npm run demo
```

La démonstration utilise uniquement des données et probabilités synthétiques. Elle n’effectue aucun appel réseau et ne constitue pas une mesure de qualité de Jev.

## Utilisation de la bibliothèque

Importez les fonctions métier depuis `@gbesse/jev-mistral-reflex`. Fournissez soit `createJevClient()` depuis l’export `./jev`, soit `createFakeProvider()` pour les tests hors ligne.

Les noms de l’API JavaScript restent stables pour préserver la compatibilité avec les versions précédentes. La documentation, les exemples et les explications destinées aux utilisateurs sont en français.

## Frontière de décision

La bibliothèque orchestre une décision bornée mais n’exécute jamais l’outil choisi. Elle n’embarque aucun identifiant fournisseur et ne remplace pas l’ensemble des fonctions de l’API Mistral.

La question exacte envoyée à Jev est versionnée dans [`src/index.mjs`](src/index.mjs). Les identifiants, dates, calculs, filtres, seuils et transitions d’état restent gérés par du code ordinaire.

## Sources

- [https://docs.mistral.ai](https://docs.mistral.ai)
- [https://docs.typesafe.ai/api](https://docs.typesafe.ai/api)

Conservez l’attribution amont, les identifiants d’origine, les URL de source et les dates de récupération avec chaque enregistrement dérivé.

## Appels Jev réels

Les appels réels sont facultatifs et payants. Le client fixe le modèle `jev-1.13.0`, valide l’identité du modèle et toutes les probabilités, refuse les redirections, ne retente que les erreurs réseau et les réponses HTTP 429/529, puis bloque les requêtes dépassant une estimation prudente de 24 000 jetons.

```sh
TYPESAFE_API_KEY=... node scripts/live-smoke.mjs
```

N’envoyez jamais de secret, de donnée personnelle ni de dossier sensible non expurgé. Évaluez le comportement sur un jeu représentatif de cas français avant tout usage opérationnel.

## Validation

```sh
npm run check
npm run typecheck
npm test
npm run demo
```

La CI exécute ces vérifications sous Node.js 22 et 24.

Projet indépendant, sans affiliation avec TypeSafe AI ni avec l’administration française. Consultez la [documentation de l’API Jev](https://docs.typesafe.ai/api) et les [limites du modèle](https://docs.typesafe.ai/model-jaggedness/jev-1.13).
