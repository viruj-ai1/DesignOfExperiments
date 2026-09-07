// src/screens/InitialOptimization.tsx
import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Analysis, Projects } from '../services/api'
import toast from 'react-hot-toast'

export default function InitialOptimization() {
  const { currentProject, setStep, setProject, setAnalysis, setOptimum, optimumResult } = useStore()
  const factors   = currentProject?.factors   || []
  const responses = currentProject?.responses || []
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function runOptimize() {
    if (!currentProject?.id) return
    setLoading(true)
    setErrorMsg(null)
    try {
      const data = await Analysis.optimize(currentProject.id)
      setOptimum(data)
      toast.success('Optimum found!')
    } catch (e: any) {
      const msg = e.response?.data?.detail || 'Optimization failed. Please complete lab runs and statistical analysis first.'
      setErrorMsg(msg)
    } finally { setLoading(false) }
  }

  async function handleLoadPreset() {
    setLoading(true)
    setErrorMsg(null)
    try {
      const proj = await Projects.loadRocuroniumPreset()
      setProject(proj)
      setOptimum(null)
      try {
        const res = await Analysis.runAll(proj.id)
        if (res && typeof res === 'object') {
          Object.entries(res).forEach(([idx, a]) => setAnalysis(+idx, a))
        }
        const opt = await Analysis.optimize(proj.id)
        if (opt) setOptimum(opt)
      } catch (err) {
        console.warn('Preset analysis load:', err)
      }
      toast.success('Loaded ROCURONIUM BROMIDE STAGE-I process dataset!')
    } catch (e: any) {
      toast.error('Failed to load preset dataset')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentProject?.id && !optimumResult) {
      runOptimize()
    }
  }, [currentProject?.id])

  const opt = optimumResult

  return (
    <div>
      <div className="page-header">
        <div className="page-header-tag">Step 13</div>
        <h1 className="page-title">Initial Optimum</h1>
        <p className="page-desc">Find the first best settings for the process.</p>
      </div>

      <div className="alert alert-info mb-2">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        Uses Derringer-Suich desirability functions for multi-response optimization via differential evolution.
      </div>

      {errorMsg && !loading && (
        <div className="alert alert-warning mb-2" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontWeight: 600 }}>⚠️ {errorMsg}</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setStep('upload-results')}>Go to Step 12: Upload Results</button>
            <button className="btn btn-secondary btn-sm" onClick={runOptimize}>↺ Retry Optimization</button>
          </div>
        </div>
      )}

      {loading && <div className="loading-overlay"><div className="spinner"/>Running desirability optimization…</div>}

      {opt && !loading && (
        <>
          {/* Desirability score */}
          <div className="card mb-2" style={{ textAlign:'center', padding:'2rem' }}>
            <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>Composite Desirability</div>
            <div style={{ fontSize:'3.5rem', fontWeight:900, background:'linear-gradient(135deg, var(--success), var(--accent))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              {(opt.composite_desirability * 100).toFixed(1)}%
            </div>
            <div style={{ fontSize:'0.82rem', color:'var(--text-secondary)', marginTop:'0.5rem' }}>
              {opt.composite_desirability > 0.8 ? '🟢 Excellent optimization' : opt.composite_desirability > 0.6 ? '🟡 Good – consider Bayesian refinement' : '🔴 Consider more runs or wider factor ranges'}
            </div>
          </div>

          {/* Optimal factor settings */}
          <div className="card mb-2">
            <div className="card-title mb-2">Optimal Process Conditions</div>
            <table className="data-table">
              <thead><tr><th>Factor</th><th>Unit</th><th>Low</th><th>High</th><th style={{ color:'var(--success)' }}>Optimal Setting</th></tr></thead>
              <tbody>
                {factors.map((f: any, i: number) => {
                  const val = opt.actual_optimum?.[i]
                  const pct = val != null ? ((val - f.low) / (f.high - f.low)) * 100 : 0
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight:700 }}>{f.name}</td>
                      <td style={{ color:'var(--text-muted)' }}>{f.unit}</td>
                      <td className="mono">{f.low}</td>
                      <td className="mono">{f.high}</td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                          <div style={{ flex:1, height:'6px', background:'var(--border)', borderRadius:'999px', overflow:'hidden' }}>
                            <div style={{ width:`${pct}%`, height:'100%', background:'linear-gradient(90deg, var(--primary), var(--success))', borderRadius:'999px' }}/>
                          </div>
                          <span className="mono" style={{ color:'var(--success)', fontWeight:700, minWidth:'70px' }}>
                            {val?.toFixed(3)} {f.unit}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Predicted responses */}
          <div className="card">
            <div className="card-title mb-2">Predicted Responses at Optimum</div>
            <div className="grid-2">
              {responses.map((r: any, i: number) => (
                <div key={i} className="stat-card">
                  <div className="stat-label">{r.name} ({r.unit})</div>
                  <div className="stat-value" style={{ color:'var(--accent)' }}>
                    {opt.predicted_responses?.[i]?.toFixed(3) || '—'}
                  </div>
                  <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', textTransform:'capitalize' }}>{r.goal}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="step-nav">
        <button className="btn btn-secondary" onClick={() => setStep('upload-results')}>← Back</button>
        <div style={{ display:'flex', gap:'0.75rem' }}>
          <button className="btn btn-secondary" onClick={runOptimize} disabled={loading}>↺ Re-optimize</button>
          <button className="btn btn-primary" onClick={() => setStep('enough-data')}>
            Next: Enough Data? →
          </button>
        </div>
      </div>
    </div>
  )
}
