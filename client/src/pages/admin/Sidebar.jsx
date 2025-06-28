import React from "react";
import { Link, Outlet } from "react-router-dom";
import SidebarContent from "@/components/SidebarContent";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronsRight } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="flex">
      {/* Mobile Sidebar */}
      {/* Floating Mobile Sidebar Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50 animate-fade-in">
        <Sheet>
          <SheetTrigger className="p-3 rounded-full bg-white/30 dark:bg-gray-700/30 backdrop-blur-md shadow-lg hover:scale-105 transition-transform duration-300">
            <ChevronsRight className="text-black dark:text-white" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[250px] sm:w-[300px] bg-[#f0f0f0] dark:bg-[#141414]"
          >
            <SheetHeader>
              <SheetTitle className="text-xl mb-4 text-blue-500">Instructor Menu</SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-gray-300 dark:border-gray-700 dark:bg-[#141414] bg-[#f0f0f0] p-5 sticky top-0 h-screen">
        <div className="mt-20">
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:p-24 p-2 bg-white dark:bg-[#141414]">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
