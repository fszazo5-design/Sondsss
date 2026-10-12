import { useEffect, useMemo, useState } from 'react';
import { Bell, Check, Heart, Moon, Play, Plus, RotateCcw, Save, Settings2, Star, Sun, Trash2, Volume2, VolumeX, X } from 'lucide-react';

export type AzkarItem = { id: string; text: string; count: number; custom?: boolean };
export type AzkarState = { morningDone: string[]; eveningDone: string[]; remindersEnabled: boolean; morningTime: string; eveningTime: string; favoriteIds?: string[]; customMorning?: AzkarItem[]; customEvening?: AzkarItem[] };
type Props = { active: boolean; data: AzkarState; onChange: (data: AzkarState) => void; onRequestNotification: () => void };
const morning: AzkarItem[] = [
  { id: 'morning-1', text: 'أصبحنا وأصبح الملك لله، والحمد لله.', count: 1 },
  { id: 'morning-2', text: 'اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور.', count: 1 },
  { id: 'morning-3', text: 'رضيت بالله ربًا، وبالإسلام دينًا، وبمحمد ﷺ نبيًا.', count: 3 },
  { id: 'morning-4', text: 'سبحان الله وبحمده.', count: 100 },
  { id: 'morning-5', text: 'اللهم إني أسألك خير هذا اليوم فتحه ونصره ونوره وبركته وهداه.', count: 1 },
];
const evening: AzkarItem[] = [
  { id: 'evening-1', text: 'أمسينا وأمسى الملك لله، والحمد لله.', count: 1 },
  { id: 'evening-2', text: 'اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير.', count: 1 },
  { id: 'evening-3', text: 'رضيت بالله ربًا، وبالإسلام دينًا، وبمحمد ﷺ نبيًا.', count: 3 },
  { id: 'evening-4', text: 'أعوذ بكلمات الله التامات من شر ما خلق.', count: 3 },
  { id: 'evening-5', text: 'اللهم إني أسألك خير هذه الليلة وأعوذ بك من شرها.', count: 1 },
];

