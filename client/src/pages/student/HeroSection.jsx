import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Rocket, Flame } from "lucide-react";
import { BeamsBackground } from "@/components/ui/beams-background";
import { Hero} from "@/components/ui/animated-hero"; // ✅ import the typing animation only
import Footer from "@/components/ui/footer";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };

  return (
    <BeamsBackground intensity="strong" className="relative  pb-10">
     <div className="relative px-6 max-w-7xl mx-auto text-white flex flex-col items-center justify-center h-full gap-2 z-10 text-center pt-10 pb-4">

        {/* === Headline with imported TypingAnimation === */}
      <Hero />
        {/* === Search Bar === */}
        <form
          onSubmit={searchHandler}
          className="lg:-mt-5 flex items-center bg-white dark:bg-zinc-900 rounded-full shadow-lg overflow-hidden max-w-xl w-full"
        >
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for courses"
            className=" flex-grow px-6 py-3 border-none text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-full"
          >
            <Search className="w-4 h-4 mr-2" /> Search
          </Button>
        </form>

        {/* === CTA Buttons === */}
        <div className="flex gap-4 mt-6">
          <Button
            onClick={() => navigate(`/course/search?query`)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-full"
          >
            <Rocket className="w-4 h-4 mr-2" /> Explore Courses
          </Button>
          <Button
            onClick={() =>
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              })
            }
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-blue-600 rounded-full"
          >
            <Flame className="w-4 h-4 mr-2" /> Trending Now
          </Button>
        </div>
        
      </div>
    </BeamsBackground>
  );
};

export default HeroSection;
