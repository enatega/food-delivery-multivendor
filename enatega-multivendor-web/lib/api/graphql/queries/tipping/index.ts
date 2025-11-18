import { gql } from "@apollo/client";

export const GET_TIPS = gql`
    query Tips {
        tips {
            tipVariations
        }
    }
`;
