import { gql } from "@apollo/client";

export const METRICS_GENERAL = gql`
  mutation MetricsGeneral {
    metricsGeneral {
      excellence
      topgun
      experience
      skydiver
      rider
      haha
      hehe
      huhu
      yoyo
      turu
    }
  }
`;
