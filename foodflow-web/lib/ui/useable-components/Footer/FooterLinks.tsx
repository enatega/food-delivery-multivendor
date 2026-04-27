import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import FooterSection from "./FooterSection";
import FooterLinkItem from "./FooterLinkItem";
import "primeicons/primeicons.css";
import { FooterLinksProps } from "@/lib/utils/interfaces/footer.interface";

const FooterLinks: React.FC<FooterLinksProps> = ({ section }) => {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
    return (
        <div className="w-full">
            {/* Grid for medium and up */}
            <div className="hidden md:grid ">
                <FooterSection
                    key={section.title}
                    title={section.title}
                    links={section.links}
                />
            </div>

            {/* Accordion for small screens */}
            <div className="md:hidden">
                <Accordion
                    activeIndex={activeIndex}
                    onTabChange={(e) => {
                        if (Array.isArray(e.index)) {
                            setActiveIndex(e.index[0] ?? null);
                        } else {
                            setActiveIndex(e.index);
                        }
                    }}
                    className="custom-accordion bg-green"
                >
                    <AccordionTab
                        key={section.title}
                        header={
                            <div className="flex justify-between w-[90%]">
                                <span>{section.title}</span>
                                {activeIndex === 0 ? (
                                    <i className="pi pi-chevron-down"></i>
                                ) : (
                                    <i className="pi pi-chevron-right"></i>
                                )}
                            </div>
                        }
                    >
                        <ul className="space-y-2">
                            {section.links.map((link) => (
                                <FooterLinkItem
                                    key={link.label}
                                    label={link.label}
                                    link={link.link}
                                    internal={link.internal}
                                />
                            ))}
                        </ul>
                    </AccordionTab>
                </Accordion>
            </div>
        </div>
    );
};

export default FooterLinks;
