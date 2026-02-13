const { useState, useMemo, useEffect } = React;

const defaultState = {
  user: null,
  profile: null,
  goals: { calories: 1800, protein: 120, carbs: 180, fat: 60, waterMl: 2000 },
  meals: [],
  waterLogs: [],
  weightLogs: []
};

const foodSeeds = [
  { name: "Scrambled Eggs", calories: 140, protein: 12, carbs: 2, fat: 10 },
  { name: "Oatmeal", calories: 220, protein: 9, carbs: 38, fat: 4 },
  { name: "Grilled Chicken", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Brown Rice", calories: 216, protein: 5, carbs: 45, fat: 1.8 },
  { name: "Greek Yogurt", calories: 150, protein: 15, carbs: 9, fat: 5 }
];

function calcTargets(profile) {
  const weightKg = profile.unit === "imperial" ? profile.currentWeight * 0.453592 : profile.currentWeight;
  const heightCm = profile.unit === "imperial" ? profile.height * 2.54 : profile.height;
  const bmr = profile.gender === "male"
    ? 10 * weightKg + 6.25 * heightCm - 5 * profile.age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * profile.age - 161;
  const factors = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, extreme: 1.9 };
  const tdee = bmr * factors[profile.activity];
  const deficit = profile.speed * 500;
  const calories = Math.max(1200, Math.round(tdee - deficit));
  return {
    calories,
    protein: Math.round((calories * 0.3) / 4),
    carbs: Math.round((calories * 0.4) / 4),
    fat: Math.round((calories * 0.3) / 9),
    waterMl: 2000
  };
}

function App() {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem("dietlog-state");
    return saved ? JSON.parse(saved) : defaultState;
  });
  const [tab, setTab] = useState("home");

  useEffect(() => {
    localStorage.setItem("dietlog-state", JSON.stringify(state));
  }, [state]);

  if (!state.user) {
    return <AuthScreen onStart={(name) => setState((s) => ({ ...s, user: { name } }))} />;
  }

  if (!state.profile) {
    return (
      <Onboarding
        user={state.user}
        onComplete={(profile) =>
          setState((s) => ({ ...s, profile, goals: calcTargets(profile) }))
        }
      />
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayMeals = state.meals.filter((m) => m.date === today);
  const totals = todayMeals.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
  const waterToday = state.waterLogs.filter((w) => w.date === today).reduce((a, b) => a + b.amount, 0);

  return (
    <div className="app-shell">
      <div className="topbar card">
        <div>
          <div className="brand">DietLog</div>
          <div className="muted small">Hi {state.user.name}, keep your streak going 🔥</div>
        </div>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => setState(defaultState)}>Reset</button>
      </div>

      {tab === "home" && (
        <HomeTab totals={totals} goals={state.goals} waterToday={waterToday} meals={todayMeals} onDeleteMeal={(id)=>setState(s=>({...s, meals:s.meals.filter(m=>m.id!==id)}))} />
      )}
      {tab === "add" && (
        <AddFoodTab
          onAdd={(meal) => setState((s) => ({ ...s, meals: [meal, ...s.meals] }))}
        />
      )}
      {tab === "progress" && (
        <ProgressTab
          weightLogs={state.weightLogs}
          onAddWeight={(entry) => setState((s) => ({ ...s, weightLogs: [entry, ...s.weightLogs] }))}
        />
      )}
      {tab === "water" && (
        <WaterTab
          total={waterToday}
          goal={state.goals.waterMl}
          onAdd={(amount) => setState((s) => ({ ...s, waterLogs: [{ date: today, amount }, ...s.waterLogs] }))}
        />
      )}

      <div className="bottom-nav card">
        {[["home", "🏠 Home"], ["add", "➕ Add"], ["progress", "📈 Progress"], ["water", "💧 Water"]].map(
          ([key, label]) => (
            <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>{label}</button>
          )
        )}
      </div>
    </div>
  );
}

