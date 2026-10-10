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

const sd = new StyleDictionary({
  tokens,
  preprocessors: ['tokens-studio'],
  platforms: {
    css: {
      transformGroup: 'tokens-studio',
      prefix: 'ds',
      buildPath: 'build/css/',
      files: [
        {
          // Fichier de la marque : uniquement la famille Primary
          destination: 'brand-marque-a.css',
          format: 'css/variables',
          filter: (token) => token.path[0] === 'Primary'
        },
        {
          // Tout le reste, avec des liens vers la marque
          destination: 'core.css',
          format: 'css/variables',
          filter: (token) => token.path[0] !== 'Primary',
          options: { outputReferences: true }
        }
      ]
    }
  }
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();