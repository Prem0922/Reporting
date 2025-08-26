import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6e8efb 0%, #4a6ee0 100%);
  padding: 20px;
`;
const Card = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  text-align: center;
`;
const Title = styled.h2`
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: 700;
`;
const Input = styled.input`
  width: 100%;
  padding: 12px 20px;
  border: 2px solid #e1e1e1;
  border-radius: 10px;
  font-size: 1rem;
  margin-bottom: 20px;
  outline: none;
  box-sizing: border-box;
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
const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 0.9rem;
  margin-bottom: 10px;
`;
const SuccessMessage = styled.div`
  color: #4caf50;
  font-size: 1rem;
  margin-bottom: 10px;
`;
const BackButton = styled(Button)`
  background: transparent;
  color: #4a6ee0;
  border: 2px solid #4a6ee0;
  margin-top: 10px;
  &:hover {
    background: rgba(74, 110, 224, 0.1);
    color: #3857b3;
  }
`;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const token = query.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to reset password.');
      } else {
        setSuccess('Password reset successful! You can now log in.');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <Container>
      <Card>
        <Title>Reset Password</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            disabled={submitting}
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={submitting}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          <Button type="submit" disabled={submitting}>{submitting ? 'Resetting...' : 'Reset Password'}</Button>
        </form>
        <BackButton type="button" onClick={() => navigate('/login')} disabled={submitting}>
          Back to Login
        </BackButton>
      </Card>
    </Container>
  );
};

export default ResetPassword; 