export type Address = {
  message: null;
  results: [
    {
      address1: string;
      address2: string;
      address3: string;
      kana1: string;
      kana2: string;
      kana3: string;
      prefcode: string;
      zipcode: string;
    },
  ];
  status: 200 | 400 | 500;
};
