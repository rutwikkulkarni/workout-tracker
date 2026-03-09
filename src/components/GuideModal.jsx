import { AG, MC } from '../data/accessories.js'
import { PROG_DATA } from '../data/progData.js'

export default function GuideModal({id, onClose}) {
  const g = AG[id];
  if (!g) return null;
  const cfg = MC[g.method];
  let name = id;
  for (const d of Object.values(PROG_DATA))
    for (const s of d.sections)
      for (const e of s.exercises)
        if (e.id === id) name = e.name;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#1A1A1A",borderRadius:"20px 20px 0 0",padding:"24px 20px 32px",maxWidth:420,width:"100%",border:"1px solid rgba(255,255,255,0.1)",borderBottom:"none",maxHeight:"70vh",overflowY:"auto"}}>
        <div style={{width:40,height:4,borderRadius:2,background:"rgba(255,255,255,0.15)",margin:"0 auto 20px"}}/>
        <div style={{fontSize:18,fontWeight:700,marginBottom:4}}>{name}</div>
        <div style={{display:"inline-flex",padding:"4px 10px",borderRadius:6,background:cfg.bg,marginBottom:16}}><span style={{fontSize:11,fontWeight:700,color:cfg.color}}>{cfg.label}</span></div>
        <div style={{marginBottom:16}}><div style={{fontSize:12,color:"rgba(255,255,255,0.4)",fontWeight:600,letterSpacing:1,marginBottom:6}}>HOW TO PROGRESS</div><div style={{fontSize:14,color:"rgba(255,255,255,0.8)",lineHeight:1.5}}>{g.tip}</div></div>
        <div style={{display:"flex",gap:12,marginBottom:16}}>
          <div style={{flex:1,background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"12px 14px"}}><div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:4}}>Rep Range</div><div style={{fontSize:16,fontWeight:700,fontFamily:"monospace"}}>{g.repRange}</div></div>
          <div style={{flex:1,background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"12px 14px"}}><div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:4}}>Increment</div><div style={{fontSize:16,fontWeight:700,fontFamily:"monospace"}}>{g.increment}</div></div>
        </div>
        <div style={{background:cfg.bg,borderRadius:10,padding:"12px 14px",marginBottom:20}}><div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:4}}>TARGET</div><div style={{fontSize:16,fontWeight:700,color:cfg.color}}>{g.milestone}</div></div>
        {g.method==="double"&&<div style={{background:"rgba(96,165,250,0.06)",borderRadius:10,padding:"14px",border:"1px solid rgba(96,165,250,0.12)",marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,color:"#60A5FA",marginBottom:8}}>Double Progression</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7}}>1. Start at <b style={{color:"#fff"}}>bottom</b> of rep range</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7}}>2. Add reps until <b style={{color:"#fff"}}>top</b> on all sets</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7}}>3. <b style={{color:"#60A5FA"}}>Add weight</b> ({g.increment}), drop back</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7}}>4. Repeat every 2-3 weeks</div>
        </div>}
        <button onClick={onClose} style={{width:"100%",padding:"14px 0",borderRadius:12,border:"none",background:cfg.bg,color:cfg.color,fontSize:15,fontWeight:700,cursor:"pointer"}}>Got it</button>
      </div>
    </div>
  );
}
