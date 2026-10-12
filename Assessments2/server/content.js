// ============================================
// HawkSight — Assessment content loader (server side)
// Loads template registry and question data, and applies published
// content overrides (question wording, guidance, retirement).
// ============================================

const path = require('path');
const { FRAMEWORKS, FRAMEWORK_ORDER } = require('../data/frameworks.js');

const DATA_EXPORTS = {
  nist: 'NIST_DATA', soc: 'SOC_DATA', retail: 'RETAIL_DATA', healthcare: 'HEALTHCARE_DATA',
  fintech: 'FINTECH_DATA', manufacturing: 'MANUFACTURING_DATA', education: 'EDUCATION_DATA',
  itservices: 'ITSERVICES_DATA', hospitality: 'HOSPITALITY_DATA', logistics: 'LOGISTICS_DATA',
  professional: 'PROFESSIONAL_DATA'
};

const rawData = {};
for (const id of Object.keys(DATA_EXPORTS)) {
  rawData[id] = require(path.join(__dirname, '..', 'data', `${id}.js`))[DATA_EXPORTS[id]];
}

function isFramework(id) {
  return Object.prototype.hasOwnProperty.call(FRAMEWORKS, id);
}

// Returns framework data with question overrides applied. Retired questions
// are removed so they no longer appear or score.
function getFrameworkData(id, questionOverrides) {
  const data = rawData[id];
  if (!data) return null;
  const overrides = questionOverrides || {};
  return {
    id: data.id,
    modules: data.modules.map(mod => ({
      ...mod,
      categories: mod.categories.map(cat => ({
        ...cat,
        questions: cat.questions
          .filter(q => !(overrides[q.id] && overrides[q.id].retired))
          .map(q => {
            const ov = overrides[q.id];
            if (!ov) return q;
            return {
              ...q,
              text: ov.text || q.text,
              context: ov.guidance || q.context
            };
          })
      }))
    }))
  };
}

function questionCount(id) {
  const data = rawData[id];
  if (!data) return 0;
  return data.modules.reduce((n, m) => n + m.categories.reduce((k, c) => k + c.questions.length, 0), 0);
}

// Questions in a Snapshot assessment: one per canonical control.
function snapshotCount(id) {
  const Scoring = require('../js/engine/scoring.js');
  return Scoring.coreQuestionIds(Scoring.buildItems(id, rawData[id], {})).size;
}

function catalog() {
  return FRAMEWORK_ORDER.map(id => {
    const fw = FRAMEWORKS[id];
    const data = rawData[id];
    return {
      id,
      type: fw.type,
      name: fw.name,
      shortName: fw.shortName,
      description: fw.description,
      audience: fw.audience,
      estimatedTime: fw.estimatedTime,
      templateVersion: fw.templateVersion,
      basis: fw.basis,
      color: fw.color,
      questionCount: questionCount(id),
      snapshotQuestionCount: snapshotCount(id),
      moduleCount: data ? data.modules.length : 0
    };
  });
}

function findQuestion(frameworkId, questionId) {
  const data = rawData[frameworkId];
  if (!data) return null;
  for (const mod of data.modules) {
    for (const cat of mod.categories) {
      const q = cat.questions.find(x => x.id === questionId);
      if (q) return { question: q, module: mod, category: cat };
    }
  }
  return null;
}

module.exports = { FRAMEWORKS, FRAMEWORK_ORDER, isFramework, getFrameworkData, questionCount, catalog, findQuestion };