export default function AzkarPage({ active, data, onChange, onRequestNotification }: Props) {
  const [mode, setMode] = useState<'morning' | 'evening'>('morning');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newText, setNewText] = useState('');
  const [newCount, setNewCount] = useState('1');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const allItems = mode === 'morning' ? [...morning, ...(data.customMorning ?? [])] : [...evening, ...(data.customEvening ?? [])];
  const favoriteIds = data.favoriteIds ?? [];
  const list = useMemo(() => favoritesOnly ? allItems.filter((item) => favoriteIds.includes(item.id)) : allItems, [allItems, favoritesOnly, favoriteIds]);
  const done = mode === 'morning' ? data.morningDone : data.eveningDone;
  useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);
  useEffect(() => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); setSpeakingId(null); }, [mode, active]);
  const speak = (item: AzkarItem) => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;
    if (speakingId === item.id) { window.speechSynthesis.cancel(); setSpeakingId(null); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.lang = 'ar-SA'; utterance.rate = 0.78; utterance.pitch = 1;
    const arabicVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith('ar'));
    if (arabicVoice) utterance.voice = arabicVoice;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(item.id); window.speechSynthesis.speak(utterance);
  };
  const toggle = (id: string) => { const next = done.includes(id) ? done.filter((item) => item !== id) : [...done, id]; onChange({ ...data, [mode === 'morning' ? 'morningDone' : 'eveningDone']: next }); };
  const toggleFavorite = (id: string) => onChange({ ...data, favoriteIds: favoriteIds.includes(id) ? favoriteIds.filter((item) => item !== id) : [...favoriteIds, id] });
  const reset = () => onChange({ ...data, [mode === 'morning' ? 'morningDone' : 'eveningDone']: [] });
  const addCustom = () => { const text = newText.trim(); const count = Number(newCount); if (!text || !Number.isFinite(count) || count < 1 || count > 1000) return; const item: AzkarItem = { id: `custom-${mode}-${Date.now()}`, text, count: Math.round(count), custom: true }; onChange({ ...data, [mode === 'morning' ? 'customMorning' : 'customEvening']: [...(mode === 'morning' ? (data.customMorning ?? []) : (data.customEvening ?? [])), item] }); setNewText(''); setNewCount('1'); };
  const removeCustom = (id: string) => onChange({ ...data, [mode === 'morning' ? 'customMorning' : 'customEvening']: (mode === 'morning' ? (data.customMorning ?? []) : (data.customEvening ?? [])).filter((item) => item.id !== id), favoriteIds: favoriteIds.filter((item) => item !== id) });
  const totalDone = done.length;
  return <section hidden={!active} className="azkar-page"><div className={`azkar-hero ${mode}`}><div><span className="section-kicker"><Bell size={14} /> أذكار محفوظة على الجهاز</span><h2>{mode === 'morning' ? 'أذكار الصباح' : 'أذكار المساء'}</h2><p>{mode === 'morning' ? 'ابدئي يومك بذكر الله وطمأنينة القلب.' : 'اختمي يومك بذكر الله وراحة النفس.'}</p></div>{mode === 'morning' ? <Sun size={62} /> : <Moon size={62} />}</div><div className="azkar-audio-note"><Volume2 size={16} /><span>اضغطي زر الصوت بجانب الذكر لسماعه بصوت عربي من الجهاز.</span></div><div className="azkar-tabs"><button className={mode === 'morning' ? 'active' : ''} onClick={() => setMode('morning')}><Sun size={18} /> الصباح</button><button className={mode === 'evening' ? 'active' : ''} onClick={() => setMode('evening')}><Moon size={18} /> المساء</button><button className="azkar-settings-button" onClick={() => setShowSettings((value) => !value)}><Settings2 size={17} /> الإعدادات</button></div>{showSettings && <div className="azkar-settings"><div className="azkar-settings-title"><div><span className="section-kicker">تخصيص الأذكار</span><h3><Heart size={17} /> مفضلاتي وأذكاري الجديدة</h3></div><button type="button" onClick={() => setShowSettings(false)} aria-label="إغلاق الإعدادات"><X size={18} /></button></div><p>اضغطي على النجمة بجوار أي ذكر لحفظه في المفضلة، أو أضيفي ذكرًا جديدًا ليظهر في قائمة {mode === 'morning' ? 'الصباح' : 'المساء'}.</p><div className="azkar-custom-form"><textarea rows={2} value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="اكتبي الذكر الجديد هنا" /><label>التكرار<input type="number" min="1" max="1000" value={newCount} onChange={(e) => setNewCount(e.target.value)} /></label><button type="button" onClick={addCustom}><Plus size={15} /> إضافة الذكر</button></div><div className="azkar-custom-list">{allItems.filter((item) => item.custom).map((item) => <div key={item.id}><span>{item.text}</span><button type="button" onClick={() => removeCustom(item.id)} aria-label="حذف الذكر"><Trash2 size={15} /></button></div>)}{allItems.filter((item) => item.custom).length === 0 && <small>لا توجد أذكار مضافة يدويًا بعد.</small>}</div></div>}<div className="azkar-filters"><button className={!favoritesOnly ? 'active' : ''} onClick={() => setFavoritesOnly(false)}>كل الأذكار ({allItems.length})</button><button className={favoritesOnly ? 'active' : ''} onClick={() => setFavoritesOnly(true)}><Star size={14} /> المفضلة ({allItems.filter((item) => favoriteIds.includes(item.id)).length})</button></div><div className="azkar-progress"><div><strong>{totalDone} / {allItems.length}</strong><span>أذكار مكتملة</span></div><div className="azkar-progress-bar"><span style={{ width: `${allItems.length ? (totalDone / allItems.length) * 100 : 0}%` }} /></div><button type="button" onClick={reset}><RotateCcw size={14} /> إعادة اليوم</button></div><div className="azkar-list">{list.length === 0 ? <div className="azkar-empty"><Star size={24} /><p>لم تختاري أذكارًا مفضلة بعد.</p></div> : list.map((zikr) => <div className={`zikr-card ${done.includes(zikr.id) ? 'zikr-done' : ''}`} key={zikr.id}><button type="button" className="zikr-main" onClick={() => toggle(zikr.id)}><span className="zikr-check">{done.includes(zikr.id) ? <Check size={18} /> : <span />}</span><span className="zikr-text">{zikr.text}</span><span className="zikr-count">{zikr.count}×</span></button><button type="button" className={`zikr-audio ${speakingId === zikr.id ? 'playing' : ''}`} onClick={() => speak(zikr)} aria-label={speakingId === zikr.id ? 'إيقاف صوت الذكر' : 'تشغيل صوت الذكر'}>{speakingId === zikr.id ? <VolumeX size={18} /> : <Play size={17} fill="currentColor" />}</button><button type="button" className={`zikr-favorite ${favoriteIds.includes(zikr.id) ? 'selected' : ''}`} onClick={() => toggleFavorite(zikr.id)} aria-label="إضافة أو إزالة من المفضلة"><Star size={18} fill={favoriteIds.includes(zikr.id) ? 'currentColor' : 'none'} /></button></div>)}</div><div className="azkar-reminders"><div><span className="section-kicker">تنبيهات الأذكار</span><h3><Bell size={17} /> تذكير يومي</h3><p>يظهر التنبيه محليًا عند فتح التطبيق في الموعد المحدد.</p></div><label className="azkar-switch"><input type="checkbox" checked={data.remindersEnabled} onChange={(e) => { onChange({ ...data, remindersEnabled: e.target.checked }); if (e.target.checked) onRequestNotification(); }} /><span /></label><div className="azkar-times"><label><Sun size={14} /> الصباح<input type="time" value={data.morningTime} onChange={(e) => onChange({ ...data, morningTime: e.target.value })} /></label><label><Moon size={14} /> المساء<input type="time" value={data.eveningTime} onChange={(e) => onChange({ ...data, eveningTime: e.target.value })} /></label></div><button className="azkar-save" type="button" onClick={() => onChange({ ...data })}><Save size={15} /> حفظ الإعدادات</button></div></section>;
}
