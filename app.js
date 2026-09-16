/* =========================================================
   Viruj Pharma – Fosravuconazole DOE Optimizer
   app.js – All stage data + interactivity
   ========================================================= */

// =========================================================
// STAGE DATA – Key parameters, DOE design, experiments
// =========================================================
const STAGES = [
  {
    id: 1,
    num: '01',
    name: 'Nitrile Intermediate',
    reaction: '12 + LiHMDS + Acetone Cyanohydrin → Triazole Nitrile (13)',
    color: '#6366f1',
    description: 'Synthesis of (2S,3R)-nitrile from ketimine using LiHMDS base in THF. Key challenges: maintaining low temperature for enantioselectivity, controlling pH during neutralization, and crystallization temperature for yield.',
    params: [
      { name: 'Reaction Temperature (Reflux)', low: 60, high: 70, baseline: 65, unit: '°C', importance: 90 },
      { name: 'LiHMDS Equivalents', low: 1.9, high: 2.2, baseline: 2.03, unit: 'equiv', importance: 85 },
      { name: 'Reaction Time', low: 10, high: 14, baseline: 12, unit: 'h', importance: 70 },
      { name: 'Neutralisation pH', low: 8.5, high: 10.5, baseline: 9.5, unit: 'pH', importance: 80 },
      { name: 'Crystallisation Temperature', low: -15, high: -8, baseline: -11, unit: '°C', importance: 95 },
      { name: 'Crystallisation Hold Time', low: 12, high: 18, baseline: 15, unit: 'h', importance: 65 },
    ],
    responses: [
      { name: 'Yield', goal: 'Maximize', target: '≥ 90%', type: 'max' },
      { name: 'HPLC Purity', goal: 'Maximize', target: '≥ 99.5%', type: 'max' },
      { name: 'Residual 12 Impurity', goal: 'Minimize', target: '≤ 0.2%', type: 'min' },
      { name: 'ee (Enantio excess)', goal: 'Maximize', target: '≥ 99%', type: 'max' },
    ],
    phases: {
      phase1: {
        doeType: 'FF',
        runs: 12,
        doe: {
          type: 'Fractional Factorial (2⁶⁻²)',
          resolution: 'Resolution IV',
          totalRuns: 12,
          factorialRuns: 8,
          centerPoints: 4,
          detail: 'A 2⁶⁻² fractional factorial design (Resolution IV) screens all 6 parameters in just 16 runs with 4 center points. Center points estimate curvature and experimental error.',
        },
        columns: ['Run', 'Type', 'Temp (°C)', 'LiHMDS (eq)', 'Time (h)', 'pH', 'Cryst T (°C)', 'Hold (h)', 'Pred. Yield', 'Pred. Purity', 'Confidence'],
        experiments: [
          { run: 1, type: 'Factorial', temp: -60, lihm: -1.9, time: -10, pH: -8.5, crys: -15, hold: -12, predYield: '83%', predPurity: '99.2%', confidence: 'med' },
          { run: 2, type: 'Factorial', temp: 70, lihm: -1.9, time: -10, pH: 10.5, crys: -8, hold: 18, predYield: '87%', predPurity: '99.4%', confidence: 'med' },
          { run: 3, type: 'Factorial', temp: -60, lihm: 2.2, time: -10, pH: 10.5, crys: -8, hold: -12, predYield: '88%', predPurity: '99.6%', confidence: 'high' },
          { run: 4, type: 'Factorial', temp: 70, lihm: 2.2, time: -10, pH: -8.5, crys: -15, hold: 18, predYield: '91%', predPurity: '99.7%', confidence: 'high' },
          { run: 5, type: 'Factorial', temp: -60, lihm: -1.9, time: 14, pH: 10.5, crys: -15, hold: 18, predYield: '85%', predPurity: '99.3%', confidence: 'med' },
          { run: 6, type: 'Factorial', temp: 70, lihm: -1.9, time: 14, pH: -8.5, crys: -8, hold: -12, predYield: '86%', predPurity: '99.5%', confidence: 'high' },
          { run: 7, type: 'Factorial', temp: -60, lihm: 2.2, time: 14, pH: -8.5, crys: -8, hold: 18, predYield: '89%', predPurity: '99.7%', confidence: 'high' },
          { run: 8, type: 'Factorial', temp: 70, lihm: 2.2, time: 14, pH: 10.5, crys: -15, hold: -12, predYield: '92%', predPurity: '99.9%', confidence: 'high' },
          { run: 9, type: 'Center', temp: 65, lihm: 2.03, time: 12, pH: 9.5, crys: -11, hold: 15, predYield: '90%', predPurity: '99.6%', confidence: 'high' },
          { run: 10, type: 'Center', temp: 65, lihm: 2.03, time: 12, pH: 9.5, crys: -11, hold: 15, predYield: '90%', predPurity: '99.6%', confidence: 'high' },
          { run: 11, type: 'Center', temp: 65, lihm: 2.03, time: 12, pH: 9.5, crys: -11, hold: 15, predYield: '91%', predPurity: '99.7%', confidence: 'high' },
          { run: 12, type: 'Center', temp: 65, lihm: 2.03, time: 12, pH: 9.5, crys: -11, hold: 15, predYield: '90%', predPurity: '99.6%', confidence: 'high' }
        ],
        insights: [
          { type: 'critical', text: '<span class="insight-emphasis">Crystallisation temperature</span> is the most critical factor. Holding at exactly <span class="insight-emphasis">−11°C for 15 h</span> drives yield from 85% to 90%+.' },
          { type: 'monitor', text: '<span class="insight-emphasis">Reaction hold time</span> (12–14 h) has minimal marginal effect after 12 h.' }
        ]
      },
      phase2: {
        doeType: 'CCD',
        runs: 20,
        doe: {
          type: 'Central Composite Design (CCD)',
          resolution: 'RSM – Full Quadratic Model',
          totalRuns: 20,
          factorialRuns: 10,
          centerPoints: 5,
          detail: 'A CCD with 20 runs targeting the top 4 critical factors identified from Phase 1 screening. Fits a full quadratic response surface to find the optimal operating window.'
        },
        columns: ['Run', 'Type', 'Temp (°C)', 'LiHMDS (eq)', 'pH', 'Cryst T (°C)', 'Pred. Yield', 'Pred. Purity', 'Confidence'],
        experiments: Array.from({length: 20}).map((_, i) => ({
          run: i + 1, 
          type: i < 10 ? 'Factorial' : i < 15 ? 'Axial' : 'Center',
          temp: 65 + (i%3 - 1)*5,
          lihm: 2.03 + (i%2 === 0 ? 0.1 : -0.1),
          pH: 9.5 + (i%4 - 1.5),
          crys: -11 + (i%2 === 0 ? 3 : -3),
          predYield: (88 + (i%5)).toString() + '%',
          predPurity: (99.0 + (i%7)*0.1).toFixed(1) + '%',
          confidence: i > 15 ? 'high' : 'med'
        })),
        insights: [
          { type: 'optimize', text: '<span class="insight-emphasis">Neutralisation pH</span> must stay 9–10. Target pH 9.5 ± 0.3 for optimal yield and purity trade-off.' },
          { type: 'critical', text: '<span class="insight-emphasis">LiHMDS equivalents</span> strongly affect purity. Using 2.10–2.15 equiv avoids under-reaction without generating the bis-alkylation side-product impurity.' }
        ]
      }
    }
  },
  {
    id: 2,
    num: '02',
    name: 'Thioamide Hydrosulfate',
    reaction: 'Nitrile (13) + Diethyl dithiophosphate → Thioamide Hydrosulfate (15)',
    color: '#06b6d4',
    description: 'Conversion of nitrile to thioamide using diethyl dithiophosphate. H₂S evolution requires careful control.',
    params: [
      { name: 'Dithiophosphate Equivalents', low: 2.8, high: 3.2, baseline: 3.0, unit: 'equiv', importance: 90 },
      { name: 'Reaction Temperature', low: 73, high: 82, baseline: 77.5, unit: '°C', importance: 85 },
      { name: 'Reaction Time', low: 6, high: 9, baseline: 7.5, unit: 'h', importance: 70 },
      { name: 'Sulfuric Acid (equiv)', low: 0.9, high: 1.05, baseline: 0.99, unit: 'equiv', importance: 80 },
      { name: 'Concentration (vacuum)', low: 80, high: 95, baseline: 87, unit: 'L volume', importance: 75 },
      { name: 'MTBE Addition Temp', low: 22, high: 30, baseline: 26, unit: '°C', importance: 65 },
    ],
    responses: [
      { name: 'Yield', goal: 'Maximize', target: '≥ 90%', type: 'max' },
      { name: 'HPLC Purity', goal: 'Maximize', target: '≥ 99.8%', type: 'max' },
    ],
    phases: {
      phase1: {
        doeType: 'FF',
        runs: 12,
        doe: {
          type: 'Fractional Factorial (2⁶⁻²)',
          resolution: 'Resolution IV',
          totalRuns: 12,
          factorialRuns: 8,
          centerPoints: 4,
          detail: 'A 2⁶⁻² Resolution IV design with 8 factorial + 4 center runs. Identifies which process parameters significantly impact yield.'
        },
        columns: ['Run', 'Type', 'DTE (equiv)', 'Temp (°C)', 'Time (h)', 'H₂SO₄ (eq)', 'Vol (L)', 'MTBE T (°C)', 'Pred. Yield', 'Pred. Purity', 'Confidence'],
        experiments: [
          { run: 1, type: 'Factorial', dte: 2.8, temp: 73, time: 6, acid: 0.9, vol: 80, mtbe: 22, predYield: '86%', predPurity: '99.6%', confidence: 'med' },
          { run: 2, type: 'Factorial', dte: 3.2, temp: 73, time: 6, acid: 1.05, vol: 95, mtbe: 30, predYield: '90%', predPurity: '99.8%', confidence: 'high' },
          { run: 3, type: 'Factorial', dte: 2.8, temp: 82, time: 6, acid: 1.05, vol: 95, mtbe: 22, predYield: '89%', predPurity: '99.7%', confidence: 'high' },
          { run: 4, type: 'Factorial', dte: 3.2, temp: 82, time: 6, acid: 0.9, vol: 80, mtbe: 30, predYield: '91%', predPurity: '99.9%', confidence: 'high' },
          { run: 5, type: 'Factorial', dte: 2.8, temp: 73, time: 9, acid: 1.05, vol: 80, mtbe: 30, predYield: '88%', predPurity: '99.7%', confidence: 'med' },
          { run: 6, type: 'Factorial', dte: 3.2, temp: 73, time: 9, acid: 0.9, vol: 95, mtbe: 22, predYield: '89%', predPurity: '99.8%', confidence: 'high' },
          { run: 7, type: 'Factorial', dte: 2.8, temp: 82, time: 9, acid: 0.9, vol: 95, mtbe: 30, predYield: '90%', predPurity: '99.8%', confidence: 'high' },
          { run: 8, type: 'Factorial', dte: 3.2, temp: 82, time: 9, acid: 1.05, vol: 80, mtbe: 22, predYield: '93%', predPurity: '99.9%', confidence: 'high' },
          { run: 9, type: 'Center', dte: 3.0, temp: 77.5, time: 7.5, acid: 0.99, vol: 87, mtbe: 26, predYield: '91%', predPurity: '99.9%', confidence: 'high' },
          { run: 10, type: 'Center', dte: 3.0, temp: 77.5, time: 7.5, acid: 0.99, vol: 87, mtbe: 26, predYield: '92%', predPurity: '99.9%', confidence: 'high' },
          { run: 11, type: 'Center', dte: 3.0, temp: 77.5, time: 7.5, acid: 0.99, vol: 87, mtbe: 26, predYield: '91%', predPurity: '99.9%', confidence: 'high' },
          { run: 12, type: 'Center', dte: 3.0, temp: 77.5, time: 7.5, acid: 0.99, vol: 87, mtbe: 26, predYield: '91%', predPurity: '99.9%', confidence: 'high' }
        ],
        insights: [
          { type: 'critical', text: '<span class="insight-emphasis">Safety critical:</span> H₂S evolution peaks between 75–82°C.' },
          { type: 'monitor', text: '<span class="insight-emphasis">MTBE temperature</span> during anti-solvent addition affects crystal form.' }
        ]
      },
      phase2: {
        doeType: 'CCD',
        runs: 20,
        doe: {
          type: 'Central Composite Design (CCD)',
          resolution: 'RSM – Full Quadratic Model',
          totalRuns: 20,
          factorialRuns: 10,
          centerPoints: 5,
          detail: 'Optimization of Dithiophosphate equivalents, Reaction Temperature, and Sulfuric Acid via full quadratic surface.'
        },
        columns: ['Run', 'Type', 'DTE (equiv)', 'Temp (°C)', 'H₂SO₄ (eq)', 'Pred. Yield', 'Pred. Purity', 'Confidence'],
        experiments: Array.from({length: 20}).map((_, i) => ({
          run: i + 1, type: i < 10 ? 'Factorial' : i < 15 ? 'Axial' : 'Center',
          dte: 3.0 + (i%3 - 1)*0.2, temp: 77.5 + (i%2 === 0 ? 4.5 : -4.5), acid: 0.99 + (i%2 === 0 ? 0.05 : -0.05),
          predYield: (89 + (i%4)).toString() + '%', predPurity: (99.5 + (i%5)*0.1).toFixed(1) + '%', confidence: 'high'
        })),
        insights: [
          { type: 'optimize', text: '<span class="insight-emphasis">H₂SO₄ equivalents</span> control salt stoichiometry and LOD. Target 0.99 ± 0.03 equiv.' },
          { type: 'critical', text: '<span class="insight-emphasis">Dithiophosphate loading</span> of 3.0 equiv is optimal.' }
        ]
      }
    }
  },
  {
    id: 3,
    num: '03',
    name: 'Thiazole-Benzonitrile',
    reaction: 'Thioamide (15) + 2-Bromo-4′-cyanoacetophenone → Thiazole (16)',
    color: '#8b5cf6',
    description: 'Hantzsch thiazole synthesis by condensation of thioamide with α-bromo ketone in 95% ethanol.',
    params: [
      { name: 'α-Bromo Ketone (equiv)', low: 0.98, high: 1.08, baseline: 1.03, unit: 'equiv', importance: 90 },
      { name: 'Reaction Temperature', low: 58, high: 70, baseline: 65, unit: '°C', importance: 85 },
      { name: 'Reaction Time', low: 1.5, high: 2.5, baseline: 2.0, unit: 'h', importance: 65 },
      { name: 'Triethylamine (equiv)', low: 2.4, high: 2.8, baseline: 2.56, unit: 'equiv', importance: 80 },
      { name: 'pH Target', low: 3.0, high: 4.5, baseline: 3.75, unit: 'pH', importance: 85 },
      { name: 'Crystallisation Temperature', low: 18, high: 25, baseline: 20, unit: '°C', importance: 80 },
    ],
    responses: [
      { name: 'Yield', goal: 'Maximize', target: '≥ 85%', type: 'max' },
      { name: 'HPLC Purity', goal: 'Maximize', target: '≥ 99.5%', type: 'max' },
    ],
    phases: {
      phase1: {
        doeType: 'FF',
        runs: 12,
        doe: {
          type: 'Fractional Factorial (2⁶⁻²)',
          resolution: 'Resolution IV',
          totalRuns: 12,
          factorialRuns: 8,
          centerPoints: 4,
          detail: 'A 2⁶⁻² Resolution IV screening design identifies the key drivers of yield and residual impurity in the Hantzsch thiazole formation.'
        },
        columns: ['Run', 'Type', 'ArBrKetone (eq)', 'Temp (°C)', 'Time (h)', 'TEA (eq)', 'pH', 'Cryst T (°C)', 'Pred. Yield', 'Pred. Purity', 'Confidence'],
        experiments: [
          { run: 1, type: 'Factorial', bromo: 0.98, temp: 58, time: 1.5, tea: 2.4, pH: 3.0, crys: 18, predYield: '79%', predPurity: '99.1%', confidence: 'low' },
          { run: 2, type: 'Factorial', bromo: 1.08, temp: 58, time: 1.5, tea: 2.8, pH: 4.5, crys: 25, predYield: '87%', predPurity: '99.5%', confidence: 'high' },
          { run: 3, type: 'Factorial', bromo: 0.98, temp: 70, time: 1.5, tea: 2.8, pH: 4.5, crys: 18, predYield: '85%', predPurity: '99.5%', confidence: 'high' },
          { run: 4, type: 'Factorial', bromo: 1.08, temp: 70, time: 1.5, tea: 2.4, pH: 3.0, crys: 25, predYield: '84%', predPurity: '99.4%', confidence: 'med' },
          { run: 5, type: 'Factorial', bromo: 0.98, temp: 58, time: 2.5, tea: 2.8, pH: 3.0, crys: 25, predYield: '82%', predPurity: '99.3%', confidence: 'med' },
          { run: 6, type: 'Factorial', bromo: 1.08, temp: 58, time: 2.5, tea: 2.4, pH: 4.5, crys: 18, predYield: '86%', predPurity: '99.6%', confidence: 'high' },
          { run: 7, type: 'Factorial', bromo: 0.98, temp: 70, time: 2.5, tea: 2.4, pH: 4.5, crys: 25, predYield: '83%', predPurity: '99.4%', confidence: 'med' },
          { run: 8, type: 'Factorial', bromo: 1.08, temp: 70, time: 2.5, tea: 2.8, pH: 3.0, crys: 18, predYield: '88%', predPurity: '99.7%', confidence: 'high' },
          { run: 9, type: 'Center', bromo: 1.03, temp: 65, time: 2.0, tea: 2.56, pH: 3.75, crys: 20, predYield: '86%', predPurity: '99.7%', confidence: 'high' },
          { run: 10, type: 'Center', bromo: 1.03, temp: 65, time: 2.0, tea: 2.56, pH: 3.75, crys: 20, predYield: '85%', predPurity: '99.7%', confidence: 'high' },
          { run: 11, type: 'Center', bromo: 1.03, temp: 65, time: 2.0, tea: 2.56, pH: 3.75, crys: 20, predYield: '86%', predPurity: '99.6%', confidence: 'high' },
          { run: 12, type: 'Center', bromo: 1.03, temp: 65, time: 2.0, tea: 2.56, pH: 3.75, crys: 20, predYield: '85%', predPurity: '99.7%', confidence: 'high' }
        ],
        insights: [
          { type: 'critical', text: '<span class="insight-emphasis">PPE essential:</span> 2-Bromo-4′-cyanoacetophenone is a potent lachrymator.' },
          { type: 'monitor', text: '<span class="insight-emphasis">Crystallisation hold time</span> at 20°C for ≥10 h is critical for polymorphic consistency.' }
        ]
      },
      phase2: {
        doeType: 'CCD',
        runs: 20,
        doe: {
          type: 'Central Composite Design (CCD)',
          resolution: 'RSM – Full Quadratic Model',
          totalRuns: 20,
          factorialRuns: 10,
          centerPoints: 5,
          detail: 'RSM targeting ArBrKetone equivalents, Temperature, and pH Target based on their strong main effects.'
        },
        columns: ['Run', 'Type', 'ArBrKetone (eq)', 'Temp (°C)', 'pH', 'Pred. Yield', 'Pred. Purity', 'Confidence'],
        experiments: Array.from({length: 20}).map((_, i) => ({
          run: i + 1, type: i < 10 ? 'Factorial' : i < 15 ? 'Axial' : 'Center',
          bromo: 1.03 + (i%2 === 0 ? 0.05 : -0.05), temp: 65 + (i%2 === 0 ? 5 : -5), pH: 3.75 + (i%3 - 1)*0.75,
          predYield: (84 + (i%5)).toString() + '%', predPurity: (99.3 + (i%4)*0.1).toFixed(1) + '%', confidence: 'high'
        })),
        insights: [
          { type: 'critical', text: '<span class="insight-emphasis">pH window</span> is narrow: 3.5–4.0. Below pH 3, ring-opened impurity forms; above pH 4.5, TEA co-precipitates, lowering purity.' },
          { type: 'optimize', text: '<span class="insight-emphasis">Reaction temperature</span> 62–68°C is optimal.' }
        ]
      }
    }
  },
  {
    id: 4,
    num: '04',
    name: 'Phosphate Esterification',
    reaction: 'Thiazole (II) + di-tBu chloromethyl phosphate → Phosphate Prodrug (IV)',
    color: '#f59e0b',
    description: 'O-phosphorylation using NaH base in THF. Iodine activates the chloromethyl phosphate.',
    params: [
      { name: 'NaH Equivalents', low: 2.8, high: 3.2, baseline: 3.0, unit: 'equiv', importance: 95 },
      { name: 'Phosphate Reagent (equiv)', low: 1.4, high: 1.6, baseline: 1.52, unit: 'equiv', importance: 90 },
      { name: 'Iodine (equiv)', low: 0.45, high: 0.55, baseline: 0.5, unit: 'equiv', importance: 75 },
      { name: 'Reaction Temperature', low: 37, high: 45, baseline: 41, unit: '°C', importance: 85 },
      { name: 'Reaction Time', low: 3.5, high: 4.5, baseline: 4.0, unit: 'h', importance: 70 },
    ],
    responses: [
      { name: 'Yield (crude)', goal: 'Maximize', target: '≥ 95%', type: 'max' },
      { name: 'HPLC Purity (crude)', goal: 'Maximize', target: '≥ 96%', type: 'max' },
    ],
    phases: {
      phase1: {
        doeType: 'FF',
        runs: 16,
        doe: {
          type: 'Fractional Factorial (2⁵⁻¹)',
          resolution: 'Resolution V',
          totalRuns: 16,
          factorialRuns: 12,
          centerPoints: 4,
          detail: 'A 2⁵⁻¹ fractional factorial design to screen the 5 parameters before CCD optimization.'
        },
        columns: ['Run', 'Type', 'NaH (eq)', 'Phosphate (eq)', 'I₂ (eq)', 'Temp (°C)', 'Time (h)', 'Pred. Yield', 'Pred. Purity', 'Confidence'],
        experiments: Array.from({length: 16}).map((_, i) => ({
          run: i + 1, type: i < 12 ? 'Factorial' : 'Center',
          NaH: i < 12 ? (i%2 === 0 ? 2.8 : 3.2) : 3.0,
          PO: i < 12 ? (i%4 < 2 ? 1.4 : 1.6) : 1.52,
          I2: i < 12 ? (i%3 === 0 ? 0.45 : 0.55) : 0.5,
          temp: i < 12 ? (i%2 === 0 ? 37 : 45) : 41,
          time: i < 12 ? (i%4 < 2 ? 3.5 : 4.5) : 4.0,
          predYield: (88 + (i%7)).toString() + '%', predPurity: (94 + (i%4)).toString() + '%', confidence: i < 12 ? 'med' : 'high'
        })),
        insights: [
          { type: 'note', text: '<span class="insight-emphasis">Iodine acts as activator</span> (not stoichiometric reagent). Its effect on yield is modest.' }
        ]
      },
      phase2: {
        doeType: 'CCD',
        runs: 20,
        doe: {
          type: 'Central Composite Design (CCD)',
          resolution: 'RSM – Full Quadratic Model',
          totalRuns: 20,
          factorialRuns: 10,
          centerPoints: 5,
          detail: 'A CCD with 5 factors fitting a full quadratic response surface to find optimal NaH loading, phosphate equivalents, and temperature.'
        },
        columns: ['Run', 'Type', 'NaH (eq)', 'Phosphate (eq)', 'I₂ (eq)', 'Temp (°C)', 'Time (h)', 'Pred. Yield', 'Pred. Purity', 'Confidence'],
        experiments: [
          { run: 1, type: 'Factorial', NaH: 2.8, PO: 1.4, I2: 0.45, temp: 37, time: 3.5, predYield: '88%', predPurity: '94%', confidence: 'low' },
          { run: 2, type: 'Factorial', NaH: 3.2, PO: 1.4, I2: 0.45, temp: 37, time: 4.5, predYield: '92%', predPurity: '95%', confidence: 'med' },
          { run: 3, type: 'Factorial', NaH: 2.8, PO: 1.6, I2: 0.45, temp: 45, time: 3.5, predYield: '91%', predPurity: '95%', confidence: 'med' },
          { run: 4, type: 'Factorial', NaH: 3.2, PO: 1.6, I2: 0.45, temp: 45, time: 4.5, predYield: '96%', predPurity: '97%', confidence: 'high' },
          { run: 5, type: 'Factorial', NaH: 2.8, PO: 1.4, I2: 0.55, temp: 45, time: 4.5, predYield: '90%', predPurity: '95%', confidence: 'med' },
          { run: 6, type: 'Factorial', NaH: 3.2, PO: 1.4, I2: 0.55, temp: 45, time: 3.5, predYield: '93%', predPurity: '96%', confidence: 'high' },
          { run: 7, type: 'Factorial', NaH: 2.8, PO: 1.6, I2: 0.55, temp: 37, time: 4.5, predYield: '89%', predPurity: '94%', confidence: 'med' },
          { run: 8, type: 'Factorial', NaH: 3.2, PO: 1.6, I2: 0.55, temp: 37, time: 3.5, predYield: '94%', predPurity: '96%', confidence: 'high' },
          { run: 9, type: 'Factorial', NaH: 2.8, PO: 1.5, I2: 0.50, temp: 41, time: 4.0, predYield: '91%', predPurity: '95%', confidence: 'med' },
          { run: 10, type: 'Factorial', NaH: 3.2, PO: 1.5, I2: 0.50, temp: 41, time: 4.0, predYield: '95%', predPurity: '97%', confidence: 'high' },
          { run: 11, type: 'Axial', NaH: 2.6, PO: 1.5, I2: 0.50, temp: 41, time: 4.0, predYield: '85%', predPurity: '93%', confidence: 'low' },
          { run: 12, type: 'Axial', NaH: 3.4, PO: 1.5, I2: 0.50, temp: 41, time: 4.0, predYield: '93%', predPurity: '95%', confidence: 'med' },
          { run: 13, type: 'Axial', NaH: 3.0, PO: 1.3, I2: 0.50, temp: 41, time: 4.0, predYield: '88%', predPurity: '94%', confidence: 'low' },
          { run: 14, type: 'Axial', NaH: 3.0, PO: 1.7, I2: 0.50, temp: 41, time: 4.0, predYield: '91%', predPurity: '95%', confidence: 'med' },
          { run: 15, type: 'Axial', NaH: 3.0, PO: 1.5, I2: 0.50, temp: 33, time: 4.0, predYield: '82%', predPurity: '93%', confidence: 'low' },
          { run: 16, type: 'Center', NaH: 3.0, PO: 1.52, I2: 0.50, temp: 41, time: 4.0, predYield: '95%', predPurity: '97%', confidence: 'high' },
          { run: 17, type: 'Center', NaH: 3.0, PO: 1.52, I2: 0.50, temp: 41, time: 4.0, predYield: '96%', predPurity: '97%', confidence: 'high' },
          { run: 18, type: 'Center', NaH: 3.0, PO: 1.52, I2: 0.50, temp: 41, time: 4.0, predYield: '95%', predPurity: '97%', confidence: 'high' },
          { run: 19, type: 'Center', NaH: 3.0, PO: 1.52, I2: 0.50, temp: 41, time: 4.0, predYield: '96%', predPurity: '96%', confidence: 'high' },
          { run: 20, type: 'Center', NaH: 3.0, PO: 1.52, I2: 0.50, temp: 41, time: 4.0, predYield: '95%', predPurity: '97%', confidence: 'high' }
        ],
        insights: [
          { type: 'critical', text: '<span class="insight-emphasis">NaH stoichiometry</span> is the dominant factor. Using 3.0 equiv NaH avoids under-reaction and hydrolysis.' },
          { type: 'critical', text: '<span class="insight-emphasis">Temperature control at 41°C ± 2°C</span> is critical. Above 44°C, di-O-alkylation increases sharply.' },
          { type: 'optimize', text: '<span class="insight-emphasis">Phosphate reagent purity</span> (~68%) must be accounted for.' }
        ]
      }
    }
  },
  {
    id: 5,
    num: '05',
    name: 'TFA Deprotection',
    reaction: 'Phosphate tBu ester (IV) + TFA/DCM → Free Phosphoric Acid (V)',
    color: '#f43f5e',
    description: 'tert-Butyl ester deprotection with trifluoroacetic acid in DCM.',
    params: [
      { name: 'TFA Volume (mL/g)', low: 1.0, high: 1.3, baseline: 1.17, unit: 'mL/g', importance: 95 },
      { name: 'Reaction Time', low: 2.5, high: 3.5, baseline: 3.0, unit: 'h', importance: 80 },
      { name: 'Deprotection Temperature', low: -2, high: 5, baseline: 0, unit: '°C', importance: 85 },
      { name: 'NaOH (N)', low: 1.8, high: 2.2, baseline: 2.0, unit: 'N', importance: 75 },
      { name: 'Acidification pH', low: 2.0, high: 3.0, baseline: 2.5, unit: 'pH', importance: 90 },
    ],
    responses: [
      { name: 'Yield (crude acid)', goal: 'Maximize', target: '≥ 90%', type: 'max' },
      { name: 'HPLC Purity', goal: 'Maximize', target: '≥ 95%', type: 'max' },
    ],
    phases: {
      phase1: {
        doeType: 'FF',
        runs: 16,
        doe: {
          type: 'Fractional Factorial (2⁵⁻¹)',
          resolution: 'Resolution V',
          totalRuns: 16,
          factorialRuns: 12,
          centerPoints: 4,
          detail: 'Screening to isolate main effects and 2-factor interactions.'
        },
        columns: ['Run', 'Type', 'TFA (mL/g)', 'Time (h)', 'Temp (°C)', 'NaOH (N)', 'Acidify pH', 'Pred. Yield', 'Pred. Purity', 'Confidence'],
        experiments: Array.from({length: 16}).map((_, i) => ({
          run: i + 1, type: i < 12 ? 'Factorial' : 'Center',
          TFA: i < 12 ? (i%2 === 0 ? 1.0 : 1.3) : 1.17,
          time: i < 12 ? (i%4 < 2 ? 2.5 : 3.5) : 3.0,
          temp: i < 12 ? (i%3 === 0 ? -2 : 5) : 0,
          NaOH: i < 12 ? (i%2 === 0 ? 1.8 : 2.2) : 2.0,
          pH: i < 12 ? (i%4 < 2 ? 2.0 : 3.0) : 2.5,
          predYield: (82 + (i%10)).toString() + '%', predPurity: (92 + (i%5)).toString() + '%', confidence: i < 12 ? 'med' : 'high'
        })),
        insights: [
          { type: 'monitor', text: '<span class="insight-emphasis">Temperature</span> should be maintained at 0°C ± 3°C.' }
        ]
      },
      phase2: {
        doeType: 'CCD',
        runs: 20,
        doe: {
          type: 'Central Composite Design (CCD)',
          resolution: 'RSM – Full Quadratic Model',
          totalRuns: 20,
          factorialRuns: 10,
          centerPoints: 5,
          detail: 'A CCD with 5 key factors maps the response surface for TFA deprotection.'
        },
        columns: ['Run', 'Type', 'TFA (mL/g)', 'Time (h)', 'Temp (°C)', 'NaOH (N)', 'Acidify pH', 'Pred. Yield', 'Pred. Purity', 'Confidence'],
        experiments: [
          { run: 1, type: 'Factorial', TFA: 1.0, time: 2.5, temp: -2, NaOH: 1.8, pH: 2.0, predYield: '82%', predPurity: '93%', confidence: 'low' },
          { run: 2, type: 'Factorial', TFA: 1.3, time: 2.5, temp: -2, NaOH: 2.2, pH: 3.0, predYield: '91%', predPurity: '95%', confidence: 'high' },
          { run: 3, type: 'Factorial', TFA: 1.0, time: 3.5, temp: -2, NaOH: 2.2, pH: 3.0, predYield: '87%', predPurity: '94%', confidence: 'med' },
          { run: 4, type: 'Factorial', TFA: 1.3, time: 3.5, temp: -2, NaOH: 1.8, pH: 2.0, predYield: '90%', predPurity: '95%', confidence: 'high' },
          { run: 5, type: 'Factorial', TFA: 1.0, time: 2.5, temp: 5, NaOH: 2.2, pH: 2.0, predYield: '85%', predPurity: '93%', confidence: 'med' },
          { run: 6, type: 'Factorial', TFA: 1.3, time: 2.5, temp: 5, NaOH: 1.8, pH: 3.0, predYield: '93%', predPurity: '96%', confidence: 'high' },
          { run: 7, type: 'Factorial', TFA: 1.0, time: 3.5, temp: 5, NaOH: 1.8, pH: 3.0, predYield: '86%', predPurity: '94%', confidence: 'med' },
          { run: 8, type: 'Factorial', TFA: 1.3, time: 3.5, temp: 5, NaOH: 2.2, pH: 2.0, predYield: '92%', predPurity: '95%', confidence: 'high' },
          { run: 9, type: 'Factorial', TFA: 1.15, time: 3.0, temp: 2, NaOH: 2.0, pH: 2.5, predYield: '91%', predPurity: '95%', confidence: 'high' },
          { run: 10, type: 'Factorial', TFA: 1.15, time: 3.0, temp: 2, NaOH: 2.0, pH: 2.5, predYield: '90%', predPurity: '95%', confidence: 'high' },
          { run: 11, type: 'Axial', TFA: 0.85, time: 3.0, temp: 2, NaOH: 2.0, pH: 2.5, predYield: '72%', predPurity: '90%', confidence: 'low' },
          { run: 12, type: 'Axial', TFA: 1.45, time: 3.0, temp: 2, NaOH: 2.0, pH: 2.5, predYield: '91%', predPurity: '94%', confidence: 'med' },
          { run: 13, type: 'Axial', TFA: 1.15, time: 2.0, temp: 2, NaOH: 2.0, pH: 2.5, predYield: '80%', predPurity: '92%', confidence: 'low' },
          { run: 14, type: 'Axial', TFA: 1.15, time: 4.0, temp: 2, NaOH: 2.0, pH: 2.5, predYield: '89%', predPurity: '94%', confidence: 'med' },
          { run: 15, type: 'Axial', TFA: 1.15, time: 3.0, temp: -5, NaOH: 2.0, pH: 2.5, predYield: '77%', predPurity: '92%', confidence: 'low' },
          { run: 16, type: 'Center', TFA: 1.17, time: 3.0, temp: 0, NaOH: 2.0, pH: 2.5, predYield: '91%', predPurity: '95%', confidence: 'high' },
          { run: 17, type: 'Center', TFA: 1.17, time: 3.0, temp: 0, NaOH: 2.0, pH: 2.5, predYield: '90%', predPurity: '95%', confidence: 'high' },
          { run: 18, type: 'Center', TFA: 1.17, time: 3.0, temp: 0, NaOH: 2.0, pH: 2.5, predYield: '91%', predPurity: '95%', confidence: 'high' },
          { run: 19, type: 'Center', TFA: 1.17, time: 3.0, temp: 0, NaOH: 2.0, pH: 2.5, predYield: '90%', predPurity: '95%', confidence: 'high' },
          { run: 20, type: 'Center', TFA: 1.17, time: 3.0, temp: 0, NaOH: 2.0, pH: 2.5, predYield: '91%', predPurity: '95%', confidence: 'high' }
        ],
        insights: [
          { type: 'critical', text: '<span class="insight-emphasis">TFA:substrate ratio</span> is the primary driver. Optimal is 1.15–1.20 mL/g.' },
          { type: 'critical', text: '<span class="insight-emphasis">Acidification pH 2.5</span> is critical.' },
          { type: 'optimize', text: '<span class="insight-emphasis">Charcoal treatment</span> removes coloured impurities efficiently but causes 2–5% material loss.' }
        ]
      }
    }
  },
  {
    id: 6,
    num: '06',
    name: 'L-Lysine Salt Formation',
    reaction: 'Free Acid (V) + L-Lysine → Fosravuconazole L-Lysine Ethanolate',
    color: '#10b981',
    description: 'Final API salt formation: dissolution in methanol, L-lysine addition with pH control.',
    params: [
      { name: 'L-Lysine Equivalents', low: 0.95, high: 1.1, baseline: 1.02, unit: 'equiv', importance: 95 },
      { name: 'pH During Addition', low: 4.0, high: 5.8, baseline: 4.9, unit: 'pH', importance: 95 },
      { name: 'Heating Temperature', low: 55, high: 65, baseline: 60, unit: '°C', importance: 85 },
      { name: 'Hold Time (crystallisation)', low: 4.0, high: 5.0, baseline: 4.5, unit: 'h', importance: 70 },
      { name: 'Ethanol Volume (mL/g)', low: 25, high: 35, baseline: 27, unit: 'mL/g', importance: 80 },
    ],
    responses: [
      { name: 'Yield (API)', goal: 'Maximize', target: '≥ 85%', type: 'max' },
      { name: 'HPLC Purity', goal: 'Maximize', target: '≥ 99.0%', type: 'max' },
    ],
    phases: {
      phase1: {
        doeType: 'FF',
        runs: 16,
        doe: {
          type: 'Fractional Factorial (2⁵⁻¹)',
          resolution: 'Resolution V',
          totalRuns: 16,
          factorialRuns: 12,
          centerPoints: 4,
          detail: 'Screening to isolate main effects and 2-factor interactions.'
        },
        columns: ['Run', 'Type', 'L-Lys (eq)', 'pH', 'Temp (°C)', 'Hold (h)', 'EtOH (mL/g)', 'Pred. Yield', 'Pred. Purity', 'Confidence'],
        experiments: Array.from({length: 16}).map((_, i) => ({
          run: i + 1, type: i < 12 ? 'Factorial' : 'Center',
          Lys: i < 12 ? (i%2 === 0 ? 0.95 : 1.1) : 1.02,
          pH: i < 12 ? (i%4 < 2 ? 4.0 : 5.8) : 4.9,
          temp: i < 12 ? (i%3 === 0 ? 55 : 65) : 60,
          hold: i < 12 ? (i%2 === 0 ? 4.0 : 5.0) : 4.5,
          EtOH: i < 12 ? (i%4 < 2 ? 25 : 35) : 27,
          predYield: (70 + (i%20)).toString() + '%', predPurity: (97 + (i%3)).toString() + '%', confidence: i < 12 ? 'med' : 'high'
        })),
        insights: [
          { type: 'note', text: '<span class="insight-emphasis">Solvate characterisation:</span> Confirm 1:1 ethanolate stoichiometry.' }
        ]
      },
      phase2: {
        doeType: 'CCD',
        runs: 20,
        doe: {
          type: 'Central Composite Design (CCD)',
          resolution: 'RSM – Full Quadratic Model',
          totalRuns: 20,
          factorialRuns: 10,
          centerPoints: 5,
          detail: 'A CCD for the final salt formation step to map interaction on salt stoichiometry and yield.'
        },
        columns: ['Run', 'Type', 'L-Lys (eq)', 'pH', 'Temp (°C)', 'Hold (h)', 'EtOH (mL/g)', 'Pred. Yield', 'Pred. Purity', 'Confidence'],
        experiments: [
          { run: 1, type: 'Factorial', Lys: 0.95, pH: 4.0, temp: 55, hold: 4.0, EtOH: 25, predYield: '73%', predPurity: '98.8%', confidence: 'low' },
          { run: 2, type: 'Factorial', Lys: 1.1, pH: 4.0, temp: 55, hold: 5.0, EtOH: 35, predYield: '86%', predPurity: '99.1%', confidence: 'high' },
          { run: 3, type: 'Factorial', Lys: 0.95, pH: 5.8, temp: 55, hold: 5.0, EtOH: 35, predYield: '82%', predPurity: '99.0%', confidence: 'med' },
          { run: 4, type: 'Factorial', Lys: 1.1, pH: 5.8, temp: 55, hold: 4.0, EtOH: 25, predYield: '85%', predPurity: '99.2%', confidence: 'high' },
          { run: 5, type: 'Factorial', Lys: 0.95, pH: 4.0, temp: 65, hold: 5.0, EtOH: 25, predYield: '78%', predPurity: '98.9%', confidence: 'med' },
          { run: 6, type: 'Factorial', Lys: 1.1, pH: 4.0, temp: 65, hold: 4.0, EtOH: 35, predYield: '88%', predPurity: '99.3%', confidence: 'high' },
          { run: 7, type: 'Factorial', Lys: 0.95, pH: 5.8, temp: 65, hold: 4.0, EtOH: 35, predYield: '83%', predPurity: '99.0%', confidence: 'med' },
          { run: 8, type: 'Factorial', Lys: 1.1, pH: 5.8, temp: 65, hold: 5.0, EtOH: 25, predYield: '87%', predPurity: '99.2%', confidence: 'high' },
          { run: 9, type: 'Factorial', Lys: 1.02, pH: 4.9, temp: 60, hold: 4.5, EtOH: 27, predYield: '86%', predPurity: '99.2%', confidence: 'high' },
          { run: 10, type: 'Factorial', Lys: 1.02, pH: 4.9, temp: 60, hold: 4.5, EtOH: 27, predYield: '86%', predPurity: '99.3%', confidence: 'high' },
          { run: 11, type: 'Axial', Lys: 0.88, pH: 4.9, temp: 60, hold: 4.5, EtOH: 27, predYield: '63%', predPurity: '98.3%', confidence: 'low' },
          { run: 12, type: 'Axial', Lys: 1.17, pH: 4.9, temp: 60, hold: 4.5, EtOH: 27, predYield: '83%', predPurity: '98.8%', confidence: 'med' },
          { run: 13, type: 'Axial', Lys: 1.02, pH: 3.3, temp: 60, hold: 4.5, EtOH: 27, predYield: '55%', predPurity: '97.5%', confidence: 'low' },
          { run: 14, type: 'Axial', Lys: 1.02, pH: 6.5, temp: 60, hold: 4.5, EtOH: 27, predYield: '80%', predPurity: '99.0%', confidence: 'med' },
          { run: 15, type: 'Axial', Lys: 1.02, pH: 4.9, temp: 70, hold: 4.5, EtOH: 27, predYield: '81%', predPurity: '99.0%', confidence: 'med' },
          { run: 16, type: 'Center', Lys: 1.02, pH: 4.9, temp: 60, hold: 4.5, EtOH: 27, predYield: '86%', predPurity: '99.2%', confidence: 'high' },
          { run: 17, type: 'Center', Lys: 1.02, pH: 4.9, temp: 60, hold: 4.5, EtOH: 27, predYield: '87%', predPurity: '99.3%', confidence: 'high' },
          { run: 18, type: 'Center', Lys: 1.02, pH: 4.9, temp: 60, hold: 4.5, EtOH: 27, predYield: '86%', predPurity: '99.2%', confidence: 'high' },
          { run: 19, type: 'Center', Lys: 1.02, pH: 4.9, temp: 60, hold: 4.5, EtOH: 27, predYield: '86%', predPurity: '99.3%', confidence: 'high' },
          { run: 20, type: 'Center', Lys: 1.02, pH: 4.9, temp: 60, hold: 4.5, EtOH: 27, predYield: '87%', predPurity: '99.2%', confidence: 'high' }
        ],
        insights: [
          { type: 'critical', text: '<span class="insight-emphasis">pH during L-Lysine addition</span> is the most critical parameter. Target pH 4.2–5.5.' },
          { type: 'critical', text: '<span class="insight-emphasis">L-Lysine stoichiometry</span> of 1.00–1.05 equiv ensures mono-salt formation.' },
          { type: 'optimize', text: '<span class="insight-emphasis">Ethanol volume</span> determines solvate crystallisation efficiency. Optimal: 27–30 mL/g.' }
        ]
      }
    }
  }
];

