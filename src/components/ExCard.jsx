import { useState } from 'react'
import { AG, MC } from '../data/accessories.js'
import Badge from './Badge.jsx'
import SetRow from './SetRow.jsx'

export default function ExCard({ex, color, onTimer, cs, sd, onToggle, onSD, onGuide}) {
  const [exp, setExp] = useState(false);
  const allDone = cs.length === ex.sets, any = cs.length > 0, g = AG[ex.id];

  return (
    <div style={{background:"rgba(255,255,255,0.04)",borderRadius:12,border:`1px solid ${allDone?"rgba(22,163,106,0.3)":"rgba(255,255,255,0.08)"}`,overflow:"hidden"}}>
      <div onClick={()=>setExp(!exp)} style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
        <div style={{width:6,height:32,borderRadius:3,flexShrink:0,background:allDone?"#16A34A":any?color:"rgba(255,255,255,0.15)"}}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <span style={{fontSize:15,fontWeight:ex.primary?700:500,color:"#fff",textDecoration:allDone?"line-through":"none",textDecorationColor:"rgba(255,255,255,0.3)"}}>{ex.name}</span>
            <Badge id={ex.id}/>
          </div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2}}>{ex.sets}×{ex.reps} · {ex.rest>0?`${ex.rest}s`:"No rest"}{g?` · ${g.milestone}`:""}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <span style={{fontSize:12,color:"rgba(255,255,255,0.3)",fontFamily:"monospace"}}>{cs.length}/{ex.sets}</span>
          <span style={{fontSize:12,color:"rgba(255,255,255,0.3)",transform:exp?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</span>
        </div>
      </div>
      {exp && (
        <div style={{padding:"0 16px 14px"}}>
          {g && <div onClick={e=>{e.stopPropagation();onGuide?.(ex.id);}} style={{padding:"8px 10px",borderRadius:8,marginBottom:10,cursor:"pointer",background:MC[g.method].bg,border:`1px solid ${MC[g.method].color}22`}}>
            <div style={{fontSize:11,color:MC[g.method].color,fontWeight:600,marginBottom:2}}>{g.method==="double"?"\u2191 Hit top of rep range \u2192 add weight \u2192 drop":g.method==="bw"?`\u2191 Build to threshold \u2192 add ${g.increment}`:g.method==="quality"?"\u25CE Focus on control, not weight":g.method==="linear"?`\u2191 Add ${g.increment} every 2-3 weeks`:"Follows programme table"}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.45)"}}>Tap for full guide <span style={{color:MC[g.method].color}}>→</span></div>
          </div>}
          {Array.from({length:ex.sets},(_,i)=><SetRow key={i} n={i+1} reps={ex.reps} done={cs.includes(i)} wt={sd[i]?.weight||""} ar={sd[i]?.reps||""} onWt={v=>onSD(i,"weight",v)} onAr={v=>onSD(i,"reps",v)} onToggle={()=>{onToggle(i);if(!cs.includes(i)&&ex.rest>0&&i<ex.sets-1)onTimer(ex.rest);}}/>)}
        </div>
      )}
    </div>
  );
}
