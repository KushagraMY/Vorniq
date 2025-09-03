
-- Insert sample suppliers
INSERT INTO suppliers (name, contact_person, email, phone, address, city, country, payment_terms) VALUES 
('Tech Solutions Ltd', 'John Smith', 'john@techsolutions.com', '+91-9876543210', '123 Tech Park', 'Mumbai', 'India', 'Net 30'),
('Global Electronics', 'Sarah Johnson', 'sarah@globalelectronics.com', '+91-9876543211', '456 Electronics Street', 'Delhi', 'India', 'Net 15'),
('Office Supplies Co', 'Mike Wilson', 'mike@officesupplies.com', '+91-9876543212', '789 Supply Lane', 'Bangalore', 'India', 'Net 45'),
('Premium Furniture', 'Lisa Brown', 'lisa@premiumfurniture.com', '+91-9876543213', '321 Furniture Row', 'Chennai', 'India', 'Net 30'),
('Digital World', 'David Lee', 'david@digitalworld.com', '+91-9876543214', '654 Digital Avenue', 'Hyderabad', 'India', 'Net 20');

-- Insert sample products
INSERT INTO products (name, description, category, sku, price, cost_price, stock_quantity, min_stock_level, max_stock_level, unit_of_measure, is_active, supplier_id) VALUES 
('MacBook Pro M3', 'Latest MacBook Pro with M3 chip', 'Laptops', 'MBP-M3-001', 150000, 120000, 15, 5, 50, 'pcs', TRUE, 1),
('iPhone 15 Pro', 'Latest iPhone with Pro features', 'Smartphones', 'IP15-PRO-001', 120000, 95000, 25, 10, 100, 'pcs', TRUE, 2),
('Dell XPS 13', 'Ultrabook with latest Intel processor', 'Laptops', 'DELL-XPS-001', 85000, 68000, 8, 5, 30, 'pcs', TRUE, 1),
('Samsung Galaxy S24', 'Latest Samsung flagship phone', 'Smartphones', 'SGS24-001', 80000, 64000, 12, 8, 60, 'pcs', TRUE, 2),
('iPad Air', 'Latest iPad Air with M2 chip', 'Tablets', 'IPAD-AIR-001', 60000, 48000, 20, 10, 80, 'pcs', TRUE, 1),
('Office Chair Premium', 'Ergonomic office chair', 'Furniture', 'OFC-CHAIR-001', 15000, 10000, 30, 15, 100, 'pcs', TRUE, 4),
('Wireless Mouse', 'Bluetooth wireless mouse', 'Accessories', 'WM-BT-001', 2500, 1500, 100, 25, 500, 'pcs', TRUE, 3),
('Mechanical Keyboard', 'RGB mechanical gaming keyboard', 'Accessories', 'KB-MECH-001', 8000, 5000, 50, 20, 200, 'pcs', TRUE, 3),
('Monitor 27 inch', '4K 27-inch monitor', 'Monitors', 'MON-27-4K-001', 35000, 28000, 18, 10, 60, 'pcs', TRUE, 2),
('Printer Laser', 'Color laser printer', 'Printers', 'PRT-LASER-001', 25000, 18000, 12, 8, 40, 'pcs', TRUE, 3);

-- Insert sample quotations
INSERT INTO quotations (quote_number, customer_name, customer_email, customer_phone, quote_date, valid_until, subtotal, tax_amount, discount_amount, total_amount, status, notes) VALUES 
('QT001', 'ABC Technologies', 'contact@abctech.com', '+91-9876543220', '2024-01-15', '2024-02-15', 500000, 90000, 25000, 565000, 'sent', 'Bulk order for office setup'),
('QT002', 'XYZ Corp', 'info@xyzcorp.com', '+91-9876543221', '2024-01-16', '2024-02-16', 300000, 54000, 15000, 339000, 'accepted', 'Laptop procurement for employees'),
('QT003', 'StartupHub', 'hello@startuphub.com', '+91-9876543222', '2024-01-17', '2024-02-17', 750000, 135000, 50000, 835000, 'draft', 'Complete office equipment quote'),
('QT004', 'TechCorp Ltd', 'sales@techcorp.com', '+91-9876543223', '2024-01-18', '2024-02-18', 200000, 36000, 10000, 226000, 'sent', 'Mobile devices for sales team'),
('QT005', 'Digital Agency', 'contact@digitalagency.com', '+91-9876543224', '2024-01-19', '2024-02-19', 400000, 72000, 20000, 452000, 'accepted', 'Design workstations setup');

