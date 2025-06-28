import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BadgeInfo, ClipboardList } from "lucide-react";

const RequirementsSection = ({ points = [] }) => {
  if (points.length === 0) return null;

  return (
    <Accordion type="multiple" defaultValue={["requirements"]} className="w-full">
      <AccordionItem value="requirements">
        <AccordionTrigger className="text-xl font-semibold">
          Requirements ({points.length})
        </AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc pl-5 space-y-1 ">
            {points.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <ClipboardList size={18} className="text-yellow-600 mt-1" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default RequirementsSection;
