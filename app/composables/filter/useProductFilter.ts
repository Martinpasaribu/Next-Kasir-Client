export const useProductFilter = () => {
  const search = ref('');
  const sortBy = ref('default');
  const viewMode = ref<'grid' | 'list'>('grid');
  const activeTab = ref<'all' | 'categories' | 'out-of-stock'>('all');

  const filterAndSort = (products: any[]) => {
    let list = [...products];

    // Filter Tab
    if (activeTab.value === 'out-of-stock') {
      list = list.filter(p => p.stock <= 0);
    }

    // Filter Search
    if (search.value) {
      const s = search.value.toLowerCase();
      list = list.filter(p => p.name?.toLowerCase().includes(s) || p.sku?.toLowerCase().includes(s));
    }

    // Sort
    if (sortBy.value === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy.value === 'name-desc') list.sort((a, b) => b.name.localeCompare(a.name));
    if (sortBy.value === 'price-low') list.sort((a, b) => a.price_sell - b.price_sell);
    if (sortBy.value === 'price-high') list.sort((a, b) => b.price_sell - a.price_sell);

    return list;
  };

  return { search, sortBy, viewMode, activeTab, filterAndSort };
};