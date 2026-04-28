type ChipProps = {
  label: string;
  active: boolean;
  activeClass: string;
  onClick: () => void;
};

export function Chip({ label, active, activeClass, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border-[0.5px] px-[13px] py-[7px] text-[11px] transition-colors duration-150 ease-out ${
        active
          ? activeClass
          : 'border-[rgba(127,119,221,0.2)] bg-[rgba(127,119,221,0.08)] text-[rgba(234,232,255,0.5)]'
      }`}
    >
      {label}
    </button>
  );
}
