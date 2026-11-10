import { Types } from 'mongoose';
import { z } from 'zod';
import { defineModule } from '../graphql/module.js';
import { objectId, optBool, optNum, optStr } from '../graphql/zod.js';
import { requireRestaurantAccess } from '../auth/guards.js';
import { badInput, must, notFound } from '../lib/errors.js';
import { pageArgs, pageResult, searchRegex } from '../lib/query.js';
import { Addon, Category, Food, Option, Restaurant, SubCategory } from '../models/index.js';

const many = <T extends z.ZodTypeAny>(item: T) => z.union([z.array(item), item]).transform((v) => (Array.isArray(v) ? v : [v]));

const VariationInput = z.object({
  _id: optStr(40),
  title: z.string().trim().max(120).default(''),
  price: z.coerce.number().min(0),
  discounted: optNum,
  addons: z.array(z.string()).max(50).nullish().transform((v) => v ?? []),
  isOutOfStock: optBool,
});

const FoodInput = z.object({
  _id: optStr(40),
  restaurant: objectId,
  category: objectId,
  subCategory: z.preprocess((v) => (v && typeof v === 'object' ? (v as { code?: string }).code : v), optStr(40)),
  title: z.string().trim().min(1).max(200),
  description: optStr(2000),
  image: optStr(2000),
  isActive: optBool,
  isOutOfStock: optBool,
  variations: z.array(VariationInput).min(1).max(50),
});

const SubCategoryInput = z.object({ _id: optStr(40), title: z.string().trim().min(1).max(120), parentCategoryId: optStr(40) });

const CategoryInput = z.object({
  _id: optStr(40),
  restaurant: objectId,
  title: z.string().trim().min(1).max(120),
  image: optStr(2000),
  subCategories: z.array(SubCategoryInput).max(100).optional(),
});

const AddonItem = z.object({
  _id: optStr(40),
  title: z.string().trim().min(1).max(120),
  description: optStr(500),
  options: z.array(z.string()).max(100).default([]),
  quantityMinimum: z.coerce.number().int().min(0).default(0),
  quantityMaximum: z.coerce.number().int().min(1).default(1),
});

const OptionItem = z.object({
  _id: optStr(40),
  title: z.string().trim().min(1).max(120),
  description: optStr(500),
  price: z.coerce.number().min(0).default(0),
  isOutOfStock: optBool,
});

const AddonInput = z.object({ restaurant: objectId, addons: many(AddonItem) });
const OptionInput = z.object({ restaurant: objectId, options: many(OptionItem) });

async function restaurantDoc(id: string) {
  return must(await Restaurant.findById(id).lean(), 'Restaurant');
}

async function assertOptionsBelong(restaurant: string, optionIds: string[]) {
  const valid = optionIds.filter((id) => Types.ObjectId.isValid(id));
  if (valid.length !== optionIds.length) throw badInput('Invalid option id.');
  const count = await Option.countDocuments({ _id: { $in: valid }, restaurant });
  if (count !== new Set(valid).size) throw badInput('Some options do not belong to this store.');
}

async function assertAddonsBelong(restaurant: string, addonIds: string[]) {
  const ids = [...new Set(addonIds.filter(Boolean))];
  if (ids.some((id) => !Types.ObjectId.isValid(id))) throw badInput('Invalid addon id.');
  const count = await Addon.countDocuments({ _id: { $in: ids }, restaurant });
  if (count !== ids.length) throw badInput('Some addons do not belong to this store.');
}

async function syncSubCategories(categoryId: string, subs: z.infer<typeof SubCategoryInput>[] | undefined) {
  if (!subs) return;
  for (const s of subs) {
    if (s._id && Types.ObjectId.isValid(s._id)) await SubCategory.updateOne({ _id: s._id, parentCategoryId: categoryId }, { title: s.title });
    else await SubCategory.create({ title: s.title, parentCategoryId: categoryId });
  }
}

function paginated<T>(load: (filter: Record<string, unknown>) => { list: Promise<T[]>; count: Promise<number> }) {
  return load;
}
void paginated;

