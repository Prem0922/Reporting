import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../AuthContext';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPassword from './ForgotPassword';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6e8efb 0%, #4a6ee0 100%);
  padding: 20px;
  position: relative;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  overflow: hidden;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: 700;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
`;

const Tab = styled.button`
  background: none;
  border: none;
  color: ${props => props.$active ? '#4a6ee0' : '#666'};
  font-size: 1.1rem;
  font-weight: ${props => props.$active ? '600' : '400'};
  cursor: pointer;
  padding: 10px 20px;
  border-bottom: 2px solid ${props => props.$active ? '#4a6ee0' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    color: #4a6ee0;
  }
`;

const FormContainer = styled.div`
  width: 100%;
`;

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setActiveTab('login');
  };

  return (
    <PageContainer>
      <Card>
        <Title>Welcome</Title>
        {!showForgotPassword && (
          <TabContainer>
            <Tab
              $active={activeTab === 'login'}
              onClick={() => setActiveTab('login')}
            >
              Login
            </Tab>
            <Tab
              $active={activeTab === 'signup'}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </Tab>
          </TabContainer>
        )}
        <FormContainer>
          {showForgotPassword ? (
            <ForgotPassword onBack={handleBackToLogin} />
          ) : activeTab === 'login' ? (
            <LoginForm onForgotPasswordClick={handleForgotPasswordClick} />
          ) : (
            <SignupForm />
          )}
        </FormContainer>
      </Card>
    </PageContainer>
  );
};

export default LandingPage; 