import ImageUpload from '../../../components/ImageUpload';
import { categories } from '../../../utils/categories';
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { ADD_GIG_ROUTE } from '../../../utils/constants';
import { useRouter } from 'next/router';

const CreateGig = () => {
  const [cookies] = useCookies();
  const router = useRouter();
  const [files, setFile] = useState([]);
  const [features, setFeatures] = useState([]);
  const [data, setData] = useState({
    title: '',
    category: '',
    description: '',
    time: 0,
    feature: '',
    price: 0,
    shortDesc: '',
  });

  const inputClassName =
    'block p-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500';
  const labelClassName = 'mb-2 text-lg font-medium text-gray-900';

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const addFeature = () => {
    if (data.feature.trim()) {
      setFeatures([...features, data.feature.trim()]);
      setData({ ...data, feature: '' });
    }
  };

  const removeFeature = (index) => {
    const updated = [...features];
    updated.splice(index, 1);
    setFeatures(updated);
  };

  const addGig = async () => {
    const { title, description, category, price, time, shortDesc } = data;
    if (
      title &&
      category &&
      description &&
      features.length &&
      files.length &&
      price > 0 &&
      time > 0 &&
      shortDesc
    ) {
      try {
        const formData = new FormData();
        files.forEach((file) => formData.append('images', file));

        const gigData = {
          title,
          description,
          category,
          features,
          price,
          time,
          shortDesc,
        };

        const res = await axios.post(ADD_GIG_ROUTE, formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${cookies.jwt}`,
          },
          params: gigData,
        });

        if (res.status === 201) {
          router.push('/seller/gigs');
        }
      } catch (err) {
        console.error('Gig creation failed:', err);
      }
    } else {
      alert('Please fill in all required fields.');
    }
  };

  return (
    <div className="min-h-screen pt-28 px-6 sm:px-10 md:px-32">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-5">
        Create a New Gig
      </h1>
      <h3 className="text-2xl md:text-3xl text-gray-800 mb-10">
        Enter the details to publish your gig
      </h3>

      <form className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="title" className={labelClassName}>
              Gig Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. AI chatbot partner"
              value={data.title}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="category" className={labelClassName}>
              Select a Category
            </label>
            <select
              id="category"
              name="category"
              value={data.category}
              onChange={handleChange}
              className={inputClassName}
            >
              <option disabled value="">
                Choose a category
              </option>
              {categories.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className={labelClassName}>
            Gig Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            placeholder="Describe what your gig offers..."
            value={data.description}
            onChange={handleChange}
            className="p-4 w-full text-sm border border-gray-300 rounded-lg bg-gray-50"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="time" className={labelClassName}>
              Delivery Time (in days)
            </label>
            <input
              id="time"
              name="time"
              type="number"
              placeholder="e.g. 3"
              value={data.time}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>

          {/* Uncomment if you want to use revisions */}
          {/* <div>
            <label htmlFor="revisions" className={labelClassName}>
              Revisions
            </label>
            <input
              id="revisions"
              name="revisions"
              type="number"
              placeholder="Max revisions"
              value={data.revisions}
              onChange={handleChange}
              className={inputClassName}
            />
          </div> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="features" className={labelClassName}>
              Add Features
            </label>
            <div className="flex items-center gap-3 mb-3">
              <input
                id="features"
                name="feature"
                type="text"
                placeholder="e.g. Funny, smart, musical"
                value={data.feature}
                onChange={handleChange}
                className={inputClassName}
              />
              <button
                type="button"
                onClick={addFeature}
                className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-md text-sm px-5 py-3"
              >
                Add
              </button>
            </div>
            <ul className="flex flex-wrap gap-2">
              {features.map((feature, i) => (
                <li
                  key={`${feature}-${i}`}
                  className="px-4 py-2 border border-gray-300 rounded-full text-sm bg-white flex items-center gap-2"
                >
                  <span>{feature}</span>
                  <button
                    type="button"
                    className="text-red-600"
                    onClick={() => removeFeature(i)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label htmlFor="images" className={labelClassName}>
              Upload Images
            </label>
            <ImageUpload files={files} setFile={setFile} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="shortDesc" className={labelClassName}>
              Short Description
            </label>
            <input
              id="shortDesc"
              name="shortDesc"
              type="text"
              placeholder="Catchy one-liner"
              value={data.shortDesc}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="price" className={labelClassName}>
              Price (in ₹)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              placeholder="e.g. 500"
              value={data.price}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={addGig}
            className="bg-[#1DBF73] hover:bg-[#17a866] text-white text-lg font-semibold px-8 py-3 rounded-md"
          >
            Create Gig
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGig;
