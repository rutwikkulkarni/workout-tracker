import { useState, useEffect, useCallback } from 'react'
import { API } from '../api/index.js'
import { PROG_DATA } from '../data/progData.js'

export function useWorkout(setScr) {
  const [ad, setAd] = useState(null);
  const [cs, setCs] = useState({});
  const [sd, setSd] = useState({});
  const [ts, setTs] = useState(null);
  const [tc, setTc] = useState("#2563EB");
  const [cw, setCw] = useState(0);
  const [hist, setHist] = useState([]);
  const [sf, setSf] = useState(false);
  const [gid, setGid] = useState(null);
  const [wid, setWid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [settings, workouts] = await Promise.all([API.get("/settings"), API.get("/workouts?limit=20")]);
        if (settings.current_week) setCw(parseInt(settings.current_week));
        setHist(workouts.map(w => ({id:w.id,day:w.day_name,dayKey:w.day_key,date:w.started_at?.split("T")[0]||w.started_at,completed:w.completed_sets,total:w.total_sets,finished:!!w.finished_at})));
      } catch(e) { console.error("Failed to load:", e); }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading) API.put("/settings/current_week", {value: String(cw)}).catch(() => {});
  }, [cw]);

  const startW = async (k) => {
    const d = PROG_DATA[k];
    try { const r = await API.post("/workouts", {day_key:k, day_name:d.name}); setWid(r.id); } catch(e) { console.error(e); }
    setAd(k); setCs({}); setSd({}); setScr("workout"); setSf(false);
  };

  const togS = (eid, si) => setCs(p => {
    const c = p[eid] || [];
    return c.includes(si) ? {...p, [eid]: c.filter(s => s !== si)} : {...p, [eid]: [...c, si]};
  });

  const upSD = (eid, si, f, v) => setSd(p => ({...p, [eid]: {...(p[eid]||{}), [si]: {...(p[eid]?.[si]||{}), [f]: v}}}));

  const startT = useCallback(s => {
    if (ad) setTc(PROG_DATA[ad].color);
    setTs(s);
  }, [ad]);

  const finW = async () => {
    const d = PROG_DATA[ad];
    const t = d.sections.reduce((s, x) => s + x.exercises.reduce((a, e) => a + e.sets, 0), 0);
    const dn = Object.values(cs).reduce((s, a) => s + a.length, 0);

    if (wid) {
      try {
        const sets = [];
        for (const sec of d.sections) {
          for (const ex of sec.exercises) {
            for (let i = 0; i < ex.sets; i++) {
              const data = sd[ex.id]?.[i] || {};
              sets.push({exercise_id:ex.id, exercise_name:ex.name, set_number:i+1, weight:data.weight?parseFloat(data.weight):null, reps:data.reps||null, completed:(cs[ex.id]||[]).includes(i)});
            }
          }
        }
        await API.post(`/workouts/${wid}/sets`, {sets});
        await API.put(`/workouts/${wid}/finish`, {completed_sets:dn, total_sets:t});

        for (const s of sets) {
          if (s.completed && s.weight && s.weight > 0) {
            API.post("/prs", {exercise_id:s.exercise_id, exercise_name:s.exercise_name, weight:s.weight, reps:s.reps||""}).catch(() => {});
          }
        }
      } catch(e) { console.error("Failed to save:", e); }
    }

    setHist(p => [{id:wid, day:d.name, dayKey:ad, date:new Date().toISOString().split("T")[0], completed:dn, total:t, finished:true}, ...p]);
    setScr("home"); setAd(null); setTs(null); setWid(null);
  };

  const cancelW = () => { setScr("home"); setAd(null); setTs(null); setWid(null); };

  const day = ad ? PROG_DATA[ad] : null;
  const tES = day ? day.sections.reduce((s, x) => s + x.exercises.reduce((a, e) => a + e.sets, 0), 0) : 0;
  const tD = Object.values(cs).reduce((s, a) => s + a.length, 0);

  return { ad, cs, sd, ts, setTs, tc, cw, setCw, hist, sf, setSf, gid, setGid, wid, loading, day, tES, tD, startW, togS, upSD, startT, finW, cancelW };
}
