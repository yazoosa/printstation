const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Load environment variables
const envPath = path.join(__dirname, '..', '.env');
console.log('Looking for .env file at:', envPath);
if (fs.existsSync(envPath)) {
  console.log('.env file found');
  require('dotenv').config({ path: envPath });
} else {
  console.error('.env file not found at:', envPath);
}

// Validate required environment variables
const requiredEnvVars = ['VITE_SMTP_HOST', 'VITE_SMTP_PORT', 'VITE_SMTP_USER', 'VITE_SMTP_PASS'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  next();
});

console.log('Creating SMTP transporter with config:', {
  host: process.env.VITE_SMTP_HOST,
  port: Number(process.env.VITE_SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.VITE_SMTP_USER,
    pass: '(password hidden)'
  }
});

const transporter = nodemailer.createTransport({
  host: process.env.VITE_SMTP_HOST,
  port: Number(process.env.VITE_SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.VITE_SMTP_USER,
    pass: process.env.VITE_SMTP_PASS
  },
  debug: true,
  logger: true
});

// Verify transporter configuration on startup
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP configuration error:', error);
    process.exit(1);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

// Format currency helper
const formatCurrency = (amount) => 
  `R${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

app.post('/api/send-quote', async (req, res) => {
  try {
    console.log('Received request to send quote email');
    const quote = req.body;
    
    if (!quote || !quote.customers || !quote.customers.email) {
      console.error('Invalid quote data:', quote);
      return res.status(400).json({ 
        error: 'Invalid quote data',
        details: 'Missing required quote information'
      });
    }

    console.log('Preparing email for:', quote.customers.email);
    
    const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { margin-bottom: 30px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .table th, .table td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
            .total { text-align: right; font-weight: bold; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Quote ${quote.quote_reference}</h1>
              <p>Thank you for your interest in our services.</p>
            </div>

            <div class="details">
              <h2>Customer Details</h2>
              <p>
                ${quote.customers.first_name} ${quote.customers.last_name}<br>
                ${quote.customers.email}<br>
                ${quote.customers.billing?.phone || ''}<br>
                ${quote.customers.billing?.company ? quote.customers.billing.company + '<br>' : ''}
                ${quote.customers.billing?.address_1 ? quote.customers.billing.address_1 + '<br>' : ''}
                ${quote.customers.billing?.address_2 ? quote.customers.billing.address_2 + '<br>' : ''}
                ${quote.customers.billing?.city ? quote.customers.billing.city + ', ' : ''}
                ${quote.customers.billing?.state || ''} 
                ${quote.customers.billing?.postcode || ''}
              </p>
            </div>

            <table class="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${quote.quote_items.map(item => `
                  <tr>
                    <td>${item.description.replace(/\n/g, '<br>')}</td>
                    <td>${formatCurrency(item.price)}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.total)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="total">
              <p>Subtotal: ${formatCurrency(quote.subtotal)}</p>
              <p>VAT (15%): ${formatCurrency(quote.vat)}</p>
              <p>Total: ${formatCurrency(quote.total)}</p>
            </div>

            <div class="footer">
              <p>
                This quote is valid for 30 days from the date of issue.<br>
                For any questions, please contact us at info@printstation.co.za
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log('Attempting to send email...');
    
    const mailOptions = {
      from: {
        name: 'Print Station',
        address: process.env.VITE_SMTP_USER
      },
      to: quote.customers.email,
      subject: `Quote ${quote.quote_reference} from Print Station`,
      html: emailContent,
    };

    console.log('Mail options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Detailed error sending quote email:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to send quote email',
      details: error.stack
    });
  }
});

app.post('/api/send-cart', async (req, res) => {
  try {
    console.log('Received request to send cart email');
    const { items, email } = req.body;
    
    if (!items || !email) {
      console.error('Invalid cart data:', { items, email });
      return res.status(400).json({ 
        error: 'Invalid cart data',
        details: 'Missing required cart information or email'
      });
    }

    console.log('Preparing cart email for:', email);
    
    const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .table th, .table td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Cart Items</h1>
            </div>

            <table class="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(item => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.price)}</td>
                    <td>${formatCurrency(item.total)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="footer">
              <p>For any questions, please contact us at info@printstation.co.za</p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log('Attempting to send cart email...');
    
    const mailOptions = {
      from: {
        name: 'Print Station',
        address: process.env.VITE_SMTP_USER
      },
      to: email,
      subject: 'Your Print Station Cart',
      html: emailContent,
    };

    console.log('Mail options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Cart email sent successfully:', info);
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Detailed error sending cart email:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to send cart email',
      details: error.stack
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment variables loaded:', {
    SMTP_HOST: process.env.VITE_SMTP_HOST,
    SMTP_PORT: process.env.VITE_SMTP_PORT,
    SMTP_USER: process.env.VITE_SMTP_USER ? '(set)' : '(not set)',
    SMTP_PASS: process.env.VITE_SMTP_PASS ? '(set)' : '(not set)'
  });
});
