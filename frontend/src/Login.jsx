import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { Link ,useNavigate} from 'react-router-dom'
import {toast,ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './login.css'

const Login = () => {
    const[values,setValues]=useState({
        email:'',
        password:''
    })

    const handleInput=(event)=>{
        setValues(prev => ({...prev,[event.target.name]:[event.target.value]}))
    }

    const navigate=useNavigate();
    axios.defaults.withCredentials=true

    useEffect(()=>{
        axios.get('http://localhost:8081')
        .then(res =>{
            if(res.data.valid){
                navigate('/')
            }else{
                navigate('/login')
            }
        })
        .catch(err=>console.log(err))
    },[])

    const handleSubmit=(event) =>{
        event.preventDefault();
        axios.post('http://localhost:8081/login',values)
        .then(res => {
            if(res.data.Login){
                navigate('/')
            }else{
                toast.error("Te dhenat nuk jane te plotesuara si duhen !",{position:toast.POSITION.TOP_RIGHT})
            }
        })
        .then(err => console.log(err))
    }

    

    return (
        <div className="login-container">
        <div className="login">
            <h2 className="textL">Log In</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Shtyp Emailin tuaj"
                  name="email"
                  value={values.email}
                  onChange={handleInput}
                  className="form-control rounded-0 w-25"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Shtyp passwordin tuaj"
                  name="password"
                  value={values.password}
                  onChange={handleInput}
                  className="form-control rounded-0  w-25"
                />
              </div>
              <button type="submit" className="buttonL">
                Log In
              </button>
              <p className="textP">
                Pranoni termet tona
              </p>
              <Link
                to="/register"
                className="buttonC"
              >
                Create Account
              </Link>
            </form>
          </div>
        </div>
      );
    };

export default Login