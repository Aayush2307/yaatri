type ToggleOptProps = {
  label: string;
  active: boolean;
  activeClass: string;
  onClick: () => void;
};

export function ToggleOpt({ label, active, activeClass, onClick }: ToggleOptProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-[10px] border-[0.5px] py-[11px] text-[12px] transition-colors duration-150 ease-out ${
        active
          ? activeClass
          : 'border-[rgba(127,119,221,0.2)] bg-[rgba(127,119,221,0.08)] text-[rgba(234,232,255,0.5)]'
      }`}
    >
      {label}
    </button>
  );
}
