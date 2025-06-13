import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import UploadImage from './UploadImage';
import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
import { useNavigate } from 'react-router-dom';

const categories = [
    { label: 'الكل', value: 'الكل' },
    { label: 'مصار', value: 'مصار' },
    { label: 'كمه', value: 'كمه' },
    { label: 'بوكسات الهدايا', value: 'بوكسات الهدايا' },
    { label: 'أقمشة', value: 'أقمشة' },
    { label: 'غتر', value: 'غتر' },
    // { label: 'بوكسات عروض', value: 'بوكسات عروض' },
    { label: 'عود', value: 'عود' },
];

const kumaTypes = [
    { label: 'كمه خياطة اليد', value: 'كمه خياطة اليد' },
    { label: 'كمه ديواني', value: 'كمه ديواني' }
];

const kumaSizes = ['9.5', '9.75', '10', '10.25', '10.5', '10.75', '11', '11.25', '11.5', '11.75'];

const massarSubTypes = [
    { label: 'سوبر ترمه يد', value: 'سوبر ترمه يد' },
    { label: 'سوبر ترمه قلمكاري', value: 'سوبر ترمه قلمكاري' },
    { label: 'نص ترمه', value: 'نص ترمه' },
    { label: 'بشمينا', value: 'بشمينا' }
];

const AddProduct = () => {
    const { user } = useSelector((state) => state.auth);
    const [product, setProduct] = useState({
        name: '',
        category: '',
        massarSubType: '',
        kumaType: '',
        kumaSize: '',
        price: '',
        description: '',
    });
    const [image, setImage] = useState([]);
    const [AddProduct, { isLoading, error }] = useAddProductMutation();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updates = { ...product, [name]: value };

        if (name === 'category') {
            updates.massarSubType = '';
            updates.kumaType = '';
            updates.kumaSize = '';
        }

        setProduct(updates);
    };

    const handleKumaTypeChange = (type) => {
        setProduct({
            ...product,
            kumaType: type,
            kumaSize: ''
        });
    };

    const handleKumaSizeChange = (size) => {
        setProduct({
            ...product,
            kumaSize: size
        });
    };

    const handleMassarSubTypeChange = (subType) => {
        setProduct({
            ...product,
            massarSubType: subType
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const requiredFields = {
          name: 'اسم المنتج',
          category: 'الفئة',
          price: 'السعر',
          description: 'الوصف'
        };
      
        const missingFields = Object.entries(requiredFields)
          .filter(([key]) => !product[key])
          .map(([_, label]) => label);
      
        if (missingFields.length > 0 || image.length === 0) {
          alert(`الرجاء تعبئة الحقول التالية: ${missingFields.join('، ')}${image.length === 0 ? ' وإضافة صورة' : ''}`);
          return;
        }
      
        if (product.category === 'كمه' && !product.kumaType) {
          alert('الرجاء اختيار نوع الكمه');
          return;
        }
      
        try {
            const productData = {
                name: product.name,
                category: product.category,
                ...(product.category === 'مصار' && { 
                    subCategory: product.massarSubType
                }),
                ...(product.category === 'كمه' && { 
                    subCategory: product.kumaSize ? `${product.kumaType}-${product.kumaSize}` : product.kumaType
                }),
                price: parseFloat(product.price),
                description: product.description,
                image: image,
                author: user?._id
            };
      
          const result = await AddProduct(productData).unwrap();
          alert('تمت إضافة المنتج بنجاح');
          setProduct({
            name: '',
            category: '',
            massarSubType: '',
            kumaType: '',
            kumaSize: '',
            price: '',
            description: ''
          });
          setImage([]);
          navigate("/shop");
        } catch (error) {
          console.error("فشل في إضافة المنتج:", error);
          alert(`حدث خطأ: ${error.data?.message || 'فشل في إضافة المنتج'}`);
        }
      };

    return (
        <div className="container mx-auto mt-8 px-4">
            <h2 className="text-2xl font-bold mb-6 text-right">إضافة منتج جديد</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <TextInput
                    label="اسم المنتج"
                    name="name"
                    placeholder="مثال: أقراط ماسية"
                    value={product.name}
                    onChange={handleChange}
                    required
                />
                
                <SelectInput
                    label="الفئة"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    options={categories}
                    required
                />
                
                {product.category === 'مصار' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 text-right mb-2">
                                نوع المصار *
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {massarSubTypes.map((subType) => (
                                    <label key={subType.value} className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="massarSubType"
                                            value={subType.value}
                                            checked={product.massarSubType === subType.value}
                                            onChange={() => handleMassarSubTypeChange(subType.value)}
                                            className="h-5 w-5 text-indigo-600"
                                            required
                                        />
                                        <span className="block text-sm font-medium text-gray-700">
                                            {subType.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
                {product.category === 'كمه' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 text-right mb-2">
                                نوع الكمه *
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {kumaTypes.map((type) => (
                                    <label key={type.value} className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="kumaType"
                                            value={type.value}
                                            checked={product.kumaType === type.value}
                                            onChange={() => handleKumaTypeChange(type.value)}
                                            className="h-5 w-5 text-indigo-600"
                                            required
                                        />
                                        <span className="block text-sm font-medium text-gray-700">
                                            {type.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        
                        {product.kumaType && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-right mb-2">
                                    مقاس الكمه
                                </label>
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                    {kumaSizes.map((size) => (
                                        <label key={size} className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="kumaSize"
                                                value={size}
                                                checked={product.kumaSize === size}
                                                onChange={() => handleKumaSizeChange(size)}
                                                className="h-5 w-5 text-indigo-600"
                                            />
                                            <span className="block text-sm font-medium text-gray-700">
                                                {size}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                <TextInput
                    label="السعر"
                    name="price"
                    type="number"
                    placeholder="50"
                    value={product.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                />
                
                <UploadImage
                    name="image"
                    id="image"
                    setImage={setImage}
                    required
                />
                
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 text-right">
                        الوصف *
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        rows={4}
                        value={product.description}
                        placeholder="أدخل وصف المنتج هنا"
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={isLoading}
                    >
                        {isLoading ? "جاري الإضافة..." : "إضافة المنتج"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;