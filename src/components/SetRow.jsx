export default function SetRow({n, reps, done, onToggle, wt, onWt, ar, onAr}) {
  return (
    <div onClick={onToggle} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.06)",cursor:"pointer",opacity:done?0.5:1,transition:"opacity 0.2s"}}>
      <div style={{width:28,height:28,borderRadius:14,flexShrink:0,border:done?"none":"2px solid rgba(255,255,255,0.2)",background:done?"#16A34A":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff"}}>{done?"\u2713":n}</div>
      <div style={{flex:1}}><span style={{fontSize:14,color:"rgba(255,255,255,0.6)"}}>Set {n}</span></div>
      <div style={{display:"flex",alignItems:"center",gap:6}} onClick={e=>e.stopPropagation()}>
        <input type="number" value={wt} onChange={e=>onWt(e.target.value)} placeholder="kg" style={{width:52,padding:"5px 4px",borderRadius:6,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.06)",color:"#fff",fontSize:14,textAlign:"center",fontFamily:"monospace",outline:"none"}}/>
        <span style={{color:"rgba(255,255,255,0.3)",fontSize:12}}>×</span>
        <input type="text" value={ar} onChange={e=>onAr(e.target.value)} placeholder={reps} style={{width:44,padding:"5px 4px",borderRadius:6,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.06)",color:"#fff",fontSize:14,textAlign:"center",fontFamily:"monospace",outline:"none"}}/>
      </div>
    </div>
  );
}
