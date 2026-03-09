import { PROG_DATA } from '../../data/progData.js'
import { AG, MC } from '../../data/accessories.js'

export default function GuideScreen({setScr}) {
  const gr = {};
  for (const [dk, dd] of Object.entries(PROG_DATA))
    for (const s of dd.sections)
      for (const e of s.exercises)
        if (AG[e.id]) {
          if (!gr[dk]) gr[dk] = {...dd, exercises: []};
          gr[dk].exercises.push({...e, guide: AG[e.id]});
        }

  return (
    <div style={{minHeight:"100vh",background:"#0A0A0A",color:"#fff",fontFamily:"inherit"}}>
      <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid rgba(255,255,255,0.08)",position:"sticky",top:0,background:"#0A0A0A",zIndex:10}}>
        <button onClick={()=>setScr("home")} style={{background:"none",border:"none",color:"#fff",fontSize:20,cursor:"pointer",padding:4}}>{"\u2190"}</button>
        <span style={{fontSize:17,fontWeight:600}}>Accessory Progression Guide</span>
      </div>
      <div style={{padding:"16px 20px 8px",display:"flex",flexWrap:"wrap",gap:8}}>
        {Object.entries(MC).map(([k,c])=><div key={k} style={{padding:"4px 10px",borderRadius:6,background:c.bg}}><span style={{fontSize:10,fontWeight:700,color:c.color}}>{c.label}</span></div>)}
      </div>
      <div style={{padding:"8px 20px 40px"}}>
        {Object.entries(gr).map(([dk,dd])=>(
          <div key={dk} style={{marginBottom:24}}>
            <div style={{fontSize:14,fontWeight:700,color:dd.color,padding:"10px 0",borderBottom:`2px solid ${dd.color}30`,marginBottom:12}}>{dd.icon} {dd.name} - {dd.subtitle}</div>
            {dd.exercises.map(ex=>{
              const c = MC[ex.guide.method];
              return (
                <div key={ex.id} style={{background:"rgba(255,255,255,0.03)",borderRadius:12,border:"1px solid rgba(255,255,255,0.06)",padding:"14px 16px",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <span style={{fontSize:15,fontWeight:600}}>{ex.name}</span>
                    <span style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:4,background:c.bg,color:c.color}}>{c.label}</span>
                  </div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.5,marginBottom:8}}>{ex.guide.tip}</div>
                  <div style={{display:"flex",gap:10}}>
                    <div style={{background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"8px 10px",flex:1}}><div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>Reps</div><div style={{fontSize:14,fontWeight:700,fontFamily:"monospace"}}>{ex.guide.repRange}</div></div>
                    <div style={{background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"8px 10px",flex:1}}><div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>Jump</div><div style={{fontSize:14,fontWeight:700,fontFamily:"monospace"}}>{ex.guide.increment}</div></div>
                    <div style={{background:c.bg,borderRadius:8,padding:"8px 10px",flex:1.5}}><div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>Target</div><div style={{fontSize:13,fontWeight:700,color:c.color}}>{ex.guide.milestone}</div></div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
