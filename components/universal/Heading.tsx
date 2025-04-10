interface HeadingProps {
  title: string;
  center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({ title, center }) => {
  return (
    <div className={center ? "text-center" : "text-start"}>
      <h1 className="font-bold text-xl sm:text-2xl md:text-3xl leading-snug">
        {title}
      </h1>
    </div>
  );
};

export default Heading;
