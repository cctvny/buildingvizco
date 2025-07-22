import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Users from "./Users";

import Locks from "./Locks";

import Credentials from "./Credentials";

import Schedules from "./Schedules";

import Gateways from "./Gateways";

import Reports from "./Reports";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Users: Users,
    
    Locks: Locks,
    
    Credentials: Credentials,
    
    Schedules: Schedules,
    
    Gateways: Gateways,
    
    Reports: Reports,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Users" element={<Users />} />
                
                <Route path="/Locks" element={<Locks />} />
                
                <Route path="/Credentials" element={<Credentials />} />
                
                <Route path="/Schedules" element={<Schedules />} />
                
                <Route path="/Gateways" element={<Gateways />} />
                
                <Route path="/Reports" element={<Reports />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}