import { useState } from 'react';
import { Check, Palette, RotateCcw, Save, Sparkles } from 'lucide-react';

export type ThemeSettings = { primary: string; secondary: string; background: string; surface: string; text: string; success: string; accent: string };
type Props = { active: boolean; theme: ThemeSettings; onChange: (theme: ThemeSettings) => void; onBack: () => void };
const defaults: ThemeSettings = { primary: '#ff007f', secondary: '#ffad39', background: '#f7f8fc', surface: '#ffffff', text: '#392444', success: '#00bd81', accent: '#6657bb' };
const choices: Array<{ key: keyof ThemeSettings; label: string; note: string }> = [
  { key: 'primary', label: 'اللون الأساسي', note: 'الأزرار والعناصر المهمة' },
  { key: 'secondary', label: 'لون البهجة', note: 'النجوم واللمسات المضيئة' },
  { key: 'background', label: 'خلفية التطبيق', note: 'المساحة خلف الصفحات' },
  { key: 'surface', label: 'لون البطاقات', note: 'البطاقات والقوائم' },
  { key: 'text', label: 'لون الكتابة', note: 'العناوين والنصوص الرئيسية' },
  { key: 'success', label: 'لون الإنجاز', note: 'المكتمل والنجاح' },
  { key: 'accent', label: 'لون مميز إضافي', note: 'المساء والمعلومات' },
];
export const defaultTheme = defaults;
export default function ThemeSettingsPage({ active, theme, onChange, onBack }: Props) {
  const [saved, setSaved] = useState(false);
  const update = (key: keyof ThemeSettings, value: string) => { onChange({ ...theme, [key]: value }); setSaved(false); };
  const reset = () => { onChange({ ...defaults }); setSaved(false); };
  const save = () => { onChange({ ...theme }); setSaved(true); window.setTimeout(() => setSaved(false), 1800); };
  return <section hidden={!active} className="theme-page"><div className="theme-hero"><div><span className="section-kicker"><Palette size={15} /> تخصيص لطيف وآمن</span><h2>ألوان تطبيقي</h2><p>اختاري الألوان التي تحبينها، وسيتغير شكل التطبيق على هذا الجهاز فقط.</p></div><div className="theme-hero-art"><Sparkles size={27} /><span /></div></div><div className="theme-preview" style={{ background: theme.background, color: theme.text }}><span>معاينة سريعة</span><strong style={{ color: theme.primary }}>هذا لوني الجميل!</strong><div><i style={{ background: theme.primary }} /><i style={{ background: theme.secondary }} /><i style={{ background: theme.success }} /><i style={{ background: theme.accent }} /></div><button type="button" style={{ background: theme.primary }}><Check size={15} /> زر ملون</button></div><div className="theme-color-grid">{choices.map(({ key, label, note }) => <label className="theme-color-row" key={key}><span className="theme-swatch" style={{ background: theme[key] }}><input type="color" value={theme[key]} onChange={(e) => update(key, e.target.value)} aria-label={label} /></span><span><strong>{label}</strong><small>{note}</small></span><code>{theme[key].toUpperCase()}</code></label>)}</div><div className="theme-actions"><button type="button" className="theme-save" onClick={save}>{saved ? <Check size={17} /> : <Save size={17} />} {saved ? 'تم الحفظ' : 'حفظ الألوان'}</button><button type="button" className="theme-reset" onClick={reset}><RotateCcw size={16} /> الألوان الافتراضية</button><button type="button" className="theme-back" onClick={onBack}>العودة إلى قائمتي</button></div></section>;
}
