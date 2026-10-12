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

---

## Conventions des composants (ajout)

### Où ranger le CSS
- Un fichier CSS par famille, dans `components/` : `forms.css`, `feedback.css`, `data-display.css`, `navigation.css`, `overlays.css`.
- `_base.css` : styles communs (police, focus visible, ombres `--ds-shadow-*`).
- Le Button garde son dossier : `components/Button/button.css`.
- `components/index.html` : page de démo. Tout nouveau composant doit y apparaître.
- Un nouveau composant va dans la famille qui lui correspond. On ne crée un fichier que pour une nouvelle famille, et on l'ajoute alors à `index.html`.

### Composants existants (miroir du fichier Figma « Token design setup »)
- **Formulaires** : Input, Textarea, Select, Checkbox, Radio, Toggle, Slider, Segmented control, Calendar + Day.
- **Feedback** : Badge, Alert, Toast, Progress, Spinner, Skeleton.
- **Données** : Card, Avatar, Divider, Chip, Accordion, Table.
- **Navigation** : Tabs, Breadcrumb, Pagination, Nav item, Stepper.
- **Overlays** : Menu, Tooltip, Modal.
- **Button** : composant à part.

### Nommage (BEM simplifié)
- Bloc : `.ds-nom` (ex. `.ds-card`).
- Élément : `.ds-nom__element` (ex. `.ds-field__label`).
- Variante : `.ds-nom--variante` (ex. `.ds-badge--success`).
- Tailles : `--sm`, `--lg`. La taille `md` est la valeur par défaut, sans classe.
- Les états passent par les attributs HTML natifs quand ils existent : `:hover`, `:focus-visible`, `:disabled`, `[aria-pressed]`, `[aria-selected]`, `[aria-current]`. Pas de classe `.is-active`.

### Noms des variables CSS
Le préfixe est `--ds-`, le nom suit Figma en kebab-case :
- `Spacing/100 (4)` → `--ds-spacing-100-4`
- `Surface/action-hover` → `--ds-surface-action-hover`
- `Font/weight/semibold` → `--ds-font-weight-semibold`
- `control-height/md` → `--ds-control-height-md`
- Vérifier un nom : le chercher dans `build/css/core.css` (Ctrl+F) avant de l'utiliser. S'il n'existe pas, ne pas l'inventer : l'ajouter dans Figma, resynchroniser (Tokens Studio puis `node build.mjs`) ou signaler le manque.

### Mapping sémantique par rôle
| Besoin | Token |
|---|---|
| Fond de page / de composant | `--ds-surface-page` / `--ds-surface-primary` |
| Fond d'action (bouton, sélection) | `--ds-surface-action` (+ `-hover`) |
| Fond de zone de contrôle (segmented, hover discret) | `--ds-surface-control` / `-control-hover` |
| Fond désactivé | `--ds-surface-disabled` |
| Fond de rail (progress, toggle, skeleton) | `--ds-surface-track` |
| Fond de statut | `--ds-surface-success` / `-warning` / `-error` / `-information` |
| Texte courant / secondaire | `--ds-text-body` / `--ds-text-secondary` |
| Texte de statut | `--ds-text-success-strong` / `-warning-strong` / `-error-strong` / `-information-strong` |
| Texte sur fond d'action | `--ds-text-on-action` |
| Bordure par défaut / forte | `--ds-border-primary` / `--ds-border-strong` |
| Focus | `--ds-border-focus`, `--ds-focus-ring-width`, `--ds-focus-ring-offset` |
| Hauteur d'un contrôle | `--ds-control-height-sm` (40) / `-md` (48) / `-lg` (56) |
| Taille d'icône | `--ds-icon-size-sm` (16) / `-md` (20) / `-lg` (24) |

### Règles à respecter pour chaque composant
1. Aucune valeur en dur (couleur, px, rayon). Uniquement `var(--ds-…)`.
2. Utiliser uniquement des tokens sémantiques, jamais primitifs. La seule exception est `Primary/*`, qui vient de `brand-*.css` pour la marque blanche.
3. Prévoir les états : default, hover, focus-visible, disabled. Ajouter error ou selected quand c'est pertinent.
4. Accessibilité : contraste AA (4.5:1 pour le texte), focus toujours visible, bon élément HTML (`button`, `input`, `table`…) plutôt qu'un `div`. Ajouter les `aria-*` nécessaires.
5. Le composant doit être identique à son homologue Figma (mêmes variantes, mêmes tailles).
6. Après chaque ajout : ouvrir `components/index.html` dans le navigateur pour vérifier le rendu.

### Écarts connus (à corriger plus tard)
- Les ombres (`Shadow/sm|md|lg`) sont des styles d'effet Figma, définis à la main dans `_base.css`.
- Le `line-height` est fixé à `1.5` dans `_base.css`, sans token.
- Pas de CSS responsive Tablet/Mobile pour l'instant. Le mode sombre n'est pas prévu.
- Le contraste du violet principal sur fond blanc est proche de 4:1 : à vérifier pour le texte.
- Composants Figma sans CSS pour l'instant : aucun. Composants Figma pas encore créés : upload de fichier, navbar, sidebar, drawer, popover, carte KPI, list item, empty state, Calendar + Day, Search field.
