import React, { useState } from 'react';
import styled from 'styled-components';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AuthContext from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const NameContainer = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
`;

const InputGroup = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 20px;
  border: 2px solid #e1e1e1;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #4a6ee0;
    box-shadow: 0 0 0 2px rgba(74, 110, 224, 0.1);
  }
`;

const PhoneInputContainer = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
`;

const CountryCode = styled.select`
  width: 100px;
  padding: 12px;
  border: 2px solid #e1e1e1;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4a6ee0;
    box-shadow: 0 0 0 2px rgba(74, 110, 224, 0.1);
  }
`;

const Button = styled.button`
  background: #4a6ee0;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 10px;

  &:hover {
    background: #3857b3;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  padding: 0;

  &:hover {
    color: #4a6ee0;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 0.9rem;
  margin-top: 5px;
  text-align: left;
  padding-left: 20px;
`;

const SignupForm = () => {
  const navigate = useNavigate();
  const { login } = React.useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+1',
    phone: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || 'Signup failed');
        return;
      }
      setSuccess(true);
      // Optionally, auto-login after signup:
      const loginRes = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password })
      });
      const loginData = await loginRes.json();
      if (loginRes.ok) {
        localStorage.setItem('token', loginData.token);
        login();
        navigate('/');
      } else {
        setServerError('Signup succeeded, but login failed. Please log in manually.');
      }
    } catch (err) {
      setServerError('Network error. Please try again.');
    }
  };

  const countryCodes = [
    '+1', '+44', '+91', '+61', '+86', '+81', '+49', '+33', '+7', '+55'
  ];

  return (
    <Form onSubmit={handleSubmit}>
      <NameContainer>
        <InputGroup>
          <Input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
        </InputGroup>
        <InputGroup>
          <Input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
        </InputGroup>
      </NameContainer>

      <InputGroup>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
      </InputGroup>

      <PhoneInputContainer>
        <CountryCode
          name="countryCode"
          value={formData.countryCode}
          onChange={handleChange}
        >
          {countryCodes.map(code => (
            <option key={code} value={code}>{code}</option>
          ))}
        </CountryCode>
        <InputGroup>
          <Input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
        </InputGroup>
      </PhoneInputContainer>

      <InputGroup>
        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
      </InputGroup>

      <InputGroup>
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <PasswordToggle
          type="button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </PasswordToggle>
        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
      </InputGroup>

      <InputGroup>
        <Input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <PasswordToggle
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
        </PasswordToggle>
        {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
      </InputGroup>

      {serverError && <ErrorMessage>{serverError}</ErrorMessage>}
      {success && <div style={{ color: 'green', textAlign: 'center' }}>Signup successful!</div>}
      <Button type="submit">Sign Up</Button>
    </Form>
  );
};

export default SignupForm; 