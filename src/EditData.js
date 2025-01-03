import React from 'react';
import { useCookies } from 'react-cookie';

function EditData() {
  const [cookie] = useCookies(['user']);

  return (
    <div className="div-align">
      
    </div>
  );
}

export default EditData;