import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';
import { readFileSync } from 'node:fs';

register(StyleDictionary);

const raw = JSON.parse(readFileSync('token.json', 'utf8'));

const isObject = (v) => v && typeof v === 'object' && !Array.isArray(v);

function merge(target, source) {
  for (const key of Object.keys(source)) {
    if (isObject(source[key]) && isObject(target[key])) {
      merge(target[key], source[key]);
    } else {
      target[key] = isObject(source[key])
        ? structuredClone(source[key])
        : source[key];
    }
  }
  return target;
}

const sets = ['Primitive/Mode 1', 'Semantic/Mode 1', 'Responsive/Desktop'];
const tokens = {};
for (const name of sets) {
  if (raw[name]) merge(tokens, raw[name]);
  else console.warn(`Collection introuvable : ${name}`);
}

// Noms lisibles : --ds-text-body, --ds-spacing-100-4, --ds-radius-sm...
const toKebab = (s) =>
  String(s)
    .replace(/raduis/gi, 'radius') // rustine : faute de frappe dans Figma
    .replace(/\s*\((\d+)\)/g, '-$1') // "100 (4)" -> "100-4"
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s/_.]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();

StyleDictionary.registerTransform({
  name: 'name/ds-kebab',
  type: 'name',
  transform: (token, config) =>
    [config.prefix, ...token.path].filter(Boolean).map(toKebab).join('-'),
});

const baseTransforms = (
  StyleDictionary.hooks.transformGroups['tokens-studio'] || []
).filter((t) => t !== 'name/camel');

// Tokens de test à ne pas envoyer dans le code
const isJunk = (token) =>
  /DeviceSizeFrame|HeaderTest/i.test(
    token.path.join('').replace(/[\s_-]/g, '')
  );

const sd = new StyleDictionary({
  tokens,
  preprocessors: ['tokens-studio'],
  platforms: {
    css: {
      prefix: 'ds',
      transforms: [...baseTransforms, 'name/ds-kebab'],
      buildPath: 'build/css/',
      files: [
        {
          // Fichier de la marque : uniquement la famille Primary
          destination: 'brand-marque-a.css',
          format: 'css/variables',
          filter: (token) => token.path[0] === 'Primary'
        },
        {
          // Le reste, avec des liens vers la marque
          destination: 'core.css',
          format: 'css/variables',
          filter: (token) => token.path[0] !== 'Primary' && !isJunk(token),
          options: { outputReferences: true }
        }
      ]
    }
  }
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();