import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const ProduktetView = () => {
    const [produktet, setProduktet] = useState([]);

    const {id} = useParams();

    useEffect(() => {
        axios.get('http://localhost:8081/getProduktetView/'+id)
          .then(res => {
            if (res.data.Status === "Success") {
              setProduktet(res.data.Result);
            } else {
              alert("Error");
            }
          })
          .catch(err => console.log(err));
      },[]);
        return (
          <div>
        <tbody>
                {produktet.map((produkti, index) => (
                  <tr key={index}>
                    <td>Id :{produkti.id}</td>
                    <td>Emri :{produkti.name}</td>
                    <td>Pershkrimi :{produkti.description}</td>
                    <td>Cmimi :{produkti.price}</td>
                    <td>Foto :{
                    <img src={`http://localhost:8081/images/` + produkti.image_url} alt="" 
                    className='produktet_image'/>
                    }</td>
                    <td>Stock :{produkti.stock}</td>
                    <td>Kategori :{produkti.category_id}</td>
                    <td>Krijuar me :{produkti.created_at}</td>
                    <Link to="/kategorite" className='btn btn-primary'>
                        Kthehu te Produktet
                    </Link>
                  </tr>
                ))}
              </tbody>
              </div>
        )
                  }

export default ProduktetView;