function AuthScreen({ onStart }) {
  const [name, setName] = useState("");
  return (
    <div className="app-shell">
      <div className="card p-4 mt-4">
        <h3>Welcome to DietLog</h3>
        <p className="muted">Start in guest mode and set up your personalized calorie targets.</p>
        <input className="form-control" placeholder="Your name" value={name} onChange={(e)=>setName(e.target.value)} />
        <button className="btn btn-success mt-3" disabled={!name.trim()} onClick={() => onStart(name.trim())}>Continue</button>
      </div>
    </div>
  );
}

function Onboarding({ user, onComplete }) {
  const [form, setForm] = useState({
    age: 30, gender: "female", height: 165, unit: "metric", currentWeight: 75, goalWeight: 65, activity: "moderate", speed: 1
  });
  const bmi = useMemo(() => {
    const kg = form.unit === "imperial" ? form.currentWeight * 0.453592 : form.currentWeight;
    const m = (form.unit === "imperial" ? form.height * 2.54 : form.height) / 100;
    return (kg / (m * m)).toFixed(1);
  }, [form]);

  return (
    <div className="app-shell">
      <div className="card p-4 mt-3">
        <h4>{user.name}, let's personalize your plan</h4>
        <div className="stepper mt-3">
          <div className="step grid-2">
            <input className="form-control" type="number" value={form.age} onChange={(e)=>setForm({...form, age:+e.target.value})} placeholder="Age" />
            <select className="form-select" value={form.gender} onChange={(e)=>setForm({...form, gender:e.target.value})}><option value="female">Female</option><option value="male">Male</option></select>
            <input className="form-control" type="number" value={form.height} onChange={(e)=>setForm({...form, height:+e.target.value})} placeholder="Height" />
            <select className="form-select" value={form.unit} onChange={(e)=>setForm({...form, unit:e.target.value})}><option value="metric">Metric</option><option value="imperial">Imperial</option></select>
          </div>
          <div className="step grid-2">
            <input className="form-control" type="number" value={form.currentWeight} onChange={(e)=>setForm({...form, currentWeight:+e.target.value})} placeholder="Current weight" />
            <input className="form-control" type="number" value={form.goalWeight} onChange={(e)=>setForm({...form, goalWeight:+e.target.value})} placeholder="Goal weight" />
            <select className="form-select" value={form.activity} onChange={(e)=>setForm({...form, activity:e.target.value})}><option value="sedentary">Sedentary</option><option value="light">Light</option><option value="moderate">Moderate</option><option value="active">Very active</option><option value="extreme">Extreme</option></select>
            <select className="form-select" value={form.speed} onChange={(e)=>setForm({...form, speed:+e.target.value})}><option value={0.5}>0.5 lb/wk</option><option value={1}>1 lb/wk</option><option value={1.5}>1.5 lb/wk</option><option value={2}>2 lb/wk</option></select>
          </div>
        </div>
        <p className="mt-3 mb-0"><strong>BMI:</strong> {bmi}</p>
        <button className="btn btn-success mt-3" onClick={() => onComplete(form)}>Finish Setup</button>
      </div>
    </div>
  );
}

