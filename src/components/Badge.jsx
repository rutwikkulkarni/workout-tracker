import { AG, MC } from '../data/accessories.js'

export default function Badge({id}) {
  const g = AG[id];
  if (!g) return null;
  const c = MC[g.method];
  return (
    <span style={{fontSize:9,fontWeight:700,letterSpacing:0.8,padding:"2px 6px",borderRadius:4,background:c.bg,color:c.color,whiteSpace:"nowrap"}}>{c.label}</span>
  );
}
