import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
// import { faker } from "@faker-js/faker";

// Revalidate on New,Update,Delete Product & on New Order
export const getlatestProducts = TryCatch(async (req, res, next) => {
  let products;

  if (myCache.has("latest-products"))
    products = JSON.parse(myCache.get("latest-products") as string);
  else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    myCache.set("latest-products", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

// Revalidate on New,Update,Delete Product & on New Order
// export const getAllCategories = TryCatch(async (req, res, next) => {
//   let categories;
//   let subCategory1;
//   let subCategory2;
//   const {category} = req.body
//       const products = await Product.find({category: category});
//       // console.log(products);
  
//   // Check and fetch categories
//   if (myCache.has("categories")) {
//     categories = JSON.parse(myCache.get("categories") as string);
//   } else {
//     categories = await Product.distinct("category");
//     myCache.set("categories", JSON.stringify(categories));
//   }

//   // Check and fetch subCategory1
//   if(category && category == "all"){
//     if (myCache.has("subCategory1")) {
//       subCategory1 = JSON.parse(myCache.get("subCategory1") as string);
//     } else {
//       subCategory1 = await Product.distinct("subCategory1");
//       myCache.set("subCategory1", JSON.stringify(subCategory1));
//     }
  
//     // Check and fetch subCategory2
//     if (myCache.has("subCategory2")) {
//       subCategory2 = JSON.parse(myCache.get("subCategory2") as string);
//     } else {
//       subCategory2 = await Product.distinct("subCategory2");
//       myCache.set("subCategory2", JSON.stringify(subCategory2));
//     }
//   } else {
//     if (myCache.has("subCategory1")) {
//       subCategory1 = JSON.parse(myCache.get("subCategory1") as string);
//     } else {
//       subCategory1 = [...new Set(products.map(product => product.subCategory1))];
//       myCache.set("subCategory1", JSON.stringify(subCategory1));
//     }
  
//     // Check and fetch subCategory2
//     if (myCache.has("subCategory2")) {
//       subCategory2 = JSON.parse(myCache.get("subCategory2") as string);
//     } else {
//       subCategory2 = [...new Set(products.map(product => product.subCategory2))];
//       myCache.set("subCategory2", JSON.stringify(subCategory2));
//     }
//   }

//   console.log(subCategory1);
//   console.log(subCategory2);
  

//   return res.status(200).json({
//     success: true,
//     categories,
//     subCategory1,
//     subCategory2,
//   });
// });


export const getAllCategories = TryCatch(async (req, res, next) => {
  const { category, subCategory1: subCategoryFirst } = req.body;
  if (!category) {
    return res.status(400).json({ success: false, message: "Category is required" });
  }
  console.log(category);
  
  let categories, subCategory1, subCategory2;

  // Fetch products based on category
  console.log("products");
  const products = await Product.find({ category: category });

  // Fetch categories with caching
  if (myCache.has("categories")) {
    categories = JSON.parse(myCache.get("categories") as string);
  } else {
    categories = await Product.distinct("category");
    myCache.set("categories", JSON.stringify(categories));
  }

  // Determine if category is "all" to fetch all subcategories
  const fetchAllSubCategories = category && category === "all";

  // Fetch subCategory1
  if (fetchAllSubCategories) {
    if (myCache.has("subCategory1")) {
      subCategory1 = JSON.parse(myCache.get("subCategory1") as string);
    } else {
      subCategory1 = await Product.distinct("subCategory1");
      myCache.set("subCategory1", JSON.stringify(subCategory1));
    }
  } else {
    subCategory1 = [...new Set(products.map(product => product.subCategory1))];
  }

  // Fetch subCategory2
  if (subCategoryFirst !== "") {
    if (!myCache.has("subCategory2") || subCategoryFirst !== myCache.get("lastSubCategory1")) {
      const subCat1 = await Product.find({ category: category, subCategory1: subCategoryFirst });

      subCategory2 = [...new Set(subCat1.map(product => product.subCategory2))];
      myCache.set("subCategory2", JSON.stringify(subCategory2));
      myCache.set("lastSubCategory1", subCategoryFirst);
    } else {
      subCategory2 = JSON.parse(myCache.get("subCategory2") as string);
    }
  } else {
    if (fetchAllSubCategories) {
      if (myCache.has("subCategory2")) {
        subCategory2 = JSON.parse(myCache.get("subCategory2") as string);
      } else {
        subCategory2 = await Product.distinct("subCategory2");
        myCache.set("subCategory2", JSON.stringify(subCategory2));
      }
    } else {
      subCategory2 = [...new Set(products.map(product => product.subCategory2))];
    }
  }
  console.log(subCategory1);
  console.log(subCategory2);

  return res.status(200).json({
    success: true,
    categories,
    subCategory1,
    subCategory2,
  });
});



// Revalidate on New,Update,Delete Product & on New Order
export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products;
  if (myCache.has("all-products"))
    products = JSON.parse(myCache.get("all-products") as string);
  else {
    products = await Product.find({});
    myCache.set("all-products", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

export const getSingleProduct = TryCatch(async (req, res, next) => {
  let product;
  const id = req.params.id;
  if (myCache.has(`product-${id}`))
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  else {
    product = await Product.findById(id);

    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    myCache.set(`product-${id}`, JSON.stringify(product));
  }

  return res.status(200).json({
    success: true,
    product,
  });
});

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, price, stock, category, subCategory1, subCategory2, sizes, description } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const images = files['images'] || [];
    const video = files['video'] ? files['video'][0] : "";
console.log('====================================');
console.log(video);
console.log('====================================');
    if (images.length === 0) {
      return next(new ErrorHandler("Please add at least 1 image", 400));
    }

    // if (!images || images.length !== 3 || !video) {
    //   if (images) {
    //     images.forEach((image) => {
    //       rm(image.path, () => {
    //         console.log(`Deleted ${image.path}`);
    //       });
    //     });
    //   }
    //   if (video) {
    //     rm(video.path, () => {
    //       console.log(`Deleted ${video.path}`);
    //     });
    //   }
    //   return next(new ErrorHandler("Please add 3 images and 1 video", 400));
    // }

    if (!name || !price || stock <0 || !category) {
      images.forEach((image) => {
        rm(image.path, () => {
          console.log(`Deleted ${image.path}`);
        });
      });
      if (video) {
            rm(video.path, () => {
              console.log(`Deleted ${video.path}`);
            });
          }
      return next(new ErrorHandler("Please enter All Fields", 400));
    }

    const imagePaths = images.map((image) => image.path);
    const videoPath = video ? video.path : null;

    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      subCategory1: subCategory1.toLowerCase(),
      subCategory2: subCategory2.toLowerCase(),
      photos: imagePaths,
      video: videoPath,
      sizes,
      description
    });

    invalidateCache({ product: true, admin: true });

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
    });
  }
);


