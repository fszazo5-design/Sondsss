import { useState } from 'react';
import { Bell, Check, Clock, Moon, RotateCcw, Save, Sun } from 'lucide-react';

export type AzkarState = { morningDone: string[]; eveningDone: string[]; remindersEnabled: boolean; morningTime: string; eveningTime: string };
type Props = { active: boolean; data: AzkarState; onChange: (data: AzkarState) => void; onRequestNotification: () => void };
type Zikr = { id: string; text: string; count: number };
const morning: Zikr[] = [
  { id: 'morning-1', text: 'أصبحنا وأصبح الملك لله، والحمد لله.', count: 1 },
  { id: 'morning-2', text: 'اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور.', count: 1 },
  { id: 'morning-3', text: 'رضيت بالله ربًا، وبالإسلام دينًا، وبمحمد ﷺ نبيًا.', count: 3 },
  { id: 'morning-4', text: 'سبحان الله وبحمده.', count: 100 },
  { id: 'morning-5', text: 'اللهم إني أسألك خير هذا اليوم فتحه ونصره ونوره وبركته وهداه.', count: 1 },
];
const evening: Zikr[] = [
  { id: 'evening-1', text: 'أمسينا وأمسى الملك لله، والحمد لله.', count: 1 },
  { id: 'evening-2', text: 'اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير.', count: 1 },
  { id: 'evening-3', text: 'رضيت بالله ربًا، وبالإسلام دينًا، وبمحمد ﷺ نبيًا.', count: 3 },
  { id: 'evening-4', text: 'أعوذ بكلمات الله التامات من شر ما خلق.', count: 3 },
  { id: 'evening-5', text: 'اللهم إني أسألك خير هذه الليلة وأعوذ بك من شرها.', count: 1 },
];
export default function AzkarPage({ active, data, onChange, onRequestNotification }: Props) {
  const [mode, setMode] = useState<'morning' | 'evening'>('morning');
  const list = mode === 'morning' ? morning : evening;
  const done = mode === 'morning' ? data.morningDone : data.eveningDone;
  const toggle = (id: string) => { const next = done.includes(id) ? done.filter((item) => item !== id) : [...done, id]; onChange({ ...data, [mode === 'morning' ? 'morningDone' : 'eveningDone']: next }); };
  const reset = () => onChange({ ...data, [mode === 'morning' ? 'morningDone' : 'eveningDone']: [] });
  return <section hidden={!active} className="azkar-page"><div className={`azkar-hero ${mode}`}><div><span className="section-kicker"><Bell size={14} /> أذكار محفوظة على الجهاز</span><h2>{mode === 'morning' ? 'أذكار الصباح' : 'أذكار المساء'}</h2><p>{mode === 'morning' ? 'ابدئي يومك بذكر الله وطمأنينة القلب.' : 'اختمي يومك بذكر الله وراحة النفس.'}</p></div>{mode === 'morning' ? <Sun size={62} /> : <Moon size={62} />}</div><div className="azkar-tabs"><button className={mode === 'morning' ? 'active' : ''} onClick={() => setMode('morning')}><Sun size={18} /> الصباح</button><button className={mode === 'evening' ? 'active' : ''} onClick={() => setMode('evening')}><Moon size={18} /> المساء</button></div><div className="azkar-progress"><div><strong>{done.length} / {list.length}</strong><span>أذكار مكتملة</span></div><div className="azkar-progress-bar"><span style={{ width: `${(done.length / list.length) * 100}%` }} /></div><button type="button" onClick={reset}><RotateCcw size={14} /> إعادة اليوم</button></div><div className="azkar-list">{list.map((zikr) => <button type="button" key={zikr.id} className={`zikr-card ${done.includes(zikr.id) ? 'zikr-done' : ''}`} onClick={() => toggle(zikr.id)}><span className="zikr-check">{done.includes(zikr.id) ? <Check size={18} /> : <span />}</span><span className="zikr-text">{zikr.text}</span><span className="zikr-count">{zikr.count}×</span></button>)}</div><div className="azkar-reminders"><div><span className="section-kicker">تنبيهات الأذكار</span><h3><Bell size={17} /> تذكير يومي</h3><p>يظهر التنبيه محليًا عند فتح التطبيق في الموعد المحدد.</p></div><label className="azkar-switch"><input type="checkbox" checked={data.remindersEnabled} onChange={(e) => { onChange({ ...data, remindersEnabled: e.target.checked }); if (e.target.checked) onRequestNotification(); }} /><span /></label><div className="azkar-times"><label><Sun size={14} /> الصباح<input type="time" value={data.morningTime} onChange={(e) => onChange({ ...data, morningTime: e.target.value })} /></label><label><Moon size={14} /> المساء<input type="time" value={data.eveningTime} onChange={(e) => onChange({ ...data, eveningTime: e.target.value })} /></label></div><button className="azkar-save" type="button" onClick={() => onChange({ ...data })}><Save size={15} /> حفظ الإعدادات</button></div></section>;
}
