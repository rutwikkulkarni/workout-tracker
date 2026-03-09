import { useState, useEffect, useRef } from 'react'

export default function Timer({seconds, onComplete, color}) {
  const [rem, setRem] = useState(seconds);
  const [run, setRun] = useState(true);
  const iv = useRef(null), st = useRef(Date.now());

  useEffect(() => {
    if (!run) return;
    st.current = Date.now() - (seconds - rem) * 1000;
    iv.current = setInterval(() => {
      const r = Math.max(0, seconds - Math.floor((Date.now() - st.current) / 1000));
      setRem(r);
      if (r === 0) { clearInterval(iv.current); onComplete?.(); }
    }, 100);
    return () => clearInterval(iv.current);
  }, [run]);

  const pct = ((seconds - rem) / seconds) * 100, m = Math.floor(rem / 60), s = rem % 60, done = rem === 0;

  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:done?"#16A34A":"#111",borderTop:`3px solid ${color}`,padding:"12px 20px max(20px, env(safe-area-inset-bottom))",display:"flex",alignItems:"center",gap:16}}>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"baseline",gap:8}}>
          <span style={{fontFamily:"'JetBrains Mono','SF Mono',monospace",fontSize:done?28:40,fontWeight:700,color:"#fff",letterSpacing:2,lineHeight:1}}>{done?"GO!":`${m}:${String(s).padStart(2,"0")}`}</span>
          {!done&&<span style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>rest</span>}
        </div>
        <div style={{height:4,borderRadius:2,background:"rgba(255,255,255,0.15)",marginTop:8,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,background:color,width:`${pct}%`,transition:"width 0.3s linear"}}/></div>
      </div>
      <div style={{display:"flex",gap:8}}>
        {!done&&<button onClick={()=>setRun(!run)} style={{width:44,height:44,borderRadius:22,border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.1)",color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{run?"\u23F8":"\u25B6"}</button>}
        <button onClick={()=>{clearInterval(iv.current);onComplete?.();}} style={{width:44,height:44,borderRadius:22,border:"none",background:done?"#fff":color,color:done?"#111":"#fff",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{done?"\u2192":"Skip"}</button>
      </div>
    </div>
  );
}
