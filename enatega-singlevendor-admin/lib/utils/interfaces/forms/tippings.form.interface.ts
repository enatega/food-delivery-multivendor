export interface ITippingsForm {
  tip1: number;
  tip2: number;
  tip3: number;
}

export interface ITippingErrors {
  tip1?: number[];
  tip2?: number[];
  tip3?: number[];
}

export interface ITippingResponse {
  tips: {
    __typename: 'Tipping';
    _id: string;
    tipVariations: number[];
    enabled: boolean;
  };
}
