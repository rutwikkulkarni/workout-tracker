export const PROG_DATA = {
  dayA:{id:"dayA",name:"Day A",subtitle:"Upper - Bench Focus",icon:"\u{1F3CB}\u{FE0F}",color:"#2563EB",
    sections:[
      {name:"Warm-up",exercises:[
        {id:"a1",name:"Band Pull-aparts",sets:2,reps:"15",rest:0,notes:"Light band"},
        {id:"a2",name:"Push-ups",sets:2,reps:"10",rest:0,notes:"Controlled tempo"},
        {id:"a3",name:"Empty Bar Bench",sets:2,reps:"10",rest:60,notes:"Scapula retraction"},
      ]},
      {name:"Main Lift",exercises:[
        {id:"a4",name:"Barbell Bench Press",sets:4,reps:"4",rest:210,notes:"Follow progression table",primary:true},
      ]},
      {name:"Accessories",exercises:[
        {id:"a5",name:"Weighted Dips",sets:3,reps:"8-10",rest:120,notes:"Lean forward"},
        {id:"a6",name:"Barbell Row",sets:4,reps:"8",rest:90,notes:"Overhand grip"},
        {id:"a7",name:"Dumbbell OHP",sets:3,reps:"10-12",rest:90,notes:"Seated or standing"},
        {id:"a8",name:"Pull-ups",sets:3,reps:"max",rest:90,notes:"Add weight at 12+"},
        {id:"a9",name:"DB Curl + Band Pushdown",sets:2,reps:"12 ea",rest:60,notes:"Superset"},
      ]},
      {name:"Cardio Finisher",exercises:[
        {id:"a10",name:"Ski/Row Erg Zone 2",sets:1,reps:"10 min",rest:0,notes:"130-150 bpm"},
      ]},
    ],
  },
  dayB:{id:"dayB",name:"Day B",subtitle:"Lower - Squat Focus",icon:"\u{1F9B5}",color:"#059669",
    sections:[
      {name:"Warm-up",exercises:[
        {id:"b1",name:"Goblet Squat (KB)",sets:2,reps:"10",rest:0,notes:"Light KB"},
        {id:"b2",name:"Band Walks",sets:2,reps:"12/side",rest:0,notes:"Mini band"},
      ]},
      {name:"Main Lift",exercises:[
        {id:"b3",name:"Barbell Back Squat",sets:3,reps:"10",rest:210,notes:"Follow progression table",primary:true},
      ]},
      {name:"Accessories",exercises:[
        {id:"b4",name:"Romanian Deadlift",sets:3,reps:"10",rest:120,notes:"Hinge at hips"},
        {id:"b5",name:"Bulgarian Split Squat",sets:3,reps:"8/leg",rest:90,notes:"Rear foot on bench"},
        {id:"b6",name:"Weighted Step-ups",sets:3,reps:"10/leg",rest:60,notes:"DBs or sandbag"},
        {id:"b7",name:"KB Swings",sets:3,reps:"15",rest:60,notes:"Hip hinge power"},
        {id:"b8",name:"Hanging Leg Raise",sets:3,reps:"12",rest:60,notes:"No swinging"},
      ]},
      {name:"Cardio Finisher",exercises:[
        {id:"b9",name:"Bike / Incline Walk",sets:1,reps:"10-15 min",rest:0,notes:"Zone 2"},
      ]},
    ],
  },
  dayC:{id:"dayC",name:"Day C",subtitle:"Upper - Volume & Hypertrophy",icon:"\u{1F4AA}",color:"#7C3AED",
    sections:[
      {name:"Warm-up",exercises:[
        {id:"c1",name:"Band Pull-aparts + Dislocates",sets:2,reps:"15",rest:0,notes:"Shoulder health"},
        {id:"c2",name:"Light DB Bench",sets:2,reps:"12",rest:60,notes:"Warm up groove"},
      ]},
      {name:"Main Lift",exercises:[
        {id:"c3",name:"Close-Grip Bench Press",sets:4,reps:"6-8",rest:150,notes:"80-85% of bench",primary:true},
      ]},
      {name:"Accessories",exercises:[
        {id:"c4",name:"Incline DB Press",sets:3,reps:"10-12",rest:90,notes:"30-45 degrees"},
        {id:"c5",name:"Barbell Row (underhand)",sets:4,reps:"8-10",rest:90,notes:"Focus on lats"},
        {id:"c6",name:"DB Lateral Raise",sets:3,reps:"15",rest:60,notes:"Light, controlled"},
        {id:"c7",name:"Dips (bodyweight)",sets:3,reps:"max",rest:90,notes:"Pump work"},
        {id:"c8",name:"Face Pulls (band)",sets:3,reps:"15-20",rest:60,notes:"Shoulder balance"},
        {id:"c9",name:"Hammer Curl + OH Tri Ext",sets:2,reps:"12 ea",rest:60,notes:"Superset"},
      ]},
      {name:"Cardio Finisher",exercises:[
        {id:"c10",name:"Row Erg Intervals",sets:1,reps:"5x1min on/off",rest:0,notes:"Hard on, easy off"},
      ]},
    ],
  },
  dayD:{id:"dayD",name:"Day D",subtitle:"Lower + Conditioning",icon:"\u{1F525}",color:"#DC2626",
    sections:[
      {name:"Strength",exercises:[
        {id:"d1",name:"Front/Pause Squat",sets:3,reps:"6",rest:150,notes:"~70% back squat",primary:true},
        {id:"d2",name:"Single-Leg RDL (DB)",sets:3,reps:"8/leg",rest:60,notes:"Balance + hams"},
        {id:"d3",name:"Sandbag Carry",sets:3,reps:"40m",rest:90,notes:"Bear hug 20kg"},
      ]},
      {name:"Conditioning",exercises:[
        {id:"d4",name:"Ski Erg Intervals",sets:1,reps:"8x30s on/off",rest:0,notes:"All-out"},
      ]},
      {name:"Core",exercises:[
        {id:"d5",name:"Plank + Dead Bug",sets:2,reps:"30s + 10",rest:30,notes:"Core stability"},
      ]},
    ],
  },
};
