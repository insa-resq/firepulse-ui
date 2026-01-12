export interface Image {
  id: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  imageSplit: string;
  containsFire: boolean;
  metadata: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  };
}
