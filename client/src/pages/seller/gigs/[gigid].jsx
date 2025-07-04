import ImageUpload from '../../../components/ImageUpload';
import { categories } from '../../../utils/categories';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { EDIT_GIG_DATA, GET_GIG_DATA } from '../../../utils/constants';
import { useRouter } from 'next/router';
import { HOST } from '../../../context/constants';
import { toast } from 'react-toastify';

const Editgig = () => {
  const [cookies] = useCookies();
  const router = useRouter();
  const { gigid } = router.query;

  const inputClassName =
    'block p-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500';
  const labelClassName = 'mb-2 text-lg font-medium text-gray-900';

  const [files, setFiles] = useState([]);
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

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const addFeature = () => {
    if (data.feature) {
      setFeatures([...features, data.feature]);
      setData({ ...data, feature: '' });
    }
  };

  const removeFeature = (index) => {
    const updated = [...features];
    updated.splice(index, 1);
    setFeatures(updated);
  };

  const editGig = async () => {
    const { category, description, price, time, title, shortDesc } = data;

    if (
      category &&
      description &&
      title &&
      features.length &&
      files.length &&
      price > 0 &&
      shortDesc &&
      time > 0
    ) {
      try {
        const formData = new FormData();
        files.forEach((file) => formData.append('images', file));

        const gigData = { title, description, category, features, price, time, shortDesc };

        const response = await axios.put(`${EDIT_GIG_DATA}/${gigid}`, formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${cookies.jwt}`,
          },
          params: gigData,
        });

        if (response.status === 201) {
          toast.success('Gig updated successfully!');
          router.push('/seller/gigs');
        }
      } catch (err) {
        // console.error(err);
        toast.error('Something went wrong while updating the gig.');
      }
    } else {
      toast.warn('Please fill in all required fields.');
    }
  };

  useEffect(() => {
    const fetchGigData = async () => {
      try {
        const {
          data: { gig },
        } = await axios.get(`${GET_GIG_DATA}/${gigid}`);

        setData({
          title: gig.title,
          category: gig.category,
          description: gig.description,
          time: gig.deliveryTime,
          shortDesc: gig.shortDesc,
          price: gig.price,
          feature: '',
        });

        setFeatures(gig.features || []);

        gig.images.forEach((image) => {
          const url = `${image}`;
          const fileName = image;
          fetch(url).then(async (response) => {
            const contentType = response.headers.get('content-type');
            const blob = await response.blob();
            const file = new File([blob], fileName, { type: contentType });
            setFiles((prev) => [...prev, file]);
          });
        });
      } catch (err) {
        console.error('Failed to fetch gig data:', err);
      }
    };

    if (gigid) fetchGigData();
  }, [gigid]);

  return (
    <div className="min-h-screen px-5 sm:px-10 md:px-20 py-10">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Edit Gig</h1>
      <h3 className="text-lg sm:text-2xl text-gray-700 mb-8">Update your gig information below</h3>

      <form className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClassName}>Gig Title</label>
            <input
              name="title"
              value={data.title}
              onChange={handleChange}
              type="text"
              className={inputClassName}
              placeholder="e.g. I will do something I'm really good at"
              required
            />
          </div>
          <div>
            <label className={labelClassName}>Select a Category</label>
            <select
              name="category"
              onChange={handleChange}
              value={data.category}
              className={inputClassName}
            >
              <option value="" disabled>Select a category</option>
              {categories.map(({ name }) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClassName}>Gig Description</label>
          <textarea
            name="description"
            rows="4"
            value={data.description}
            onChange={handleChange}
            className={inputClassName}
            placeholder="Describe your gig..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClassName}>ETA (days)</label>
            <input
              type="number"
              name="time"
              value={data.time}
              onChange={handleChange}
              className={inputClassName}
              placeholder="Delivery time"
            />
          </div>
          <div>
            <label className={labelClassName}>Gig Price (₹)</label>
            <input
              type="number"
              name="price"
              value={data.price}
              onChange={handleChange}
              className={inputClassName}
              placeholder="Price"
            />
          </div>
        </div>

        <div>
          <label className={labelClassName}>Short Description</label>
          <input
            type="text"
            name="shortDesc"
            value={data.shortDesc}
            onChange={handleChange}
            className={inputClassName}
            placeholder="A quick summary of your gig"
          />
        </div>

        <div>
          <label className={labelClassName}>Gig Features</label>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              name="feature"
              value={data.feature}
              onChange={handleChange}
              className={inputClassName}
              placeholder="Enter a feature"
            />
            <button
              type="button"
              onClick={addFeature}
              className="bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {features.map((feature, index) => (
              <li
                key={index}
                className="bg-gray-100 px-4 py-2 rounded-md flex items-center gap-2 border border-gray-300"
              >
                <span>{feature}</span>
                <span
                  className="text-red-600 cursor-pointer"
                  onClick={() => removeFeature(index)}
                >
                  &times;
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label className={labelClassName}>Gig Images</label>
          <ImageUpload files={files} setFile={setFiles} />
        </div>

        <div>
          <button
            type="button"
            onClick={editGig}
            className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold px-6 py-3 rounded-md"
          >
            Update Gig
          </button>
        </div>
      </form>
    </div>
  );
};

export default Editgig;
