import { ISubCategory } from '../category.interface';

export interface ICategoryForm {
  _id?: string;
  title: string;
  subCategories: ISubCategory[];
}

export interface ICategoryErrors {
  _id?: string[];
  title: string[];
}
