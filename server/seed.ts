import "./env-loader";
import { eq, and } from "drizzle-orm";
import { db, pool } from "./db";
import { featureFlags, siteSettings, sprintDays, sprintProducts } from "@shared/schema";

const flags = {
  ENABLE_COMMUNITY: true,
  ENABLE_MEMBERSHIP: true,
  ENABLE_AI_OPERATOR: false,
  ENABLE_RADAR: true,
  ENABLE_VAULT: true,
  ENABLE_PUBLIC_PROJECTS: true,
  ENABLE_MANUAL_PAYMENTS: true,
} as const;
const settings = {
  sprint_price_egp: "199",
  membership_price_egp: "10",
  instapay_phone: "",
  instapay_name: "",
} as const;

const days = [
  [0, "راجع حقيقة المنتج", "تأكد إن منتجك بيحل مشكلة محددة وإن شخصًا يقدر يجربه الآن."],
  [1, "اختار المشتري", "حدد شخصًا أو نوع شركة يعاني من المشكلة، واكتب سبب اختيارك."],
  [2, "وضّح العرض", "اكتب المشكلة والنتيجة التي تقدمها والسعر أو الخطوة التالية بوضوح."],
  [3, "اجمع 20 عميلًا محتملًا", "سجّل 20 شخصًا أو شركة تنطبق عليهم مواصفات المشتري."],
  [4, "ابدأ محادثات حقيقية", "اسأل عن آخر مرة ظهرت فيها المشكلة وكيف يتعاملون معها الآن."],
  [5, "راجع الدليل والعرض", "لخّص ما تكرر في الردود وعدّل عرضك بناءً على كلام الناس."],
  [6, "اطلب البيع", "قدّم عرضًا واضحًا لشخص مناسب واطلب خطوة شراء محددة."],
  [7, "فسّر النتيجة", "سجّل ما حدث وحدد تغييرًا واحدًا تختبره بعد ذلك."],
] as const;

async function seed() {
  for (const [key, defaultValue] of Object.entries(flags)) {
    const envValue = process.env[key];
    await db.insert(featureFlags).values({
      key,
      value: envValue === undefined ? defaultValue : envValue === "true",
      description: `Default for ${key}`,
    }).onConflictDoNothing();
  }
  for (const [key, value] of Object.entries(settings)) {
    await db.insert(siteSettings).values({ key, value, description: `Initial value for ${key}` }).onConflictDoNothing();
  }

  let [product] = await db.select().from(sprintProducts).where(eq(sprintProducts.slug, "first-sale-7-day")).limit(1);
  if (!product) {
    [product] = await db.insert(sprintProducts).values({
      slug: "first-sale-7-day",
      name: "تحدي أول بيعة في 7 أيام",
      description: "هدف التحدي هو تنفيذ أول تجربة بيع حقيقية، والحصول على evidence واضح.",
    }).returning();
  }

  for (const [dayNumber, titleAr, missionAr] of days) {
    const found = await db.select({ id: sprintDays.id }).from(sprintDays).where(and(
      eq(sprintDays.sprintProductId, product.id),
      eq(sprintDays.dayNumber, dayNumber),
    )).limit(1);
    if (found.length) continue;
    await db.insert(sprintDays).values({
      sprintProductId: product.id,
      dayNumber,
      titleAr,
      missionAr,
      taskDescriptionAr: missionAr,
      sortOrder: dayNumber,
    });
  }
}

seed().then(() => console.log("Seed completed.")).catch((error: unknown) => {
  console.error("Seed failed.", error);
  process.exitCode = 1;
}).finally(() => pool.end());
