import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, DollarSign, FileText, 
  TrendingUp, TrendingDown, ExternalLink 
} from 'lucide-react';
import { supabase } from '@/lib/createClient';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEntrepreneurs: 0,
    totalEvents: 0,
    totalReports: 0,
    totalTransactions: 0,
    totalCredit: 0,
    totalDebit: 0,
    currentBalance: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch entrepreneurs count
      const { count: entrepreneursCount } = await supabase
        .from('entrepreneurs')
        .select('*', { count: 'exact', head: true });

      // Fetch events count
      const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });

      // Fetch reports count
      const { count: reportsCount } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true });

      // Fetch transactions and calculate totals
      const { data: transactions } = await supabase
        .from('fund_transactions')
        .select('*');

      let totalCredit = 0;
      let totalDebit = 0;

      if (transactions) {
        transactions.forEach(transaction => {
          const amount = parseFloat(transaction.amount) || 0;
          if (transaction.transaction_type === 'credit') {
            totalCredit += amount;
          } else {
            totalDebit += amount;
          }
        });
      }

      const currentBalance = totalCredit - totalDebit;

      // Get recent activity (last 5 entrepreneurs)
      const { data: recentEntrepreneurs } = await supabase
        .from('entrepreneurs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalEntrepreneurs: entrepreneursCount || 0,
        totalEvents: eventsCount || 0,
        totalReports: reportsCount || 0,
        totalTransactions: transactions?.length || 0,
        totalCredit,
        totalDebit,
        currentBalance
      });

      setRecentActivity(recentEntrepreneurs || []);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, onClick }) => (
    <div 
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer ${
        onClick ? 'hover:border-emerald-300' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-emerald-600" />
        </div>
      </div>
    </div>
  );

  const QuickLink = ({ href, title, description, icon: Icon }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 hover:border-emerald-300"
    >
      <div className="flex items-start">
        <Icon className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </div>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </a>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome to your administration panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Entrepreneurs"
            value={stats.totalEntrepreneurs}
            color="bg-emerald-50"
            onClick={() => navigate('/dashboard/entrepreneurs')}
          />
          <StatCard
            icon={Calendar}
            title="Events"
            value={stats.totalEvents}
            color="bg-blue-50"
            onClick={() => navigate('/dashboard/events')}
          />
          <StatCard
            icon={FileText}
            title="Reports"
            value={stats.totalReports}
            color="bg-purple-50"
            onClick={() => navigate('/dashboard/reports')}
          />
          <StatCard
            icon={DollarSign}
            title="Transactions"
            value={stats.totalTransactions}
            color="bg-orange-50"
            onClick={() => navigate('/dashboard/transactions')}
          />
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-50 rounded">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Credit</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(stats.totalCredit)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-50 rounded">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Debit</p>
                    <p className="text-lg font-bold text-red-600">{formatCurrency(stats.totalDebit)}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Current Balance</p>
                  <p className={`text-xl font-bold ${
                    stats.currentBalance >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(stats.currentBalance)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Entrepreneurs</h3>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((entrepreneur) => (
                  <div 
                    key={entrepreneur.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                    onClick={() => navigate('/entrepreneurs')}
                  >
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden">
                      {entrepreneur.image_url ? (
                        <img
                          src={entrepreneur.image_url}
                          alt={entrepreneur.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="h-5 w-5 text-emerald-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{entrepreneur.name}</p>
                      <p className="text-sm text-gray-500">{entrepreneur.designation}</p>
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatDate(entrepreneur.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No entrepreneurs added yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickLink
              href="https://www.notion.so"
              title="Notion Dashboard"
              description="Access project documentation and planning"
              icon={FileText}
            />
            <QuickLink
              href="https://calendar.google.com"
              title="Google Calendar"
              description="View and manage scheduled events"
              icon={Calendar}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>Dashboard updated: {new Date().toLocaleDateString()}</p>
            <div className="flex items-center gap-4 mt-2 md:mt-0">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Active</span>
              </span>
              <span>•</span>
              <span>System Status: Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;