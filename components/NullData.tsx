interface NullDataProps {
  title: string;
}

const NullData: React.FC<NullDataProps> = ({ title }) => {
  return (
    <div className="w-full h-[40vh] sm:h-[50vh] flex items-center justify-center px-4 text-lg sm:text-xl md:text-2xl text-center">
      <p className="font-medium">{title}</p>
    </div>
  );
};

export default NullData;
