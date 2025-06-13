import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { CSSProperties, HTMLInputAutoCompleteAttribute } from "react";

import { NumerTypes } from "../types/number";
import { IGlobalComponentProps } from "./global.interface";

// Global
interface IGlobalTextFieldProps extends IGlobalComponentProps {
  type: string;
  placeholder?: string;
  name: string;
  maxLength?: number;
  value?: string;
  showLabel: boolean;
  style?: CSSProperties;
  isLoading?: boolean;
}
// Extra
interface IIconProperties {
  position: "left" | "right";
  icon: IconDefinition;
  style?: CSSProperties;
}
// Fields
export interface ITextFieldProps extends IGlobalTextFieldProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}
export interface IIconTextFieldProps extends IGlobalTextFieldProps {
  iconProperties: IIconProperties;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export interface IPhoneTextFieldProps extends IGlobalTextFieldProps {
  mask: string;
  showLabel: boolean;
  page?: string;
  onChange?: (value: string) => void;
  // onChange: (event: InputMaskChangeEvent) => void;
}
export interface INumberTextFieldProps
  extends Omit<IGlobalTextFieldProps, "value" | "type" | "maxLength"> {
  value: number | null | undefined;
  min: number;
  max?: number;
  minFractionDigits?: number;
  maxFractionDigits?: number;
  mode?: NumerTypes.TNumberMode;
  currency?: string;
  locale?: string;
  prefix?: string;
  suffix?: string;
  useGrouping?: boolean;
  disabled?: boolean;
  onChange?: (field: string, value: number | null) => void;
  onChangeFieldValue?: (name: string, val: number) => void;
}
export interface IPasswordTextFieldProps
  extends Omit<IGlobalTextFieldProps, "type"> {
  autoComplete?: HTMLInputAutoCompleteAttribute | undefined;
  feedback?: boolean;
  iconProperties?: Omit<IIconProperties, "icon"> & { icon?: IconDefinition };
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ICustomRadiusInputFieldComponentProps
  extends Omit<IGlobalTextFieldProps, "value" | "onChange"> {
  value: number;
  onChange?: (val: number) => void;
  min?: number;
  max?: number;
  loading: boolean;
}

export interface ITimeTextField {
  value: string | null; // Changed from Date to string
  placeholder?: string;
  onChange: (value: string) => void; // Changed to string
  showLabel?: boolean;
  isLoading?: boolean;
  className?: string;
  style?: CSSProperties;
  name?: string;
}

export interface IDateTextField {
  value: string | null; // Changed from Date to string
  placeholder?: string;
  onChange: (value: string) => void; // Changed to string
  showLabel?: boolean;
  isLoading?: boolean;
  className?: string;
  style?: CSSProperties;
  name?: string;
}

export interface ICustomNumberTippingProps extends IGlobalTextFieldProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  loading: boolean;
}
