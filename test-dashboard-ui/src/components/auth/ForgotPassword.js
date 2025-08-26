import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 20px;
  border: 2px solid #e1e1e1;
  border-radius: 30px;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;

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
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    background: #3857b3;
    transform: translateY(-1px);
  }
`;

const BackButton = styled(Button)`
  background: transparent;
  color: #4a6ee0;
  border: 2px solid #4a6ee0;

  &:hover {
    background: rgba(74, 110, 224, 0.1);
    transform: translateY(-1px);
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 10px;
  border: 2px solid #4a6ee0;
  background: ${props => props.$active ? '#4a6ee0' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#4a6ee0'};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$active ? '#3857b3' : 'rgba(74, 110, 224, 0.1)'};
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 0.9rem;
  margin-top: 5px;
  text-align: left;
  padding-left: 20px;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-align: center;
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
  margin-right: 10px;
  &:focus {
    border-color: #4a6ee0;
    box-shadow: 0 0 0 2px rgba(74, 110, 224, 0.1);
  }
`;

const ForgotPassword = ({ onBack }) => {
  const [method, setMethod] = useState('email');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [countryCode, setCountryCode] = useState('+1');

  const countryCodes = [
    '+1', '+44', '+91', '+61', '+86', '+81', '+49', '+33', '+7', '+55'
  ];

  const validateInput = () => {
    if (method === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        return 'Email is required';
      }
      if (!emailRegex.test(value)) {
        return 'Invalid email format';
      }
    } else {
      const phoneRegex = /^\d{10}$/;
      if (!value.trim()) {
        return 'Phone number is required';
      }
      if (!phoneRegex.test(value)) {
        return 'Phone number must be 10 digits';
      }
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccess(false);
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSubmitting(true);
    try {
      const payload = method === 'phone'
        ? { method, value, countryCode }
        : { method, value };
      const res = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || 'Failed to send reset instructions');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setServerError('Network error. Please try again.');
    }
    setSubmitting(false);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    if (error) {
      setError('');
    }
    if (serverError) {
      setServerError('');
    }
    setSuccess(false);
  };

  return (
    <Container>
      <Title>Reset Password</Title>
      
      <ToggleContainer>
        <ToggleButton
          type="button"
          $active={method === 'email'}
          onClick={() => {
            setMethod('email');
            setValue('');
            setError('');
            setServerError('');
            setSuccess(false);
          }}
        >
          Email
        </ToggleButton>
        <ToggleButton
          type="button"
          $active={method === 'phone'}
          onClick={() => {
            setMethod('phone');
            setValue('');
            setError('');
            setServerError('');
            setSuccess(false);
          }}
        >
          Phone
        </ToggleButton>
      </ToggleContainer>

      <Form onSubmit={handleSubmit}>
        {method === 'phone' && (
          <CountryCode
            name="countryCode"
            value={countryCode}
            onChange={e => setCountryCode(e.target.value)}
            disabled={submitting}
          >
            {countryCodes.map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </CountryCode>
        )}
        <InputGroup>
          <Input
            type={method === 'email' ? 'email' : 'tel'}
            placeholder={method === 'email' ? 'Enter your email' : 'Enter your phone number'}
            value={value}
            onChange={handleChange}
            disabled={submitting}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {serverError && <ErrorMessage>{serverError}</ErrorMessage>}
          {success && <div style={{ color: 'green', textAlign: 'left', paddingLeft: 20 }}>If the account exists, reset instructions have been sent.</div>}
        </InputGroup>

        <Button type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Reset Password'}</Button>
        <BackButton type="button" onClick={onBack} disabled={submitting}>
          Back to Login
        </BackButton>
      </Form>
    </Container>
  );
};

export default ForgotPassword; 