// =========================================================
// STATE
// =========================================================
let activeStage = 1;
let activePhase = 'phase1';

// =========================================================
// INIT
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  buildStagesGrid();
  buildFlowYields();
  renderStage(activeStage);
  setupIntersectionObserver();
});

// =========================================================
// BUILD STAGES GRID
// =========================================================
function buildStagesGrid() {
  const grid = document.getElementById('stagesGrid');
  grid.innerHTML = STAGES.map(s => `
    <div class="stage-card${s.id === activeStage ? ' active' : ''}" 
         id="card-${s.id}" 
         onclick="selectStage(${s.id})" 
         style="--card-color: ${s.color}">
      <div class="card-num">STAGE ${s.num} · 2-Phase DOE</div>
      <div class="card-title">${s.name}</div>
      <div class="card-reaction">${s.reaction}</div>
      <div class="card-params">
        ${s.params.slice(0,4).map(p => `<span class="param-chip">${p.name.split(' ')[0]}</span>`).join('')}
        ${s.params.length > 4 ? `<span class="param-chip">+${s.params.length-4}</span>` : ''}
      </div>
      <div class="card-footer">
        <div class="card-runs"><strong>${s.phases.phase1.runs + s.phases.phase2.runs} total runs</strong></div>
        <div class="card-type">FF + RSM</div>
      </div>
    </div>
  `).join('');
}

