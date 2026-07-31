import { gql } from "@apollo/client";

export const METRICS_GENERAL =
  // @multi-vendor-only
  gql`
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
