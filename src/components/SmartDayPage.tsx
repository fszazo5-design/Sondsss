import { useMemo, useState } from 'react';
import { Moon, Sparkles, Sun, Check } from 'lucide-react';

type Props = { active: boolean };
const morningSteps = ['كوب ماء عند الاستيقاظ', 'اختاري أهم خطوة لليوم', 'خمس دقائق حركة لطيفة'];
const eveningSteps = ['راجعي أجمل إنجاز اليوم', 'جهزي مهمة الغد', 'تنفّسي ببطء وخذي وقتًا للراحة'];
export default function SmartDayPage({ active }: Props) {
  const [mode, setMode] = useState<'morning' | 'evening'>('morning');
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const steps = mode === 'morning' ? morningSteps : eveningSteps;
  const message = useMemo(() => mode === 'morning' ? 'ابدئي بهدوء: اختاري خطوة صغيرة قابلة للإنجاز، وسيكبر أثرها خلال اليوم.' : 'أغلقي يومك بلطف: ما أنجزتِه اليوم كافٍ، وغدًا فرصة جديدة.', [mode]);
  return <section hidden={!active} className="smart-day-page"><div className={`smart-day-hero ${mode}`}><div><span className="section-kicker"><Sparkles size={14} /> ذكاء يومي يعمل دون إنترنت</span><h2>{mode === 'morning' ? 'صباحك أذكى وألطف' : 'مساؤك هادئ ومطمئن'}</h2><p>{message}</p></div>{mode === 'morning' ? <Sun size={65} /> : <Moon size={65} />}</div><div className="smart-day-tabs"><button className={mode === 'morning' ? 'active' : ''} onClick={() => setMode('morning')}><Sun size={18} /> الذكاء الصباحي</button><button className={mode === 'evening' ? 'active' : ''} onClick={() => setMode('evening')}><Moon size={18} /> الذكاء المسائي</button></div><div className="smart-routine"><span className="section-kicker">اقتراحات {mode === 'morning' ? 'الصباح' : 'المساء'}</span><h3>روتينك المقترح اليوم</h3>{steps.map((step, index) => <button type="button" className={`smart-step ${checked[`${mode}-${index}`] ? 'checked' : ''}`} key={step} onClick={() => setChecked((current) => ({ ...current, [`${mode}-${index}`]: !current[`${mode}-${index}`] }))}><span>{checked[`${mode}-${index}`] ? <Check size={16} /> : index + 1}</span>{step}</button>)}<p className="smart-note">هذه الاقتراحات محلية وثابتة لتظل الصفحة مفيدة حتى عند انقطاع الشبكة.</p></div></section>;
}
