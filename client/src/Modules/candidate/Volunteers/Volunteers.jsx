import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { AuthContext } from '@/context/AuthContext';
import axiosInstance from '@/lib/axios';
import { showToast } from '@/toast/customToast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';

// Constants
const INITIAL_FORM_DATA = {
  name: '',
  email: '',
  phone: '',
  password: '',
  wardId: '',
  streetId: '',
  userId: '',
};

// Custom Hook for Data Fetching
const useVolunteerData = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [wards, setWards] = useState([]);
  const [streets, setStreets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [wardLoading, setWardLoading] = useState(false);
  const [streetLoading, setStreetLoading] = useState(false);

  const fetchVolunteers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/volunteers');
      setVolunteers(response.data || []);
    } catch (error) {
      console.error('Error fetching volunteers:', error.response?.data || error.message);
      showToast('error', error.response?.data?.message || 'Failed to fetch volunteers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchWards = useCallback(async () => {
    setWardLoading(true);
    try {
      const response = await axiosInstance.get('/wards');
      setWards(response.data || []);
    } catch (error) {
      console.error('Error fetching wards:', error.response?.data || error.message);
      showToast('error', error.response?.data?.message || 'Failed to fetch wards');
    } finally {
      setWardLoading(false);
    }
  }, []);

  const fetchStreets = useCallback(async (wardId) => {
    setStreetLoading(true);
    try {
      const response = await axiosInstance.get('/streets', {
        params: wardId ? { ward: wardId } : {},
      });
      setStreets(response.data || []);
    } catch (error) {
      console.error('Error fetching streets:', error.response?.data || error.message);
      showToast('error', error.response?.data?.message || 'Failed to fetch streets');
    } finally {
      setStreetLoading(false);
    }
  }, []);

  return {
    volunteers,
    setVolunteers,
    wards,
    streets,
    setStreets,
    isLoading,
    wardLoading,
    streetLoading,
    fetchVolunteers,
    fetchWards,
    fetchStreets,
  };
};

// Custom Hook for Form Handling
const useVolunteerForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handleWardChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, wardId: value, streetId: '' }));
    setErrors((prev) => ({ ...prev, wardId: '', streetId: '' }));
  }, []);

  const handleStreetChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, streetId: value }));
    setErrors((prev) => ({ ...prev, streetId: '' }));
  }, []);

  const validateForm = useCallback((isEditing) => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be a 10-digit number';
    if (!isEditing && !formData.password) newErrors.password = 'Password is required';
    else if (!isEditing && formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (!formData.wardId) newErrors.wardId = 'Ward is required';
    if (!formData.streetId) newErrors.streetId = 'Street is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
  }, []);

  return {
    formData,
    setFormData,
    errors,
    handleInputChange,
    handleWardChange,
    handleStreetChange,
    validateForm,
    resetForm,
  };
};

