import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { landingData } from "@/data/landing";

export default function FAQ() {
  const { t } = useTranslation();
  return (
    <section id="faq" className="py-20 px-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-black tracking-tighter mb-10 text-center">{t("faq.title")}</h2>
      <Accordion type="single" collapsible className="w-full">
        {landingData.faq.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left font-bold tracking-wide">{item.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
