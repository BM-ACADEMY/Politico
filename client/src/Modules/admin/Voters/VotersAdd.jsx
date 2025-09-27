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
import { PlusCircle, Edit, Trash2, Download } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { showToast } from "@/toast/customToast";
import * as XLSX from "xlsx";

const VotersAdd = () => {
  const [voters, setVoters] = useState([]);
  const [wards, setWards] = useState([]);
  const [streets, setStreets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWard, setSelectedWard] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingVoterId, setEditingVoterId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [voterToDelete, setVoterToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    voter_card_id: "",
    street_id: "",
    ward_id: "",
    age: "",
    gender: "",
    religion: "",
    community: "",
    phone: "",
    notes: "",
    profileImageFile: null,
    profileImagePreview: "",
  });

  useEffect(() => {
    fetchVoters();
    fetchWards();
    fetchStreets();
    return () => {
      if (formData.profileImagePreview) {
        URL.revokeObjectURL(formData.profileImagePreview);
      }
    };
  }, []);

  const fetchVoters = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/voters");
      console.log("Voters response:", response.data);
      setVoters(response.data.data || []);
    } catch (error) {
      console.error("Error fetching voters:", error.response?.data || error.message);
      showToast("error", error.response?.data?.message || "Failed to fetch voters");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWards = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/wards");
      console.log("Wards response:", response.data);
      setWards(response.data || []);
    } catch (error) {
      console.error("Error fetching wards:", error.response?.data || error.message);
      showToast("error", error.response?.data?.message || "Failed to fetch wards");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStreets = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/streets");
      console.log("Streets response:", response.data);
      setStreets(response.data || []);
    } catch (error) {
      console.error("Error fetching streets:", error.response?.data || error.message);
      showToast("error", error.response?.data?.message || "Failed to fetch streets");
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
      voter_card_id: "",
      street_id: "",
      ward_id: "",
      age: "",
      gender: "",
      religion: "",
      community: "",
      phone: "",
      notes: "",
      profileImageFile: null,
      profileImagePreview: "",
    });
    setIsEditing(false);
    setEditingVoterId(null);
  };

  const handleAddOrUpdateVoter = async () => {
    try {
      if (!formData.name || !formData.voter_card_id || !formData.street_id || !formData.ward_id || !formData.age || !formData.gender) {
        throw new Error("Name, voter card ID, street, ward, age, and gender are required");
      }

      setIsLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("voter_card_id", formData.voter_card_id);
      formDataToSend.append("street_id", formData.street_id);
      formDataToSend.append("ward_id", formData.ward_id);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("religion", formData.religion || "");
      formDataToSend.append("community", formData.community || "");
      formDataToSend.append("phone", formData.phone || "");
      formDataToSend.append("notes", formData.notes || "");
      if (formData.profileImageFile) {
        formDataToSend.append("profileImage", formData.profileImageFile);
      }

      if (isEditing) {
        const response = await axiosInstance.put(`/voters/${editingVoterId}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Update voter response:", response.data);
        await fetchVoters();
        showToast("success", "Voter updated successfully");
      } else {
        const response = await axiosInstance.post("/voters", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Create voter response:", response.data);
        await fetchVoters();
        showToast("success", "Voter created successfully");
      }

      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Voter operation error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      showToast("error", error.response?.data?.message || `Failed to ${isEditing ? "update" : "create"} voter`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditVoter = (voter) => {
    console.log("Editing voter:", voter);
    setIsEditing(true);
    setEditingVoterId(voter._id);
    setFormData({
      name: voter.name || "",
      voter_card_id: voter.voter_card_id || "",
      street_id: voter.street_id?._id || voter.street_id || "",
      ward_id: voter.ward_id?._id || voter.ward_id || "",
      age: voter.age || "",
      gender: voter.gender || "",
      religion: voter.religion || "",
      community: voter.community || "",
      phone: voter.phone || "",
      notes: voter.notes || "",
      profileImageFile: null,
      profileImagePreview: voter.profile_image || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteVoter = async () => {
    try {
      setIsLoading(true);
      console.log("Deleting voter with ID:", voterToDelete);
      const response = await axiosInstance.delete(`/voters/${voterToDelete}`);
      console.log("Delete voter response:", response.data);
      await fetchVoters();
      showToast("success", "Voter deleted successfully");
      setIsDeleteModalOpen(false);
      setVoterToDelete(null);
    } catch (error) {
      console.error("Error deleting voter:", error.response?.data || error.message);
      showToast("error", error.response?.data?.message || "Failed to delete voter");
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (voterId) => {
    setVoterToDelete(voterId);
    setIsDeleteModalOpen(true);
  };

  // Export function for Excel
  const exportToExcel = () => {
    const exportData = filteredVoters.map((voter) => ({
      Name: voter.name || "-",
      "Voter Card ID": voter.voter_card_id || "-",
      Ward: typeof voter.ward_id === "object" && voter.ward_id
        ? voter.ward_id.ward || voter.ward_id.name || "-"
        : wards.find((w) => w._id === voter.ward_id)?.ward || "-",
      Street: typeof voter.street_id === "object" && voter.street_id
        ? voter.street_id.name || "-"
        : streets.find((s) => s._id === voter.street_id)?.name || "-",
      Age: voter.age || "-",
      Gender: voter.gender || "-",
      Phone: voter.phone || "-",
      Religion: voter.religion || "-",
      Community: voter.community || "-",
      Notes: voter.notes || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Voters");
    XLSX.writeFile(wb, "voters.xlsx");
  };

  // Filter voters based on search term and selected ward
  const filteredVoters = (voters || []).filter(
    (voter) =>
      (voter.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.voter_card_id?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedWard === "all" || voter.ward_id?._id === selectedWard || voter.ward_id === selectedWard)
  );

  // Filter streets based on selected ward in form
  const filteredStreets = formData.ward_id
    ? streets.filter((street) => street.ward?._id === formData.ward_id)
    : streets;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 w-2/3">
          <Input
            placeholder="Search voters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[40%]"
            disabled={isLoading}
          />
          <Select
            value={selectedWard}
            onValueChange={setSelectedWard}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[30%]">
              <SelectValue placeholder="Filter by Ward" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Wards</SelectItem>
              {wards.map((ward) => (
                <SelectItem key={ward._id} value={ward._id}>
                  {ward.ward || ward.name || "Unnamed Ward"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={exportToExcel}
            disabled={isLoading}
            variant="outline"
          >
            <Download className="w-5 h-5 mr-2" />
            Export to Excel
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            disabled={isLoading}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Voter
          </Button>
        </div>
      </div>

      {/* Add/Edit Voter Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Voter" : "Add New Voter"}</DialogTitle>
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
              name="voter_card_id"
              placeholder="Voter Card ID"
              value={formData.voter_card_id}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Select
              name="ward_id"
              value={formData.ward_id}
              onValueChange={(value) => setFormData({ ...formData, ward_id: value, street_id: "" })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Ward" />
              </SelectTrigger>
              <SelectContent>
                {wards.map((ward) => (
                  <SelectItem key={ward._id} value={ward._id}>
                    {ward.ward || ward.name || "Unnamed Ward"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              name="street_id"
              value={formData.street_id}
              onValueChange={(value) => setFormData({ ...formData, street_id: value })}
              disabled={isLoading || !formData.ward_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Street" />
              </SelectTrigger>
              <SelectContent>
                {filteredStreets.length > 0 ? (
                  filteredStreets.map((street) => (
                    <SelectItem key={street._id} value={street._id}>
                      {street.name || "Unnamed Street"}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-streets" disabled>
                    No streets available for this ward
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <Input
              name="age"
              placeholder="Age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              disabled={isLoading}
              min="18"
            />
            <Select
              name="gender"
              value={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input
              name="religion"
              placeholder="Religion (optional)"
              value={formData.religion}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Input
              name="community"
              placeholder="Community (optional)"
              value={formData.community}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Input
              name="phone"
              placeholder="Phone (optional)"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Input
              name="notes"
              placeholder="Notes (optional)"
              value={formData.notes}
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleAddOrUpdateVoter} disabled={isLoading}>
              {isLoading ? (isEditing ? "Updating..." : "Adding...") : (isEditing ? "Update Voter" : "Add Voter")}
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
              Are you sure you want to delete this voter? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setVoterToDelete(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteVoter}
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
            <TableHead>Voter Card ID</TableHead>
            <TableHead>Ward</TableHead>
            <TableHead>Street</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={9}>Loading...</TableCell>
            </TableRow>
          ) : filteredVoters.length > 0 ? (
            filteredVoters.map((voter) => (
              <TableRow key={voter._id}>
                <TableCell>
                  {voter.profile_image ? (
                    <img
                      src={voter.profile_image}
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
                <TableCell>{voter.name || "-"}</TableCell>
                <TableCell>{voter.voter_card_id || "-"}</TableCell>
                <TableCell>
                  {typeof voter.ward_id === "object" && voter.ward_id
                    ? voter.ward_id.ward || voter.ward_id.name || "-"
                    : wards.find((w) => w._id === voter.ward_id)?.ward || "-"}
                </TableCell>
                <TableCell>
                  {typeof voter.street_id === "object" && voter.street_id
                    ? voter.street_id.name || "-"
                    : streets.find((s) => s._id === voter.street_id)?.name || "-"}
                </TableCell>
                <TableCell>{voter.age || "-"}</TableCell>
                <TableCell>{voter.gender || "-"}</TableCell>
                <TableCell>{voter.phone || "-"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditVoter(voter)}
                      disabled={isLoading}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteModal(voter._id)}
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
              <TableCell colSpan={9}>No voters found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VotersAdd;