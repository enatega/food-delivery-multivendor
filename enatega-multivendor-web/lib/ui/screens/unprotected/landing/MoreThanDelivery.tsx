import { FiArrowRight, FiHome, FiSmartphone } from "react-icons/fi";
import { PiScooter } from "react-icons/pi";
import { useTranslations } from "next-intl";

const items = [
  { id: "customer", Icon: FiSmartphone },
  { id: "business", Icon: FiHome },
  { id: "rider", Icon: PiScooter },
] as const;

export default function MoreThanDelivery() {
  const t = useTranslations("Landing.more");

  return (
    <section aria-labelledby="more-than-delivery" className="relative overflow-hidden bg-dispatch-ground px-6 pb-10 pt-4 md:px-8 lg:min-h-[178px] lg:px-12 lg:py-0 xl:px-16">
      <svg aria-hidden viewBox="0 0 1720 178" preserveAspectRatio="none" className="absolute inset-0 hidden h-full w-full lg:block">
        <path d="M0 154H365C402 154 424 132 424 96V72C424 42 443 28 474 28H1720" fill="none" stroke="var(--primary-dark)" strokeWidth="2" />
        {[540, 915, 1300].map((cx) => <circle key={cx} cx={cx} cy="28" r="6" fill="var(--dispatch-ground)" stroke="var(--primary-dark)" strokeWidth="3" />)}
      </svg>
      <div className="relative mx-auto grid max-w-dispatch-page gap-9 lg:grid-cols-[27%_73%] lg:items-center">
        <h2 id="more-than-delivery" className="pt-2 text-[clamp(2rem,2.4vw,2.8rem)] font-medium tracking-[-0.035em] text-dispatch-ink lg:pt-0">
          {t("title")} <span className="font-editorial italic text-primary-dark">{t("accent")}</span>
        </h2>
        <div className="grid gap-5 sm:grid-cols-3 lg:h-[178px] lg:items-center lg:gap-8 lg:pt-8">
          {items.map(({ id, Icon }) => (
            <article key={id} className="grid grid-cols-[52px_1fr_auto] items-center gap-4 border-t border-dispatch-line py-5 sm:border-0 sm:py-0">
              <Icon aria-hidden className="h-11 w-11 stroke-[1.35] text-primary-dark" />
              <div>
                <h3 className="text-sm font-semibold text-dispatch-ink">{t(`items.${id}.title`)}</h3>
                <p className="mt-1 max-w-[24ch] text-xs leading-5 text-dispatch-muted">{t(`items.${id}.body`)}</p>
              </div>
              <FiArrowRight aria-hidden className="h-5 w-5 text-dispatch-ink rtl:rotate-180" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
