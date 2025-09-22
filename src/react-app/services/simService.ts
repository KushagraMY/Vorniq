import { supabase } from '../supabaseClient';

export interface SIMStats {
  totalProducts: number;
  lowStockCount: number;
  monthlyRevenue: number;
  pendingOrdersCount: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  sku: string;
  price: number;
  cost_price: number;
  stock_quantity: number;
  min_stock_level: number;
  max_stock_level: number;
  unit_of_measure: string;
  is_active: boolean;
  supplier_id: number;
  created_at: string;
  updated_at: string;
}

export interface Quotation {
  id: number;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  quote_date: string;
  valid_until: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  invoice_date: string;
  due_date: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  status: string;
  payment_status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier_id: number;
  supplier_name: string;
  order_date: string;
  expected_delivery_date: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: number;
  product_id: number;
  movement_type: string;
  quantity: number;
  reference_type: string;
  reference_id: number;
  notes: string;
  created_by: string;
  created_at: string;
}

export interface StockAlert {
  id: number;
  product_id: number;
  alert_type: string;
  current_stock: number;
  threshold_value: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecentSale {
  item: string;
  amount: number;
  customer: string;
  time: string;
}

export interface RecentAlert {
  product: string;
  current: number;
  minimum: number;
  status: 'critical' | 'warning';
}

export interface Supplier {
  id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  created_at: string;
}

class SIMService {
  // Debug method to check what data exists in the database
  async debugDatabaseData(): Promise<void> {
    try {
      console.log('=== SIM Database Debug ===');
      
      // Check products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, stock_quantity, min_stock_level, is_active');
      console.log('Products:', products?.length || 0, productsError ? productsError : 'OK');
      if (products && products.length > 0) {
        console.log('Sample products:', products.slice(0, 3));
      }

      // Check invoices
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('id, invoice_number, customer_name, total_amount, paid_amount, payment_status, created_at');
      console.log('Invoices:', invoices?.length || 0, invoicesError ? invoicesError : 'OK');
      if (invoices && invoices.length > 0) {
        console.log('Sample invoices:', invoices.slice(0, 3));
      }

      // Check purchase orders
      const { data: purchaseOrders, error: purchaseOrdersError } = await supabase
        .from('purchase_orders')
        .select('id, po_number, status, created_at');
      console.log('Purchase Orders:', purchaseOrders?.length || 0, purchaseOrdersError ? purchaseOrdersError : 'OK');
      if (purchaseOrders && purchaseOrders.length > 0) {
        console.log('Sample purchase orders:', purchaseOrders.slice(0, 3));
      }

      // Check stock alerts
      const { data: stockAlerts, error: stockAlertsError } = await supabase
        .from('stock_alerts')
        .select('id, product_id, alert_type, current_stock, threshold_value, is_active');
      console.log('Stock Alerts:', stockAlerts?.length || 0, stockAlertsError ? stockAlertsError : 'OK');
      if (stockAlerts && stockAlerts.length > 0) {
        console.log('Sample stock alerts:', stockAlerts.slice(0, 3));
      }

      // Check suppliers
      const { data: suppliers, error: suppliersError } = await supabase
        .from('suppliers')
        .select('id, name, contact_person, email, phone');
      console.log('Suppliers:', suppliers?.length || 0, suppliersError ? suppliersError : 'OK');
      if (suppliers && suppliers.length > 0) {
        console.log('Sample suppliers:', suppliers.slice(0, 3));
      }

      console.log('=== End Debug ===');
    } catch (error) {
      console.error('Error in debug method:', error);
    }
  }
  // Get SIM dashboard statistics
  async getSIMStats(): Promise<SIMStats> {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        console.warn('Supabase not configured, returning demo SIM stats');
        return {
          totalProducts: 85,
          lowStockCount: 12,
          monthlyRevenue: 75000,
          pendingOrdersCount: 8
        };
      }

      console.log('Fetching SIM stats...');
      
      // Get current month date range
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

