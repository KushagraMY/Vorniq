import { supabase } from '../supabaseClient';

export interface CRMStats {
  totalCustomers: number;
  activeLeads: number;
  pendingFollowups: number;
  conversionRate: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  job_title: string;
  address: string;
  city: string;
  country: string;
  website: string;
  source: string;
  tags: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  job_title: string;
  source: string;
  value: number;
  probability: number;
  stage: string;
  assigned_to: string;
  customer_id: number;
  next_follow_up: string;
  tags: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface FollowUp {
  id: number;
  lead_id: number;
  customer_id: number;
  type: string;
  description: string;
  scheduled_date: string;
  status: string;
  assigned_to: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Communication {
  id: number;
  lead_id: number;
  customer_id: number;
  type: string;
  subject: string;
  content: string;
  direction: string;
  date: string;
  status: string;
  created_at: string;
}

export interface SalesStage {
  stage: string;
  count: number;
  value: number;
}

class CRMService {
  // Get CRM dashboard statistics
  async getCRMStats(): Promise<CRMStats> {
    try {
      // Get total customers
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('id');

      if (customersError) throw customersError;

      // Get total leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('id, stage, value');

      if (leadsError) throw leadsError;

      // Get pending follow-ups
      const { data: followUpsData, error: followUpsError } = await supabase
        .from('follow_ups')
        .select('id')
        .eq('status', 'pending')
        .gte('due_date', new Date().toISOString().split('T')[0]);

      if (followUpsError) throw followUpsError;

      const totalCustomers = customersData?.length || 0;
      const activeLeads = leadsData?.filter(lead => 
        !['closed_won', 'closed_lost'].includes(lead.stage)
      ).length || 0;
      const pendingFollowups = followUpsData?.length || 0;

      // Calculate conversion rate
      const totalLeads = leadsData?.length || 0;
      const wonLeads = leadsData?.filter(lead => lead.stage === 'closed_won').length || 0;
      const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

      return {
        totalCustomers,
        activeLeads,
        pendingFollowups,
        conversionRate,
      };
    } catch (error) {
      console.error('Error fetching CRM stats:', error);
      return {
        totalCustomers: 0,
        activeLeads: 0,
        pendingFollowups: 0,
        conversionRate: 0,
      };
    }
  }

  // Get all customers
  async getCustomers(): Promise<Customer[]> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  }

  // Add new customer
  async addCustomer(customer: Partial<Customer>): Promise<Customer> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([{
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          company: customer.company,
          job_title: customer.job_title,
          address: customer.address,
          city: customer.city,
          country: customer.country,
          website: customer.website,
          source: customer.source,
          tags: customer.tags,
          notes: customer.notes,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  }

  // Update customer
  async updateCustomer(id: number, customer: Partial<Customer>): Promise<void> {
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          company: customer.company,
          job_title: customer.job_title,
          address: customer.address,
          city: customer.city,
          country: customer.country,
          website: customer.website,
          source: customer.source,
          tags: customer.tags,
          notes: customer.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  // Delete customer
  async deleteCustomer(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }

  // Get all leads
  async getLeads(): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  }

  // Add new lead
  async addLead(lead: Partial<Lead>): Promise<Lead> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          job_title: lead.job_title,
          source: lead.source,
          value: lead.value,
          probability: lead.probability,
          stage: lead.stage || 'new',
          assigned_to: lead.assigned_to,
          customer_id: lead.customer_id,
          next_follow_up: lead.next_follow_up,
          tags: lead.tags,
          notes: lead.notes,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding lead:', error);
      throw error;
    }
  }

  // Update lead
  async updateLead(id: number, lead: Partial<Lead>): Promise<void> {
    try {
      const { error } = await supabase
        .from('leads')
        .update({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          job_title: lead.job_title,
          source: lead.source,
          value: lead.value,
          probability: lead.probability,
          stage: lead.stage,
          assigned_to: lead.assigned_to,
          customer_id: lead.customer_id,
          next_follow_up: lead.next_follow_up,
          tags: lead.tags,
          notes: lead.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  }

  // Delete lead
  async deleteLead(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  }

  // Get sales funnel data
  async getSalesFunnel(): Promise<SalesStage[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('stage, value');

      if (error) throw error;

      const stageGroups = data?.reduce((acc, lead) => {
        const stage = lead.stage;
        if (!acc[stage]) {
          acc[stage] = { count: 0, value: 0 };
        }
        acc[stage].count += 1;
        acc[stage].value += lead.value || 0;
        return acc;
      }, {} as Record<string, { count: number; value: number }>) || {};

      return Object.entries(stageGroups).map(([stage, data]) => ({
        stage,
        count: data.count,
        value: data.value,
      }));
    } catch (error) {
      console.error('Error fetching sales funnel:', error);
      return [];
    }
  }

  // Get follow-ups
  async getFollowUps(): Promise<FollowUp[]> {
    try {
      const { data, error } = await supabase
        .from('follow_ups')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
      return [];
    }
  }

  // Add follow-up
  async addFollowUp(followUp: Partial<FollowUp>): Promise<FollowUp> {
    try {
      const { data, error } = await supabase
        .from('follow_ups')
        .insert([{
          lead_id: followUp.lead_id,
          customer_id: followUp.customer_id,
          title: followUp.description || 'Follow-up',
          description: followUp.description,
          due_date: followUp.scheduled_date,
          status: followUp.status || 'pending',
          assigned_to: followUp.assigned_to,
          priority: 'medium',
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding follow-up:', error);
      throw error;
    }
  }

  // Get communications
  async getCommunications(): Promise<Communication[]> {
    try {
      const { data, error } = await supabase
        .from('communications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching communications:', error);
      return [];
    }
  }

  // Add communication
  async addCommunication(communication: Partial<Communication>): Promise<Communication> {
    try {
      const { data, error } = await supabase
        .from('communications')
        .insert([{
          lead_id: communication.lead_id,
          customer_id: communication.customer_id,
          type: communication.type,
          subject: communication.subject,
          content: communication.content,
          direction: communication.direction,
          scheduled_at: communication.date,
          status: communication.status || 'completed',
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding communication:', error);
      throw error;
    }
  }

  // Get recent activities (leads and customers)
  async getRecentActivities(): Promise<any[]> {
    try {
      const [leadsData, customersData] = await Promise.all([
        supabase
          .from('leads')
          .select('id, name, stage, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('customers')
          .select('id, name, source, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      if (leadsData.error) throw leadsData.error;
      if (customersData.error) throw customersData.error;

      const activities: any[] = [];

      // Add recent leads
      leadsData.data?.forEach(lead => {
        activities.push({
          id: lead.id,
          type: 'lead',
          name: lead.name,
          description: `New lead added - Stage: ${lead.stage}`,
          date: lead.created_at,
        });
      });

      // Add recent customers
      customersData.data?.forEach(customer => {
        activities.push({
          id: customer.id,
          type: 'customer',
          name: customer.name,
          description: `New customer added - Source: ${customer.source}`,
          date: customer.created_at,
        });
      });

      // Sort by date and return top 10
      return activities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  }

  // Get conversion metrics
  async getConversionMetrics(): Promise<{
    totalLeads: number;
    qualifiedLeads: number;
    wonLeads: number;
    lostLeads: number;
    conversionRate: number;
    totalValue: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('stage, value');

      if (error) throw error;

      const totalLeads = data?.length || 0;
      const qualifiedLeads = data?.filter(lead => lead.stage === 'qualified').length || 0;
      const wonLeads = data?.filter(lead => lead.stage === 'closed_won').length || 0;
      const lostLeads = data?.filter(lead => lead.stage === 'closed_lost').length || 0;
      const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
      const totalValue = data?.reduce((sum, lead) => sum + (lead.value || 0), 0) || 0;

      return {
        totalLeads,
        qualifiedLeads,
        wonLeads,
        lostLeads,
        conversionRate,
        totalValue,
      };
    } catch (error) {
      console.error('Error fetching conversion metrics:', error);
      return {
        totalLeads: 0,
        qualifiedLeads: 0,
        wonLeads: 0,
        lostLeads: 0,
        conversionRate: 0,
        totalValue: 0,
      };
    }
  }
}

export const crmService = new CRMService();