export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category, subCategory1, subCategory2, description, sizes } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const images = files['images'];
  const video = files['video'] ? files['video'][0] : null;
  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  // Handle images replacement
  if (images) {
    images.forEach((image) => {
      const {imageIndex} = req.body;
      console.log(imageIndex);
      console.log(isNaN(imageIndex));
      
      
      if (!isNaN(imageIndex) && product.photos[imageIndex]) {
        console.log(imageIndex);
        
        console.log(images);
        rm(product.photos[imageIndex], () => {
          console.log(`Old Photo ${product.photos[imageIndex]} Deleted`);
        });
        product.photos[imageIndex] = image.path;
      }
    });
  }

  // Handle video replacement
  if (video) {
    if (product.video) {
      rm(product.video, () => {
        console.log("Old Video Deleted");
      });
    }
    product.video = video.path;
  }

  // Handle other fields
  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;
  if (subCategory1) product.subCategory1 = subCategory1;
  if (subCategory2) product.subCategory2 = subCategory2;
  if (description) product.description = description;

  if (sizes) {
    try {
      product.sizes = JSON.parse(sizes);
    } catch (error) {
      return next(new ErrorHandler("Invalid sizes format", 400));
    }
  }

  await product.save();

  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
  });
});




export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  // Delete all product photos
  if (product.photos && product.photos.length > 0) {
    product.photos.forEach(photo => {
      rm(photo, () => {
        console.log(`Product Photo ${photo} Deleted`);
      });
    });
  }

  // Delete product video
  if (product.video) {
    rm(product.video, () => {
      console.log("Product Video Deleted");
    });
  }

  // Delete the product document
  await product.deleteOne();

  // Invalidate cache
  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});


export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, subCategory1,subCategory2, price } = req.query;

    const page = Number(req.query.page) || 1;
    // 1,2,3,4,5,6,7,8
    // 9,10,11,12,13,14,15,16
    // 17,18,19,20,21,22,23,24
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };

    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    if (category && category !== "all") baseQuery.category = category;
    if (subCategory1) baseQuery.subCategory1 = subCategory1;
    if (subCategory2) baseQuery.subCategory2 = subCategory2;


    let sortOption: any = {};
    if (category === "all") {
      sortOption.createdAt = -1; // Sort by latest products
    } else if (sort) {
      sortOption.price = sort === "asc" ? 1 : -1;
    }

    const productsPromise = Product.find(baseQuery)
      .sort(sortOption)
      .limit(limit)
      .skip(skip);

    const [products, filteredOnlyProduct] = await Promise.all([
      productsPromise,
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  }
);

// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];

//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\\5ba9bd91-b89c-40c2-bb8a-66703408f986.png",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };

//     products.push(product);
//   }

//   await Product.create(products);

//   console.log({ succecss: true });
// };

// const deleteRandomsProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);

//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }

//   console.log({ succecss: true });
// };
