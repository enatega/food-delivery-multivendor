export interface Link {
    label: string;
    link: string;
    internal:boolean
  }

export interface FooterSectionProps {
    title: string;
    links: Link[];
  }
  
export  interface FooterLinksProps {
    section: FooterSectionProps;
  }
  