      console.log('Date range:', startOfMonth.toISOString(), 'to', endOfMonth.toISOString());

      // Get total products - try multiple approaches
      let totalProducts = 0;
      try {
        // First try: count query
        const { count: productsCount, error: productsCountError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        if (productsCountError) {
          console.warn('Count query failed, trying alternative:', productsCountError);
          // Fallback: fetch all and count
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('id')
            .eq('is_active', true);
          
          if (productsError) throw productsError;
          totalProducts = productsData?.length || 0;
        } else {
          totalProducts = productsCount || 0;
        }
      } catch (error) {
        console.error('Error fetching products count:', error);
        totalProducts = 0;
      }

      // Get low stock count - calculate from products with low stock
      let lowStockCount = 0;
      try {
        const { data: lowStockProducts, error: lowStockError } = await supabase
          .from('products')
          .select('id, stock_quantity, min_stock_level')
          .eq('is_active', true);

        if (lowStockError) throw lowStockError;
        
        lowStockCount = lowStockProducts?.filter(p => 
          p.stock_quantity <= p.min_stock_level && p.stock_quantity > 0
        ).length || 0;
      } catch (error) {
        console.error('Error fetching low stock count:', error);
        lowStockCount = 0;
      }

      // Get pending orders count
      let pendingOrdersCount = 0;
      try {
        const { count: ordersCount, error: ordersError } = await supabase
          .from('purchase_orders')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (ordersError) {
          console.warn('Orders count query failed, trying alternative:', ordersError);
          const { data: ordersData, error: ordersDataError } = await supabase
            .from('purchase_orders')
            .select('id')
            .eq('status', 'pending');
          
          if (ordersDataError) throw ordersDataError;
          pendingOrdersCount = ordersData?.length || 0;
        } else {
          pendingOrdersCount = ordersCount || 0;
        }
      } catch (error) {
        console.error('Error fetching pending orders count:', error);
        pendingOrdersCount = 0;
      }

      // Get monthly revenue - be more flexible with date filtering
      let monthlyRevenue = 0;
      try {
        const { data: revenueData, error: revenueError } = await supabase
          .from('invoices')
          .select('paid_amount, invoice_date, payment_status')
          .eq('payment_status', 'paid');

        if (revenueError) throw revenueError;

        // Filter for current month
        monthlyRevenue = revenueData?.filter(invoice => {
          const invoiceDate = new Date(invoice.invoice_date);
          return invoiceDate >= startOfMonth && invoiceDate <= endOfMonth;
        }).reduce((sum, invoice) => sum + (invoice.paid_amount || 0), 0) || 0;
      } catch (error) {
        console.error('Error fetching monthly revenue:', error);
        monthlyRevenue = 0;
      }

      console.log('SIM Stats calculated:', {
        totalProducts,
        lowStockCount,
        monthlyRevenue,
        pendingOrdersCount
      });

      return {
        totalProducts,
        lowStockCount,
        monthlyRevenue,
        pendingOrdersCount,
      };
    } catch (error) {
      console.error('Error fetching SIM stats:', error);
      return {
        totalProducts: 0,
        lowStockCount: 0,
        monthlyRevenue: 0,
        pendingOrdersCount: 0,
      };
    }
  }

