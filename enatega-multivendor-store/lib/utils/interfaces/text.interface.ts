import { IGlobalComponentProps } from "./global.interface";

export interface ITextDefaultComponentProps extends IGlobalComponentProps {
  bold?: boolean;
  bolder?: boolean;
  center?: boolean;
  right?: boolean;
  small?: boolean;
  XL?: boolean;
  H5?: boolean;
  H4?: boolean;
  H3?: boolean;
  H2?: boolean;
  H1?: boolean;
  uppercase?: boolean;
  lineOver?: boolean;
  numberOfLines?: number;
  textColor?: string;
}