const VolunteersAdd = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    volunteers,
    setVolunteers,
    wards,
    streets,
    setStreets,
    isLoading,
    wardLoading,
    streetLoading,
    fetchVolunteers,
    fetchWards,
    fetchStreets,
  } = useVolunteerData();
  const {
    formData,
    setFormData,
    errors,
    handleInputChange,
    handleWardChange,
    handleStreetChange,
    validateForm,
    resetForm,
  } = useVolunteerForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingVolunteerId, setEditingVolunteerId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [volunteerToDelete, setVolunteerToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    if (!user) {
      showToast('error', 'You must be logged in to view this page');
      navigate('/login');
      return;
    }
    fetchVolunteers();
    fetchWards();
  }, [user, navigate, fetchVolunteers, fetchWards]);

  // Handle ward change for streets
  useEffect(() => {
    if (formData.wardId) {
      fetchStreets(formData.wardId);
    } else {
      setStreets([]);
    }
  }, [formData.wardId, fetchStreets, setStreets]);

  // Debounced search
  const debouncedSetSearchTerm = useMemo(
    () => debounce((value) => setSearchTerm(value), 300),
    []
  );

  const handleSearchChange = useCallback((e) => {
    debouncedSetSearchTerm(e.target.value);
  }, [debouncedSetSearchTerm]);

  // Memoized filtered volunteers
  const filteredVolunteers = useMemo(() => {
    return volunteers.filter(
      (volunteer) =>
        volunteer?.user &&
        (volunteer.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (volunteer.user.email && volunteer.user.email.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [volunteers, searchTerm]);

  // Handle form submission
  const handleAddOrUpdateVolunteer = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm(isEditing)) {
      const errorMessages = Object.values(errors).join(', ');
      showToast('error', `Please fix the following errors: ${errorMessages}`);
      return;
    }

    setActionLoading(true);
    try {
      if (isEditing) {
        const response = await axiosInstance.put(`/volunteers/${editingVolunteerId}`, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          wardId: formData.wardId,
          streetId: formData.streetId,
          userId: formData.userId,
        });
        setVolunteers(
          volunteers.map((v) =>
            v._id === editingVolunteerId ? response.data : v
          )
        );
        showToast('success', 'Volunteer updated successfully');
      } else {
        const response = await axiosInstance.post('/volunteers', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          wardId: formData.wardId,
          streetId: formData.streetId,
        });
        setVolunteers([...volunteers, response.data]);
        showToast('success', 'Volunteer created successfully');
      }
      setIsModalOpen(false);
      resetForm();
      setIsEditing(false);
      setEditingVolunteerId(null);
    } catch (error) {
      console.error('Volunteer operation error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      showToast('error', error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} volunteer`);
    } finally {
      setActionLoading(false);
    }
  }, [isEditing, editingVolunteerId, formData, volunteers, errors, validateForm, resetForm]);

  // Handle edit button click
  const handleEditVolunteer = useCallback((volunteer) => {
    setIsEditing(true);
    setEditingVolunteerId(volunteer._id);
    setFormData({
      name: volunteer.user?.name || '',
      email: volunteer.user?.email || '',
      phone: volunteer.user?.phone || '',
      password: '',
      wardId: volunteer.ward?._id || '',
      streetId: volunteer.assignedStreet?._id || '',
      userId: volunteer.user?._id || '',
    });
    setIsModalOpen(true);
  }, [setFormData]);

  // Handle delete button click
  const handleDeleteVolunteer = useCallback(async () => {
    setActionLoading(true);
    try {
      await axiosInstance.delete(`/volunteers/${volunteerToDelete}`);
      setVolunteers(volunteers.filter((v) => v._id !== volunteerToDelete));
      showToast('success', 'Volunteer deleted successfully');
      setIsDeleteModalOpen(false);
      setVolunteerToDelete(null);
    } catch (error) {
      console.error('Error deleting volunteer:', error.response?.data || error.message);
      showToast('error', error.response?.data?.message || 'Failed to delete volunteer');
    } finally {
      setActionLoading(false);
    }
  }, [volunteerToDelete, volunteers]);

  // Open delete confirmation modal
  const openDeleteModal = useCallback((volunteerId) => {
    setVolunteerToDelete(volunteerId);
    setIsDeleteModalOpen(true);
  }, []);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Volunteers</CardTitle>
          <CardDescription>Manage volunteers: add, edit, or delete</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <Input
              placeholder="Search by name or email..."
              onChange={handleSearchChange}
              className="w-1/3"
              disabled={isLoading}
              aria-label="Search volunteers"
            />
            <Button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              disabled={isLoading}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Volunteer
            </Button>
          </div>

          {/* Add/Edit Volunteer Modal */}
          <Dialog
            open={isModalOpen}
            onOpenChange={(open) => {
              setIsModalOpen(open);
              if (!open) {
                resetForm();
                setIsEditing(false);
                setEditingVolunteerId(null);
              }
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Volunteer' : 'Add New Volunteer'}</DialogTitle>
                <DialogDescription>
                  {isEditing ? 'Update the volunteer details.' : 'Enter details to create a new volunteer.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddOrUpdateVolunteer} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    disabled={actionLoading}
                    className={errors.name ? 'border-red-500' : ''}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && <p id="name-error" className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    disabled={actionLoading}
                    className={errors.email ? 'border-red-500' : ''}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && <p id="email-error" className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    disabled={actionLoading}
                    className={errors.phone ? 'border-red-500' : ''}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {errors.phone && <p id="phone-error" className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
                {!isEditing && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      disabled={actionLoading}
                      className={errors.password ? 'border-red-500' : ''}
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? 'password-error' : undefined}
                    />
                    {errors.password && <p id="password-error" className="text-red-500 text-sm">{errors.password}</p>}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="wardId">Ward</Label>
                  <Select
                    onValueChange={handleWardChange}
                    value={formData.wardId}
                    disabled={actionLoading || wardLoading}
                  >
                    <SelectTrigger className={errors.wardId ? 'border-red-500' : ''} aria-invalid={!!errors.wardId}>
                      <SelectValue placeholder={wardLoading ? 'Loading wards...' : 'Select a ward'} />
                    </SelectTrigger>
                    <SelectContent>
                      {wardLoading ? (
                        <SelectItem disabled>Loading...</SelectItem>
                      ) : (
                        wards.map((ward) => (
                          <SelectItem key={ward._id} value={ward._id}>
                            {ward.ward} - {ward.area}, {ward.district}, {ward.state}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.wardId && <p id="wardId-error" className="text-red-500 text-sm">{errors.wardId}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="streetId">Street</Label>
                  <Select
                    onValueChange={handleStreetChange}
                    value={formData.streetId}
                    disabled={actionLoading || streetLoading || !formData.wardId}
                  >
                    <SelectTrigger className={errors.streetId ? 'border-red-500' : ''} aria-invalid={!!errors.streetId}>
                      <SelectValue placeholder={streetLoading ? 'Loading streets...' : formData.wardId ? 'Select a street' : 'Select a ward first'} />
                    </SelectTrigger>
                    <SelectContent>
                      {streetLoading ? (
                        <SelectItem disabled>Loading...</SelectItem>
                      ) : streets.length > 0 ? (
                        streets.map((street) => (
                          <SelectItem key={street._id} value={street._id}>
                            {street.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled>No streets available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.streetId && <p id="streetId-error" className="text-red-500 text-sm">{errors.streetId}</p>}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={actionLoading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={actionLoading}>
                    {actionLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isEditing ? 'Updating...' : 'Adding...'}
                      </>
                    ) : isEditing ? (
                      'Update Volunteer'
                    ) : (
                      'Add Volunteer'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Modal */}
          <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this volunteer? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setVolunteerToDelete(null);
                  }}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteVolunteer} disabled={actionLoading}>
                  {actionLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead>Street</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredVolunteers.length > 0 ? (
                filteredVolunteers.map((volunteer) => (
                  <TableRow key={volunteer._id}>
                    <TableCell>{volunteer.user?.name || '-'}</TableCell>
                    <TableCell>{volunteer.user?.email || '-'}</TableCell>
                    <TableCell>{volunteer.user?.phone || '-'}</TableCell>
                    <TableCell>
                      {volunteer.ward ? `${volunteer.ward.ward}, ${volunteer.ward.area}` : '-'}
                    </TableCell>
                    <TableCell>{volunteer.assignedStreet?.name || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditVolunteer(volunteer)}
                          disabled={actionLoading}
                          aria-label={`Edit ${volunteer.user?.name || 'volunteer'}`}
                        >
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteModal(volunteer._id)}
                          disabled={actionLoading}
                          aria-label={`Delete ${volunteer.user?.name || 'volunteer'}`}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No volunteers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VolunteersAdd;