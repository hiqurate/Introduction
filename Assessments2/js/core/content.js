// ============================================
// HawkSight — Client content cache
// Template catalogue, methodology and question content.
// ============================================

(function (root) {
  const cache = { catalog: null, methodology: null, templates: {} };

  const Content = {
    async catalog() {
      if (!cache.catalog) cache.catalog = (await root.API.get('/api/public/catalog')).frameworks;
      return cache.catalog;
    },
    async methodology() {
      if (!cache.methodology) cache.methodology = await root.API.get('/api/public/methodology');
      return cache.methodology;
    },
    async template(frameworkId) {
      if (!cache.templates[frameworkId]) cache.templates[frameworkId] = await root.API.get(`/api/content/${encodeURIComponent(frameworkId)}`);
      return cache.templates[frameworkId];
    },
    clear() {
      cache.templates = {};
      cache.methodology = null;
    },
    frameworkName(catalog, id) {
      const f = (catalog || []).find(x => x.id === id);
      return f ? f.shortName : id;
    }
  };

  root.Content = Content;
})(window);
