import { WEEKS } from '../../data/weeks.js'

export default function ProgressScreen({cw, setScr}) {
  return (
    <div style={{minHeight:"100vh",background:"#0A0A0A",color:"#fff",fontFamily:"inherit"}}>
      <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid rgba(255,255,255,0.08)",position:"sticky",top:0,background:"#0A0A0A",zIndex:10}}>
        <button onClick={()=>setScr("home")} style={{background:"none",border:"none",color:"#fff",fontSize:20,cursor:"pointer",padding:4}}>{"\u2190"}</button>
        <span style={{fontSize:17,fontWeight:600}}>Progression Table</span>
      </div>
      <div style={{padding:16,overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr>{["Week","Bench","Squat","Phase"].map(h=><th key={h} style={{padding:"10px 8px",textAlign:"left",borderBottom:"2px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.5)",fontWeight:600,fontSize:11,letterSpacing:1}}>{h}</th>)}</tr></thead>
          <tbody>{WEEKS.map((r,i)=>(
            <tr key={i} style={{background:i===cw?"rgba(37,99,235,0.1)":"transparent"}}>
              <td style={{padding:"10px 8px",fontWeight:i===cw?700:400,whiteSpace:"nowrap",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>{i===cw&&"\u25B8 "}{r.week}</td>
              <td style={{padding:"10px 8px",fontFamily:"monospace",color:"#60A5FA",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>{r.bench}</td>
              <td style={{padding:"10px 8px",fontFamily:"monospace",color:"#34D399",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>{r.squat}</td>
              <td style={{padding:"10px 8px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}><span style={{padding:"2px 8px",borderRadius:10,fontSize:11,fontWeight:600,background:r.phase==="TEST"?"rgba(234,179,8,0.15)":r.phase==="Recovery"?"rgba(34,197,94,0.15)":"rgba(255,255,255,0.06)",color:r.phase==="TEST"?"#FBBF24":r.phase==="Recovery"?"#34D399":"rgba(255,255,255,0.6)"}}>{r.phase}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
