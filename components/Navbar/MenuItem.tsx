interface MenuItemProps {
  children: React.ReactNode;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ children, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="px-4 py-3 sm:px-3 sm:py-2 hover:bg-neutral-100 transition text-sm sm:text-base cursor-pointer"
    >
      {children}
    </div>
  );
};

export default MenuItem;
