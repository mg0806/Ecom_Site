"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "../universal/Container";
import FooterList from "./FooterList";
import { MdFacebook } from "react-icons/md";
import { categories } from "@/Utils/Categories";
import {
  AiFillGithub,
  AiFillInstagram,
  AiFillTwitterCircle,
} from "react-icons/ai";
import Loader from "@/components/universal/Loader"; // Import Loader

const Footer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Handle navigation with loader
  const handleNavigation = (url: string) => {
    setIsLoading(true);
    router.push(url);
    setTimeout(() => setIsLoading(false), 700); // Simulating page load
  };

  return (
    <footer className="bg-slate-700 text-slate-200 text-sm mt-16">
      <Container>
        <div className="flex flex-col lg:flex-row flex-wrap justify-between gap-y-10 pt-16 pb-8">
          {/* Shop Categories */}
          <FooterList>
            <h3 className="text-base mb-2 font-bold">Shop Categories</h3>
            {categories
              .filter((item) => item.label !== "")
              .map((category) => (
                <Link
                  key={category.label}
                  href={`/?category=${category.label}`}
                  className="block hover:underline"
                >
                  {category.label}
                </Link>
              ))}
          </FooterList>

          {/* Customer Services */}
          <FooterList>
            <h3 className="text-base mb-2 font-bold">Customer Services</h3>
            {[
              { label: "Contact us", path: "/contact" },
              { label: "Terms and Conditions", path: "/terms-and-conditions" },
              { label: "Shipping Policy", path: "/shippingPolicy" },
              {
                label: "Cancellation and Refund",
                path: "/cancellation-refund",
              },
              { label: "FAQs", path: "/FAQ" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.path)}
                className="block hover:underline text-left w-full"
              >
                {item.label}
                {isLoading && <Loader />}
              </button>
            ))}
          </FooterList>

          {/* About Us */}
          <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mb-6">
            <h3 className="text-base font-bold mb-2">About Us</h3>
            <p className="mb-2">
              Art-Store is your premier destination for discovering and
              purchasing unique artwork. From original paintings and digital
              prints to handcrafted sculptures and home decor, we celebrate
              creativity in every form. With a curated collection and an
              intuitive shopping experience, finding the perfect piece to
              inspire your space has never been easier.
            </p>

            <p>
              &copy; {new Date().getFullYear()} Art-Store All rights Reserved
            </p>
          </div>

          {/* Social Links */}
          <FooterList>
            <h3 className="text-base font-bold mb-2">Follow Us</h3>
            <div className="flex gap-3">
              <Link href="">
                <MdFacebook size={24} />
              </Link>
              <Link href="">
                <AiFillTwitterCircle size={24} />
              </Link>
              <Link href="">
                <AiFillInstagram size={24} />
              </Link>
              <Link href="">
                <AiFillGithub size={24} />
              </Link>
            </div>
          </FooterList>
        </div>
      </Container>

      {/* Show Loader when navigating */}
      {isLoading && <Loader />}
    </footer>
  );
};

export default Footer;
