import { useState, useEffect } from 'react';
import { API } from '../../api/index.js';

const DAY_COLORS = { dayA: '#2563EB', dayB: '#16A34A', dayC: '#7C3AED', dayD: '#DC2626' };

function mapRow(w) {
  return { id: w.id, day: w.day_name, dayKey: w.day_key, date: w.started_at?.split("T")[0] || w.started_at, completed: w.completed_sets, total: w.total_sets, finished: !!w.finished_at };
}

export default function HistoryScreen({ setScr }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [detailCache, setDetailCache] = useState({});
  const [loadingDetailId, setLoadingDetailId] = useState(null);

  const LIMIT = 50;

  useEffect(() => {
    (async () => {
      try {
        const rows = await API.get(`/workouts?limit=${LIMIT}&offset=0`);
        setItems(rows.map(mapRow));
        setHasMore(rows.length === LIMIT);
        setOffset(LIMIT);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const rows = await API.get(`/workouts?limit=${LIMIT}&offset=${offset}`);
      setItems(prev => [...prev, ...rows.map(mapRow)]);
      setHasMore(rows.length === LIMIT);
      setOffset(prev => prev + LIMIT);
    } catch (e) { console.error(e); }
    setLoadingMore(false);
  };

  const toggleExpand = async (id) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    if (detailCache[id]) return;
    setLoadingDetailId(id);
    try {
      const data = await API.get(`/workouts/${id}`);
      setDetailCache(prev => ({ ...prev, [id]: data }));
    } catch (e) { console.error(e); }
    setLoadingDetailId(null);
  };

  const color = (dayKey) => DAY_COLORS[dayKey] || '#9CA3AF';

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'inherit', paddingBottom: 40 }}>
      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#0A0A0A', padding: 'max(48px, calc(env(safe-area-inset-top) + 16px)) 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setScr('home')} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', borderRadius: 8, width: 36, height: 36, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>‹</button>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Workout History</div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '60px 0', fontSize: 14 }}>Loading...</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '60px 0', fontSize: 14 }}>No workouts yet</div>
        ) : (
          <>
            {items.map(item => {
              const isOpen = expandedId === item.id;
              const detail = detailCache[item.id];
              const c = color(item.dayKey);
              const borderColor = isOpen ? `${c}66` : 'rgba(255,255,255,0.08)';

              // Group sets by exercise name
              const byExercise = detail ? detail.sets.reduce((acc, s) => { (acc[s.exercise_name] ??= []).push(s); return acc; }, {}) : null;

              return (
                <div key={item.id} style={{ marginBottom: 8, background: 'rgba(255,255,255,0.04)', border: `1px solid ${borderColor}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                  {/* Summary row */}
                  <button onClick={() => toggleExpand(item.id)} style={{ width: '100%', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                    <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, flexShrink: 0, background: c }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{item.day}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{formatDate(item.date)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {item.finished ? (
                        <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)' }}>{item.completed}/{item.total}</span>
                      ) : (
                        <span style={{ fontSize: 11, color: '#F59E0B', background: 'rgba(245,158,11,0.12)', padding: '2px 8px', borderRadius: 10 }}>incomplete</span>
                      )}
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▾</span>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 16px 16px' }}>
                      {loadingDetailId === item.id ? (
                        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, textAlign: 'center', padding: '12px 0' }}>Loading...</div>
                      ) : byExercise ? (
                        Object.entries(byExercise).map(([exName, sets]) => (
                          <div key={exName} style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: c, letterSpacing: 0.5, marginBottom: 6 }}>{exName}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                              {sets.map(s => (
                                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                                  <span style={{ color: 'rgba(255,255,255,0.3)', width: 18, flexShrink: 0, fontFamily: 'monospace' }}>S{s.set_number}</span>
                                  {s.weight != null ? (
                                    <span style={{ fontFamily: 'monospace', color: '#fff', fontWeight: 600 }}>{s.weight}kg</span>
                                  ) : (
                                    <span style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>—</span>
                                  )}
                                  {s.reps && <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>× {s.reps}</span>}
                                  {!!s.completed && <span style={{ color: '#34D399', fontSize: 11 }}>✓</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}

            {hasMore && (
              <button onClick={loadMore} disabled={loadingMore} style={{ width: '100%', marginTop: 8, padding: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: 10, cursor: loadingMore ? 'default' : 'pointer', fontSize: 13, fontWeight: 500 }}>
                {loadingMore ? 'Loading...' : 'Load more'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
