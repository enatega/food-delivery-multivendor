import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ToastTypes } from "../types/toast";
import { IGlobalProps } from "./global.interface";
import { IProvider } from "./layout.interface";

export interface IToastProviderProps extends IProvider {}

export interface IToast {
  type: ToastTypes.TToastSeverity;
  title: string;
  message: string;
  duration?: number;
  loading?: boolean;
}

export interface IToastNotificationComponentProps
  extends Omit<IToast, "duration"> {}

interface ISeverityStyle {
  bgColor: string;
  textColor: string;
  icon: IconDefinition;
  iconBg: string;
}

export interface ISeverityStyles {
  success: ISeverityStyle;
  info: ISeverityStyle;
  error: ISeverityStyle;
  warn: ISeverityStyle;
}

export interface IToastContext extends IGlobalProps {
  showToast: (config: IToast) => void;
}
