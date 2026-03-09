import ExCard from '../ExCard.jsx'
import Timer from '../Timer.jsx'
import GuideModal from '../GuideModal.jsx'

export default function WorkoutScreen({day, cs, sd, ts, setTs, tc, sf, setSf, gid, setGid, tES, tD, togS, upSD, startT, finW, cancelW}) {
  return (
    <div style={{minHeight:"100vh",background:"#0A0A0A",color:"#fff",fontFamily:"inherit",paddingBottom:ts!==null?100:80}}>
      <div style={{position:"sticky",top:0,zIndex:50,background:"#0A0A0A",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"14px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>{if(tD>0&&!sf){setSf(true);return;}cancelW();}} style={{background:"none",border:"none",color:"#fff",fontSize:20,cursor:"pointer",padding:4}}>{"\u2190"}</button>
            <div><div style={{fontSize:17,fontWeight:700}}>{day.name}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>{day.subtitle}</div></div>
          </div>
          <div style={{fontSize:13,fontFamily:"monospace",color:day.color,background:`${day.color}15`,padding:"4px 12px",borderRadius:20,fontWeight:600}}>{tD}/{tES}</div>
        </div>
        <div style={{height:3,borderRadius:2,background:"rgba(255,255,255,0.08)",marginTop:10}}><div style={{height:"100%",borderRadius:2,background:day.color,width:tES>0?`${(tD/tES)*100}%`:"0%",transition:"width 0.3s"}}/></div>
      </div>

      {sf&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div style={{background:"#1A1A1A",borderRadius:20,padding:24,maxWidth:320,width:"100%",border:"1px solid rgba(255,255,255,0.1)"}}>
          <div style={{fontSize:18,fontWeight:700,marginBottom:8}}>Finish Workout?</div>
          <div style={{fontSize:14,color:"rgba(255,255,255,0.5)",marginBottom:20}}>You've completed {tD}/{tES} sets.</div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setSf(false)} style={{flex:1,padding:"12px 0",borderRadius:12,border:"1px solid rgba(255,255,255,0.15)",background:"transparent",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>Keep Going</button>
            <button onClick={finW} style={{flex:1,padding:"12px 0",borderRadius:12,border:"none",background:day.color,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>Finish</button>
          </div>
        </div>
      </div>}

      {gid&&<GuideModal id={gid} onClose={()=>setGid(null)}/>}

      <div style={{padding:"16px 20px"}}>
        {day.sections.map((sec,si)=>(
          <div key={si} style={{marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:2,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",marginBottom:10,paddingLeft:2}}>{sec.name}</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {sec.exercises.map(ex=><ExCard key={ex.id} ex={ex} color={day.color} cs={cs[ex.id]||[]} sd={sd[ex.id]||{}} onToggle={si=>togS(ex.id,si)} onSD={(si,f,v)=>upSD(ex.id,si,f,v)} onTimer={startT} onGuide={id=>setGid(id)}/>)}
            </div>
          </div>
        ))}
        <button onClick={finW} style={{width:"100%",padding:"16px 0",borderRadius:14,border:"none",background:tD===tES?day.color:"rgba(255,255,255,0.06)",color:tD===tES?"#fff":"rgba(255,255,255,0.4)",fontSize:16,fontWeight:700,cursor:"pointer",marginTop:8}}>{tD===tES?"Complete Workout \u2713":"Finish Early"}</button>
      </div>

      {ts!==null&&<Timer key={ts+Date.now()} seconds={ts} color={tc} onComplete={()=>setTs(null)}/>}
    </div>
  );
}
