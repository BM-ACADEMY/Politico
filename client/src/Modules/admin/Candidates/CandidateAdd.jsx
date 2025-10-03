import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { showToast } from "@/toast/customToast";

const CandidateAdd = () => {
  const [candidates, setCandidates] = useState([]);
  const [wards, setWards] = useState([]);``
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCandidateId, setEditingCandidateId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // New state for delete modal
  const [candidateToDelete, setCandidateToDelete] = useState(null); // Store candidate ID to delete
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    profileImageFile: null,
    profileImagePreview: "",
    wardId: "",
    password: "",
    userId: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCandidates();
    fetchWards();
    return () => {
      if (formData.profileImagePreview) {
        URL.revokeObjectURL(formData.profileImagePreview);
      }
    };
  }, []);

  const fetchCandidates = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/candidate-managers");
      setCandidates(response.data || []);
    } catch (error) {
      console.error("Error fetching candidates:", error.response?.data || error.message);
      showToast("error", error.response?.data?.message || "Failed to fetch candidates");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWards = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/wards");
      setWards(response.data || []);
    } catch (error) {
      console.error("Error fetching wards:", error.response?.data || error.message);
      showToast("error", error.response?.data?.message || "Failed to fetch wards");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      showToast("error", "Please select an image file");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!allowedTypes.includes(file.type)) {
      showToast("error", "Only JPEG, PNG, GIF, or WebP images are allowed");
      return;
    }
    if (file.size > maxSize) {
      showToast("error", "Image size must be less than 5MB");
      return;
    }

    if (formData.profileImagePreview) {
      URL.revokeObjectURL(formData.profileImagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      profileImageFile: file,
      profileImagePreview: previewUrl,
    }));
  };

  const resetForm = () => {
    if (formData.profileImagePreview) {
      URL.revokeObjectURL(formData.profileImagePreview);
    }
    setFormData({
      name: "",
      phone: "",
      email: "",
      profileImageFile: null,
      profileImagePreview: "",
      wardId: "",
      password: "",
      userId: "",
    });
    setIsEditing(false);
    setEditingCandidateId(null);
  };

  const handleAddOrUpdateCandidate = async () => {
    try {
      if (!formData.name || !formData.phone || (!isEditing && !formData.password)) {
        throw new Error("Name, phone, and password (for new candidates) are required");
      }

      setIsLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("email", formData.email);
      if (!isEditing) {
        formDataToSend.append("password", formData.password);
      }
      formDataToSend.append("wardId", formData.wardId);
      if (formData.profileImageFile) {
        formDataToSend.append("profileImage", formData.profileImageFile);
      }
      if (isEditing) {
        formDataToSend.append("userId", formData.userId);
      }

      if (isEditing) {
        const response = await axiosInstance.put(`/candidate-managers/${editingCandidateId}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setCandidates(candidates.map((c) => (c._id === editingCandidateId ? response.data.candidateManager : c)));
        showToast("success", "Candidate Manager updated successfully");
      } else {
        const response = await axiosInstance.post("/candidate-managers", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setCandidates([...candidates, response.data.candidateManager]);
        showToast("success", "Candidate Manager created successfully");
      }

      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Candidate operation error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      showToast("error", error.response?.data?.message || `Failed to ${isEditing ? "update" : "create"} candidate`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCandidate = (candidate) => {
    setIsEditing(true);
    setEditingCandidateId(candidate._id);
    setFormData({
      name: candidate.user?.name || "",
      phone: candidate.user?.phone || "",
      email: candidate.user?.email || "",
      profileImageFile: null,
      profileImagePreview: candidate.user?.profileImage || "",
      wardId: candidate.user?.ward?._id || "",
      password: "", // Password not pre-filled for security
      userId: candidate.user?._id || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteCandidate = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(`/candidate-managers/${candidateToDelete}`);
      setCandidates(candidates.filter((c) => c._id !== candidateToDelete));
      showToast("success", "Candidate Manager deleted successfully");
      setIsDeleteModalOpen(false); // Close the modal
      setCandidateToDelete(null); // Reset the candidate to delete
    } catch (error) {
      console.error("Error deleting candidate:", error.response?.data || error.message);
      showToast("error", error.response?.data?.message || "Failed to delete candidate");
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (candidateId) => {
    setCandidateToDelete(candidateId);
    setIsDeleteModalOpen(true);
  };

  const filteredCandidates = (candidates || []).filter(
    (candidate) =>
      candidate?.user &&
      (candidate.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (candidate.user.email && candidate.user.email.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 w-1/3">
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[40%]"
            disabled={isLoading}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            disabled={isLoading}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Add/Edit Candidate Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Candidate Manager" : "Add New Candidate Manager"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Input
              name="email"
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Input
              name="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isLoading}
            />
            {formData.profileImagePreview && (
              <img
                src={formData.profileImagePreview}
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded-md"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
            )}
            <Select
              name="wardId"
              value={formData.wardId}
              onValueChange={(value) => setFormData({ ...formData, wardId: value })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Ward" />
              </SelectTrigger>
              <SelectContent>
                {wards.map((ward) => (
                  <SelectItem key={ward._id} value={ward._id}>
                    {ward.ward} - {ward.area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isEditing && (
              <Input
                name="password"
                placeholder="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleAddOrUpdateCandidate} disabled={isLoading}>
              {isLoading ? (isEditing ? "Updating..." : "Adding...") : (isEditing ? "Update Candidate" : "Add Candidate")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this candidate? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setCandidateToDelete(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCandidate}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Profile Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Ward</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6}>Loading...</TableCell>
            </TableRow>
          ) : filteredCandidates.length > 0 ? (
            filteredCandidates.map((candidate) => (
              <TableRow key={candidate._id}>
                <TableCell>
                  {candidate.user?.profileImage ? (
                    <img
                      src={candidate.user.profileImage}
                      alt="Profile"
                      className="w-12 h-12 object-cover rounded-full"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{candidate.user?.name || "-"}</TableCell>
                <TableCell>{candidate.user?.email || "-"}</TableCell>
                <TableCell>{candidate.user?.phone || "-"}</TableCell>
                <TableCell>
                  {candidate.user?.ward ? `${candidate.user.ward.ward} - ${candidate.user.ward.area}` : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCandidate(candidate)}
                      disabled={isLoading}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteModal(candidate._id)} // Open delete modal
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>No candidates found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CandidateAdd;