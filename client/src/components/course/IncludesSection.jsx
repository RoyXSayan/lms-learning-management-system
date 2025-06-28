import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, ListChecks } from "lucide-react";

const IncludesSection = ({ course }) => {
  const { includes = [] } = course;

  if (includes.length === 0) return null;

  return (
    <Accordion type="multiple" defaultValue={["includes"]} className="w-full">
      <AccordionItem value="includes">
        <AccordionTrigger className="text-xl font-semibold">
          This course includes ({includes.length})
        </AccordionTrigger>
        <AccordionContent>
          <ul className="list-none space-y-2">
            {includes.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <ListChecks className="text-blue-600 mt-1" size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default IncludesSection;
