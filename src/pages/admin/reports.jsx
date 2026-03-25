import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, Plus, Trash2, Edit, X, Eye, ExternalLink, 
  Calendar, FileText, Download, Globe, SortAsc, SortDesc
} from 'lucide-react';
import { supabase } from '@/lib/createClient';
import { toast } from 'sonner';

// Form and Dialog Components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components2/ui/alert-dialog";
import { Label } from "@/components2/ui/label";
import { Button } from "@/components2/ui/button";
import { Input } from "@/components2/ui/input";
import { Textarea } from "@/components2/ui/textarea";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components2/ui/sheet";

function Reports() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewReport, setViewReport] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  const [formData, setFormData] = useState({
    name: '',
    link: '',
    description: '',
    report_date: ''
  });

  const initialFormData = {
    name: '',
    link: '',
    description: '',
    report_date: ''
  };

  // Fetch reports from Supabase
  const fetchReports = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('reports')
        .select('*');

      // Apply sorting
      if (sortField) {
        query = query.order(sortField, { 
          ascending: sortDirection === 'asc' 
        });
      }

      const { data, error } = await query;

      if (error) throw error;

      setReports(data || []);
    } catch (error) {
      console.error("Error fetching reports: ", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [sortField, sortDirection]);

  // Set form data when editing
  useEffect(() => {
    if (editingReport) {
      setFormData({
        name: editingReport.name || '',
        link: editingReport.link || '',
        description: editingReport.description || '',
        report_date: editingReport.report_date ? editingReport.report_date.split('T')[0] : ''
      });
      setSheetOpen(true);
    }
  }, [editingReport]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const reportData = {
        name: formData.name,
        link: formData.link,
        description: formData.description,
        report_date: formData.report_date || null
      };

      if (editingReport) {
        const { error } = await supabase
          .from('reports')
          .update({
            ...reportData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingReport.id);

        if (error) throw error;

        // Update local state
        setReports((prev) =>
          prev.map((report) =>
            report.id === editingReport.id ? { ...report, ...reportData } : report
          )
        );
        
        toast.success("Report updated successfully!");
      } else {
        const { data, error } = await supabase
          .from('reports')
          .insert([{
            ...reportData,
            created_at: new Date().toISOString()
          }])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          setReports((prev) => [data[0], ...prev]);
        }
        
        toast.success("Report added successfully!");
      }

      // Reset form
      resetForm();
      setSheetOpen(false);

    } catch (error) {
      console.error("Error saving report: ", error);
      toast.error(error.message || "Failed to save report");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!reportToDelete) return;

    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportToDelete.id);

      if (error) throw error;

      // Update local state
      setReports((prev) => prev.filter((report) => report.id !== reportToDelete.id));
      setDeleteDialogOpen(false);
      toast.success("Report deleted successfully!");

    } catch (error) {
      console.error("Error deleting report: ", error);
      toast.error("Failed to delete report");
    }
  };

  const openDeleteDialog = (report) => {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };

  const handleViewReport = (report) => {
    setViewReport(report);
    setSheetOpen(true);
  };

  // Filter reports based on search term
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const searchLower = searchTerm.toLowerCase();
      return (
        report.name?.toLowerCase().includes(searchLower) ||
        report.description?.toLowerCase().includes(searchLower) ||
        report.link?.toLowerCase().includes(searchLower)
      );
    });
  }, [reports, searchTerm]);

  const resetForm = () => {
    setFormData({ ...initialFormData });
    setEditingReport(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Get sort icon for a field
  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <SortAsc className="w-4 h-4 ml-1" />
    ) : (
      <SortDesc className="w-4 h-4 ml-1" />
    );
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports Manager</h1>
              <p className="text-gray-600 mt-1">Manage and organize your reports and documents</p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setSheetOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Report
            </Button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div>
              <Label htmlFor="search" className="mb-1 font-medium text-gray-700">Search Reports</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by report name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-800">Total Reports</p>
                  <p className="text-2xl font-bold text-emerald-900">{reports.length}</p>
                </div>
                <FileText className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h3 className="text-sm font-medium text-gray-500 mb-2">This Year</h3>
            <p className="text-3xl font-bold text-emerald-700">
              {reports.filter(report => {
                const reportDate = new Date(report.report_date || report.created_at);
                const currentYear = new Date().getFullYear();
                return reportDate.getFullYear() === currentYear;
              }).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Last 30 Days</h3>
            <p className="text-3xl font-bold text-blue-600">
              {reports.filter(report => {
                const reportDate = new Date(report.created_at);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return reportDate >= thirtyDaysAgo;
              }).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Filtered Results</h3>
            <p className="text-3xl font-bold text-orange-600">{filteredReports.length}</p>
          </div>
        </div>

        {/* Results Count */}
        {searchTerm && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredReports.length} of {reports.length} reports
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        )}

        {/* Reports Table - Using HTML Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Report Name
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('description')}
                  >
                    <div className="flex items-center">
                      Description
                      {getSortIcon('description')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('report_date')}
                  >
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Report Date
                      {getSortIcon('report_date')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Added On
                      {getSortIcon('created_at')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-8 bg-gray-200 rounded w-24 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <div className="text-gray-400 mb-2">
                        <FileText className="w-12 h-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-600 mb-1">
                        {reports.length === 0 ? 'No reports yet' : 'No reports found'}
                      </h3>
                      <p className="text-gray-500">
                        {reports.length === 0 
                          ? 'Click "Add Report" to get started' 
                          : 'Try adjusting your search term'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{report.name}</div>
                        {report.link && (
                          <a
                            href={report.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-600 hover:text-emerald-800 hover:underline inline-flex items-center gap-1 mt-1"
                          >
                            <Globe className="w-3 h-3" />
                            View Report
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {report.description || 'No description'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {report.report_date ? formatDate(report.report_date) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {formatDate(report.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2  group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewReport(report)}
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingReport(report);
                            }}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {report.link && (
                            <a
                              href={report.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center h-8 w-8 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                              title="Open Link"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(report)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Report Sheet */}
      <Sheet open={sheetOpen && !viewReport} onOpenChange={(open) => {
        setSheetOpen(open);
        if (!open) {
          resetForm();
        }
      }}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingReport ? 'Edit Report' : 'Add New Report'}</SheetTitle>
            <SheetDescription>
              {editingReport ? 'Update report information' : 'Add a new report to your collection'}
            </SheetDescription>
          </SheetHeader>
          
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Report Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Annual Report 2023"
                required
              />
            </div>

            <div>
              <Label htmlFor="link">Report Link (URL) *</Label>
              <Input
                id="link"
                name="link"
                type="url"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="https://example.com/report.pdf"
                required
              />
              {formData.link && !validateUrl(formData.link) && (
                <p className="text-sm text-red-500 mt-1">Please enter a valid URL</p>
              )}
            </div>

            <div>
              <Label htmlFor="report_date">Report Date</Label>
              <Input
                id="report_date"
                name="report_date"
                type="date"
                value={formData.report_date}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the report content..."
                rows="4"
              />
            </div>

            <SheetFooter className="mt-4">
              <SheetClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </SheetClose>
              <Button 
                type="submit" 
                disabled={isSubmitting || (formData.link && !validateUrl(formData.link))}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting ? 'Saving...' : (editingReport ? 'Update Report' : 'Add Report')}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* View Report Sheet */}
      <Sheet open={viewReport && sheetOpen} onOpenChange={(open) => {
        if (!open) setViewReport(null);
        setSheetOpen(open);
      }}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {viewReport && (
            <>
              <SheetHeader>
                <SheetTitle>{viewReport.name}</SheetTitle>
                <SheetDescription>
                  Report details and information
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-800">Report Details</p>
                      <p className="text-lg font-bold text-emerald-900">{viewReport.name}</p>
                    </div>
                    <FileText className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>

                <div className="space-y-4">
                  {viewReport.description && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Description</Label>
                      <p className="mt-1 text-gray-700 whitespace-pre-wrap">{viewReport.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Report Date</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p>{viewReport.report_date ? formatDate(viewReport.report_date) : 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Added On</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p>{formatDate(viewReport.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  {viewReport.link && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Report Link</Label>
                      <div className="mt-2 space-y-2">
                        <a
                          href={viewReport.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-3 py-2 rounded transition-colors w-full"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="truncate max-w-xs">{viewReport.link}</span>
                        </a>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            window.open(viewReport.link, '_blank');
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Open Report
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
                <Button
                  onClick={() => {
                    setEditingReport(viewReport);
                    setViewReport(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Report
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the report
              from your collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Reports;