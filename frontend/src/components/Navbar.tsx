import React, { useEffect, useState } from "react";
import { useAppData } from "../context/AppContext";
import { useLocation, useSearchParams, Link } from "react-router-dom";
import { CgShoppingCart } from "react-icons/cg";
import { BiMapPin, BiSearch } from "react-icons/bi";

export const Navbar = () => {
  const { isAuth } = useAppData();
  const currentLocation = useLocation();

  const isHomePage = currentLocation.pathname === "/";

  const [searchParam, setSearchParam] = useSearchParams();
  const [search, setSearch] = useState(searchParam.get("search") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        setSearchParam({ search });
      } else {
        setSearchParam({});
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="text-xl sm:text-2xl font-bold text-orange-700">
          Tomato
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/cart" className="relative">
            <CgShoppingCart className="h-6 w-6 text-orange-700" />
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-700 text-xs font-semibold text-white">
              0
            </span>
          </Link>

          {isAuth ? (
            <Link
              to="/account"
              className="text-sm sm:text-base font-medium text-orange-700 hover:underline"
            >
              Account
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-sm sm:text-base font-medium text-orange-700 hover:underline"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Search Section */}
      {isHomePage && (
        <div className="border-t px-4 py-3">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-lg border shadow-sm overflow-hidden">
              {/* Location */}
              <div className="flex items-center gap-2 px-3 py-2 sm:border-r text-gray-700 bg-gray-50 sm:bg-transparent">
                <BiMapPin className="h-4 w-4 text-orange-700" />
                <span className="text-sm truncate max-w-[120px]">City</span>
              </div>

              {/* Search Input */}
              <div className="flex flex-1 items-center gap-2 px-3">
                <BiSearch className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search For Restaurant"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full py-2 text-sm outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
