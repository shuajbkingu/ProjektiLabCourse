import { Badge, Container, Dropdown, FormControl, Nav, Navbar } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { LogoutOutlined } from '@ant-design/icons';
import axios from 'axios';
import './CategoriesStyle.css';
import { Link } from 'react-router-dom';

const User = () => {
  const [produktet, setProduktet] = useState([]);
  const [kategoriteUser, setKategoriteUser] = useState([]);
  const [kategoriaZgjedhur, setKategoriaZgjedhur] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/user/kategorite')
      .then(response => {
        setKategoriteUser(response.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8081/produktetUser')
      .then(response => {
        setProduktet(response.data);
      })
      .catch(err => {
        console.log('Gabim gjatë shfaqjes së produkteve', err);
      });
  }, []);

  const handleLogout = () => {
    axios.get('http://localhost:8081/logoutUser')
      .then(res => {
        window.location.reload();
      })
      .catch(err => console.log(err));
  };

  const handlePriceFilter = async (range) => {
    try {
      const response = await axios.get(`http://localhost:8081/produktetUser?priceRange=${range}`);
      setProduktet(response.data);
    } catch (error) {
      console.log('Gabim gjatë filtrimit të produktit', error);
    }
  };

  const handleKategoriaClick = (kategoriaId) => {
    setKategoriaZgjedhur(kategoriaId);
  };

  const produktetFiltruar = kategoriaZgjedhur
    ? produktet.filter(product => product.category_id === kategoriaZgjedhur)
    : produktet;
  
  return (
    <div>
    <Navbar bg="dark" variant="dark" style={{ height: 80 }}>
      <Container>
        <Navbar.Brand>
          <h1 className="shop">TheVirtualMall</h1>
        </Navbar.Brand>
        <Navbar.Text className="search">
          <FormControl style={{ width: 500 }} placeholder="Kërko produktin!" className="m-auto" />
        </Navbar.Text>
        <Nav className="ms-auto">
          <li onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <LogoutOutlined style={{ fontSize: '20px', marginRight: '5px', color: 'white' }} />
            <span style={{ fontSize: '16px', color: 'white',paddingRight:'10px' }}>Logout</span>
          </li>
          <li>
            <Dropdown alignRight>
              <Dropdown.Toggle variant="secondary">
                <FaShoppingCart color="white" fontSize="25px" />
                <Badge style={{ marginLeft: '5px', color: 'white' }}>{0}</Badge>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ minWidth: 370 }}>
                <span style={{ padding: '10px', fontSize: '16px' }}>Shporta është e zbrazët!</span>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </Nav>
      </Container>
    </Navbar>
      <Container>
      <div className="kategoria-container">
        <h2 className="kategoria">Kategoritë</h2>
        <ul className="categories-list">
          {kategoriteUser.map(kategori => (
            <li
              key={kategori.id}
              className={`category-item ${kategoriaZgjedhur === kategori.id ? 'selected' : ''}`}
              onClick={() => handleKategoriaClick(kategori.id)}
            >
              {kategori.name}
            </li>
          ))}
        </ul>
        </div>
        <div className="button-container">
          <h2 className="filter">Kërko sipas çmimit</h2>
        <button onClick={() => handlePriceFilter('0-100')}>0-100</button>
        <button onClick={() => handlePriceFilter('100-200')}>100-200</button>
        <button onClick={() => handlePriceFilter('200-500')}>200-500</button>
        <button onClick={() => handlePriceFilter('1000+')}>&gt;1000</button>
      </div>

      <ul className="product-list">
  {produktetFiltruar.map(product => (
    <li key={product.id}>
        <span>
        <img
          src={`http://localhost:8081/images/${product.image_url}`}
          alt=""
          className="product-image"
        />
      </span>
      <span className="product-name">{product.name}</span>
      <span className="product-price">{product.price}€</span>
    
      <Link to={`/cart/${product.id}`} className="product-link">Shiko produktin</Link>
    </li>
  ))}
</ul>

      </Container>
    </div>
  );
};

export default User;
