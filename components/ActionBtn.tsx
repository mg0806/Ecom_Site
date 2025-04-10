import { IconType } from "react-icons";

interface ActionBtnProps {
  icon: IconType;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const ActionBtn: React.FC<ActionBtnProps> = ({
  icon: Icon,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={`
            flex items-center justify-center
            cursor-pointer rounded
            w-[36px] h-[36px] sm:w-[40px] sm:h-[40px]
            text-slate-700 border border-slate-400
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
    >
      <Icon size={16} className="sm:size-[18px]" />
    </button>
  );
};

export default ActionBtn;