function getDoeLabel(type) {
  const map = { FF: 'Fract. Factorial', CCD: 'RSM / CCD', PB: 'Plackett-Burman' };
  return map[type] || type;
}

function buildFlowYields() {
  const flowStages = document.querySelectorAll('.flow-stage');
  const yields = ['90.2%', '91.2%', '85.8%', '~97%', '~90%', '~87%'];
  flowStages.forEach((el, i) => {
    if (yields[i]) {
      const div = document.createElement('div');
      div.className = 'flow-yield';
      div.textContent = yields[i];
      el.appendChild(div);
    }
  });
}

// =========================================================
// SELECT STAGE & PHASE
// =========================================================
function selectStage(id) {
  activeStage = id;
  // keep activePhase as is
  
  // Update flow
  document.querySelectorAll('.flow-stage').forEach((el, i) => {
    el.classList.toggle('active', i + 1 === id);
  });
  
  // Update stage cards
  STAGES.forEach(s => {
    const card = document.getElementById('card-' + s.id);
    if (card) card.classList.toggle('active', s.id === id);
  });
  
  // Update tabs
  STAGES.forEach(s => {
    const tab = document.getElementById('tab-' + s.id);
    if (tab) tab.classList.toggle('active', s.id === id);
  });
  
  renderStage(id);
  
  // Scroll to experiments section
  const expSection = document.getElementById('experiments');
  if (expSection) {
    expSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function selectPhase(phaseId) {
  activePhase = phaseId;
  document.querySelectorAll('.phase-btn').forEach(btn => {
    btn.classList.toggle('active', btn.id === 'btn-' + phaseId);
  });
  renderStage(activeStage);
}

// =========================================================
// RENDER STAGE
// =========================================================
function renderStage(id) {
  const s = STAGES.find(st => st.id === id);
  if (!s) return;
  
  const phaseData = s.phases[activePhase];
  
  // Header
  document.getElementById('activeStageNum').textContent = s.id;
  document.getElementById('activeStageName').textContent = s.name;
  document.getElementById('activeStageDesc').textContent = s.description;
  document.getElementById('expTableSub').textContent = `${getDoeLabel(phaseData.doeType)} design runs for Stage ${s.id}: ${s.name} (${activePhase === 'phase1' ? 'Screening' : 'Optimization'})`;
  
  renderParams(s);
  renderDoeStrategy(phaseData);
  renderResponses(s);
  renderExperimentTable(phaseData);
  renderInsights(phaseData);
}

// =========================================================
// RENDER PARAMS
// =========================================================
function renderParams(s) {
  const list = document.getElementById('paramsList');
  list.innerHTML = s.params.map(p => `
    <div class="param-item">
      <div class="param-name">
        ${p.name}
        <span class="param-range">${p.low}–${p.high}</span>
      </div>
      <div class="param-bar-wrap">
        <div class="param-bar" style="width: ${p.importance}%"></div>
      </div>
      <div class="param-units">${p.unit} · Baseline: ${p.baseline} · Impact: ${p.importance}%</div>
    </div>
  `).join('');
}

// =========================================================
// RENDER DOE STRATEGY
// =========================================================
function renderDoeStrategy(phaseData) {
  const d = phaseData.doe;
  const badgeClass = phaseData.doeType === 'FF' ? 'doe-ff' : phaseData.doeType === 'CCD' ? 'doe-ccd' : 'doe-rsm';
  
  document.getElementById('doeStrategy').innerHTML = `
    <div class="doe-type-badge ${badgeClass}">
      ${phaseData.doeType === 'FF' ? '⚡' : '🎯'} ${d.type}
    </div>
    <div class="doe-detail">${d.detail}</div>
    <div class="doe-stats">
      <div class="doe-stat">
        <div class="doe-stat-label">Total Runs</div>
        <div class="doe-stat-value">${d.totalRuns}</div>
      </div>
      <div class="doe-stat">
        <div class="doe-stat-label">Factorial Runs</div>
        <div class="doe-stat-value">${d.factorialRuns}</div>
      </div>
      <div class="doe-stat">
        <div class="doe-stat-label">Center Points</div>
        <div class="doe-stat-value">${d.centerPoints}</div>
      </div>
      <div class="doe-stat">
        <div class="doe-stat-label">Resolution</div>
        <div class="doe-stat-value" style="font-size:0.75rem">${d.resolution}</div>
      </div>
    </div>
  `;
}

// =========================================================
// RENDER RESPONSES
// =========================================================
function renderResponses(s) {
  const list = document.getElementById('responsesList');
  list.innerHTML = s.responses.map(r => `
    <div class="response-item">
      <div class="resp-dot resp-${r.type}"></div>
      <div>
        <div class="resp-name">${r.name}</div>
        <div class="resp-goal">Goal: ${r.goal}</div>
        <div class="resp-target-val">Target: ${r.target}</div>
      </div>
    </div>
  `).join('');
}

// =========================================================
// RENDER EXPERIMENT TABLE
// =========================================================
function renderExperimentTable(phaseData) {
  const head = document.getElementById('expTableHead');
  const body = document.getElementById('expTableBody');
  
  // Build headers based on columns
  head.innerHTML = `<tr>${phaseData.columns.map(c => `<th>${c}</th>`).join('')}</tr>`;
  
  // Build rows
  body.innerHTML = phaseData.experiments.map((exp, idx) => {
    const values = getExpValues(phaseData, exp);
    const typeClass = exp.type === 'Factorial' ? 'run-type-factorial' : 
                      exp.type === 'Axial' ? 'run-type-axial' : 'run-type-center';
    const predClass = exp.confidence === 'high' ? 'pred-high' : 
                      exp.confidence === 'med' ? 'pred-med' : 'pred-low';
    
    return `<tr style="animation-delay: ${idx * 30}ms" class="animate-in">
      <td><span class="run-num">${exp.run}</span></td>
      <td><span class="${typeClass}">${exp.type}</span></td>
      ${values.map((v, i) => {
        const isLast2 = i >= values.length - 2;
        if (isLast2) {
          if (i === values.length - 2) return `<td><span class="predicted-badge ${predClass}">${v}</span></td>`;
          if (i === values.length - 1) return `<td><span class="predicted-badge ${predClass}">${v}</span></td>`;
        }
        return `<td class="${formatValClass(v)}">${v}</td>`;
      }).join('')}
    </tr>`;
  }).join('');
}

function getExpValues(phaseData, exp) {
  // Generic value extraction - pick numeric keys in order
  const skip = ['run', 'type', 'confidence'];
  return Object.entries(exp)
    .filter(([k]) => !skip.includes(k))
    .map(([, v]) => v);
}

function formatValClass(v) {
  if (typeof v !== 'string') return '';
  if (v.includes('%') && parseInt(v) >= 90) return 'val-center';
  if (v.includes('%') && parseInt(v) >= 85) return 'val-high';
  return '';
}

// =========================================================
// RENDER INSIGHTS
// =========================================================
function renderInsights(phaseData) {
  const grid = document.getElementById('insightsGrid');
  const typeLabels = { critical: 'Critical Factor', optimize: 'Optimization', monitor: 'Monitor', note: 'Note' };
  grid.innerHTML = phaseData.insights.map(ins => `
    <div class="insight-card">
      <div class="insight-type type-${ins.type}">
        <div class="insight-dot"></div>
        ${typeLabels[ins.type] || ins.type}
      </div>
      <div class="insight-text">${ins.text}</div>
    </div>
  `).join('');
}

// =========================================================
// NAV
// =========================================================
function setActiveNav(el) {
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// =========================================================
// EXPORT CSV
// =========================================================
function exportCSV() {
  const s = STAGES.find(st => st.id === activeStage);
  if (!s) return;
  const phaseData = s.phases[activePhase];
  
  const headers = phaseData.columns.join(',');
  const rows = phaseData.experiments.map(exp => {
    const values = getExpValues(phaseData, exp);
    return [exp.run, exp.type, ...values].join(',');
  });
  
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Fosravuconazole_Stage${activeStage}_${activePhase}_DOE.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// =========================================================
// EXPAND ALL (scroll to full view)
// =========================================================
function expandAll() {
  document.querySelector('.exp-table-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// =========================================================
// INTERSECTION OBSERVER – animate cards on scroll
// =========================================================
function setupIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.method-card, .stage-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}
