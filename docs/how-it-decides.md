# Comment la décision est prise

La bibliothèque orchestre une décision bornée mais n’exécute jamais l’outil choisi. Elle n’embarque aucun identifiant fournisseur et ne remplace pas l’ensemble des fonctions de l’API Mistral.

La question et les critères exacts sont versionnés dans [`src/index.mjs`](../src/index.mjs). Les probabilités de la démonstration sont synthétiques. Calibrez les seuils de revue sur des cas français annotés et représentatifs avant tout usage opérationnel.
