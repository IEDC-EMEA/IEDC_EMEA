import React, { useState, useEffect, useMemo } from 'react';
import { 
  ExternalLink, User, MapPin, Mail, Phone, Linkedin, Github, Instagram, 
  Search, Filter, Plus, Trash2, Edit, X, ImageIcon, Globe
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components2/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components2/ui/sheet";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewTeam, setViewTeam] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [profile_img, setProfile_Img] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    designation: '',
    image_url: null,
    instagram_url: '',
    linkedin_url: '',
    email: '',
    phone: '',
    place: ''
  });

  const initialFormData = {
    name: '',
    role: '',
    designation: '',
    image_url: null,
    instagram_url: '',
    linkedin_url: '',
    email: '',
    phone: '',
    place: ''
  };

  // Role options (you can customize these)
  const roleOptions = [
    'All',
    'Developer',
    'Designer',
    'Marketing',
    'Management',
    'Content',
    'Operations',
    'Founder',
    'Intern',
    'Other'
  ];

  // Helper function to upload image to Supabase Storage
  const uploadImageToSupabase = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `teams/${fileName}`;
      
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
      const filePath = urlParts.slice(urlParts.indexOf('teams')).join('/');
      
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

  // Fetch teams from Supabase
  const fetchTeams = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTeams(data || []);
    } catch (error) {
      console.error("Error fetching teams: ", error);
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Set form data when editing
  useEffect(() => {
    if (editingTeam) {
      setFormData({
        name: editingTeam.name || '',
        role: editingTeam.role || '',
        designation: editingTeam.designation || '',
        image_url: editingTeam.image_url || null,
        instagram_url: editingTeam.instagram_url || '',
        linkedin_url: editingTeam.linkedin_url || '',
        email: editingTeam.email || '',
        phone: editingTeam.phone || '',
        place: editingTeam.place || ''
      });
      setProfile_Img(null);
      setSheetOpen(true);
    }
  }, [editingTeam]);

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

      // Prepare team data
      const teamData = {
        name: formData.name,
        role: formData.role,
        designation: formData.designation,
        image_url: image_url,
        instagram_url: formData.instagram_url,
        linkedin_url: formData.linkedin_url,
        email: formData.email,
        phone: formData.phone,
        place: formData.place
      };

      if (editingTeam) {
        // Delete old image if it was replaced
        if (profile_img && editingTeam.image_url) {
          await deleteImageFromSupabase(editingTeam.image_url);
        }

        const { error } = await supabase
          .from('teams')
          .update({
            ...teamData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingTeam.id);

        if (error) throw error;

        // Update local state
        setTeams((prev) =>
          prev.map((team) =>
            team.id === editingTeam.id ? { ...team, ...teamData } : team
          )
        );
        
        toast.success("Team member updated successfully!");
      } else {
        const { data, error } = await supabase
          .from('teams')
          .insert([{
            ...teamData,
            created_at: new Date().toISOString()
          }])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          setTeams((prev) => [data[0], ...prev]);
        }
        
        toast.success("Team member added successfully!");
      }

      // Reset form
      setFormData({ ...initialFormData });
      setProfile_Img(null);
      setEditingTeam(null);
      setSheetOpen(false);

    } catch (error) {
      console.error("Error saving team member: ", error);
      toast.error(error.message || "Failed to save team member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!teamToDelete) return;

    try {
      // Delete image from storage
      if (teamToDelete.image_url) {
        await deleteImageFromSupabase(teamToDelete.image_url);
      }

      // Delete from database
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamToDelete.id);

      if (error) throw error;

      // Update local state
      setTeams((prev) => prev.filter((team) => team.id !== teamToDelete.id));
      setDeleteDialogOpen(false);
      toast.success("Team member deleted successfully!");

    } catch (error) {
      console.error("Error deleting team member: ", error);
      toast.error("Failed to delete team member");
    }
  };

  const openDeleteDialog = (team) => {
    setTeamToDelete(team);
    setDeleteDialogOpen(true);
  };

  const handleViewTeam = (team) => {
    setViewTeam(team);
    setSheetOpen(true);
  };

  // Filter teams based on search term and filters
  const filteredTeams = useMemo(() => {
    return teams.filter(team => {
      const matchesSearch =
        team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.place?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === 'All' || team.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [teams, searchTerm, roleFilter]);

  // Get unique roles for filter dropdown (excluding 'All')
  const availableRoles = useMemo(() => {
    const roles = new Set(teams.map(team => team.role).filter(Boolean));
    return ['All', ...Array.from(roles)];
  }, [teams]);

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'developer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'designer':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'marketing':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'founder':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'intern':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDepartmentCount = () => {
    const departments = new Set(teams.map(team => team.role));
    return departments.size;
  };

  const resetForm = () => {
    setFormData({ ...initialFormData });
    setProfile_Img(null);
    setEditingTeam(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Team Members</h1>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  resetForm();
                  setSheetOpen(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Team Member
              </Button>
              <a
                href="https://scoringapp-three.vercel.app//"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View in Score app
              </a>
            </div>
          </div>
          <p className="text-gray-600">Manage your team members and their information</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div>
              <Label htmlFor="search" className="mb-1 font-medium text-gray-700">Search Team Members</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by name, role, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <Label htmlFor="roleFilter" className="mb-1 font-medium text-gray-700">Filter by Role</Label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Members</h3>
            <p className="text-3xl font-bold text-gray-900">{teams.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Members</h3>
            <p className="text-3xl font-bold text-emerald-700">{teams.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Departments</h3>
            <p className="text-3xl font-bold text-blue-600">{getDepartmentCount()}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Filtered Results</h3>
            <p className="text-3xl font-bold text-orange-600">{filteredTeams.length}</p>
          </div>
        </div>

        {/* Results Count */}
        {searchTerm || roleFilter !== 'All' ? (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredTeams.length} of {teams.length} team members
              {searchTerm && ` matching "${searchTerm}"`}
              {roleFilter !== 'All' && ` in role "${roleFilter}"`}
            </p>
          </div>
        ) : null}

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))
          ) : filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <div key={team.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow duration-200">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden">
                      {team.image_url ? (
                        <img
                          src={team.image_url}
                          alt={team.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <User className="w-6 h-6 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{team.name}</h3>
                      <p className="text-sm text-gray-500">{team.designation}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(team.role)}`}>
                    {team.role}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  {team.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{team.email}</span>
                    </div>
                  )}
                  {team.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{team.phone}</span>
                    </div>
                  )}
                  {team.place && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{team.place}</span>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Social Profiles</p>
                  <div className="flex gap-3">
                    {team.linkedin_url && (
                      <a
                        href={team.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {team.instagram_url && (
                      <a
                        href={team.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-800 transition-colors"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewTeam(team)}
                    className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <User className="w-4 h-4" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingTeam(team);
                    }}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteDialog(team)}
                    className="text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No team members found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Team Member Sheet */}
      <Sheet open={sheetOpen} onOpenChange={(open) => {
        setSheetOpen(open);
        if (!open) {
          resetForm();
        }
      }}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingTeam ? 'Edit Team Member' : 'Add Team Member'}</SheetTitle>
            <SheetDescription>
              {editingTeam ? 'Update team member information' : 'Add a new team member to your team'}
            </SheetDescription>
          </SheetHeader>
          
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="role">Role *</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => setFormData({...formData, role: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.filter(role => role !== 'All').map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="designation">Designation *</Label>
                <Input
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  placeholder="Senior Developer"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <Label htmlFor="place">Location</Label>
                <Input
                  id="place"
                  name="place"
                  value={formData.place}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                />
              </div>
              <div>
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <Label htmlFor="instagram_url">Instagram URL</Label>
                <Input
                  id="instagram_url"
                  name="instagram_url"
                  value={formData.instagram_url}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/username"
                />
              </div>
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
                  Upload Image
                </Label>
                <span className="text-sm text-gray-500">
                  {profile_img ? profile_img.name : formData.image_url ? 'Current image' : 'No file selected'}
                </span>
              </div>
              {formData.image_url && (
                <div className="relative inline-block mt-2">
                  <img
                    src={formData.image_url}
                    alt="Profile preview"
                    className="h-32 w-32 object-cover rounded"
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

            <SheetFooter className="mt-4">
              <SheetClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </SheetClose>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting ? 'Saving...' : (editingTeam ? 'Update' : 'Add Team Member')}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* View Team Member Sheet */}
      <Sheet open={viewTeam && sheetOpen} onOpenChange={(open) => {
        if (!open) setViewTeam(null);
        setSheetOpen(open);
      }}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {viewTeam && (
            <>
              <SheetHeader>
                <SheetTitle>{viewTeam.name}</SheetTitle>
                <SheetDescription>
                  Team member details
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden mb-4">
                    {viewTeam.image_url ? (
                      <img
                        src={viewTeam.image_url}
                        alt={viewTeam.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-emerald-600" />
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{viewTeam.name}</h3>
                    <p className="text-gray-600">{viewTeam.designation}</p>
                    <span className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(viewTeam.role)}`}>
                      {viewTeam.role}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Contact Information</Label>
                    <div className="mt-2 space-y-2">
                      {viewTeam.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <a href={`mailto:${viewTeam.email}`} className="text-emerald-600 hover:underline">
                            {viewTeam.email}
                          </a>
                        </div>
                      )}
                      {viewTeam.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <a href={`tel:${viewTeam.phone}`} className="text-emerald-600 hover:underline">
                            {viewTeam.phone}
                          </a>
                        </div>
                      )}
                      {viewTeam.place && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{viewTeam.place}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {(viewTeam.linkedin_url || viewTeam.instagram_url) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Social Profiles</Label>
                      <div className="flex gap-3 mt-2">
                        {viewTeam.linkedin_url && (
                          <a
                            href={viewTeam.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded transition-colors"
                          >
                            <Linkedin className="w-4 h-4" />
                            LinkedIn
                          </a>
                        )}
                        {viewTeam.instagram_url && (
                          <a
                            href={viewTeam.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-pink-50 hover:bg-pink-100 text-pink-600 px-3 py-2 rounded transition-colors"
                          >
                            <Instagram className="w-4 h-4" />
                            Instagram
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Label className="text-sm font-medium text-gray-500">Member Since</Label>
                    <p className="mt-1">
                      {viewTeam.created_at ? new Date(viewTeam.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
                <Button
                  onClick={() => {
                    setEditingTeam(viewTeam);
                    setViewTeam(null);
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
              This action cannot be undone. This will permanently delete the team member
              and remove their profile from the system.
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

export default Teams;