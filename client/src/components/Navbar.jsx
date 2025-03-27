





import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  HandPlatter,
  Loader2,
  Menu,
  Moon,
  PackageCheck,
  ShoppingCart,
  SquareMenu,
  Sun,
  LogOut,
  UserPlus,
  LayoutDashboard,
  UtensilsCrossed,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Sheet,
  SheetFooter,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { useUserStore } from "@/store/useUserStore";
import { useThemeStore } from "@/store/useThemeStore";

const activeClass = "text-orange-600 font-medium";
const inactiveClass = "text-gray-700 dark:text-gray-200 hover:text-orange-600";
const DesktopNavbar = () => {
  const { user, loading, logout } = useUserStore();
  const { setTheme } = useThemeStore();

  return (
    <nav className="hidden md:flex bg-white dark:bg-gray-800 shadow-lg py-4 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-12">
        
        {/* Logo - Shifted More to the Left */}
        <Link to="/" >
          <h1 className="text-3xl font-extrabold text-orange-600">ROZGAR</h1>
        </Link>

        {/* Navigation Links - Increased Spacing */}
        <div className="flex items-center gap-10 ml-20">
          <NavLink to="/" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
            Home
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
            Profile
          </NavLink>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="text-gray-700 dark:text-gray-200 hover:text-black flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" /> Dashboard
              </MenubarTrigger>
              <MenubarContent className="w-48">
                <NavLink to="/admin/Workers" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                  <MenubarItem className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" /> Add Worker
                  </MenubarItem>
                </NavLink>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>

        {/* Right Side - Increased Spacing */}
        <div className="flex items-center gap-10 ml-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border-2 border-gray-700 text-gray-700 dark:border-gray-200 dark:text-gray-200 hover:border-black">
                <Sun className="h-5 w-5 dark:hidden" />
                <Moon className="h-5 w-5 hidden dark:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Avatar - Moved More Right */}
          <Avatar className="border-2 border-gray-700 dark:border-gray-200">
            <AvatarImage src={user?.profilePicture} alt="Profile" />
            <AvatarFallback>👤</AvatarFallback>
          </Avatar>

          {/* Logout Button - Moved More Right */}
          {loading ? (
            <div className="flex items-center text-gray-700 dark:text-gray-200">
              <Loader2 className="animate-spin h-5 w-5 mr-2" /> Please wait...
            </div>
          ) : (
            <NavLink
              to="#"
              onClick={logout}
              className={({ isActive }) => `flex items-center gap-4 ${isActive ? "text-black font-bold" : " dark:text-gray-200 hover:text-black"}`}
            >
              <LogOut className="h-5 w-5" /> Logout
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};




const MobileNavbar = () => {
  const { user, logout, loading } = useUserStore();
  const { setTheme } = useThemeStore();

  return (
    <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 shadow-lg">
      {/* Left: Hamburger menu (opens sheet from left side) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="rounded-full bg-gray-200 text-black hover:bg-gray-200"
            variant="outline"
          >
            <Menu size="18" />
          </Button>
        </SheetTrigger>
        <SheetContent className="p-4 w-64 left-0">
          <SheetHeader className="mb-4">
            <SheetTitle>ROZGAR</SheetTitle>
          </SheetHeader>
          <div className="space-y-2">
            <Link
              to="/profile"
              className="block py-2 text-gray-700 dark:text-gray-200 hover:text-black"
            >
              Profile
            </Link>
            <Link
              to="/admin/Workers"
              className="block py-2 text-gray-700 dark:text-gray-200 hover:text-black"
            >
              Add Worker
            </Link>
            {loading ? (
              <div className="flex items-center text-gray-700 dark:text-gray-200 py-2">
                <Loader2 className="animate-spin h-5 w-5 mr-2" /> Please wait...
              </div>
            ) : (
              <SheetClose asChild>
                <button
                  onClick={logout}
                  className="w-full text-left py-2 text-gray-700 dark:text-gray-200 hover:text-black"
                >
                  <LogOut className="inline-block h-5 w-5 mr-2" /> Logout
                </button>
              </SheetClose>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Center: ROZGAR Title */}
      <div>
        <Link to="/">
          <h1 className="text-2xl font-bold text-orange-600">ROZGAR</h1>
        </Link>
      </div>

      {/* Right: Theme Toggle and Avatar */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border-2 border-gray-700 text-gray-700 dark:border-gray-200 dark:text-gray-200 hover:border-black"
            >
              <Sun className="h-5 w-5 dark:hidden" />
              <Moon className="h-5 w-5 hidden dark:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Avatar className="border-2 border-gray-700 dark:border-gray-200">
          <AvatarImage src={user?.profilePicture} alt="Profile" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};





const Navbar = () => {
  return (
    <>
      <DesktopNavbar />
      <div className="md:hidden">
        <MobileNavbar />
      </div>
    </>
  );
};

export default Navbar;
