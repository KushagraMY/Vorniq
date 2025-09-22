// Script to set up a demo user in Supabase
// Run this script with: node setup-demo-user.js

import { createClient } from '@supabase/supabase-js';

// Your Supabase configuration
const supabaseUrl = 'https://your-project-id.supabase.co'; // Replace with your actual Supabase URL
const supabaseServiceKey = 'your-service-role-key'; // Replace with your service role key

// Create Supabase client with service role key (has admin privileges)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDemoUser() {
  try {
    console.log('Setting up demo user...');

    // 1. Create a demo user in Firebase Auth (you'll need to do this manually in Firebase Console)
    // For now, we'll assume the user exists with UID: 'demo-user-123'
    const demoUserId = 'demo-user-123';
    const demoEmail = 'demo@vorniq.com';

    // 2. Create a subscription record for the demo user
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: demoUserId,
        service_ids: '1,2,3,4,5,6', // All services (CRM, HRM, SIM, Accounting, Dashboard, UserRoles)
        status: 'active',
        expires_at: null, // No expiration for demo account
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
      return;
    }

    console.log('✅ Demo subscription created:', subscription);

    // 3. Add some demo data for each service
    console.log('Adding demo data...');

    // Add demo customers for CRM
    const { error: customersError } = await supabase
      .from('customers')
      .insert([
        {
          name: 'Acme Corporation',
          email: 'contact@acme.com',
          phone: '+1-555-0123',
          company: 'Acme Corporation',
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          name: 'TechStart Inc',
          email: 'info@techstart.com',
          phone: '+1-555-0456',
          company: 'TechStart Inc',
          status: 'active',
          created_at: new Date().toISOString()
        }
      ]);

    if (customersError) {
      console.log('Note: Customers table might not exist yet:', customersError.message);
    } else {
      console.log('✅ Demo customers added');
    }

    // Add demo employees for HRM
    const { error: employeesError } = await supabase
      .from('employees')
      .insert([
        {
          employee_id: 'EMP001',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@company.com',
          phone: '+1-555-0789',
          department: 'Engineering',
          position: 'Software Developer',
          salary: 75000,
          status: 'active',
          hire_date: '2024-01-15',
          created_at: new Date().toISOString()
        },
        {
          employee_id: 'EMP002',
          first_name: 'Sarah',
          last_name: 'Smith',
          email: 'sarah.smith@company.com',
          phone: '+1-555-0321',
          department: 'Marketing',
          position: 'Marketing Manager',
          salary: 65000,
          status: 'active',
          hire_date: '2024-01-20',
          created_at: new Date().toISOString()
        }
      ]);

    if (employeesError) {
      console.log('Note: Employees table might not exist yet:', employeesError.message);
    } else {
      console.log('✅ Demo employees added');
    }

    // Add demo products for SIM
    const { error: productsError } = await supabase
      .from('products')
      .insert([
        {
          name: 'Laptop Pro 15"',
          description: 'High-performance laptop for professionals',
          category: 'Electronics',
          sku: 'LAPTOP-PRO-15',
          price: 1299.99,
          cost_price: 899.99,
          stock_quantity: 25,
          min_stock_level: 5,
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          name: 'Wireless Mouse',
          description: 'Ergonomic wireless mouse',
          category: 'Accessories',
          sku: 'MOUSE-WIRELESS',
          price: 49.99,
          cost_price: 24.99,
          stock_quantity: 100,
          min_stock_level: 20,
          status: 'active',
          created_at: new Date().toISOString()
        }
      ]);

    if (productsError) {
      console.log('Note: Products table might not exist yet:', productsError.message);
    } else {
      console.log('✅ Demo products added');
    }

    console.log('🎉 Demo user setup complete!');
    console.log('You can now login with:');
    console.log('Email: demo@vorniq.com');
    console.log('Password: (whatever you set in Firebase Auth)');
    console.log('Or use the "Try Demo Account" button on the login page');

  } catch (error) {
    console.error('Error setting up demo user:', error);
  }
}

// Run the setup
setupDemoUser();
