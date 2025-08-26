import { ILocation } from "@/lib/utils/interfaces";

export namespace LocationNameSpace {
  export type LocationCallback = (
    error: string | null,
    location?: ILocation
  ) => void;
}