function HomeTab({ totals, goals, waterToday, meals, onDeleteMeal }) {
  const pct = (val, max) => Math.min(100, Math.round((val / max) * 100));
  return (
    <>
      <div className="card p-3 mb-3">
        <h5>Daily Overview</h5>
        <div className="grid-2 mt-3">
          {[
            ["Calories", `${totals.calories}/${goals.calories}`, pct(totals.calories, goals.calories)],
            ["Protein", `${totals.protein}g/${goals.protein}g`, pct(totals.protein, goals.protein)],
            ["Carbs", `${totals.carbs}g/${goals.carbs}g`, pct(totals.carbs, goals.carbs)],
            ["Fat", `${totals.fat}g/${goals.fat}g`, pct(totals.fat, goals.fat)]
          ].map(([label, value, percent]) => (
            <div className="metric" key={label}>
              <h6>{label}</h6>
              <p>{value}</p>
              <div className="progress"><div className="progress-bar" style={{ width: `${percent}%` }}></div></div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-3 mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Hydration</h5>
          <span className="badge bg-primary">{waterToday} / {goals.waterMl} ml</span>
        </div>
      </div>

      <div className="card p-3">
        <h5>Meal Timeline</h5>
        <ul className="list-unstyled log-list mb-0">
          {meals.length === 0 && <li className="muted">No meals logged today.</li>}
          {meals.map((m) => (
            <li key={m.id} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{m.mealType}</strong> — {m.name}
                <div className="small muted">{m.calories} kcal</div>
              </div>
              <button className="btn btn-sm btn-outline-danger" onClick={() => onDeleteMeal(m.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function AddFoodTab({ onAdd }) {
  const [selected, setSelected] = useState(foodSeeds[0]);
  const [qty, setQty] = useState(1);
  const [mealType, setMealType] = useState("Breakfast");

  const createMeal = () => {
    const factor = Number(qty) || 1;
    onAdd({
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      mealType,
      name: selected.name,
      calories: Math.round(selected.calories * factor),
      protein: +(selected.protein * factor).toFixed(1),
      carbs: +(selected.carbs * factor).toFixed(1),
      fat: +(selected.fat * factor).toFixed(1)
    });
  };

  return (
    <div className="card p-3">
      <h5>Add Food</h5>
      <div className="mt-2">
        <label className="form-label">Food</label>
        <select className="form-select" value={selected.name} onChange={(e)=>setSelected(foodSeeds.find(f=>f.name===e.target.value))}>
          {foodSeeds.map((f) => <option key={f.name}>{f.name}</option>)}
        </select>
      </div>
      <div className="grid-2 mt-2">
        <div>
          <label className="form-label">Meal</label>
          <select className="form-select" value={mealType} onChange={(e)=>setMealType(e.target.value)}>
            <option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option>
          </select>
        </div>
        <div>
          <label className="form-label">Quantity</label>
          <input className="form-control" type="number" min="0.25" step="0.25" value={qty} onChange={(e)=>setQty(e.target.value)} />
        </div>
      </div>
      <p className="mt-3 mb-2 muted">Preview: {Math.round(selected.calories * qty)} kcal • P {Math.round(selected.protein * qty)}g • C {Math.round(selected.carbs * qty)}g • F {Math.round(selected.fat * qty)}g</p>
      <button className="btn btn-success" onClick={createMeal}>Add to Log</button>
    </div>
  );
}

function WaterTab({ total, goal, onAdd }) {
  return (
    <div className="card p-3">
      <h5>Water Tracker</h5>
      <p className="muted">{total} / {goal} ml</p>
      <div className="quick-actions">
        {[200, 250, 500].map((v) => <button key={v} className="btn btn-outline-primary" onClick={() => onAdd(v)}>+{v} ml</button>)}
      </div>
    </div>
  );
}

function ProgressTab({ weightLogs, onAddWeight }) {
  const [weight, setWeight] = useState("");
  return (
    <div className="card p-3">
      <h5>Weight Progress</h5>
      <div className="d-flex gap-2 mb-3">
        <input className="form-control" type="number" placeholder="Enter weight" value={weight} onChange={(e)=>setWeight(e.target.value)} />
        <button className="btn btn-success" onClick={() => {
          if (!weight) return;
          onAddWeight({ id: crypto.randomUUID(), date: new Date().toISOString().slice(0,10), value: Number(weight) });
          setWeight("");
        }}>Save</button>
      </div>
      <ul className="list-unstyled log-list mb-0">
        {weightLogs.length === 0 && <li className="muted">No weigh-ins yet.</li>}
        {weightLogs.map((w) => <li key={w.id} className="d-flex justify-content-between"><span>{w.date}</span><strong>{w.value}</strong></li>)}
      </ul>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
