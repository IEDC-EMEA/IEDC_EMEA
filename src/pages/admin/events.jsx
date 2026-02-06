import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Plus, Trash2, Image as ImageIcon, Edit, X, Eye, EyeOff, Link, CheckCircle, XCircle, Globe, Building, Smartphone } from 'lucide-react';
import { supabase } from '@/lib/createClient';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components2/ui/alert-dialog"
import { Label } from "@/components2/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components2/ui/sheet"
import { Button } from "@/components2/ui/button"
import { Input } from "@/components2/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components2/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components2/ui/select"
import { Badge } from "@/components2/ui/badge"
import ImagePreview from '../../components2/ImagePreview';

function Events() {
    const [events, setEvents] = useState([]);
    const [activeTab, setActiveTab] = useState("view");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [thumbnail_img, setThumbnail_Img] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [eventToAction, setEventToAction] = useState(null);
    const [actionType, setActionType] = useState('');
    const [viewEvent, setViewEvent] = useState(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        venue: '',
        start_at: '',
        end_at: '',
        registration_link: '',
        type: 'online', // online, offline, both
        status: 'draft', // draft, published, cancelled
        image_url: null
    });

    const initialFormData = {
        name: '',
        description: '',
        venue: '',
        start_at: '',
        end_at: '',
        registration_link: '',
        type: 'online',
        status: 'draft',
        image_url: null
    };

    // Event types
    const eventTypes = [
        { value: 'online', label: 'Online', icon: Globe },
        { value: 'offline', label: 'Offline', icon: Building },
        { value: 'both', label: 'Hybrid', icon: Smartphone }
    ];

    const statusOptions = [
        { value: 'draft', label: 'Draft', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'published', label: 'Published', color: 'bg-green-100 text-green-800' },
        { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
    ];

    // Helper function to upload image to Supabase Storage
    const uploadImageToSupabase = async (file) => {
        try {
            // Create a unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `events/${fileName}`;
            
            // Upload to 'portfolio' bucket in 'events' folder
            const { data, error } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
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
            
            // Extract file path from URL
            const urlParts = url.split('/');
            const filePath = urlParts.slice(urlParts.indexOf('events')).join('/');
            
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

    // Fetch events from Supabase
    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setEvents(data || []);
        } catch (error) {
            console.error("Error fetching events: ", error);
            toast.error("Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Set form data when editing an event
    useEffect(() => {
        if (editingEvent) {
            setFormData({
                name: editingEvent.name || '',
                description: editingEvent.description || '',
                venue: editingEvent.venue || '',
                start_at: editingEvent.start_at ? new Date(editingEvent.start_at).toISOString().slice(0, 16) : '',
                end_at: editingEvent.end_at ? new Date(editingEvent.end_at).toISOString().slice(0, 16) : '',
                registration_link: editingEvent.registration_link || '',
                type: editingEvent.type || 'online',
                status: editingEvent.status || 'draft',
                image_url: editingEvent.image_url || null
            });
            setThumbnail_Img(null);
            setActiveTab("add");
        }
    }, [editingEvent]);

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
            setThumbnail_Img(file);

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

    const removeThumbnail = () => {
        setThumbnail_Img(null);
        setFormData({
            ...formData,
            image_url: null
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Upload thumbnail image if new
            let image_url = formData.image_url;
            if (thumbnail_img) {
                image_url = await uploadImageToSupabase(thumbnail_img);
            }

            // Prepare event data
            const eventData = {
                name: formData.name,
                description: formData.description,
                venue: formData.venue,
                start_at: formData.start_at ? new Date(formData.start_at).toISOString() : null,
                end_at: formData.end_at ? new Date(formData.end_at).toISOString() : null,
                registration_link: formData.registration_link,
                type: formData.type,
                status: formData.status,
                image_url: image_url
            };

            if (editingEvent) {
                // Delete old image if it was replaced
                if (thumbnail_img && editingEvent.image_url) {
                    await deleteImageFromSupabase(editingEvent.image_url);
                }

                const { error } = await supabase
                    .from('events')
                    .update({
                        ...eventData,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', editingEvent.id);

                if (error) throw error;

                // Update local state
                setEvents((prev) =>
                    prev.map((ev) =>
                        ev.id === editingEvent.id ? { ...ev, ...eventData } : ev
                    )
                );
                
                toast.success("Event updated successfully!");
            } else {
                const { data, error } = await supabase
                    .from('events')
                    .insert([{
                        ...eventData,
                        created_at: new Date().toISOString()
                    }])
                    .select();

                if (error) throw error;

                if (data && data[0]) {
                    setEvents((prev) => [data[0], ...prev]);
                }
                
                toast.success("Event created successfully!");
            }

            // Reset form
            setFormData({ ...initialFormData });
            setThumbnail_Img(null);
            setEditingEvent(null);
            setActiveTab("view");

        } catch (error) {
            console.error("Error saving event: ", error);
            toast.error(error.message || "Failed to save event");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!eventToAction) return;

        try {
            // Delete image from storage
            if (eventToAction.image_url) {
                await deleteImageFromSupabase(eventToAction.image_url);
            }

            // Delete from database
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', eventToAction.id);

            if (error) throw error;

            // Update local state
            setEvents((prev) => prev.filter((event) => event.id !== eventToAction.id));
            setDeleteDialogOpen(false);
            toast.success("Event deleted successfully!");

        } catch (error) {
            console.error("Error deleting event: ", error);
            toast.error("Failed to delete event");
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
    };

    const handleStatusUpdate = async () => {
        if (!eventToAction) return;

        try {
            const { error } = await supabase
                .from('events')
                .update({
                    status: eventToAction.newValue,
                    updated_at: new Date().toISOString()
                })
                .eq('id', eventToAction.id);

            if (error) throw error;

            // Update local state
            setEvents((prev) =>
                prev.map((event) =>
                    event.id === eventToAction.id
                        ? { ...event, status: eventToAction.newValue }
                        : event
                )
            );

            setStatusDialogOpen(false);
            toast.success("Status updated successfully!");

        } catch (error) {
            console.error("Error updating event status: ", error);
            toast.error("Failed to update status");
        }
    };

    const openStatusDialog = (event, newValue) => {
        setEventToAction({ id: event.id, newValue });
        setStatusDialogOpen(true);
    };

    const openDeleteDialog = (event) => {
        setEventToAction(event);
        setDeleteDialogOpen(true);
    };

    const handleViewEvent = (event) => {
        setViewEvent(event);
        setSheetOpen(true);
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const cancelEdit = () => {
        setEditingEvent(null);
        setFormData({ ...initialFormData });
        setThumbnail_Img(null);
        setActiveTab("view");
    };

    const getTypeIcon = (type) => {
        const typeObj = eventTypes.find(t => t.value === type);
        return typeObj ? typeObj.icon : Globe;
    };

    const getTypeLabel = (type) => {
        const typeObj = eventTypes.find(t => t.value === type);
        return typeObj ? typeObj.label : 'Online';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-8 w-8 text-emerald-600" />
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Events Manager</h1>
                                <p className="text-sm text-gray-500">Create and manage your events</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => {
                                setEditingEvent(null);
                                setActiveTab("add");
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Add Event
                        </Button>
                    </div>

                    {/* Tabs for View Events and Add Event */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 p-2">
                            <TabsTrigger value="view">View Events</TabsTrigger>
                            <TabsTrigger value="add">{editingEvent ? 'Edit Event' : 'Add Event'}</TabsTrigger>
                        </TabsList>

                        {/* View Events Tab */}
                        <TabsContent value="view" className="p-4 md:p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Events ({events.length})
                                </h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Filter:</span>
                                    <select 
                                        className="text-sm border border-gray-300 rounded px-2 py-1"
                                        onChange={(e) => {
                                            // Filter logic can be added here
                                        }}
                                    >
                                        <option value="all">All Events</option>
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            {events.length === 0 ? (
                                loading ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 text-lg">Loading events...</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg">No events created yet</p>
                                        <p className="text-gray-400">Click "Add Event" to create your first event</p>
                                    </div>
                                )) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full table-auto">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Event
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date & Time
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {events.map((event) => {
                                                const TypeIcon = getTypeIcon(event.type);
                                                return (
                                                    <tr key={event.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center">
                                                                {event.image_url && (
                                                                    <ImagePreview
                                                                        src={event.image_url}
                                                                        alt={event.name}
                                                                        size="h-12 w-12 object-cover rounded mr-3"
                                                                    />
                                                                )}
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">{event.name}</div>
                                                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                                                        {event.description?.substring(0, 60)}...
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1">
                                                                <TypeIcon className="h-3 w-3" />
                                                                {getTypeLabel(event.type)}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="text-sm text-gray-900">
                                                                <div className="flex items-center">
                                                                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                                                    {formatDateTime(event.start_at)}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center">
                                                                <Badge
                                                                    variant="outline"
                                                                    className={statusOptions.find(s => s.value === event.status)?.color}
                                                                >
                                                                    {event.status === 'published' && <Eye className="h-3 w-3 mr-1" />}
                                                                    {event.status === 'draft' && <EyeOff className="h-3 w-3 mr-1" />}
                                                                    {event.status === 'cancelled' && <XCircle className="h-3 w-3 mr-1" />}
                                                                    {statusOptions.find(s => s.value === event.status)?.label || event.status}
                                                                </Badge>
                                                                {event.status !== 'cancelled' && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => openStatusDialog(
                                                                            event,
                                                                            event.status === 'published' ? 'draft' : 'published'
                                                                        )}
                                                                        className="ml-2 text-gray-400 hover:text-gray-600"
                                                                    >
                                                                        {event.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleViewEvent(event)}
                                                                    className="text-emerald-600 hover:text-emerald-900 flex items-center gap-1"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                    View
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleEdit(event)}
                                                                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openDeleteDialog(event)}
                                                                    className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </TabsContent>

                        {/* Add/Edit Event Tab */}
                        <TabsContent value="add" className="p-4 md:p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                {editingEvent ? 'Edit Event' : 'Create New Event'}
                            </h2>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name" className="mb-1">
                                            Event Name *
                                        </Label>
                                        <Input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter event name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="type" className="mb-1">
                                            Event Type *
                                        </Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Event Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {eventTypes.map((type) => {
                                                    const Icon = type.icon;
                                                    return (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            <div className="flex items-center gap-2">
                                                                <Icon className="h-4 w-4" />
                                                                {type.label}
                                                            </div>
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="start_at" className="mb-1">
                                            Start Date & Time *
                                        </Label>
                                        <Input
                                            type="datetime-local"
                                            name="start_at"
                                            value={formData.start_at}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="end_at" className="mb-1">
                                            End Date & Time *
                                        </Label>
                                        <Input
                                            type="datetime-local"
                                            name="end_at"
                                            value={formData.end_at}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="venue" className="mb-1">
                                            Venue *
                                        </Label>
                                        <Input
                                            type="text"
                                            name="venue"
                                            value={formData.venue}
                                            onChange={handleInputChange}
                                            placeholder="Enter venue or online platform"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="registration_link" className="mb-1">
                                            Registration Link
                                        </Label>
                                        <Input
                                            type="url"
                                            name="registration_link"
                                            value={formData.registration_link}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com/register"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="status" className="mb-1">
                                            Status
                                        </Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description" className="mb-1">
                                        Description *
                                    </Label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="Describe your event..."
                                        rows="4"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label className="mb-1">
                                        Event Poster (Max 2MB)
                                    </Label>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="image-upload"
                                            accept="image/*"
                                        />
                                        <Label
                                            htmlFor="image-upload"
                                            className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                                        >
                                            <ImageIcon className="h-4 w-4" />
                                            Upload Poster
                                        </Label>
                                        <span className="text-sm text-gray-500">
                                            {thumbnail_img ? thumbnail_img.name : 'No file selected'}
                                        </span>
                                    </div>
                                    {formData.image_url && (
                                        <div className="relative inline-block mt-2">
                                            <ImagePreview
                                                src={formData.image_url}
                                                alt="Event poster preview"
                                                size="h-32 w-48 object-cover rounded"
                                            />
                                            <Button
                                                type="button"
                                                onClick={removeThumbnail}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 h-6 w-6 hover:bg-red-600"
                                                size="icon"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2"
                                    >
                                        {isSubmitting
                                            ? (editingEvent ? 'Updating...' : 'Creating...')
                                            : (editingEvent ? 'Update Event' : 'Create Event')
                                        }
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={cancelEdit}
                                        variant="outline"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* View Event Sheet */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
                    {viewEvent && (
                        <>
                            <SheetHeader>
                                <SheetTitle>{viewEvent.name}</SheetTitle>
                                <SheetDescription>
                                    Event details and information
                                </SheetDescription>
                            </SheetHeader>
                            <div className="grid gap-4 py-4">
                                {viewEvent.image_url && (
                                    <ImagePreview
                                        src={viewEvent.image_url}
                                        alt={viewEvent.name}
                                        size="w-full h-48 object-cover rounded-md"
                                    />
                                )}
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Type</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            {(() => {
                                                const TypeIcon = getTypeIcon(viewEvent.type);
                                                return <TypeIcon className="h-4 w-4 text-emerald-600" />;
                                            })()}
                                            <p className="font-medium">{getTypeLabel(viewEvent.type)}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Status</Label>
                                        <div className="mt-1">
                                            <Badge
                                                variant="outline"
                                                className={statusOptions.find(s => s.value === viewEvent.status)?.color}
                                            >
                                                {statusOptions.find(s => s.value === viewEvent.status)?.label}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Start Time</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <p>{formatDateTime(viewEvent.start_at)}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">End Time</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            <p>{formatDateTime(viewEvent.end_at)}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Venue</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <p>{viewEvent.venue}</p>
                                    </div>
                                </div>
                                
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Description</Label>
                                    <p className="mt-1 text-gray-700 whitespace-pre-wrap">{viewEvent.description}</p>
                                </div>
                                
                                {viewEvent.registration_link && (
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Registration Link</Label>
                                        <a 
                                            href={viewEvent.registration_link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="mt-1 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-800 hover:underline"
                                        >
                                            <Link className="h-4 w-4" />
                                            {viewEvent.registration_link}
                                        </a>
                                    </div>
                                )}
                            </div>
                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button>Close</Button>
                                </SheetClose>
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
                            This action cannot be undone. This will permanently delete the event
                            and remove it from our servers.
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

            {/* Status Update Dialog */}
            <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Update Event Status</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to change the status of this event?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleStatusUpdate}>
                            Update Status
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default Events;