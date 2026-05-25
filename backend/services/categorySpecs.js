import {
  inferCategory,
  getDefaultSpecsForCategory,
  getDefaultImageUrl,
  getCategoriesForTier,
  TECH_SPEC_FIELDS,
  ALL_CATEGORIES,
} from '../models/categories.js';

export function sanitizeTechnicalSpecs(category, specs) {
  const fields = TECH_SPEC_FIELDS[category] || [];
  const input = specs && typeof specs === 'object' ? specs : {};
  const out = {};

  for (const field of fields) {
    const val = input[field.key];
    if (val === undefined || val === null || val === '') continue;
    if (field.type === 'number') out[field.key] = Number(val);
    else if (field.type === 'boolean') out[field.key] = Boolean(val);
    else out[field.key] = val;
  }

  return Object.keys(out).length ? out : getDefaultSpecsForCategory(category);
}

export function resolveProductMediaAndSpecs(product) {
  const category = inferCategory(product);
  const technicalSpecs = sanitizeTechnicalSpecs(
    category,
    product.technicalSpecs || getDefaultSpecsForCategory(category)
  );
  const imageUrl =
    product.imageUrl && String(product.imageUrl).trim()
      ? String(product.imageUrl).trim()
      : getDefaultImageUrl(category);

  return { category, technicalSpecs, imageUrl };
}

export { inferCategory, getCategoriesForTier, getDefaultImageUrl, ALL_CATEGORIES };
