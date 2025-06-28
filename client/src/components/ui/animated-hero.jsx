import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import TypingEffect from "@/components/ui/TypingEffect"; // ✅ Import here

function Hero() {
  const titles = [
    "AI-Powered.",
    "Expert-Led.",
    "Future-Proof.",
    "Career-Driven Growth.",
  ];

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="lg:pt-26 flex gap-4 py-8 lg:py-12 items-center justify-center flex-col">
          <div>
            <Button variant="secondary" size="sm" className="gap-4">
              <span className="font-bold text-spektr-cyan-600 animate-pulse">
                🚀 New!
              </span>
              <span>Introducing AI Learning Paths</span>
              <MoveRight className="w-4 h-4" />
            </Button>
          </div>

          {/* heading */}
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-6xl md:text-7xl max-w-7xl tracking-tighter text-center font-semibold py-3 gap-10">
              <span className="text-spektr-cyan-50">Empower Your Future</span>
              {/* ✅ Using the extracted TypingEffect component */}
              <TypingEffect titles={titles} />
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
