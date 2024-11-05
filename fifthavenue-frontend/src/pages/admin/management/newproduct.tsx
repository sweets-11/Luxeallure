import { ChangeEvent, FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useNewProductMutation } from "../../../redux/api/productAPI";
import { RootState } from "../../../redux/store";
import { responseToast } from "../../../utils/features";

const NewProduct = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [subCategoryFirst, setSubCategoryFirst] = useState<string>("");
  const [subCategorySecond, setSubCategorySecond] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [sizes, setSizes] = useState<string[]>([""]);
  const [photoPrevs, setPhotoPrevs] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [videoPrev, setVideoPrev] = useState<string>("");
  const [video, setVideo] = useState<File | null>(null);

  const [newProduct] = useNewProductMutation();
  const navigate = useNavigate();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newPhotos = [...photos, file];
      setPhotos(newPhotos);

      const preview = URL.createObjectURL(file);
      setPhotoPrevs([...photoPrevs, preview]);
    }
  };

  const removeImageHandler = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPhotoPrevs = photoPrevs.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setPhotoPrevs(newPhotoPrevs);
  };

  const changeVideoHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
      setVideoPrev(URL.createObjectURL(file));
    }
  };

  const handleCategoryClick = (category: string) => {
    setCategory(category);
  };

  const handleSizeChange = (index: number, value: string) => {
    const newSizes = [...sizes];
    newSizes[index] = value;
    setSizes(newSizes);
  };

  const addSizeField = () => {
    setSizes([...sizes, ""]);
  };

  const removeSizeField = (index: number) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    setSizes(newSizes);
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !price || stock < 0 || !category || photos.length === 0) return;

    const formData = new FormData();

    formData.set("name", name);
    formData.set("price", price.toString());
    formData.set("stock", stock.toString());
    formData.set("category", category);
    formData.set("subCategory1", subCategoryFirst);
    formData.set("subCategory2", subCategorySecond);
    formData.set("description", description);

    photos.forEach(photo => {
      formData.append("images", photo);
    });

    if (video) { formData.append("video", video); }

    sizes.forEach(size => {
      formData.append("sizes", size);
    });

    const res = await newProduct({ id: user?._id!, formData });

    responseToast(res, navigate, "/admin/product");
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Category</label>
              <input
                required
                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <div className="category-buttons">
                <button type="button" className="category-btn" onClick={() => handleCategoryClick("men")}>
                  Men
                </button>
                <button type="button" className="category-btn" onClick={() => handleCategoryClick("women")}>
                  Women
                </button>
                <button type="button" className="category-btn" onClick={() => handleCategoryClick("kids")}>
                  Kids
                </button>
                <button type="button" className="category-btn" onClick={() => handleCategoryClick("jewellery")}>
                  Jewellery
                </button>
                <button type="button" className="category-btn" onClick={() => handleCategoryClick("preowned")}>
                  Pre-Owned
                </button>
              </div>
            </div>
            <div>
              <label>SubCategory1</label>
              <input
                required
                type="text"
                placeholder="eg. Accessories"
                value={subCategoryFirst}
                onChange={(e) => setSubCategoryFirst(e.target.value)}
              />
            </div>
            <div>
              <label>SubCategory2</label>
              <input
                required
                type="text"
                placeholder="eg. Necklace"
                value={subCategorySecond}
                onChange={(e) => setSubCategorySecond(e.target.value)}
              />
            </div>
            <div>
              <label>Sizes</label>
              {sizes.map((size, index) => (
                <div key={index}>
                  <input
                    required
                    className="sizeInput"
                    type="text"
                    placeholder="Size"
                    value={size}
                    onChange={(e) => handleSizeChange(index, e.target.value)}
                  />
                  <button type="button" onClick={() => removeSizeField(index)}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addSizeField}>Add Size</button>
            </div>
            <div>
              <label>Description</label>
              <input
                required
                type="text"
                placeholder="Product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label>Photos (max 3 images)</label>
              <input required type="file" onChange={changeImageHandler} />
            </div>
            {photoPrevs.map((photoPrev, index) => (
              <div key={index}>
                <img style={{ width: "200px", height: "auto" }} src={photoPrev} alt={`Preview ${index + 1}`} />
                <button type="button" onClick={() => removeImageHandler(index)}>Remove</button>
              </div>
            ))}
            <div>
              <label>Video (Optional)</label>
              <input type="file" onChange={changeVideoHandler} />
            </div>
            {videoPrev && <video style={{ width: "300px", height: "200px" }} src={videoPrev} controls />}
            <button type="submit">Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
