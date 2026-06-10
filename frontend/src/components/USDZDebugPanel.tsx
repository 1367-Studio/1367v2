import { useState } from 'react'
import { createPortal } from 'react-dom'
import USDZViewer from './USDZViewer'

interface Config {
  playing: boolean
  rotationSpeed: number
  tiltX: number
  tiltY: number
  tiltZ: number
  offsetY: number
  cameraAzimuth: number
  cameraElevation: number
  cameraDistance: number
  fov: number
  scale: number
  lAmbient: number
  lTopRight: number
  lBottomLeft: number
  lTopLeft: number
  lFront: number
  lRight: number
  lBottom: number
}

const DEFAULTS: Config = {
  playing: true,
  rotationSpeed: 0.015,
  tiltX: 0, tiltY: 0, tiltZ: 0,
  offsetY: 0,
  cameraAzimuth: 0,
  cameraElevation: 1.57,
  cameraDistance: 1,
  fov: 40,
  scale: 1,
  lAmbient: 2,
  lTopRight: 3,
  lBottomLeft: 3,
  lTopLeft: 3,
  lFront: 0,
  lRight: 0,
  lBottom: 0,
}

const MAIN_SLIDERS: { key: keyof Config; label: string; min: number; max: number; step: number }[] = [
  { key: 'rotationSpeed',   label: 'Rotation Speed', min: 0,     max: 0.06, step: 0.001 },
  { key: 'tiltX',           label: 'Rotation X',     min: -3.14, max: 3.14, step: 0.01  },
  { key: 'tiltY',           label: 'Rotation Y',     min: -3.14, max: 3.14, step: 0.01  },
  { key: 'tiltZ',           label: 'Rotation Z',     min: -3.14, max: 3.14, step: 0.01  },
  { key: 'offsetY',         label: 'Spin Offset',    min: -6.28, max: 6.28, step: 0.01  },
  { key: 'cameraAzimuth',   label: 'Cam Azimuth',    min: -3.14, max: 3.14, step: 0.01  },
  { key: 'cameraElevation', label: 'Cam Elevation',  min: 0.01,  max: 3.14, step: 0.01  },
  { key: 'cameraDistance',  label: 'Cam Distance',   min: 0.1,   max: 5,    step: 0.05  },
  { key: 'fov',             label: 'FOV',            min: 10,    max: 120,  step: 1     },
  { key: 'scale',           label: 'Scale',          min: 0.1,   max: 5,    step: 0.05  },
]

const LIGHT_SLIDERS: { key: keyof Config; label: string }[] = [
  { key: 'lAmbient',    label: 'Ambient'     },
  { key: 'lTopRight',   label: 'Top Right'   },
  { key: 'lTopLeft',    label: 'Top Left'    },
  { key: 'lFront',      label: 'Front'       },
  { key: 'lRight',      label: 'Right'       },
  { key: 'lBottomLeft', label: 'Bottom Left' },
  { key: 'lBottom',     label: 'Bottom'      },
]

export default function USDZDebugPanel({ src }: { src: string }) {
  const [cfg, setCfg] = useState<Config>(DEFAULTS)
  const [copied, setCopied] = useState(false)

  const set = (key: keyof Config, val: number | boolean) =>
    setCfg(prev => ({ ...prev, [key]: val }))

  const copyProps = () => {
    const str = (Object.keys(DEFAULTS) as (keyof Config)[])
      .filter(k => k !== 'playing')
      .map(k => `${k}={${Number((cfg[k] as number).toFixed(3))}}`)
      .join(' ')
    navigator.clipboard.writeText(str)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const pasteProps = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const next: Partial<Config> = {}
      for (const [, key, val] of text.matchAll(/(\w+)=\{([^}]+)\}/g)) {
        if (key in DEFAULTS && key !== 'playing') (next as any)[key] = parseFloat(val)
      }
      if (Object.keys(next).length) setCfg(prev => ({ ...prev, ...next }))
    } catch {}
  }

  const panel = createPortal(
    <div style={{
      position: 'fixed', bottom: 16, right: 16, width: 268,
      background: 'rgba(10,10,10,0.92)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 10, padding: '14px 16px', fontFamily: 'monospace', fontSize: 11,
      color: '#fff', zIndex: 99999, backdropFilter: 'blur(12px)',
      maxHeight: '90vh', overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.05em' }}>USDZ DEBUG</span>
        <div style={{ display: 'flex', gap: 5 }}>
          <button onClick={() => set('playing', !cfg.playing)} style={{
            background: cfg.playing ? 'rgba(255,255,255,0.1)' : '#22c55e',
            color: '#fff', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 5, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontFamily: 'monospace',
          }}>{cfg.playing ? '⏸' : '▶'}</button>
          <button onClick={pasteProps} style={{
            background: 'rgba(255,255,255,0.08)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: 5,
            padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontFamily: 'monospace',
          }}>Paste</button>
          <button onClick={copyProps} style={{
            background: copied ? '#22c55e' : '#3b82f6', color: '#fff', border: 'none',
            borderRadius: 5, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontFamily: 'monospace',
          }}>{copied ? '✓' : 'Copy'}</button>
        </div>
      </div>

      {/* Main sliders */}
      {MAIN_SLIDERS.map(({ key, label, min, max, step }) => (
        <div key={key} style={{ marginBottom: 9 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <span style={{ color: '#94a3b8' }}>{label}</span>
            <span style={{ color: '#e2e8f0', minWidth: 48, textAlign: 'right' }}>
              {(cfg[key] as number).toFixed(3)}
            </span>
          </div>
          <input type="range" min={min} max={max} step={step} value={cfg[key] as number}
            onChange={e => set(key, parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer' }} />
        </div>
      ))}

      {/* Lights */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', margin: '12px 0 10px', paddingTop: 10 }}>
        <span style={{ color: '#64748b', fontSize: 10, letterSpacing: '0.08em' }}>LIGHTS</span>
      </div>
      {LIGHT_SLIDERS.map(({ key, label }) => (
        <div key={key} style={{ marginBottom: 9 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <span style={{ color: '#94a3b8' }}>{label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#e2e8f0', minWidth: 36, textAlign: 'right' }}>
                {(cfg[key] as number).toFixed(1)}
              </span>
              <button onClick={() => set(key, 0)} style={{
                background: (cfg[key] as number) === 0 ? '#ef4444' : 'rgba(255,255,255,0.08)',
                color: '#fff', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 4, padding: '1px 7px', cursor: 'pointer', fontSize: 10, fontFamily: 'monospace',
              }}>off</button>
            </div>
          </div>
          <input type="range" min={0} max={100} step={0.5} value={cfg[key] as number}
            onChange={e => set(key, parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }} />
        </div>
      ))}

      <button onClick={() => setCfg(DEFAULTS)} style={{
        marginTop: 6, width: '100%', background: 'rgba(255,255,255,0.05)',
        color: '#64748b', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 5, padding: '5px 0', cursor: 'pointer', fontSize: 11, fontFamily: 'monospace',
      }}>Reset</button>
    </div>,
    document.body
  )

  return (
    <>
      <div style={{ width: '100%', height: '100%' }}>
        <USDZViewer src={src} {...cfg} />
      </div>
      {panel}
    </>
  )
}