  // Get recent sales
  async getRecentSales(): Promise<RecentSale[]> {
    try {
      console.log('Fetching recent sales...');
      
      const { data, error } = await supabase
        .from('invoices')
        .select('customer_name, total_amount, created_at, invoice_number')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent sales:', error);
        return [];
      }

      const sales = data?.map((inv) => ({
        item: `Invoice ${inv.invoice_number || 'N/A'}`,
        amount: inv.total_amount || 0,
        customer: inv.customer_name || 'Customer',
        time: new Date(inv.created_at).toLocaleString(),
      })) || [];

      console.log('Recent sales fetched:', sales.length, 'sales');
      return sales;
    } catch (error) {
      console.error('Error fetching recent sales:', error);
      return [];
    }
  }

  // Get recent stock alerts - generate alerts from products if no alerts exist
  async getRecentAlerts(): Promise<RecentAlert[]> {
    try {
      console.log('Fetching recent alerts...');
      
      // First try to get existing alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('stock_alerts')
        .select('product_id, alert_type, current_stock, threshold_value')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (alertsError) {
        console.warn('Error fetching stock alerts, generating from products:', alertsError);
      }

      let alerts = alertsData || [];
      
      // If no alerts exist, generate them from products with low stock
      if (alerts.length === 0) {
        console.log('No stock alerts found, generating from products...');
        
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, name, stock_quantity, min_stock_level')
          .eq('is_active', true);

        if (productsError) {
          console.error('Error fetching products for alerts:', productsError);
          return [];
        }

        // Generate alerts for products with low stock
        const lowStockProducts = productsData?.filter(p => 
          p.stock_quantity <= p.min_stock_level
        ) || [];

        alerts = lowStockProducts.map(p => ({
          product_id: p.id,
          alert_type: p.stock_quantity === 0 ? 'out_of_stock' : 'low_stock',
          current_stock: p.stock_quantity,
          threshold_value: p.min_stock_level,
        })).slice(0, 5); // Limit to 5 most critical
      }

      // Get product names
      const productIds = Array.from(new Set(alerts.map((a) => a.product_id))).filter(Boolean);
      let idToName = new Map<number, string>();
      
      if (productIds.length > 0) {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, name')
          .in('id', productIds as number[]);

        if (productsError) {
          console.error('Error fetching product names:', productsError);
        } else {
          const rows = productsData || [];
          idToName = new Map(rows.map((r) => [r.id, r.name]));
        }
      }

      const recentAlerts = alerts.map((a) => ({
        product: idToName.get(a.product_id) || `Product #${a.product_id}`,
        current: a.current_stock || 0,
        minimum: a.threshold_value || 0,
        status: (a.alert_type === 'out_of_stock' ? 'critical' : 'warning') as 'critical' | 'warning',
      }));

      console.log('Recent alerts fetched:', recentAlerts.length, 'alerts');
      return recentAlerts;
    } catch (error) {
      console.error('Error fetching recent alerts:', error);
      return [];
    }
  }

  // Get all suppliers
  async getSuppliers(): Promise<Supplier[]> {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      return [];
    }
  }

  // Add new supplier
  async addSupplier(supplier: Partial<Supplier>): Promise<Supplier> {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert([{
          name: supplier.name,
          contact_person: supplier.contact_person,
          email: supplier.email,
          phone: supplier.phone,
          city: supplier.city,
          address: supplier.address,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding supplier:', error);
      throw error;
    }
  }

  // Get all products
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Add new product
  async addProduct(product: Partial<Product>): Promise<Product> {
    try {
      // Prepare product data, handling supplier_id properly
      const productData: any = {
        name: product.name,
        description: product.description,
        category: product.category,
        sku: product.sku,
        price: product.price,
        cost_price: product.cost_price,
        stock_quantity: product.stock_quantity || 0,
        min_stock_level: product.min_stock_level || 0,
        max_stock_level: product.max_stock_level || 0,
        unit_of_measure: product.unit_of_measure || 'pcs',
        is_active: product.is_active !== undefined ? product.is_active : true,
      };

      // Only include supplier_id if it's provided and not null/undefined
      if (product.supplier_id && product.supplier_id > 0) {
        productData.supplier_id = product.supplier_id;
      }
      // If supplier_id is null, undefined, or 0, we don't include it (will be NULL in database)

      console.log('Adding product with data:', productData);

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error adding product:', error);
        throw error;
      }
      
      console.log('Product added successfully:', data);
      return data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  // Update product
  async updateProduct(id: number, product: Partial<Product>): Promise<void> {
    try {
      // Prepare update data, handling supplier_id properly
      const updateData: any = {
        name: product.name,
        description: product.description,
        category: product.category,
        sku: product.sku,
        price: product.price,
        cost_price: product.cost_price,
        stock_quantity: product.stock_quantity,
        min_stock_level: product.min_stock_level,
        max_stock_level: product.max_stock_level,
        unit_of_measure: product.unit_of_measure,
        is_active: product.is_active,
        updated_at: new Date().toISOString(),
      };

      // Handle supplier_id properly
      if (product.supplier_id && product.supplier_id > 0) {
        updateData.supplier_id = product.supplier_id;
      } else if (product.supplier_id === null || product.supplier_id === 0) {
        updateData.supplier_id = null; // Explicitly set to NULL
      }
      // If supplier_id is undefined, don't include it in the update

      console.log('Updating product with data:', updateData);

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Supabase error updating product:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product (soft delete)
  async deleteProduct(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Get all quotations
  async getQuotations(): Promise<Quotation[]> {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching quotations:', error);
      return [];
    }
  }

  // Add new quotation
  async addQuotation(quotation: Partial<Quotation>): Promise<Quotation> {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .insert([{
          quote_number: quotation.quote_number,
          customer_name: quotation.customer_name,
          customer_email: quotation.customer_email,
          customer_phone: quotation.customer_phone,
          customer_address: quotation.customer_address,
          quote_date: quotation.quote_date,
          valid_until: quotation.valid_until,
          subtotal: quotation.subtotal,
          tax_amount: quotation.tax_amount || 0,
          discount_amount: quotation.discount_amount || 0,
          total_amount: quotation.total_amount,
          status: quotation.status || 'draft',
          notes: quotation.notes,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding quotation:', error);
      throw error;
    }
  }

  // Update quotation
  async updateQuotation(id: number, quotation: Partial<Quotation>): Promise<void> {
    try {
      const { error } = await supabase
        .from('quotations')
        .update({
          quote_number: quotation.quote_number,
          customer_name: quotation.customer_name,
          customer_email: quotation.customer_email,
          customer_phone: quotation.customer_phone,
          customer_address: quotation.customer_address,
          quote_date: quotation.quote_date,
          valid_until: quotation.valid_until,
          subtotal: quotation.subtotal,
          tax_amount: quotation.tax_amount,
          discount_amount: quotation.discount_amount,
          total_amount: quotation.total_amount,
          status: quotation.status,
          notes: quotation.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating quotation:', error);
      throw error;
    }
  }

  // Delete quotation
  async deleteQuotation(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('quotations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting quotation:', error);
      throw error;
    }
  }

  // Get all invoices
  async getInvoices(): Promise<Invoice[]> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
  }

  // Add new invoice
  async addInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([{
          invoice_number: invoice.invoice_number,
          customer_name: invoice.customer_name,
          customer_email: invoice.customer_email,
          customer_phone: invoice.customer_phone,
          customer_address: invoice.customer_address,
          invoice_date: invoice.invoice_date,
          due_date: invoice.due_date,
          subtotal: invoice.subtotal,
          tax_amount: invoice.tax_amount || 0,
          discount_amount: invoice.discount_amount || 0,
          total_amount: invoice.total_amount,
          paid_amount: invoice.paid_amount || 0,
          status: invoice.status || 'draft',
          payment_status: invoice.payment_status || 'pending',
          notes: invoice.notes,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding invoice:', error);
      throw error;
    }
  }

  // Update invoice
  async updateInvoice(id: number, invoice: Partial<Invoice>): Promise<void> {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          invoice_number: invoice.invoice_number,
          customer_name: invoice.customer_name,
          customer_email: invoice.customer_email,
          customer_phone: invoice.customer_phone,
          customer_address: invoice.customer_address,
          invoice_date: invoice.invoice_date,
          due_date: invoice.due_date,
          subtotal: invoice.subtotal,
          tax_amount: invoice.tax_amount,
          discount_amount: invoice.discount_amount,
          total_amount: invoice.total_amount,
          paid_amount: invoice.paid_amount,
          status: invoice.status,
          payment_status: invoice.payment_status,
          notes: invoice.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  }

  // Delete invoice
  async deleteInvoice(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }

  // Get all purchase orders
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      return [];
    }
  }

  // Add new purchase order
  async addPurchaseOrder(po: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .insert([{
          po_number: po.po_number,
          supplier_id: po.supplier_id,
          supplier_name: po.supplier_name,
          order_date: po.order_date,
          expected_delivery_date: po.expected_delivery_date,
          subtotal: po.subtotal,
          tax_amount: po.tax_amount || 0,
          total_amount: po.total_amount,
          status: po.status || 'draft',
          notes: po.notes,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding purchase order:', error);
      throw error;
    }
  }

  // Get all stock movements
  async getStockMovements(): Promise<StockMovement[]> {
    try {
      const { data, error } = await supabase
        .from('stock_movements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching stock movements:', error);
      return [];
    }
  }

  // Add stock movement
  async addStockMovement(movement: Partial<StockMovement>): Promise<StockMovement> {
    try {
      const { data, error } = await supabase
        .from('stock_movements')
        .insert([{
          product_id: movement.product_id,
          movement_type: movement.movement_type,
          quantity: movement.quantity,
          reference_type: movement.reference_type,
          reference_id: movement.reference_id,
          notes: movement.notes,
          created_by: movement.created_by,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding stock movement:', error);
      throw error;
    }
  }

  // Delete stock movement
  async deleteStockMovement(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('stock_movements')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting stock movement:', error);
      throw error;
    }
  }

  // Get all stock alerts
  async getStockAlerts(): Promise<StockAlert[]> {
    try {
      const { data, error } = await supabase
        .from('stock_alerts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching stock alerts:', error);
      return [];
    }
  }

  // Add stock alert
  async addStockAlert(alert: Partial<StockAlert>): Promise<StockAlert> {
    try {
      const { data, error } = await supabase
        .from('stock_alerts')
        .insert([{
          product_id: alert.product_id,
          alert_type: alert.alert_type,
          current_stock: alert.current_stock,
          threshold_value: alert.threshold_value,
          is_active: alert.is_active !== undefined ? alert.is_active : true,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding stock alert:', error);
      throw error;
    }
  }

  // Delete stock alert (soft delete)
  async deleteStockAlert(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('stock_alerts')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting stock alert:', error);
      throw error;
    }
  }

  // Get sales analytics
  async getSalesAnalytics(): Promise<{
    totalRevenue: number;
    totalInvoices: number;
    paidInvoices: number;
    outstandingAmount: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('total_amount, paid_amount, payment_status');

      if (error) throw error;

      const invoices = data || [];
      const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.paid_amount || 0), 0);
      const totalInvoices = invoices.length;
      const paidInvoices = invoices.filter(inv => inv.payment_status === 'paid').length;
      const outstandingAmount = invoices.reduce((sum, inv) => sum + ((inv.total_amount || 0) - (inv.paid_amount || 0)), 0);

      return {
        totalRevenue,
        totalInvoices,
        paidInvoices,
        outstandingAmount,
      };
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      return {
        totalRevenue: 0,
        totalInvoices: 0,
        paidInvoices: 0,
        outstandingAmount: 0,
      };
    }
  }

  // Get inventory analytics
  async getInventoryAnalytics(): Promise<{
    totalProducts: number;
    activeProducts: number;
    lowStockItems: number;
    outOfStockItems: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, stock_quantity, min_stock_level, is_active');

      if (error) throw error;

      const products = data || [];
      const totalProducts = products.length;
      const activeProducts = products.filter(p => p.is_active).length;
      const lowStockItems = products.filter(p => p.stock_quantity <= p.min_stock_level && p.stock_quantity > 0).length;
      const outOfStockItems = products.filter(p => p.stock_quantity === 0).length;

      return {
        totalProducts,
        activeProducts,
        lowStockItems,
        outOfStockItems,
      };
    } catch (error) {
      console.error('Error fetching inventory analytics:', error);
      return {
        totalProducts: 0,
        activeProducts: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
      };
    }
  }
}

export const simService = new SIMService();
