# Jev Mistral Reflex

**Aiguille les décisions bornées vers Jev et confie les demandes ouvertes à un répondant compatible Mistral.**

[![Tests](https://github.com/gbesse/jev-mistral-reflex/actions/workflows/test.yml/badge.svg)](https://github.com/gbesse/jev-mistral-reflex/actions/workflows/test.yml) [MIT](LICENSE) · Node.js 22+ · v0.1.4 · Documentation française

Cette petite cascade permet à Jev de choisir parmi des outils ou actions déclarés. Les demandes incertaines ou ouvertes sont transmises à un répondant compatible avec l’API Mistral.

## Démarrage rapide

```sh
git clone https://github.com/gbesse/jev-mistral-reflex.git
cd jev-mistral-reflex
npm install
npm run demo
```

La démonstration utilise uniquement des données et probabilités synthétiques. Elle n’effectue aucun appel réseau et ne constitue pas une mesure de qualité de Jev.

## Exemple exécutable

Cet exemple aiguille une recherche d’entreprise vers l’outil déclaré. Il utilise un fournisseur Jev simulé : aucune clé API ni connexion réseau n’est nécessaire. L’assertion intégrée fait échouer la commande si le comportement attendu change.

Le code complet de [`examples/demo.mjs`](examples/demo.mjs) est directement copiable :

```js
// Objectif : démontrer la frontière de décision sans appel réseau.
import assert from "node:assert/strict";
import { routeReflex } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const jev = createFakeProvider(() => ({
  model: "jev-1.13.0",
  answers: {
    tool: {
      type: "choice",
      choice: "lookup_company",
      probabilities: { none: 0.02, lookup_company: 0.94, search_law: 0.04 },
      confidence: 0.94,
    },
  },
  usage: { input_tokens: 45, output_tokens: 0 },
}));
const mistral = { respond: async ({ input }) => "brouillon : " + input };
const resultat = await routeReflex("Trouver l’entreprise 552100554", {
  jev,
  mistral,
  tools: [
    {
      name: "lookup_company",
      description: "Rechercher une entreprise française par SIREN",
    },
    { name: "search_law", description: "Rechercher dans le droit français" },
  ],
});
assert.equal(resultat.tool, "lookup_company");
console.log(JSON.stringify(resultat, null, 2));
```

Lancez-le avec :

```sh
npm run demo:principal
```

Résultat à repérer : `tool: lookup_company`.

### Cas limite à tester

Une confiance Jev insuffisante déclenche explicitement le repli Mistral. Le code se trouve dans [`examples/cas-limite.mjs`](examples/cas-limite.mjs).

```sh
npm run demo:limite
```

Résultat à repérer : `path: mistral · reason: low_confidence`. La commande `npm run demo` exécute les deux exemples.

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

## Parcours comparatif

`npm run demo:parcours` produit un rapport JSON partageable pour **jev-mistral-reflex** : le scénario principal et la frontière déterministe. Chaque scénario garde sa sortie propre et échoue si son assertion ne passe plus. Les données et probabilités sont synthétiques ; aucun appel Jev n’est effectué.

Cette vue permet de comparer rapidement les chemins de décision et de choisir quel exemple adapter à vos propres données sourcées.

## Validation

```sh
npm run check
npm run typecheck
npm test
npm run demo
```

La CI exécute ces vérifications sous Node.js 22 et 24.

Projet indépendant, sans affiliation avec TypeSafe AI ni avec l’administration française. Consultez la [documentation de l’API Jev](https://docs.typesafe.ai/api) et les [limites du modèle](https://docs.typesafe.ai/model-jaggedness/jev-1.13).
