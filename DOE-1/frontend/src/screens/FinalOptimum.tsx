// src/screens/FinalOptimum.tsx
import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Optimization } from '../services/api'
import toast from 'react-hot-toast'

export default function FinalOptimum() {
  const { currentProject, setStep, setFinal, finalResult } = useStore()
  const factors   = currentProject?.factors   || []
  const responses = currentProject?.responses || []
  const [loading, setLoading] = useState(false)
  const [aiSummary, setAiSummary] = useState<any>(null)
  const [loadingAi, setLoadingAi] = useState(false)
  const [chatMessages, setChatMessages] = useState<{role:string, content:string}[]>([])
  const [chatInput, setChatInput] = useState('')
  const [loadingChat, setLoadingChat] = useState(false)

  async function loadFinal() {
    if (!currentProject?.id) return
    setLoading(true)
    try {
      const data = await Optimization.final(currentProject.id, 0)
      setFinal(data)
      toast.success('Final optimum calculated')
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Failed – run analysis + GP first')
    } finally { setLoading(false) }
  }

  useEffect(() => {
    if (currentProject?.id) {
      loadFinal()
    }
  }, [currentProject?.id])

  const fr = finalResult

  async function handleGenerateAi() {
    setLoadingAi(true)
    try {
      const data = await Optimization.llmSummary(currentProject!.id, 0)
      setAiSummary(data)
      toast.success('AI Executive Summary generated!')
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Failed to generate AI summary.')
    } finally { setLoadingAi(false) }
  }

  async function handleSendChat() {
    if (!chatInput.trim()) return
    const msg = chatInput.trim()
    setChatInput('')
    const newHistory = [...chatMessages, { role: 'user', content: msg }]
    setChatMessages(newHistory)
    setLoadingChat(true)
    try {
      const data = await Optimization.llmChat(currentProject!.id, msg, chatMessages, 0)
      setChatMessages([...newHistory, { role: 'assistant', content: data.response }])
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Chat failed')
      setChatMessages([...newHistory, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setLoadingChat(false)
    }
  }


  return (
    <div>
      <div className="page-header">
        <div className="page-header-tag">Step 18</div>
        <h1 className="page-title">Final Optimum</h1>
        <p className="page-desc">Find the best final settings after all experiments.</p>
      </div>

      {loading && <div className="loading-overlay"><div className="spinner"/>Computing final optimum…</div>}

      {fr && !loading && (
        <>
          {/* Improvement highlight */}
          <div className="card mb-2" style={{ background:'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1))', border:'1px solid rgba(16,185,129,0.3)', padding:'2rem', textAlign:'center' }}>
            <div style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--success)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'0.75rem' }}>
              🏆 Optimization Complete
            </div>
            {fr.improvement_pct !== 0 && (
              <>
                <div style={{ fontSize:'4rem', fontWeight:900, color:'var(--success)', lineHeight:1 }}>
                  +{fr.improvement_pct}%
                </div>
                <div style={{ color:'var(--text-secondary)', fontSize:'0.9rem', marginTop:'0.5rem' }}>
                  Improvement from first run to best observed
                </div>
              </>
            )}
            <div style={{ display:'flex', justifyContent:'center', gap:'2rem', marginTop:'1.5rem', flexWrap:'wrap' }}>
              <div>
                <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>Total Experiments</div>
                <div style={{ fontSize:'1.4rem', fontWeight:800, color:'var(--accent)' }}>{fr.n_obs}</div>
              </div>
              {fr.best_observed && (
                <div>
                  <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>Best Observed Value</div>
                  <div style={{ fontSize:'1.4rem', fontWeight:800, color:'var(--success)' }}>{fr.best_observed.value?.toFixed(3)}</div>
                  <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>Run #{fr.best_observed.run_number}</div>
                </div>
              )}
              <div>
                <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>GP Predicted Optimum</div>
                <div style={{ fontSize:'1.4rem', fontWeight:800, color:'var(--primary-light)' }}>{fr.final_optimum?.predicted_mean?.toFixed(3)}</div>
              </div>
            </div>
          </div>

          {/* Optimal conditions table */}
          <div className="card mb-2">
            <div className="card-title mb-2">🎯 Optimal Process Settings</div>
            <table className="data-table">
              <thead>
                <tr><th>Factor</th><th>Unit</th><th>Low</th><th>High</th><th style={{ color:'var(--success)' }}>Optimal Value</th></tr>
              </thead>
              <tbody>
                {factors.map((f: any, i: number) => {
                  const val = fr.final_optimum?.actual_values?.[i]
                  const pct = val != null ? Math.min(100, Math.max(0, ((val-f.low)/(f.high-f.low))*100)) : 50
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight:700 }}>{f.name}</td>
                      <td style={{ color:'var(--text-muted)' }}>{f.unit}</td>
                      <td className="mono">{f.low}</td>
                      <td className="mono">{f.high}</td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                          <div style={{ flex:1, height:'6px', background:'var(--border)', borderRadius:'999px', overflow:'hidden' }}>
                            <div style={{ width:`${pct}%`, height:'100%', background:'linear-gradient(90deg, var(--success), var(--accent))', borderRadius:'999px' }}/>
                          </div>
                          <span className="mono" style={{ color:'var(--success)', fontWeight:700, minWidth:'80px', textAlign:'right' }}>
                            {val?.toFixed(3)} {f.unit}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {fr.final_optimum?.confidence_95 && (
              <div style={{ marginTop:'0.75rem', fontSize:'0.8rem', color:'var(--text-muted)' }}>
                GP 95% Confidence Interval: [{fr.final_optimum.confidence_95[0]?.toFixed(3)}, {fr.final_optimum.confidence_95[1]?.toFixed(3)}]
              </div>
            )}
          </div>

          <div className="alert alert-success mb-2">
            ✅ These conditions have been validated through {fr.n_obs} experiments using GP-guided Bayesian optimization.
            Verify with confirmation experiments before scale-up.
          </div>

          {/* AI Executive Summary Section */}
          <div className="card mb-2">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
               <div className="card-title" style={{ margin: 0 }}>🧠 AI Executive Summary</div>
               <button className="btn btn-accent" onClick={handleGenerateAi} disabled={loadingAi}>
                 {loadingAi ? 'Generating...' : 'Generate AI Summary'}
               </button>
            </div>
            
            {loadingAi && <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Analyzing the entire DOE campaign and GP optimum with Llama 3.3 70B... This takes a few seconds.</div>}
            
            {aiSummary && !loadingAi && (
              <div style={{ background: 'var(--surface-light)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <h4 style={{ color: 'var(--primary-light)', marginBottom: '0.5rem', marginTop: 0 }}>Process Status & Correctness</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem', fontWeight: 600 }}>{aiSummary.process_correctness}</p>

                <h4 style={{ color: 'var(--primary-light)', marginBottom: '0.5rem', marginTop: 0 }}>Executive Summary</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{aiSummary.executive_summary}</p>
                
                <h4 style={{ color: 'var(--primary-light)', marginBottom: '0.5rem' }}>Key Interactions</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{aiSummary.key_interactions}</p>
                
                <h4 style={{ color: 'var(--primary-light)', marginBottom: '0.5rem' }}>Suggested Validation Experiments</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {Array.isArray(aiSummary.validation_experiments) ? aiSummary.validation_experiments.map((exp: any, i: number) => (
                    <div key={i} style={{ padding: '1rem', background: 'var(--surface)', borderRadius: '6px', borderLeft: '4px solid var(--accent)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{exp.name || `Experiment ${i + 1}`}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{exp.rationale || (typeof exp === 'string' ? exp : JSON.stringify(exp))}</div>
                      {exp.factor_settings && typeof exp.factor_settings === 'object' && (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {Object.entries(exp.factor_settings).map(([fname, fval]: [string, any], j) => (
                            <div key={j} className="badge badge-primary">{fname}: {fval}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )) : (
                    <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: '6px', borderLeft: '4px solid var(--accent)' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{aiSummary.validation_experiments}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* AI Chat Interaction Section */}
          {aiSummary && (
            <div className="card mb-2">
              <div className="card-title" style={{ marginBottom: '1rem' }}>💬 Chat with Virtual Data Scientist</div>
              <div style={{ background: 'var(--surface)', borderRadius: '8px', padding: '1rem', maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {chatMessages.length === 0 && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                    Ask me any questions about the data, optimal conditions, or validation experiments!
                  </div>
                )}
                {chatMessages.map((msg, idx) => (
                  <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', background: msg.role === 'user' ? 'var(--primary-dark)' : 'var(--surface-light)', color: msg.role === 'user' ? '#fff' : 'var(--text)', padding: '0.75rem 1rem', borderRadius: '8px', maxWidth: '80%', fontSize: '0.9rem', border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none', whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                  </div>
                ))}
                {loadingChat && (
                  <div style={{ alignSelf: 'flex-start', background: 'var(--surface-light)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Thinking...
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="input" 
                  style={{ flex: 1 }}
                  placeholder="Ask a follow-up question..." 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                  disabled={loadingChat}
                />
                <button className="btn btn-primary" onClick={handleSendChat} disabled={loadingChat || !chatInput.trim()}>
                  Send
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <div className="step-nav">
        <button className="btn btn-secondary" onClick={() => setStep('more-improvement')}>← Back</button>
        <div style={{ display:'flex', gap:'0.75rem' }}>
          <button className="btn btn-secondary" onClick={loadFinal} disabled={loading}>↺ Recalculate</button>
          <button className="btn btn-primary" onClick={() => setStep('report')}>
            Generate Report →
          </button>
        </div>
      </div>
    </div>
  )
}
