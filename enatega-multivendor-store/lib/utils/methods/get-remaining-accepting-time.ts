import { MAX_TIME } from "../constants";

export const getRemainingAcceptingTime = (acceptedAt: string) =>
  Math.floor(
    (new Date(acceptedAt).getTime() + MAX_TIME * 1000 - Date.now()) / 1000,
  );
