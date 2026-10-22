import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DashboardMenu from '../Components/DashboardMenu';
import Navbar from '../Components/Navbar';
import { useSelector } from 'react-redux';

function Home() {
  const userData = useSelector((state) => state.activeUser?.value);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate('/login');
    }
  }, [userData, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex">
        <DashboardMenu />
        <main className="flex-1 min-w-0 overflow-y-auto bg-slate-50">
          <div className="w-full max-w-[1580px] mx-auto px-6 sm:px-10 lg:px-12 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;