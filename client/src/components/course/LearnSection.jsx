import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpenCheck, CheckCircle } from "lucide-react";

const LearnSection = ({ points = [] }) => {
  if (points.length === 0) return null;

  return (
    <Accordion type="multiple" defaultValue={["learn"]} className="w-full">
      <AccordionItem value="learn">
        <AccordionTrigger className="text-xl font-semibold">
          What you'll learn ({points.length})
        </AccordionTrigger>
        <AccordionContent>
          <ul className="list-none space-y-2">
            {points.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <BookOpenCheck size={18} className="text-green-600 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default LearnSection;