async function listPage(model: typeof Addon | typeof Option | typeof Category, args: { restaurantId: string; page?: number; limit?: number; search?: string }, field: string) {
  const { page, limit, skip } = pageArgs(args.page, args.limit);
  const filter: Record<string, unknown> = { restaurant: args.restaurantId };
  const re = searchRegex(args.search);
  if (re) filter[field] = re;
  const [data, total] = await Promise.all([
    (model as typeof Addon).find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    (model as typeof Addon).countDocuments(filter),
  ]);
  return pageResult(data, total, page, limit);
}

export const menuModule = defineModule({
  name: 'menu',
  inputs: {
    FoodInput,
    CategoryInput,
    SubCategoryInput,
    AddonInput,
    editAddonInput: AddonInput,
    CreateOptionInput: OptionInput,
    editOptionInput: OptionInput,
  },
  resolvers: {
    Query: {
      restaurantAddonsPaginated: async (_p, args: { restaurantId: string; page?: number; limit?: number; search?: string }, ctx) => {
        await requireRestaurantAccess(ctx, args.restaurantId);
        return listPage(Addon, args, 'title');
      },
      restaurantOptionsPaginated: async (_p, args: { restaurantId: string; page?: number; limit?: number; search?: string }, ctx) => {
        await requireRestaurantAccess(ctx, args.restaurantId);
        return listPage(Option, args, 'title');
      },
      restaurantCategoriesPaginated: async (_p, args: { restaurantId: string; page?: number; limit?: number; search?: string }, ctx) => {
        await requireRestaurantAccess(ctx, args.restaurantId);
        const res = await listPage(Category, args, 'title');
        const ids = res.data.map((c: { _id: unknown }) => String(c._id));
        const foods: { category: unknown }[] = await Food.find({ category: { $in: ids }, isDeleted: { $ne: true } } as Record<string, unknown>).lean();
        return { ...res, data: res.data.map((c: { _id: unknown }) => ({ ...c, foods: foods.filter((f) => String(f.category) === String(c._id)) })) };
      },
      subCategories: async () => SubCategory.find().sort({ title: 1 }).limit(2000).lean(),
      subCategoriesByParentId: async (_p, { parentCategoryId }: { parentCategoryId: string }) =>
        SubCategory.find({ parentCategoryId }).sort({ createdAt: 1 }).lean(),
      subCategory: async (_p, { _id }: { _id?: string }) => (_id && Types.ObjectId.isValid(_id) ? SubCategory.findById(_id).lean() : null),
      fetchCategoryDetailsByStoreId: async (_p, { storeId }: { storeId: string }) => {
        const r = await restaurantDoc(storeId);
        const cats = await Category.find({ restaurant: storeId, isActive: { $ne: false } }).sort({ order: 1, createdAt: 1 }).lean();
        const subs = await SubCategory.find({ parentCategoryId: { $in: cats.map((c) => String(c._id)) } }).lean();
        return cats.map((c) => ({
          id: c._id,
          label: c.title,
          url: `/store/${r.slug}/${c._id}`,
          items: subs.filter((s) => s.parentCategoryId === String(c._id)).map((s) => ({ id: s._id, label: s.title, url: `/store/${r.slug}/${c._id}/${s._id}` })),
        }));
      },
      fetchCategoryDetailsByStoreIdForMobile: async (_p, { storeId }: { storeId: string }) => {
        await restaurantDoc(storeId);
        const cats = await Category.find({ restaurant: storeId, isActive: { $ne: false } }).sort({ order: 1, createdAt: 1 }).lean();
        const firstFoods = await Food.aggregate<{ _id: unknown; food: unknown }>([
          { $match: { category: { $in: cats.map((c) => c._id) }, isDeleted: { $ne: true }, isActive: true } },
          { $sort: { order: 1, createdAt: 1 } },
          { $group: { _id: '$category', food: { $first: '$_id' } } },
        ]);
        const map = new Map(firstFoods.map((f) => [String(f._id), String(f.food)]));
        return cats.map((c) => ({ id: c._id, category_name: c.title, url: c.image ?? null, food_id: map.get(String(c._id)) ?? null }));
      },
    },
    Mutation: {
      createCategory: async (_p, { category }: { category: z.infer<typeof CategoryInput> }, ctx) => {
        await requireRestaurantAccess(ctx, category.restaurant);
        if (await Category.exists({ restaurant: category.restaurant, title: new RegExp(`^${category.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') })) {
          throw badInput('A category with this title already exists.');
        }
        const order = await Category.countDocuments({ restaurant: category.restaurant });
        const c = await Category.create({ restaurant: category.restaurant, title: category.title, image: category.image, order });
        await syncSubCategories(String(c._id), category.subCategories);
        return restaurantDoc(category.restaurant);
      },
      editCategory: async (_p, { category }: { category: z.infer<typeof CategoryInput> }, ctx) => {
        await requireRestaurantAccess(ctx, category.restaurant);
        if (!category._id) throw badInput('Category id is required.');
        const c = must(await Category.findOneAndUpdate({ _id: category._id, restaurant: category.restaurant }, { title: category.title, image: category.image }, { returnDocument: 'after' }), 'Category');
        await syncSubCategories(String(c._id), category.subCategories);
        return restaurantDoc(category.restaurant);
      },
      deleteCategory: async (_p, { id, restaurant }: { id: string; restaurant: string }, ctx) => {
        await requireRestaurantAccess(ctx, restaurant);
        must(await Category.findOneAndDelete({ _id: id, restaurant }), 'Category');
        await Food.updateMany({ category: id }, { isDeleted: true, isActive: false });
        await SubCategory.deleteMany({ parentCategoryId: id });
        return restaurantDoc(restaurant);
      },
      createFood: async (_p, { foodInput }: { foodInput: z.infer<typeof FoodInput> }, ctx) => upsertFood(ctx, foodInput),
      editFood: async (_p, { foodInput }: { foodInput: z.infer<typeof FoodInput> }, ctx) => upsertFood(ctx, foodInput),
      deleteFood: async (_p, { id, restaurant }: { id: string; restaurant: string; categoryId: string }, ctx) => {
        await requireRestaurantAccess(ctx, restaurant);
        must(await Food.findOneAndUpdate({ _id: id, restaurant }, { isDeleted: true, isActive: false }), 'Food');
        return restaurantDoc(restaurant);
      },
      updateFoodOutOfStock: async (_p, { id, restaurant }: { id: string; restaurant: string; categoryId: string }, ctx) => {
        await requireRestaurantAccess(ctx, restaurant);
        const f = must(await Food.findOne({ _id: id, restaurant }), 'Food');
        f.isOutOfStock = !f.isOutOfStock;
        await f.save();
        return true;
      },
      createAddons: async (_p, { addonInput }: { addonInput: z.infer<typeof AddonInput> }, ctx) => {
        await requireRestaurantAccess(ctx, addonInput.restaurant);
        for (const a of addonInput.addons) {
          if (a.quantityMinimum > a.quantityMaximum) throw badInput('quantityMinimum cannot exceed quantityMaximum.');
          await assertOptionsBelong(addonInput.restaurant, a.options);
        }
        await Addon.insertMany(addonInput.addons.map(({ _id, ...a }) => ({ ...a, restaurant: addonInput.restaurant })));
        return restaurantDoc(addonInput.restaurant);
      },
      editAddon: async (_p, { addonInput }: { addonInput: z.infer<typeof AddonInput> }, ctx) => {
        await requireRestaurantAccess(ctx, addonInput.restaurant);
        for (const a of addonInput.addons) {
          if (!a._id) throw badInput('Addon id is required.');
          if (a.quantityMinimum > a.quantityMaximum) throw badInput('quantityMinimum cannot exceed quantityMaximum.');
          await assertOptionsBelong(addonInput.restaurant, a.options);
          must(await Addon.findOneAndUpdate({ _id: a._id, restaurant: addonInput.restaurant }, { ...a, _id: undefined }), 'Addon');
        }
        return restaurantDoc(addonInput.restaurant);
      },
      deleteAddon: async (_p, { id, restaurant }: { id: string; restaurant: string }, ctx) => {
        await requireRestaurantAccess(ctx, restaurant);
        must(await Addon.findOneAndDelete({ _id: id, restaurant }), 'Addon');
        await Food.updateMany({ restaurant }, { $pull: { 'variations.$[].addons': id } });
        return restaurantDoc(restaurant);
      },
      createOptions: async (_p, { optionInput }: { optionInput: z.infer<typeof OptionInput> }, ctx) => {
        await requireRestaurantAccess(ctx, optionInput.restaurant);
        await Option.insertMany(optionInput.options.map(({ _id, ...o }) => ({ ...o, restaurant: optionInput.restaurant })));
        return restaurantDoc(optionInput.restaurant);
      },
      editOption: async (_p, { optionInput }: { optionInput: z.infer<typeof OptionInput> }, ctx) => {
        await requireRestaurantAccess(ctx, optionInput.restaurant);
        for (const o of optionInput.options) {
          if (!o._id) throw badInput('Option id is required.');
          must(await Option.findOneAndUpdate({ _id: o._id, restaurant: optionInput.restaurant }, { ...o, _id: undefined }), 'Option');
        }
        return restaurantDoc(optionInput.restaurant);
      },
      deleteOption: async (_p, { id, restaurant }: { id: string; restaurant: string }, ctx) => {
        await requireRestaurantAccess(ctx, restaurant);
        must(await Option.findOneAndDelete({ _id: id, restaurant }), 'Option');
        await Addon.updateMany({ restaurant }, { $pull: { options: id } });
        return restaurantDoc(restaurant);
      },
      createSubCategories: async (_p, { subCategories }: { subCategories: z.infer<typeof SubCategoryInput>[] }, ctx) => {
        const parents = [...new Set(subCategories.map((s) => s.parentCategoryId).filter(Boolean))] as string[];
        if (parents.length === 0) throw badInput('parentCategoryId is required.');
        for (const pid of parents) {
          const cat = must(await Category.findById(pid).select('restaurant').lean(), 'Category');
          await requireRestaurantAccess(ctx, String(cat.restaurant));
        }
        const docs = await SubCategory.insertMany(subCategories.map((s) => ({ title: s.title, parentCategoryId: s.parentCategoryId })));
        return docs.map((d) => String(d._id));
      },
      deleteSubCategory: async (_p, { _id }: { _id: string }, ctx) => {
        const sub = must(await SubCategory.findById(_id), 'SubCategory');
        const cat = await Category.findById(sub.parentCategoryId).select('restaurant').lean();
        if (!cat) throw notFound('Category');
        await requireRestaurantAccess(ctx, String(cat.restaurant));
        await sub.deleteOne();
        await Food.updateMany({ subCategory: _id }, { $unset: { subCategory: 1 } });
        return _id;
      },
    },
    Category: {
      foods: async (c: { _id: unknown; foods?: unknown[]; restaurant?: unknown }, _a, ctx) => {
        if (c.foods) return c.foods;
        const foods = c.restaurant ? await ctx.loaders.foodsByRestaurant.load(String(c.restaurant)) : [];
        return foods.filter((f: { category: unknown }) => String(f.category) === String(c._id));
      },
    },
  },
});

async function upsertFood(ctx: Parameters<typeof requireRestaurantAccess>[0], input: z.infer<typeof FoodInput>) {
  await requireRestaurantAccess(ctx, input.restaurant);
  must(await Category.exists({ _id: input.category, restaurant: input.restaurant }), 'Category');
  await assertAddonsBelong(input.restaurant, input.variations.flatMap((v) => v.addons));
  const data = {
    restaurant: input.restaurant,
    category: input.category,
    subCategory: input.subCategory,
    title: input.title,
    description: input.description,
    image: input.image,
    isActive: input.isActive ?? true,
    isOutOfStock: input.isOutOfStock ?? false,
    variations: input.variations.map((v) => ({
      ...(v._id && Types.ObjectId.isValid(v._id) ? { _id: v._id } : {}),
      title: v.title,
      price: v.price,
      discounted: v.discounted,
      addons: v.addons,
      isOutOfStock: v.isOutOfStock ?? false,
    })),
  };
  if (input._id) {
    must(await Food.findOneAndUpdate({ _id: input._id, restaurant: input.restaurant, isDeleted: { $ne: true } }, data, { runValidators: true }), 'Food');
  } else {
    const order = await Food.countDocuments({ category: input.category });
    await Food.create({ ...data, order });
  }
  return restaurantDoc(input.restaurant);
}
