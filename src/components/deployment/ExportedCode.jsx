import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Download, ExternalLink, CheckCircle } from "lucide-react";

export default function ExportedCode() {
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    alert(`${type} copied to clipboard!`);
  };

  // Backend API code
  const backendCode = `const https = require('https');
const querystring = require('querystring');

// TTLock API base URL
const TTLOCK_API_BASE = 'https://euapi.ttlock.com';

// Helper function to make HTTP requests
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          resolve({ error: 'Invalid JSON response', raw: data });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

// Get access token from TTLock
async function getAccessToken(clientId, clientSecret, username, password) {
  const postData = querystring.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    username: username,
    password: password,
    grant_type: 'password'
  });

  const options = {
    hostname: 'euapi.ttlock.com',
    port: 443,
    path: '/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return await makeRequest(options, postData);
}

// Get locks from TTLock API
async function getLocks(accessToken, clientId) {
  const params = querystring.stringify({
    clientId: clientId,
    accessToken: accessToken,
    pageNo: 1,
    pageSize: 100
  });

  const options = {
    hostname: 'euapi.ttlock.com',
    port: 443,
    path: \`/v3/lock/list?\${params}\`,
    method: 'GET'
  };

  return await makeRequest(options);
}

// Main API handler
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { action } = req.query;

    // Get credentials from environment variables
    const clientId = process.env.TTLOCK_CLIENT_ID;
    const clientSecret = process.env.TTLOCK_CLIENT_SECRET;
    const username = process.env.TTLOCK_USERNAME;
    const password = process.env.TTLOCK_PASSWORD;

    if (!clientId || !clientSecret || !username || !password) {
      return res.status(500).json({
        error: 'TTLock credentials not configured. Please set environment variables.'
      });
    }

    if (action === 'authenticate') {
      // Test authentication
      const tokenResponse = await getAccessToken(clientId, clientSecret, username, password);
      
      if (tokenResponse.error || !tokenResponse.access_token) {
        return res.status(401).json({
          success: false,
          error: 'Authentication failed',
          details: tokenResponse
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Authentication successful',
        accountInfo: {
          email: username,
          username: username.split('@')[0],
          accountType: 'TTLock App User'
        }
      });
    }

    if (action === 'sync-locks') {
      // Get access token first
      const tokenResponse = await getAccessToken(clientId, clientSecret, username, password);
      
      if (tokenResponse.error || !tokenResponse.access_token) {
        return res.status(401).json({
          success: false,
          error: 'Authentication failed during sync'
        });
      }

      // Get locks
      const locksResponse = await getLocks(tokenResponse.access_token, clientId);
      
      if (locksResponse.error) {
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch locks',
          details: locksResponse
        });
      }

      // Format locks for our application
      const locks = locksResponse.list || [];
      const formattedLocks = locks.map(lock => ({
        lockId: lock.lockId,
        lockName: lock.lockName,
        lockMac: lock.lockMac,
        lockVersion: lock.lockVersion,
        electricQuantity: lock.electricQuantity,
        isOnline: lock.isOnline,
        lockData: lock.lockData,
        specialValue: lock.specialValue,
        timezoneRawOffset: lock.timezoneRawOffset
      }));

      return res.status(200).json({
        success: true,
        locks: formattedLocks,
        count: formattedLocks.length
      });
    }

    res.status(400).json({ error: 'Invalid action parameter' });

  } catch (error) {
    console.error('TTLock API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}`;

  // Package.json
  const packageJson = `{
  "name": "lockmaster-property-management",
  "version": "1.0.0",
  "description": "TTLock Property Management System",
  "main": "index.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@next/font": "^14.0.0",
    "https": "^1.0.0",
    "querystring": "^0.2.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}`;

  // Vercel.json
  const vercelJson = `{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}`;

  // Deployment instructions
  const instructions = `# LockMaster Property Management - Deployment Guide

## 🚀 Quick Deploy to Vercel

### Step 1: GitHub Setup
1. Go to github.com and create a new repository called "lockmaster-property-management"
2. Make it PUBLIC (required for free Vercel)
3. Upload all the files from this export

### Step 2: File Structure
Create this exact folder structure in your GitHub repo:
\`\`\`
lockmaster-property-management/
├── api/
│   └── ttlock.js          (Copy the backend code)
├── entities/              (Copy all your entities)
├── pages/                 (Copy all your pages)
├── components/            (Copy all your components)
├── package.json           (Copy the package config)
├── vercel.json           (Copy the Vercel config)
└── README.md
\`\`\`

### Step 3: Deploy to Vercel
1. Go to vercel.com/signup
2. Sign up with GitHub
3. Import your repository
4. It will deploy automatically

### Step 4: Add Environment Variables
In Vercel dashboard → Settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| TTLOCK_CLIENT_ID | 58c5fab6a4d64da885b41cb66e4d2971 |
| TTLOCK_CLIENT_SECRET | [Your secret from TTLock dashboard] |
| TTLOCK_USERNAME | avi@globalvisionsinc.com |
| TTLOCK_PASSWORD | Pr0tect@ |

### Step 5: Test Live Connection
1. Visit your deployed app URL
2. Go to Locks page
3. Click "Sync TTLock Account"
4. Should connect to your real locks!

## 🔧 Your TTLock API Credentials
- Client ID: 58c5fab6a4d64da885b41cb66e4d2971
- Username: avi@globalvisionsinc.com  
- Password: Pr0tect@
- Client Secret: [Get this from your TTLock developer dashboard]

## 📞 Support
If you need help, the deployment should take less than 10 minutes total.
`;

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Download className="w-8 h-8 text-slate-900" />
          <h1 className="text-3xl font-bold text-slate-900">Ready for GitHub Deploy</h1>
        </div>

        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>All set!</strong> Your complete application code is ready for deployment. Follow the steps below to get it live.
          </AlertDescription>
        </Alert>

        {/* Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Deployment Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm whitespace-pre-wrap">{instructions}</pre>
            </div>
            <Button 
              onClick={() => copyToClipboard(instructions, 'Instructions')}
              className="mt-4"
              variant="outline"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Instructions
            </Button>
          </CardContent>
        </Card>

        {/* Backend Code */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>📁 api/ttlock.js (Backend Code)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto max-h-96">
              <pre className="text-xs">{backendCode}</pre>
            </div>
            <Button 
              onClick={() => copyToClipboard(backendCode, 'Backend Code')}
              className="mt-4"
              variant="outline"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Backend Code
            </Button>
          </CardContent>
        </Card>

        {/* Package.json */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>📦 package.json</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">{packageJson}</pre>
            </div>
            <Button 
              onClick={() => copyToClipboard(packageJson, 'Package.json')}
              className="mt-4"
              variant="outline"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Package.json
            </Button>
          </CardContent>
        </Card>

        {/* Vercel.json */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>⚙️ vercel.json</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">{vercelJson}</pre>
            </div>
            <Button 
              onClick={() => copyToClipboard(vercelJson, 'Vercel.json')}
              className="mt-4"
              variant="outline"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Vercel.json
            </Button>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>🔗 Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-auto p-4">
                <a href="https://github.com/new" target="_blank" rel="noopener noreferrer">
                  <div className="text-left">
                    <div className="font-semibold">1. Create GitHub Repo</div>
                    <div className="text-sm text-slate-600">github.com/new</div>
                  </div>
                </a>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4">
                <a href="https://vercel.com/signup" target="_blank" rel="noopener noreferrer">
                  <div className="text-left">
                    <div className="font-semibold">2. Deploy with Vercel</div>
                    <div className="text-sm text-slate-600">vercel.com/signup</div>
                  </div>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}