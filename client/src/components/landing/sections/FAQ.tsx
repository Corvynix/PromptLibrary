import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

export default function FAQ() {
  const { t } = useTranslation();
  return (
    <section id="faq" className="py-20 px-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-black tracking-tighter mb-10 text-center">{t("home.faqTitle")}</h2>
      <Accordion type="single" collapsible className="w-full">
        {(t("home.faqItems", { returnObjects: true }) as Array<{ q: string; a: string }>).map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left font-bold tracking-wide rtl:text-right">{item.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
