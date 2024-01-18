export function getDistinctCategories(data: any[]) {
  const categories = new Set();
  for (let obj of data) {
    categories.add(obj.category.trim());
    // categories.add(obj.category);
  }
  return Array.from(categories);
}
