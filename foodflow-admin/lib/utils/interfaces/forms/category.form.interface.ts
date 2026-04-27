import { ISubCategory } from '../category.interface';

export interface ICategoryForm {
  _id?: string;
  title: string;
  subCategories: ISubCategory[];
  image?: string | null;
}

export interface ICategoryErrors {
  _id?: string[];
  title: string[];
  image: string[];
}
