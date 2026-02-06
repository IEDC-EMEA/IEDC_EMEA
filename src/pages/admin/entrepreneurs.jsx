import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Plus, Trash2, Edit, X, ImageIcon, User, Eye, Calendar
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components2/ui/sheet";

function Entrepreneurs() {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entrepreneurToDelete, setEntrepreneurToDelete] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewEntrepreneur, setViewEntrepreneur] = useState(null);
  const [editingEntrepreneur, setEditingEntrepreneur] = useState(null);
  const [profile_img, setProfile_Img] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    image_url: null,
  });

  const initialFormData = {
    name: '',
    designation: '',
    image_url: null,
  };

  // Helper function to upload image to Supabase Storage
  const uploadImageToSupabase = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `entrepreneurs/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  // Helper function to delete image from Supabase Storage
  const deleteImageFromSupabase = async (url) => {
    try {
      if (!url) return;
      
      const urlParts = url.split('/');
      const filePath = urlParts.slice(urlParts.indexOf('entrepreneurs')).join('/');
      
      const { error } = await supabase.storage
        .from('portfolio')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting image:', error);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  // Fetch entrepreneurs from Supabase
  const fetchEntrepreneurs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('entrepreneurs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setEntrepreneurs(data || []);
    } catch (error) {
      console.error("Error fetching entrepreneurs: ", error);
      toast.error("Failed to load entrepreneurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntrepreneurs();
  }, []);

  // Set form data when editing
  useEffect(() => {
    if (editingEntrepreneur) {
      setFormData({
        name: editingEntrepreneur.name || '',
        designation: editingEntrepreneur.designation || '',
        image_url: editingEntrepreneur.image_url || null,
      });
      setProfile_Img(null);
      setSheetOpen(true);
    }
  }, [editingEntrepreneur]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      setProfile_Img(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          image_url: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfile_Img(null);
    setFormData({
      ...formData,
      image_url: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload profile image if new
      let image_url = formData.image_url;
      if (profile_img) {
        image_url = await uploadImageToSupabase(profile_img);
      }

      // Prepare entrepreneur data
      const entrepreneurData = {
        name: formData.name,
        designation: formData.designation,
        image_url: image_url
      };

      if (editingEntrepreneur) {
        // Delete old image if it was replaced
        if (profile_img && editingEntrepreneur.image_url) {
          await deleteImageFromSupabase(editingEntrepreneur.image_url);
        }

        const { error } = await supabase
          .from('entrepreneurs')
          .update(entrepreneurData)
          .eq('id', editingEntrepreneur.id);

        if (error) throw error;

        // Update local state
        setEntrepreneurs((prev) =>
          prev.map((entrepreneur) =>
            entrepreneur.id === editingEntrepreneur.id ? { ...entrepreneur, ...entrepreneurData } : entrepreneur
          )
        );
        
        toast.success("Entrepreneur updated successfully!");
      } else {
        const { data, error } = await supabase
          .from('entrepreneurs')
          .insert([entrepreneurData])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          setEntrepreneurs((prev) => [data[0], ...prev]);
        }
        
        toast.success("Entrepreneur added successfully!");
      }

      // Reset form
      resetForm();
      setSheetOpen(false);

    } catch (error) {
      console.error("Error saving entrepreneur: ", error);
      toast.error(error.message || "Failed to save entrepreneur");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!entrepreneurToDelete) return;

    try {
      // Delete image from storage
      if (entrepreneurToDelete.image_url) {
        await deleteImageFromSupabase(entrepreneurToDelete.image_url);
      }

      // Delete from database
      const { error } = await supabase
        .from('entrepreneurs')
        .delete()
        .eq('id', entrepreneurToDelete.id);

      if (error) throw error;

      // Update local state
      setEntrepreneurs((prev) => prev.filter((entrepreneur) => entrepreneur.id !== entrepreneurToDelete.id));
      setDeleteDialogOpen(false);
      toast.success("Entrepreneur deleted successfully!");

    } catch (error) {
      console.error("Error deleting entrepreneur: ", error);
      toast.error("Failed to delete entrepreneur");
    }
  };

  const openDeleteDialog = (entrepreneur) => {
    setEntrepreneurToDelete(entrepreneur);
    setDeleteDialogOpen(true);
  };

  const handleViewEntrepreneur = (entrepreneur) => {
    setViewEntrepreneur(entrepreneur);
    setSheetOpen(true);
  };

  // Filter entrepreneurs based on search term
  const filteredEntrepreneurs = useMemo(() => {
    return entrepreneurs.filter(entrepreneur => {
      const searchLower = searchTerm.toLowerCase();
      return (
        entrepreneur.name?.toLowerCase().includes(searchLower) ||
        entrepreneur.designation?.toLowerCase().includes(searchLower)
      );
    });
  }, [entrepreneurs, searchTerm]);

  const resetForm = () => {
    setFormData({ ...initialFormData });
    setProfile_Img(null);
    setEditingEntrepreneur(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Entrepreneurs Directory</h1>
              <p className="text-gray-600 mt-1">Manage and showcase entrepreneurs</p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setSheetOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Entrepreneur
            </Button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 mb-8">
          <div>
            <Label htmlFor="search" className="mb-1 font-medium text-gray-700">Search Entrepreneurs</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="search"
                type="text"
                placeholder="Search by name or designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Entrepreneurs</h3>
            <p className="text-3xl font-bold text-emerald-700">{entrepreneurs.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h3 className="text-sm font-medium text-gray-500 mb-2">With Profile Images</h3>
            <p className="text-3xl font-bold text-blue-600">
              {entrepreneurs.filter(e => e.image_url).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Filtered Results</h3>
            <p className="text-3xl font-bold text-orange-600">{filteredEntrepreneurs.length}</p>
          </div>
        </div>

        {/* Results Count */}
        {searchTerm && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredEntrepreneurs.length} of {entrepreneurs.length} entrepreneurs
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        )}

        {/* Entrepreneurs Table - Using HTML Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added On
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
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-8 bg-gray-200 rounded w-24 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredEntrepreneurs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <div className="text-gray-400 mb-2">
                        <User className="w-12 h-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-600 mb-1">
                        {entrepreneurs.length === 0 ? 'No entrepreneurs yet' : 'No entrepreneurs found'}
                      </h3>
                      <p className="text-gray-500">
                        {entrepreneurs.length === 0 
                          ? 'Click "Add Entrepreneur" to get started' 
                          : 'Try adjusting your search term'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredEntrepreneurs.map((entrepreneur) => (
                    <tr key={entrepreneur.id} className="hover:bg-gray-50 group">
                      <td className="px-6 py-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-100">
                          {entrepreneur.image_url ? (
                            <img
                              src={entrepreneur.image_url}
                              alt={entrepreneur.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-5 h-5 text-emerald-600" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{entrepreneur.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{entrepreneur.designation || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(entrepreneur.created_at)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewEntrepreneur(entrepreneur)}
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingEntrepreneur(entrepreneur);
                            }}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(entrepreneur)}
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

      {/* Add/Edit Entrepreneur Sheet */}
      <Sheet open={sheetOpen && !viewEntrepreneur} onOpenChange={(open) => {
        setSheetOpen(open);
        if (!open) {
          resetForm();
        }
      }}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingEntrepreneur ? 'Edit Entrepreneur' : 'Add Entrepreneur'}</SheetTitle>
            <SheetDescription>
              {editingEntrepreneur ? 'Update entrepreneur information' : 'Add a new entrepreneur'}
            </SheetDescription>
          </SheetHeader>
          
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="designation">Designation *</Label>
                <Input
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  placeholder="CEO, Founder, etc."
                  required
                />
              </div>

              <div>
                <Label>Profile Image (Max 2MB)</Label>
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="profile-upload"
                    accept="image/*"
                  />
                  <Label
                    htmlFor="profile-upload"
                    className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <ImageIcon className="h-4 w-4" />
                    {formData.image_url ? 'Change Image' : 'Upload Image'}
                  </Label>
                  <span className="text-sm text-gray-500">
                    {profile_img ? profile_img.name : formData.image_url ? 'Image selected' : 'No file selected'}
                  </span>
                </div>
                {formData.image_url && (
                  <div className="relative inline-block mt-2">
                    <img
                      src={formData.image_url}
                      alt="Profile preview"
                      className="h-32 w-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      onClick={removeProfileImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 h-6 w-6 hover:bg-red-600"
                      size="icon"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <SheetFooter className="mt-4">
              <SheetClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </SheetClose>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting ? 'Saving...' : (editingEntrepreneur ? 'Update' : 'Add Entrepreneur')}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* View Entrepreneur Sheet */}
      <Sheet open={viewEntrepreneur && sheetOpen} onOpenChange={(open) => {
        if (!open) setViewEntrepreneur(null);
        setSheetOpen(open);
      }}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          {viewEntrepreneur && (
            <>
              <SheetHeader>
                <SheetTitle>{viewEntrepreneur.name}</SheetTitle>
                <SheetDescription>
                  Entrepreneur details
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden mb-4">
                    {viewEntrepreneur.image_url ? (
                      <img
                        src={viewEntrepreneur.image_url}
                        alt={viewEntrepreneur.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-emerald-600" />
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{viewEntrepreneur.name}</h3>
                    <p className="text-gray-600">{viewEntrepreneur.designation}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Name</Label>
                      <p className="mt-1 font-medium">{viewEntrepreneur.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Designation</Label>
                      <p className="mt-1 font-medium">{viewEntrepreneur.designation || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Label className="text-sm font-medium text-gray-500">Added On</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p>{formatDate(viewEntrepreneur.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
                <Button
                  onClick={() => {
                    setEditingEntrepreneur(viewEntrepreneur);
                    setViewEntrepreneur(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
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
              This action cannot be undone. This will permanently delete the entrepreneur
              profile and remove it from your directory.
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

export default Entrepreneurs;