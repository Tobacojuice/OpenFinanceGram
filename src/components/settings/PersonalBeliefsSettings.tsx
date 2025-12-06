import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const BELIEF_OPTIONS = [
  { id: "ramadan", label: "Ramadan", hint: "Eid calendar adjustments" },
  { id: "lunar", label: "Jewish Holidays", hint: "Rosh Hashanah, Yom Kippur, Passover" },
  { id: "catholic", label: "Catholic", hint: "Ash Wednesday, Good Friday, Christmas" },
  { id: "buddhist", label: "Buddhist", hint: "Vesak, Asalha Puja, Magha Puja" },
  { id: "general", label: "Lunar Calendar", hint: "Secular moon phases" },
];

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}

const ToggleSwitch = ({ enabled, onChange, label, hint }: ToggleSwitchProps) => (
  <div 
    className="group flex items-center justify-between py-2 px-3 hover:bg-foreground/5 cursor-pointer transition-colors rounded"
    onClick={() => onChange(!enabled)}
  >
    <div className="flex flex-col">
      <span className="mono text-sm">{label}</span>
      {hint && <span className="mono text-[10px] opacity-40">{hint}</span>}
    </div>
    <div className={cn(
      "w-10 h-5 rounded-full transition-all duration-200 relative",
      enabled ? "bg-primary" : "bg-foreground/20"
    )}>
      <div className={cn(
        "absolute top-0.5 w-4 h-4 rounded-full bg-background transition-all duration-200",
        enabled ? "left-5" : "left-0.5"
      )} />
    </div>
  </div>
);

export const PersonalBeliefsSettings = () => {
  const [masterEnabled, setMasterEnabled] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("financegram_beliefs");
    if (saved) {
      const parsed = JSON.parse(saved);
      setMasterEnabled(parsed.enabled || false);
      setSelected(parsed.modes || {});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("financegram_beliefs", JSON.stringify({ 
      enabled: masterEnabled, 
      modes: selected 
    }));
  }, [masterEnabled, selected]);

  const toggleOption = (id: string) => {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeCount = Object.values(selected).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-foreground/10 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mono text-sm">personal_beliefs</h3>
            <p className="mono text-[10px] opacity-40 mt-0.5">
              // experimental · respectful career alignment
            </p>
          </div>
          <div className="mono text-[10px] opacity-30">
            {masterEnabled ? `${activeCount} active` : "disabled"}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-foreground/5 rounded p-3 space-y-2">
        <p className="mono text-[11px] opacity-60 leading-relaxed">
          We understand that for many individuals, faith and personal values are central to every aspect of life—including career choices. 
          This experimental feature is designed with the utmost respect to help you navigate the job market in a way that honors your beliefs.
        </p>
        <p className="mono text-[11px] opacity-60 leading-relaxed">
          When enabled, we'll do our best to evaluate and filter companies based on their business practices, 
          helping you identify opportunities that align with your religious or ethical principles. 
          Whether you observe certain dietary laws, sabbath traditions, or wish to avoid industries that conflict with your faith—we're here to support that journey.
        </p>
        <p className="mono text-[10px] opacity-40 italic">
          This is not about exclusion, but about finding the right fit where you can thrive authentically.
        </p>
      </div>

      {/* Master Toggle */}
      <div className="border border-foreground/10 rounded">
        <ToggleSwitch
          enabled={masterEnabled}
          onChange={setMasterEnabled}
          label="enable_belief_modes"
          hint="adjust VaR windows and calendar filters"
        />
      </div>

      {/* Options - Hyprland style list */}
      {masterEnabled && (
        <div className="border border-foreground/10 rounded divide-y divide-foreground/5">
          {BELIEF_OPTIONS.map((opt) => (
            <ToggleSwitch
              key={opt.id}
              enabled={selected[opt.id] || false}
              onChange={() => toggleOption(opt.id)}
              label={opt.id}
              hint={opt.hint}
            />
          ))}
        </div>
      )}

      {/* Footer hint */}
      <p className="mono text-[9px] opacity-20 text-center">
        your beliefs matter · preferences stored locally and respected always
      </p>
    </div>
  );
};
