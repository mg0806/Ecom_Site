import Link from "next/link";
import Container from "../universal/Container";
import { Redressed } from "next/font/google";
import CartCount from "./cartCount";
import UserMenu from "./userMenu";
import { getCurrentUser } from "@/actions/getCurrentUser";
import Categories from "./Categories";
import SearchBar from "../universal/SearchBar";
import { Suspense } from "react";

const redressed = Redressed({ subsets: ["latin"], weight: ["400"] });

const Navbar = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="sticky top-0 w-full bg-slate-200 z-30 shadow-md">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex flex-col gap-4 w-full md:grid md:grid-cols-3 md:items-center">
            {/* Logo - always on the left */}
            <div className="flex items-center justify-between md:justify-start">
              <Link
                href="/"
                className={`${redressed.className} font-bold text-2xl`}
              >
                ART-Store
              </Link>

              {/* On small screens, user/cart are inline with logo */}
              <div className="flex items-center gap-4 md:hidden">
                <CartCount />
                <UserMenu currentUser={currentUser} />
              </div>
            </div>

            {/* SearchBar - centered on medium+, full width on mobile */}
            <div className="w-full md:flex md:justify-center">
              <div className="w-full">
                <Suspense fallback={<div>Search...</div>}>
                  <SearchBar />
                </Suspense>
              </div>
            </div>

            {/* UserMenu + Cart on the right for md+ */}
            <div className="hidden md:flex items-center justify-end gap-6">
              <CartCount />
              <UserMenu currentUser={currentUser} />
            </div>
          </div>
        </Container>
      </div>

      <Categories />
    </div>
  );
};

export default Navbar;
