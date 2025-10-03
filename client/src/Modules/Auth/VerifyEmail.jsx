import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '@/lib/axios';
import { showToast } from '@/toast/customToast';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
      showToast('success', response.data.message);
      navigate('/login');
    } catch (error) {
      showToast('error', error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/resend-otp', { email });
      showToast('success', response.data.message);
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
      <p className="mb-4">An OTP has been sent to {email}. Please enter it below.</p>
      <form onSubmit={handleVerify}>
        <div className="mb-4">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
            OTP
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Didn't receive the OTP?{' '}
        <button
          onClick={handleResendOTP}
          disabled={loading}
          className="text-blue-600 hover:underline disabled:opacity-50"
        >
          Resend OTP
        </button>
      </p>
    </div>
  );
};

export default VerifyEmail;