-- Insert sample invoices
INSERT INTO invoices (invoice_number, customer_name, customer_email, customer_phone, customer_address, invoice_date, due_date, subtotal, tax_amount, discount_amount, total_amount, paid_amount, status, payment_status, notes) VALUES 
('INV001', 'ABC Technologies', 'contact@abctech.com', '+91-9876543220', '123 Business Park, Mumbai', '2024-01-20', '2024-02-20', 300000, 54000, 15000, 339000, 339000, 'sent', 'paid', 'Payment received on time'),
('INV002', 'XYZ Corp', 'info@xyzcorp.com', '+91-9876543221', '456 Corporate Street, Delhi', '2024-01-21', '2024-02-21', 500000, 90000, 25000, 565000, 200000, 'sent', 'partial', 'Partial payment received'),
('INV003', 'TechCorp Ltd', 'sales@techcorp.com', '+91-9876543223', '789 Tech Tower, Bangalore', '2024-01-22', '2024-02-22', 200000, 36000, 10000, 226000, 0, 'draft', 'pending', 'Draft invoice for review'),
('INV004', 'Digital Agency', 'contact@digitalagency.com', '+91-9876543224', '321 Creative Hub, Chennai', '2024-01-23', '2024-02-23', 400000, 72000, 20000, 452000, 452000, 'sent', 'paid', 'Full payment received'),
('INV005', 'StartupHub', 'hello@startuphub.com', '+91-9876543222', '654 Innovation Center, Hyderabad', '2024-01-24', '2024-02-24', 150000, 27000, 8000, 169000, 0, 'sent', 'pending', 'Follow up required');

-- Insert sample purchase orders
INSERT INTO purchase_orders (po_number, supplier_id, supplier_name, order_date, expected_delivery_date, subtotal, tax_amount, total_amount, status, notes) VALUES 
('PO001', 1, 'Tech Solutions Ltd', '2024-01-15', '2024-01-25', 2000000, 360000, 2360000, 'confirmed', 'Bulk order for MacBooks'),
('PO002', 2, 'Global Electronics', '2024-01-16', '2024-01-26', 1500000, 270000, 1770000, 'sent', 'iPhone and Samsung phones'),
('PO003', 3, 'Office Supplies Co', '2024-01-17', '2024-01-27', 500000, 90000, 590000, 'draft', 'Office accessories and furniture'),
('PO004', 4, 'Premium Furniture', '2024-01-18', '2024-01-28', 300000, 54000, 354000, 'confirmed', 'Office chairs and desks'),
('PO005', 5, 'Digital World', '2024-01-19', '2024-01-29', 800000, 144000, 944000, 'received', 'Monitors and peripherals');

-- Insert sample stock movements
INSERT INTO stock_movements (product_id, movement_type, quantity, reference_type, reference_id, notes, created_by) VALUES 
(1, 'stock_in', 20, 'purchase', 1, 'Received from supplier', 'admin'),
(2, 'stock_in', 50, 'purchase', 2, 'Bulk purchase', 'admin'),
(3, 'stock_out', 5, 'sale', 1, 'Sold to customer', 'sales'),
(4, 'stock_out', 8, 'sale', 2, 'Corporate sale', 'sales'),
(5, 'adjustment_in', 5, 'adjustment', NULL, 'Stock count adjustment', 'admin'),
(6, 'stock_in', 40, 'purchase', 4, 'Furniture delivery', 'admin'),
(7, 'stock_out', 25, 'sale', 3, 'Bulk accessories sale', 'sales'),
(8, 'stock_in', 30, 'purchase', 3, 'Keyboard restock', 'admin'),
(9, 'stock_out', 12, 'sale', 4, 'Monitor sale', 'sales'),
(10, 'adjustment_out', 3, 'adjustment', NULL, 'Damaged units', 'admin');

-- Insert sample stock alerts
INSERT INTO stock_alerts (product_id, alert_type, current_stock, threshold_value, is_active) VALUES 
(1, 'low_stock', 5, 5, TRUE),
(3, 'low_stock', 3, 5, TRUE),
(4, 'low_stock', 4, 8, TRUE),
(9, 'low_stock', 6, 10, TRUE),
(10, 'low_stock', 9, 8, FALSE);
