#!/usr/bin/env node

/**
 * JWT Token Generator for Testing
 * Generates a valid JWT token for testing the Service Orders API
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Configuration
const JWT_SECRET =
  'your-super-secret-jwt-key-change-in-production-minimum-32-characters';
const JWT_EXPIRES_IN = '7d';

// Test user payload
const testUserPayload = {
  sub: '507f1f77bcf86cd799439011', // MongoDB ObjectId format
  email: 'test@example.com',
  role: 'admin',
};

// Generate JWT token
const token = jwt.sign(testUserPayload, JWT_SECRET, {
  expiresIn: JWT_EXPIRES_IN,
  algorithm: 'HS256',
});

// Display results
console.log('🔐 JWT Token Generator for Testing');
console.log('=====================================');
console.log('');
console.log('📋 Token Details:');
console.log(`   Secret: ${JWT_SECRET}`);
console.log(`   Expires: ${JWT_EXPIRES_IN}`);
console.log(`   Algorithm: HS256`);
console.log('');
console.log('👤 Test User Payload:');
console.log(JSON.stringify(testUserPayload, null, 2));
console.log('');
console.log('🎫 Generated JWT Token:');
console.log(token);
console.log('');
console.log('📏 Token Length:', token.length, 'characters');
console.log('');
console.log('🧪 Testing Commands:');
console.log('');
console.log('# Test with curl:');
console.log(
  `curl -H "Authorization: Bearer ${token}" http://localhost:3000/api/v1/users`,
);
console.log('');
console.log('# Test with Postman:');
console.log('Authorization: Bearer ' + token);
console.log('');
console.log('🔍 Decode token (for verification):');
console.log('https://jwt.io/');
console.log('');
console.log(
  '⚠️  Note: This token is for testing only. Use secure secrets in production!',
);
