import { useState } from 'react'
import { useWorkout } from './hooks/useWorkout.js'
import HomeScreen from './components/screens/HomeScreen.jsx'
import WorkoutScreen from './components/screens/WorkoutScreen.jsx'
import ProgressScreen from './components/screens/ProgressScreen.jsx'
import GuideScreen from './components/screens/GuideScreen.jsx'

export default function App() {
  const [scr, setScr] = useState('home');
  const workout = useWorkout(setScr);

  if (workout.loading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0A0A0A",color:"rgba(255,255,255,0.5)",fontSize:14}}>Loading...</div>
  );

  if (scr === 'home') return <HomeScreen cw={workout.cw} setCw={workout.setCw} hist={workout.hist} startW={workout.startW} setScr={setScr} />;
  if (scr === 'guide') return <GuideScreen setScr={setScr} />;
  if (scr === 'progress') return <ProgressScreen cw={workout.cw} setScr={setScr} />;

  return (
    <WorkoutScreen
      day={workout.day}
      cs={workout.cs}
      sd={workout.sd}
      ts={workout.ts}
      setTs={workout.setTs}
      tc={workout.tc}
      sf={workout.sf}
      setSf={workout.setSf}
      gid={workout.gid}
      setGid={workout.setGid}
      tES={workout.tES}
      tD={workout.tD}
      togS={workout.togS}
      upSD={workout.upSD}
      startT={workout.startT}
      finW={workout.finW}
      cancelW={workout.cancelW}
    />
  );
}
