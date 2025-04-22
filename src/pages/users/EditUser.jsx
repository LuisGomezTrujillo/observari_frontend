import React, { useState, useEffect } from 'react';
import { getUserById, updateUser } from '../../api/usersService';
import { FormUser } from '../../components/organisms/FormUser';

export const EditUser = ({ userId, onUpdateSuccess, onCancel }) => {
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      const data = await getUserById(userId);
      setUserData({
        email: data.email,
        password: '' // Password field empty for security
      });
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos del usuario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Only send fields that have changed
      const dataToUpdate = {};
      if (userData.email) dataToUpdate.email = userData.email;
      if (userData.password) dataToUpdate.password = userData.password;
      
      await updateUser(userId, dataToUpdate);
      onUpdateSuccess();
    } catch (err) {
      setError('Error al actualizar el usuario');
      console.error('Error updating user:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <FormUser 
          form={userData}
          handleChange={handleChange}
        />
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Actualizar
          </button>
        </div>
      </form>
    </div>
  );
};