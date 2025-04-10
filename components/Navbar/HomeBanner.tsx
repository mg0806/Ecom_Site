import Image from "next/image";
const HomeBanner = () => {
  return (
    <div className="relative bg-gradient-to-r from-red-300 to-sky-400 rounded-xl overflow-hidden">
      <div className="mx-auto px-4 sm:px-8 py-10 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Text Section */}
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white">
            Welcome to
          </h1>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white">
            Art-Store
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white mt-4">
            Enjoy Your Shopping
          </p>
          <p className="text-xl sm:text-2xl md:text-4xl text-yellow-200 font-bold mt-2">
            Get 50% off
          </p>
        </div>

        {/* Image Section */}
        <div className="flex-1 w-full max-w-md md:max-w-lg relative aspect-video">
          <Image
            src="/banner-image.jpg"
            width={800}
            height={800}
            priority
            alt="Banner Image"
            className="object-contain rounded-2xl w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
