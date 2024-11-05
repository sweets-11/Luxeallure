import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/loader";
import {
  useDeleteProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
} from "../../../redux/api/productAPI";
import { RootState, server } from "../../../redux/store";
import { responseToast } from "../../../utils/features";

const ProductManagement = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const params = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useProductDetailsQuery(params.id!);

  const { photos = [], video = "", name, stock, category, subCategory1, subCategory2, sizes, description, price } =
    data?.product || {
      photos: [],
      video: "",
      category: "",
      subCategory1: "",
      subCategory2: "",
      description: "",
      name: "",
      stock: 0,
      price: 0,
      sizes: [],
    };

  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [subCategoryFirst, setSubCategoryFirst] = useState<string>(subCategory1);
  const [subCategorySecond, setSubCategorySecond] = useState<string>(subCategory2);
  const [descriptionUpdate, setDescriptionUpdate] = useState<string>(description);
  const [sizesUpdate, setSizesUpdate] = useState<string[]>(sizes);
  const [photoPrevs, setPhotoPrevs] = useState<string[]>(photos.map(photo => `${server}/${photo}`));
  const [photoFiles, setPhotoFiles] = useState<(File | null)[]>(Array(photos.length).fill(null));
  const [videoPrev, setVideoPrev] = useState<string | null>(`${server}/${video}`);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const changeSingleImageHandler = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const newPhotoFiles = photoFiles;
      newPhotoFiles[index] = file;
      setPhotoFiles(newPhotoFiles);
      console.log(photoFiles);

      const newPhotoPrevs = [...photoPrevs];
      newPhotoPrevs[index] = URL.createObjectURL(file);
      setPhotoPrevs(newPhotoPrevs);
    }
  };

  const changeVideoHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPrev(URL.createObjectURL(file));
    }
  };

  const handleSizesChange = (index: number, value: string) => {
    const updatedSizes = [...sizesUpdate];
    updatedSizes[index] = value;
    setSizesUpdate(updatedSizes);
  };

  const addSizeField = () => {
    setSizesUpdate([...sizesUpdate, ""]);
  };

  const removeSizeField = (index: number) => {
    const updatedSizes = sizesUpdate.filter((_, i) => i !== index);
    setSizesUpdate(updatedSizes);
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    if (nameUpdate) formData.set("name", nameUpdate);
    if (priceUpdate) formData.set("price", priceUpdate.toString());
    if (stockUpdate !== undefined) formData.set("stock", stockUpdate.toString());
    photoFiles.forEach((photoFile, index) => {
      if (photoFile) {
        formData.append("images", photoFile);
        formData.append(`imageIndex`, index.toString());
      }
    });
    if (videoFile) formData.set("video", videoFile);
    if (categoryUpdate) formData.set("category", categoryUpdate);
    if (subCategoryFirst) formData.set("subCategory1", subCategoryFirst);
    if (subCategorySecond) formData.set("subCategory2", subCategorySecond);
    if (descriptionUpdate) formData.set("description", descriptionUpdate);
    formData.set("sizes", JSON.stringify(sizesUpdate));

    const res = await updateProduct({
      formData,
      userId: user?._id!,
      productId: data?.product._id!,
    });

    responseToast(res, navigate, "/admin/product");
  };

  const deleteHandler = async () => {
    const res = await deleteProduct({
      userId: user?._id!,
      productId: data?.product._id!,
    });

    responseToast(res, navigate, "/admin/product");
  };

  useEffect(() => {
    if (data) {
      setNameUpdate(data.product.name);
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
      setCategoryUpdate(data.product.category);
      setSubCategoryFirst(data.product.subCategory1);
      setSubCategorySecond(data.product.subCategory2);
      setDescriptionUpdate(data.product.description);
      setSizesUpdate(data.product.sizes);
      setPhotoPrevs(data.product.photos.map(photo => `${server}/${photo}`));
      if (data.product.video != null) {
        setVideoPrev(`${server}/${data.product.video}`);
      } else { setVideoPrev(null); }
      setPhotoFiles(data.product.photos.map(() => null)); // Initialize photoFiles with null values
    }
  }, [data]);

  if (isError) return <Navigate to={"/404"} />;
  console.log("videoPrev", videoPrev);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <section>
              <strong>ID - {data?.product._id}</strong>
              {photoPrevs.map((photoPrev, index) => (
                <div key={index}>
                  <img src={photoPrev} style={{ width: "300px", height: "auto" }} alt={`Product ${index + 1}`} />
                </div>
              ))}
              {videoPrev && (
                <video style={{ width: "300px", height: "auto" }} src={videoPrev} controls />
              )}
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>${price}</h3>
            </section>
            <article>
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="text"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="text"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>SubCategory1</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={subCategoryFirst}
                    onChange={(e) => setSubCategoryFirst(e.target.value)}
                  />
                </div>
                <div>
                  <label>SubCategory2</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={subCategorySecond}
                    onChange={(e) => setSubCategorySecond(e.target.value)}
                  />
                </div>
                <div>
                  <label>Sizes</label>
                  {sizesUpdate.map((size, index) => (
                    <div key={index}>
                      <input
                        className="sizeInput"
                        type="text"
                        placeholder="Size"
                        value={size}
                        onChange={(e) => handleSizesChange(index, e.target.value)}
                      />
                      <button type="button" onClick={() => removeSizeField(index)}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addSizeField}>
                    Add Size
                  </button>
                </div>
                <div>
                  <label>Photos</label>
                  {photoPrevs.map((photoPrev, index) => (
                    <div key={index}>
                      <img src={photoPrev} style={{ width: "300px", height: "auto" }} alt={`Preview ${index + 1}`} />
                      <input type="file" onChange={(e) => changeSingleImageHandler(e, index)} />
                    </div>
                  ))}
                </div>
                <div>
                  <label>Video</label>
                  <input type="file" onChange={changeVideoHandler} />
                </div>
                {videoPrev != null ? <video style={{ width: "300px", height: "auto" }} src={videoPrev} controls /> : <></>}
                <div>
                  <label>Description</label>
                  <input
                    type="text"
                    placeholder="Product description"
                    value={descriptionUpdate}
                    onChange={(e) => setDescriptionUpdate(e.target.value)}
                  />
                </div>
                <button type="submit">Update</button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default ProductManagement;
