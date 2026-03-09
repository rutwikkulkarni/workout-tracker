import { PROG_DATA } from '../../data/progData.js'
import { WEEKS } from '../../data/weeks.js'

export default function HomeScreen({cw, setCw, hist, startW, setScr}) {
  const weekStartStr = (() => {
    const d = new Date(), day = d.getDay(), diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d.toISOString().split("T")[0];
  })();

  const dayStatus = {};
  for (const [k, d] of Object.entries(PROG_DATA)) {
    const m = hist.find(h => h.dayKey === k && h.finished === true && h.date >= weekStartStr);
    dayStatus[k] = {done: !!m, label: m ? (([y,mo,dy]) => new Date(y,mo-1,dy).toLocaleDateString("en-GB",{weekday:"short"}))(m.date.split("-").map(Number)) : null};
  }
  const doneCount = Object.values(dayStatus).filter(s => s.done).length;

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#0A0A0A 0%,#111 100%)",color:"#fff",fontFamily:"inherit",paddingBottom:80}}>
      <div style={{padding:"max(48px, calc(env(safe-area-inset-top) + 16px)) 20px 20px"}}>
        <div style={{fontSize:12,fontWeight:600,letterSpacing:3,color:"rgba(255,255,255,0.35)",textTransform:"uppercase"}}>Road to</div>
        <div style={{fontSize:48,fontWeight:800,lineHeight:1,background:"linear-gradient(135deg,#fff 40%,#60A5FA)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>100kg</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.5)",marginTop:4}}>Bench Press Programme</div>
      </div>

      <div style={{padding:"0 20px",marginBottom:24}}>
        <div style={{background:"rgba(255,255,255,0.04)",borderRadius:16,border:"1px solid rgba(255,255,255,0.08)",padding:"16px 18px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.4)",fontWeight:600,letterSpacing:1}}>CURRENT PHASE</span>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>setCw(Math.max(0,cw-1))} style={{background:"rgba(255,255,255,0.08)",border:"none",color:"#fff",borderRadius:6,width:28,height:28,cursor:"pointer",fontSize:14}}>{"\u2039"}</button>
              <button onClick={()=>setCw(Math.min(WEEKS.length-1,cw+1))} style={{background:"rgba(255,255,255,0.08)",border:"none",color:"#fff",borderRadius:6,width:28,height:28,cursor:"pointer",fontSize:14}}>{"\u203A"}</button>
            </div>
          </div>
          <div style={{fontSize:18,fontWeight:700}}>{WEEKS[cw].week}</div>
          <div style={{display:"flex",gap:24,marginTop:10}}>
            <div><div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:2}}>Bench</div><div style={{fontSize:20,fontWeight:700,fontFamily:"monospace",color:"#60A5FA"}}>{WEEKS[cw].bench}</div></div>
            <div><div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:2}}>Squat</div><div style={{fontSize:20,fontWeight:700,fontFamily:"monospace",color:"#34D399"}}>{WEEKS[cw].squat}</div></div>
            <div><div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:2}}>Phase</div><div style={{fontSize:13,fontWeight:600,marginTop:4,padding:"3px 10px",borderRadius:20,background:WEEKS[cw].phase==="TEST"?"rgba(234,179,8,0.15)":"rgba(255,255,255,0.06)",color:WEEKS[cw].phase==="TEST"?"#FBBF24":"rgba(255,255,255,0.6)",display:"inline-block"}}>{WEEKS[cw].phase}</div></div>
          </div>
          <div style={{marginTop:14,height:4,borderRadius:2,background:"rgba(255,255,255,0.08)"}}><div style={{height:"100%",borderRadius:2,background:"linear-gradient(90deg,#2563EB,#60A5FA)",width:`${((cw+1)/WEEKS.length)*100}%`,transition:"width 0.3s"}}/></div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:4}}>Week {cw+1} of {WEEKS.length}</div>
        </div>
      </div>

      <div style={{padding:"0 20px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:600,letterSpacing:2,color:"rgba(255,255,255,0.35)",textTransform:"uppercase"}}>Start Workout</div>
          <div style={{fontSize:12,fontWeight:500,color:"rgba(255,255,255,0.4)"}}><span style={{color:"#fff",fontWeight:700}}>{doneCount}</span><span style={{color:"rgba(255,255,255,0.3)"}}> / 4 this week</span></div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {Object.entries(PROG_DATA).map(([k,d])=>{
            const st = dayStatus[k];
            return (
              <button key={k} onClick={()=>startW(k)} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",background:st.done?`${d.color}0D`:"rgba(255,255,255,0.04)",borderRadius:14,border:`1px solid ${st.done?d.color+"50":"rgba(255,255,255,0.08)"}`,cursor:"pointer",textAlign:"left"}}>
                <div style={{width:4,alignSelf:"stretch",borderRadius:2,flexShrink:0,background:st.done?d.color:"rgba(255,255,255,0.1)"}}/>
                <div style={{width:44,height:44,borderRadius:12,background:`${d.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{d.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:16,fontWeight:600,color:"#fff"}}>{d.name}</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,0.45)"}}>{d.subtitle}</div>
                  {st.done&&<div style={{fontSize:11,fontWeight:600,color:d.color,marginTop:3,display:"flex",alignItems:"center",gap:4}}><span>{"✓"}</span><span>{"Done \u2013 "+st.label}</span></div>}
                </div>
                <div style={{color:st.done?d.color:"rgba(255,255,255,0.3)",fontSize:st.done?18:20,flexShrink:0}}>{st.done?"✓":"\u2192"}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{padding:"24px 20px",display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
        <button onClick={()=>setScr("progress")} style={{background:"none",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",padding:"10px 20px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:500}}>Progression Table</button>
        <button onClick={()=>setScr("guide")} style={{background:"none",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",padding:"10px 20px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:500}}>Accessory Guide</button>
        <a href="/api/export" style={{background:"none",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",padding:"10px 20px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:500,textDecoration:"none"}}>Export Data</a>
      </div>

      {hist.length>0&&<div style={{padding:"0 20px"}}>
        <div style={{fontSize:12,fontWeight:600,letterSpacing:2,color:"rgba(255,255,255,0.35)",marginBottom:12,textTransform:"uppercase"}}>Recent</div>
        {hist.slice(0,10).map((h,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            <div><span style={{fontSize:14,color:"#fff",fontWeight:500}}>{h.day}</span><span style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginLeft:8}}>{h.date}</span></div>
            <span style={{fontSize:13,color:"rgba(255,255,255,0.4)",fontFamily:"monospace"}}>{h.completed}/{h.total}</span>
          </div>
        ))}
      </div>}
    </div>
  );
}
