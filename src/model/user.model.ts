export interface UserModel {
  id: number;
  username: string;
  email: string;
  role: 'Sap' | 'Cpl' | 'Cch' | 'Sgt' | 'Sch'| 'Adj' | 'Adc' | 'Ltn' | 'Cne' | 'Cdt' | 'Lcl' | 'Col' | 'Gnl' ;
  rights: string[];

}
