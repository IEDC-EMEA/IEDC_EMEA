import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Trash2, Eye, Mail, Calendar, SortAsc, SortDesc, 
  MessageSquare, Download, ChevronLeft, ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/createClient';
import { toast } from 'sonner';

// Dialog Components
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components2/ui/sheet";

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [viewFeedback, setViewFeedback] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch feedbacks from Supabase
  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('contacts')
        .select('*');

      // Apply sorting
      if (sortField) {
        query = query.order(sortField, { 
          ascending: sortDirection === 'asc' 
        });
      }

      const { data, error } = await query;

      if (error) throw error;

      setFeedbacks(data || []);
    } catch (error) {
      console.error("Error fetching feedbacks: ", error);
      toast.error("Failed to load feedback messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [sortField, sortDirection]);

  const handleDelete = async () => {
    if (!feedbackToDelete) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', feedbackToDelete.id);

      if (error) throw error;

      // Update local state
      setFeedbacks((prev) => prev.filter((feedback) => feedback.id !== feedbackToDelete.id));
      setDeleteDialogOpen(false);
      toast.success("Feedback deleted successfully!");

    } catch (error) {
      console.error("Error deleting feedback: ", error);
      toast.error("Failed to delete feedback");
    }
  };

  const openDeleteDialog = (feedback) => {
    setFeedbackToDelete(feedback);
    setDeleteDialogOpen(true);
  };

  const handleViewFeedback = (feedback) => {
    setViewFeedback(feedback);
    setSheetOpen(true);
  };

  // Filter feedbacks based on search term
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(feedback => {
      const searchLower = searchTerm.toLowerCase();
      return (
        feedback.email?.toLowerCase().includes(searchLower) ||
        feedback.message?.toLowerCase().includes(searchLower)
      );
    });
  }, [feedbacks, searchTerm]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <SortAsc className="w-4 h-4 ml-1" />
    ) : (
      <SortDesc className="w-4 h-4 ml-1" />
    );
  };

  const exportToCSV = () => {
    const headers = ['Email', 'Message', 'Date'];
    const csvData = filteredFeedbacks.map(feedback => [
      feedback.email,
      `"${feedback.message.replace(/"/g, '""')}"`,
      formatDate(feedback.created_at)
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `feedbacks_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Feedbacks exported successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Feedback Messages</h1>
              <p className="text-gray-600 mt-1">View and manage all contact form submissions</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={exportToCSV}
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                disabled={filteredFeedbacks.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Stats Section */}
        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-2">
              <Label htmlFor="search" className="mb-1 font-medium text-gray-700">Search Messages</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by email or message content..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-800">Total Messages</p>
                  <p className="text-2xl font-bold text-emerald-900">{feedbacks.length}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {searchTerm && (
          <div className="mb-6">
            <p className="text-gray-600">
              Found {filteredFeedbacks.length} message{filteredFeedbacks.length !== 1 ? 's' : ''} 
              matching "{searchTerm}"
            </p>
          </div>
        )}

        {/* Feedbacks Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                      {getSortIcon('email')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('message')}
                  >
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                      {getSortIcon('message')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Received On
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
                        <div className="h-8 bg-gray-200 rounded w-24 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredFeedbacks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center">
                      <div className="text-gray-400 mb-2">
                        <MessageSquare className="w-12 h-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-600 mb-1">
                        {feedbacks.length === 0 ? 'No messages yet' : 'No messages found'}
                      </h3>
                      <p className="text-gray-500">
                        {feedbacks.length === 0 
                          ? 'Contact form submissions will appear here' 
                          : 'Try adjusting your search term'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  currentFeedbacks.map((feedback) => (
                    <tr key={feedback.id} className="hover:bg-gray-50 group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{feedback.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 line-clamp-2 max-w-md">
                          {feedback.message}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {formatDate(feedback.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2  group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewFeedback(feedback)}
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(feedback)}
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

          {/* Pagination */}
          {!loading && filteredFeedbacks.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredFeedbacks.length)} of {filteredFeedbacks.length} messages
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="border-gray-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={currentPage === pageNum 
                            ? "bg-emerald-600 hover:bg-emerald-700" 
                            : "border-gray-300"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="border-gray-300"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Feedback Sheet */}
      <Sheet open={sheetOpen} onOpenChange={(open) => {
        if (!open) setViewFeedback(null);
        setSheetOpen(open);
      }}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {viewFeedback && (
            <>
              <SheetHeader>
                <SheetTitle>Message Details</SheetTitle>
                <SheetDescription>
                  Full message content from {viewFeedback.email}
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-800">Sender Information</p>
                      <p className="text-lg font-bold text-emerald-900">{viewFeedback.email}</p>
                    </div>
                    <Mail className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Message</Label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{viewFeedback.message}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Received On</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-700">{formatDate(viewFeedback.created_at)}</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => {
                        window.location.href = `mailto:${viewFeedback.email}?subject=Response to your feedback`;
                      }}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Reply via Email
                    </Button>
                  </div>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
                <Button
                  onClick={() => {
                    openDeleteDialog(viewFeedback);
                    setSheetOpen(false);
                  }}
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Message
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
              This action cannot be undone. This will permanently delete the feedback message
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

export default AdminFeedback;