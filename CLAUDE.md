# Règles du design system (marque blanche)

Ce fichier est lu par l'IA avant toute création ou modification de composant. Il est prioritaire sur toute habitude de codage.

## Architecture
- `token.json` : source de vérité, exportée de Figma via Tokens Studio. Ne jamais l'éditer à la main.
- `node build.mjs` génère `build/css/core.css` (tokens du cœur) et `build/css/brand-*.css` (une marque = un fichier). Ces fichiers sont générés : ne jamais les modifier.
- Le cœur ne contient aucune couleur de marque : il pointe vers elle via `var(--ds-primary-...)`.

## Règle d'or
1. Un composant n'utilise que les tokens de `core.css`, par famille : `--ds-text-*`, `--ds-surface-*`, `--ds-border-*`, `--ds-icon-*`, `--ds-widths-*` (épaisseurs de bordure), `--ds-radius-*`, `--ds-spacing-*`, `--ds-font-*`, `--ds-heading-*`, `--ds-paragraph-*`.
2. Interdits : valeur en dur (hex, px, rem, ombre) et couleur primitive utilisée directement (`--ds-neutral-*`, `--ds-error-*`, `--ds-success-*`, `--ds-warning-*`, `--ds-information-*`, `--ds-base-*`, `--ds-primary-*`). Seuls les tokens sémantiques (text, surface, border, icon) portent les couleurs.
3. Exception : les espacements (`--ds-spacing-*`) s'utilisent directement, car il n'existe pas encore de couche sémantique pour eux.
4. Les noms exacts sont dans `core.css`. Ne jamais en inventer. Si un token nécessaire n'existe pas, s'arrêter et le signaler au lieu de contourner.

## Marque blanche
- Changer de marque = remplacer le fichier `brand-*.css`. Ne jamais modifier un composant pour une marque.
- Une nouvelle marque fournit toute la famille `--ds-primary-*` (mêmes noms que la marque existante).
- Après chaque marque, vérifier les contrastes : `text-on-action` sur `surface-action` ≥ 4,5:1 ; `text-action` sur `surface-page` ≥ 4,5:1 ; `border-action` sur `surface-page` ≥ 3:1. En cas d'échec, ajuster la marque, jamais le composant.

## États obligatoires (composants interactifs)
- Défaut, survol (tokens `*-action-hover`), focus clavier visible (`--ds-border-focus`), actif, désactivé (`surface-disabled`, `text-on-disabled`, `border-disabled`).
- Ajouter chargement et erreur quand c'est pertinent (`*-error`).

## Accessibilité
- Contraste AA : 4,5:1 pour le texte, 3:1 pour les éléments d'interface.
- Cible tactile ≥ 44 px, focus toujours visible, HTML sémantique (`button`, `label`, `input`).
- Ne jamais porter une information par la couleur seule.

## Structure d'un composant
- Dossier `components/NomDuComposant/` avec `nom.css` et `index.html` (page de démo montrant toutes les variantes et tous les états).
- Classes `ds-nom` et modificateurs `ds-nom--variante`.
- Charger `core.css` puis le `brand-*.css` dans la page de démo.

## Tokens manquants (ne pas contourner : le signaler)
- Graisses de police, ombres, bordure « forte » pour les champs (`border-primary` est trop pâle), tokens Tablet et Mobile.

## À chaque livraison
Fournir : le CSS, la page de démo, la liste des tokens utilisés et le résultat de la vérification des contrastes.