import es from '../locales/es.json';
import en from '../locales/en.json';

const dictionaries = { es, en };

export const getDictionary = (lang) => {
  // Si el idioma no existe, devuelve español por defecto
  return dictionaries[lang] || dictionaries.es;
};