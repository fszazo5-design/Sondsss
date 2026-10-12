import { useEffect, useState } from 'react';
import { Activity, Check, Clock3, Heart, ImagePlus, Pause, Play, Plus, RotateCcw, Save, Sparkles, Timer, X } from 'lucide-react';

export type CustomActivity = {
  id: string;
  title: string;
  description: string;
  instruction: string;
  mode: 'reps' | 'hold';
  duration: number;
  unit: string;
  image?: string;
};

export type ActivityGameStats = { sessions: number; totalReps: number; bestReps: number };
type ActivityGame = CustomActivity & { level: string; color: string; icon: string };

const fmt = (n: number) => new Intl.NumberFormat('ar-EG').format(n);
const clock = (n: number) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;

type Props = {
  active: boolean;
  customGames: CustomActivity[];
  stats: ActivityGameStats;
  onCustomGamesChange: (games: CustomActivity[]) => void;
  onComplete: (reps: number) => void;
};

export default function ActivityGames({ active, customGames, stats, onCustomGamesChange, onComplete }: Props) {
  const games: ActivityGame[] = customGames.map((game, index) => ({ ...game, level: 'لعبتك', color: ['rose', 'mint', 'peach', 'lilac', 'sky'][index % 5], icon: '✨' }));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', instruction: '', mode: 'reps' as 'reps' | 'hold', duration: '30', unit: 'تكرار', image: '' });
  const [formError, setFormError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [reps, setReps] = useState(0);
  const [running, setRunning] = useState(false);
  const [completeNotice, setCompleteNotice] = useState('');
  const selected = games.find((game) => game.id === selectedId) ?? null;

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => setSecondsLeft((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (!running || secondsLeft !== 0) return;
    setRunning(false);
    if (selected) {
      setCompleteNotice(`أحسنتِ! سجلتِ ${fmt(reps)} ${selected.unit}.`);
      onComplete(reps);
    }
  }, [running, secondsLeft, reps, onComplete, selected]);

  const openGame = (game: ActivityGame) => { setSelectedId(game.id); setRunning(false); setSecondsLeft(game.duration); setReps(0); setCompleteNotice(''); };
  const saveCustom = () => {
    const title = form.title.trim();
    const duration = Number(form.duration);
    if (!title) { setFormError('اكتبي اسم اللعبة.'); return; }
    if (!Number.isFinite(duration) || duration < 5 || duration > 300) { setFormError('اختاري مدة بين 5 و300 ثانية.'); return; }
    onCustomGamesChange([...customGames, { id: `custom-game-${Date.now()}`, title, description: form.description.trim() || 'لعبة حركة من اختيارك', instruction: form.instruction.trim() || 'تحركي بالوتيرة التي تناسبك وخذي استراحة عند الحاجة.', mode: form.mode, duration, unit: form.mode === 'hold' ? 'ثانية ثبات' : (form.unit.trim() || 'تكرار'), image: form.image || undefined }]);
    setShowAddForm(false);
    setForm({ title: '', description: '', instruction: '', mode: 'reps', duration: '30', unit: 'تكرار', image: '' });
    setFormError('');
  };
  const readImage = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setFormError('اختاري ملف صورة فقط.'); return; }
    if (file.size > 10 * 1024 * 1024) { setFormError('اختاري صورة أقل من 10 ميجابايت.'); return; }
    const reader = new FileReader();
    reader.onerror = () => setFormError('تعذر قراءة الصورة، حاولي مرة أخرى.');
    reader.onload = () => {
      const source = new Image();
      source.onerror = () => setFormError('الصورة غير صالحة.');
      source.onload = () => {
        const maxSide = 1000;
        const scale = Math.min(1, maxSide / Math.max(source.naturalWidth, source.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(source.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(source.naturalHeight * scale));
        canvas.getContext('2d')?.drawImage(source, 0, 0, canvas.width, canvas.height);
        setForm((current) => ({ ...current, image: canvas.toDataURL('image/jpeg', 0.78) }));
        setFormError('');
      };
      source.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return <section hidden={!active} className="activity-games-page">
    <div className="games-hero"><div className="games-hero-copy"><span className="games-kicker"><Sparkles size={15} /> مساحة ألعابك الخاصة</span><h2>أضيفي لعبتك بنفسك</h2><p>أنشئي لعبة تناسبك واحفظيها على هذا الجهاز. لا توجد ألعاب جاهزة أو اتصال مطلوب.</p><div className="games-safety"><Heart size={15} /> اختاري مستوى مريحًا لكِ، وتوقفي عند أي ألم أو دوخة.</div></div><div className="games-hero-art" aria-hidden="true"><span>✦</span><span>★</span><span>✧</span></div></div>
    <div className="games-summary"><div><Activity size={20} /><strong>{fmt(stats.sessions)}</strong><span>جولات مكتملة</span></div><div><Clock3 size={20} /><strong>{fmt(stats.totalReps)}</strong><span>حركات مسجّلة</span></div><div><Sparkles size={20} /><strong>{fmt(games.length)}</strong><span>ألعابك المحفوظة</span></div></div>
    <div className="games-section-heading"><div><span className="section-kicker">مكتبتك المحلية</span><h3>ألعابي</h3></div><span className="games-count">{fmt(games.length)} ألعاب</span></div>
    <div className="games-grid">
      {games.map((game) => <article className={`activity-game-card game-${game.color}`} key={game.id}><button className="activity-game-art" type="button" onClick={() => openGame(game)} aria-label={`ابدئي ${game.title}`}>{game.image ? <img src={game.image} alt={`صورة ${game.title}`} /> : <span className="custom-game-art">{game.icon}</span>}<span className="game-level">لعبتك</span></button><div className="activity-game-copy"><h4>{game.title}</h4><p>{game.description}</p><div className="game-meta"><span><Clock3 size={13} /> {fmt(game.duration)} ث</span><span>{game.mode === 'hold' ? 'ثبات' : 'عدّاد'}</span></div><button type="button" className="game-play-button" onClick={() => openGame(game)}><Play size={15} fill="currentColor" /> ابدئي اللعب</button></div></article>)}
      <button type="button" className="add-game-card" onClick={() => { setShowAddForm(true); setFormError(''); }}><span className="add-game-icon"><Plus size={25} /></span><strong>أضيفي لعبة</strong><span>الاسم، المدة، التعليمات والصورة</span></button>
    </div>
    {games.length === 0 && <p className="games-note"><Activity size={15} /> لم تتم إضافة ألعاب بعد. ابدئي بلعبتك الأولى.</p>}
    {showAddForm && <div className="game-modal-backdrop" role="presentation" onClick={() => setShowAddForm(false)}><section className="game-dialog" role="dialog" aria-modal="true" aria-labelledby="add-game-title" onClick={(event) => event.stopPropagation()}><button className="game-dialog-close" type="button" onClick={() => setShowAddForm(false)} aria-label="إغلاق"><X size={18} /></button><div className="game-dialog-heading"><span><Plus size={22} /></span><div><small>تخزين محلي</small><h3 id="add-game-title">إضافة لعبة جديدة</h3></div></div><div className="game-form"><label>اسم اللعبة<input autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="مثال: مشي في المكان" /></label><label>وصف قصير<input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="حركة خفيفة وممتعة" /></label><label>طريقة اللعب<select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value as 'reps' | 'hold' })}><option value="reps">عدّ الحركات بالضغط</option><option value="hold">تحدي ثبات بالوقت</option></select></label><label>مدة الجولة بالثواني<input type="number" min="5" max="300" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></label>{form.mode === 'reps' && <label>اسم الحركة<input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="تكرار" /></label>}<label className="game-form-wide">صورة اللعبة <input type="file" accept="image/*" onChange={(e) => readImage(e.target.files?.[0])} />{form.image && <><span className="image-ready"><ImagePlus size={14} /> تم تجهيز الصورة</span><img className="game-image-preview" src={form.image} alt="معاينة صورة اللعبة" /></>}</label><label className="game-form-wide">التعليمات<textarea rows={3} value={form.instruction} onChange={(e) => setForm({ ...form, instruction: e.target.value })} placeholder="اكتبي طريقة اللعب" /></label></div>{formError && <p className="game-form-error" role="alert">{formError}</p>}<div className="game-dialog-actions"><button type="button" className="game-save-button" onClick={saveCustom}><Save size={16} /> حفظ اللعبة</button><button type="button" className="game-cancel-button" onClick={() => setShowAddForm(false)}>إلغاء</button></div></section></div>}
    {selected && <div className="game-modal-backdrop" role="presentation" onClick={() => { setRunning(false); setSelectedId(null); }}><section className="game-dialog game-play-dialog" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}><button className="game-dialog-close" type="button" onClick={() => { setRunning(false); setSelectedId(null); }} aria-label="إغلاق اللعبة"><X size={18} /></button><div className="game-dialog-heading"><span className="selected-game-emoji">{selected.icon}</span><div><small>لعبتك · {selected.mode === 'hold' ? 'تحدي ثبات' : 'تحدي حركة'}</small><h3>{selected.title}</h3></div></div><p className="game-instruction">{selected.instruction}</p><div className="game-clock-panel"><Timer size={19} /><strong role="timer">{clock(secondsLeft)}</strong>{selected.mode === 'reps' && <span className="game-rep-count">{fmt(reps)} <small>{selected.unit}</small></span>}</div><div className="game-timer-progress"><span style={{ width: `${selected.duration ? ((selected.duration - secondsLeft) / selected.duration) * 100 : 0}%` }} /></div>{selected.mode === 'reps' && <button type="button" className="game-rep-button" disabled={!running} onClick={() => setReps((count) => count + 1)}><Check size={20} /> سجّلي حركة</button>}{completeNotice && <p className="game-complete-message" role="status"><Sparkles size={17} /> {completeNotice}</p>}<div className="game-dialog-actions"><button type="button" className="game-save-button" onClick={() => { if (secondsLeft <= 0) { setSecondsLeft(selected.duration); setReps(0); } setRunning((value) => !value); }}>{running ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}{running ? 'إيقاف مؤقت' : 'ابدئي الجولة'}</button><button type="button" className="game-cancel-button" onClick={() => { setRunning(false); setSecondsLeft(selected.duration); setReps(0); setCompleteNotice(''); }}><RotateCcw size={16} /> إعادة</button></div></section></div>}
  </section>;
}
