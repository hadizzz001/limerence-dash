'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ManageCategory = () => {
  const [editFormData, setEditFormData] = useState({ id: '', name: [''] });
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/banner1', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Edit category (only allowed for specific ID)
  const handleEdit = (category) => {
    if (category.id !== '68a864a47451b9a1c5d4491f') {
      setMessage('Editing is only allowed for category with ID: 68a864a47451b9a1c5d4491f');
      return;
    }
    setEditMode(true);
    setEditFormData({
      id: category.id,
      name: category.name, // should already be array
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (editFormData.id !== '68a864a47451b9a1c5d4491f') {
      setMessage('Only this category can be updated: 68a864a47451b9a1c5d4491f');
      return;
    }

    try {
      const res = await fetch(`/api/banner1?id=${encodeURIComponent(editFormData.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editFormData.name,
        }),
      });

      if (res.ok) {
        window.location.reload();
        setEditFormData({ id: '', name: [''] });
        setEditMode(false);
        fetchCategories();
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while updating the Banner.');
    }
  };

  // Handle name input change
  const handleNameChange = (index, value) => {
    const updatedNames = [...editFormData.name];
    updatedNames[index] = value;
    setEditFormData({ ...editFormData, name: updatedNames });
  };

  // Add new name field
  const addNameField = () => {
    setEditFormData({ ...editFormData, name: [...editFormData.name, ''] });
  };

  // Remove name field
  const removeNameField = (index) => {
    const updatedNames = [...editFormData.name];
    updatedNames.splice(index, 1);
    setEditFormData({ ...editFormData, name: updatedNames });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Banner</h1>

      {editMode && (
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Names</label>
            {editFormData.name.map((n, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  className="border p-2 w-full"
                  value={n}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeNameField(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addNameField}
              className="bg-green-500 text-white px-2 py-1 rounded mt-2"
            >
              + Add Name
            </button>
          </div>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            Update Banner
          </button>
        </form>
      )}

      {message && <p className="mt-4">{message}</p>}
 
      <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Names</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.id}>
                <td className="border border-gray-300 p-2">
                  {Array.isArray(category.name) ? category.name.join(', ') : category.name}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {category.id === '68a864a47451b9a1c5d4491f' && (
                    <button
                      onClick={() => handleEdit(category)}
                      className="bg-yellow-500 text-white px-4 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="border border-gray-300 p-2 text-center">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCategory;
