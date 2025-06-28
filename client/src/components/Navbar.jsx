import { Menu, School } from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Logout Successfully");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <div
      className="h-16 fixed top-0 left-0 right-0 z-50 
  backdrop-blur-md bg-white/30 dark:bg-[#0A0A0A]/40 
  border-b border-white/20 dark:border-gray-800 shadow-sm"
    >
      {/* Desktop Responsive*/}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full ">
        <div className="flex items-center gap-2">
          <Link to="/">
            <img
              src="/assets/logo.svg"
              alt="CoreGyan Logo"
              className="object-contain hidden md:block"
              style={{
                height: "60px",
                width: "160px",
              }}
            />
          </Link>
        </div>
        {/* User and darkmode icons */}
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex flex-row flex-wrap items-center gap-12">
                  <Avatar>
                    <AvatarImage
                      src={
                        user?.photoURL ||
                        "https://static.vecteezy.com/ti/vecteur-libre/t1/6487917-homme-avatar-vecteur-icone-gratuit-vectoriel.jpg"
                      }
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link to="my-learning">My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {" "}
                    <Link to="profile">Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler}>
                    Log out
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    {(user?.role === "instructor" ||
                      user?.role === "owner") && (
                      <Link to="/admin/dashboard">Dashboard</Link>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                {user?.role === "owner" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin/owner-dashboard">
                        <Button className="w-full text-left" variant="default">
                          👑 Owner Dashboard
                        </Button>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button variant="outline" onClick={() => navigate("/login")}>
                Signup
              </Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>

      {/* Mobile Responsive */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <Link to="/">
          <img
            src="/assets/logo.svg"
            alt="CoreGyan Logo"
            className="object-contain"
            style={{
              height: "60px",
              width: "160px",
            }}
          />
        </Link>
        <MobileNavbar user={user} />
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Logout Successfully");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <Sheet>
      <SheetTrigger size="icon" className="rounded-full">
        <Menu />
      </SheetTrigger>

      <SheetContent className="flex flex-col backdrop-blur-md bg-white/30 dark:bg-[#0A0A0A]/40 border-r border-white/20 dark:border-gray-800 shadow-md">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle>
            <img
              src="/assets/logo.svg"
              alt="CoreGyan Logo"
              className="object-contain"
              style={{
                height: "60px",
                width: "160px",
              }}
            />
          </SheetTitle>
          <DarkMode />
        </SheetHeader>

        <Separator className="mr-2" />

        {user ? (
          // ✅ When logged in
          <nav className="flex flex-col space-y-4 mt-4">
            <SheetClose asChild>
              <Link to="/my-learning" className="hover:text-blue-400">
                My Learning
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link to="/profile" className="hover:text-blue-400">
                Edit Profile
              </Link>
            </SheetClose>

            {/* instructor dashboard */}
            <SheetClose asChild>
              {(user?.role === "instructor" || user?.role === "owner") && (
                <SheetClose asChild>
                  <Button onClick={() => navigate("/admin/dashboard")}>
                    Dashboard
                  </Button>
                </SheetClose>
              )}
            </SheetClose>

            {user.role === "owner" && (
              <SheetFooter className="flex flex-col space-y-2 mt-4">
                {user.role === "owner" && (
                  <SheetClose asChild>
                    <Button
                      className="w-full text-base font-semibold flex items-center justify-center gap-2"
                      onClick={() => navigate("/admin/owner-dashboard")}
                    >
                      👑 Owner Dashboard
                    </Button>
                  </SheetClose>
                )}
              </SheetFooter>
            )}
            {/* logout button */}
            <SheetClose asChild>
              <Button variant="destructive" onClick={logoutHandler}>
                Logout
              </Button>
            </SheetClose>
          </nav>
        ) : (
          // ✅ When logged out
          <div className="flex flex-col space-y-4 mt-4">
            <SheetClose asChild>
              <Button onClick={() => navigate("/login")} variant="outline">
                Login
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button onClick={() => navigate("/login")} variant="outline">
                Signup
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
