import React, { useState, useEffect, useRef } from "react";
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
import { PlusCircle, Edit, Trash2, Download, Upload, ArrowUpDown } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { showToast } from "@/toast/customToast";
import * as XLSX from "xlsx";

const VotersAdd = () => {
  const [voters, setVoters] = useState([]);
  const [wards, setWards] = useState([]);
  const [streets, setStreets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWard, setSelectedWard] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [sortBy, setSortBy] = useState("name"); // 'name', 'street'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc', 'desc'
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
    address: "", // New address field
    age: "",
    gender: "",
    religion: "",
    community: "",
    phone: "",
    notes: "",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchVoters();
    fetchWards();
    fetchStreets();
  }, []);

  const fetchVoters = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/voters");
      setVoters(response.data.data || []);
    } catch (error) {
      showToast("error", error.response?.data?.message || "Failed to fetch voters");
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
      showToast("error", error.response?.data?.message || "Failed to fetch wards");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStreets = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/streets");
      setStreets(response.data || []);
    } catch (error) {
      showToast("error", error.response?.data?.message || "Failed to fetch streets");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      voter_card_id: "",
      street_id: "",
      ward_id: "",
      address: "", // Reset new field
      age: "",
      gender: "",
      religion: "",
      community: "",
      phone: "",
      notes: "",
    });
    setIsEditing(false);
    setEditingVoterId(null);
  };

  const handleAddOrUpdateVoter = async () => {
    try {
      if (!formData.name || !formData.voter_card_id || !formData.street_id || !formData.ward_id || !formData.age || !formData.gender) {
        throw new Error("Name, voter card ID, street, ward, age, and gender are required");
      }

      if (formData.age < 18) {
        throw new Error("Age must be 18 or older");
      }

      if (!["male", "female", "other"].includes(formData.gender.toLowerCase())) {
        throw new Error("Invalid gender value");
      }

      setIsLoading(true);
      const dataToSend = {
        name: formData.name,
        voter_card_id: formData.voter_card_id,
        street_id: formData.street_id,
        ward_id: formData.ward_id,
        address: formData.address || "", // Include new field
        age: parseInt(formData.age),
        gender: formData.gender.toLowerCase(),
        religion: formData.religion || "",
        community: formData.community || "",
        phone: formData.phone || "",
        notes: formData.notes || "",
      };

      if (isEditing) {
        await axiosInstance.put(`/voters/${editingVoterId}`, dataToSend);
        showToast("success", "Voter updated successfully");
      } else {
        await axiosInstance.post("/voters", dataToSend);
        showToast("success", "Voter created successfully");
      }

      await fetchVoters();
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      showToast("error", error.response?.data?.message || `Failed to ${isEditing ? "update" : "create"} voter`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditVoter = (voter) => {
    setIsEditing(true);
    setEditingVoterId(voter._id);
    setFormData({
      name: voter.name || "",
      voter_card_id: voter.voter_card_id || "",
      street_id: voter.street_id?._id || voter.street_id || "",
      ward_id: voter.ward_id?._id || voter.ward_id || "",
      address: voter.address || "", // Load new field
      age: voter.age || "",
      gender: voter.gender || "",
      religion: voter.religion || "",
      community: voter.community || "",
      phone: voter.phone || "",
      notes: voter.notes || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteVoter = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(`/voters/${voterToDelete}`);
      await fetchVoters();
      showToast("success", "Voter deleted successfully");
      setIsDeleteModalOpen(false);
      setVoterToDelete(null);
    } catch (error) {
      showToast("error", error.response?.data?.message || "Failed to delete voter");
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (voterId) => {
    setVoterToDelete(voterId);
    setIsDeleteModalOpen(true);
  };

  const handleExcelImport = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      showToast("error", "Please select an Excel file");
      return;
    }

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      showToast("error", "Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    try {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (jsonData.length < 2) {
            showToast("error", "Excel file is empty or missing data");
            return;
          }

          const headers = jsonData[0].map(h => h.trim());
          const requiredHeaders = ["Name", "Voter Card ID", "Ward", "Street", "Age", "Gender"];
          const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
          if (missingHeaders.length > 0) {
            showToast("error", `Missing required columns: ${missingHeaders.join(", ")}`);
            return;
          }

          const votersData = jsonData.slice(1).map(row => {
            const rowData = {};
            headers.forEach((header, index) => {
              rowData[header] = row[index] || "";
            });
            return rowData;
          });

          let successCount = 0;
          let errorCount = 0;

          for (const voter of votersData) {
            if (!voter.Name || !voter["Voter Card ID"] || !voter.Ward || !voter.Street || !voter.Age || !voter.Gender) {
              showToast("error", `Missing required fields for voter: ${voter.Name || "Unknown"}`);
              errorCount++;
              continue;
            }

            const ward = wards.find((w) => w.ward?.toLowerCase() === voter.Ward.toLowerCase() || w.name?.toLowerCase() === voter.Ward.toLowerCase());
            if (!ward) {
              showToast("error", `Invalid ward "${voter.Ward}" for voter: ${voter.Name}`);
              errorCount++;
              continue;
            }

            const street = streets.find((s) => s.name?.toLowerCase() === voter.Street.toLowerCase() && s.ward?._id === ward._id);
            if (!street) {
              showToast("error", `Invalid street "${voter.Street}" for ward "${voter.Ward}" for voter: ${voter.Name}`);
              errorCount++;
              continue;
            }

            if (voter.Age < 18) {
              showToast("error", `Invalid age "${voter.Age}" for voter: ${voter.Name}`);
              errorCount++;
              continue;
            }

            if (!["male", "female", "other"].includes(voter.Gender.toLowerCase())) {
              showToast("error", `Invalid gender "${voter.Gender}" for voter: ${voter.Name}`);
              errorCount++;
              continue;
            }

            const voterData = {
              name: voter.Name,
              voter_card_id: voter["Voter Card ID"],
              street_id: street._id,
              ward_id: ward._id,
              address: voter.Address || "", // Include new field if present in Excel
              age: parseInt(voter.Age),
              gender: voter.Gender.toLowerCase(),
              religion: voter.Religion || "",
              community: voter.Community || "",
              phone: voter.Phone || "",
              notes: voter.Notes || "",
            };

            try {
              await axiosInstance.post("/voters", voterData);
              successCount++;
            } catch (error) {
              showToast("error", `Failed to import voter "${voter.Name}": ${error.response?.data?.message || error.message}`);
              errorCount++;
            }
          }

          await fetchVoters();
          showToast("success", `Imported ${successCount} voters successfully${errorCount > 0 ? `, ${errorCount} failed` : ""}`);
        } catch (error) {
          showToast("error", `Error processing Excel file: ${error.message}`);
        }
      };
      reader.onerror = () => {
        showToast("error", "Failed to read Excel file");
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      showToast("error", `Failed to import voters: ${error.message}`);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

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
      Address: voter.address || "-", // Export new field
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

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? <ArrowUpDown className="ml-1 h-4 w-4" /> : <ArrowUpDown className="ml-1 h-4 w-4 rotate-180" />;
  };

  const filteredVoters = React.useMemo(() => {
    let filtered = (voters || []).filter(
      (voter) =>
        (voter.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          voter.voter_card_id?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedWard === "all" || voter.ward_id?._id === selectedWard || voter.ward_id === selectedWard) &&
        (selectedGender === "all" || voter.gender === selectedGender)
    );

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      if (sortBy === "name") {
        aValue = a.name?.toLowerCase() || "";
        bValue = b.name?.toLowerCase() || "";
      } else if (sortBy === "street") {
        const aStreetName = typeof a.street_id === "object" && a.street_id
          ? a.street_id.name || ""
          : streets.find((s) => s._id === a.street_id)?.name || "";
        const bStreetName = typeof b.street_id === "object" && b.street_id
          ? b.street_id.name || ""
          : streets.find((s) => s._id === b.street_id)?.name || "";
        aValue = aStreetName.toLowerCase();
        bValue = bStreetName.toLowerCase();
      }
      if (sortOrder === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return filtered;
  }, [voters, searchTerm, selectedWard, selectedGender, sortBy, sortOrder, streets]);

  const filteredStreets = formData.ward_id
    ? streets.filter((street) => street.ward?._id === formData.ward_id)
    : streets;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 w-full lg:w-2/3">
          <Input
            placeholder="Search voters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full lg:w-[25%]"
            disabled={isLoading}
          />
          <Select
            value={selectedWard}
            onValueChange={setSelectedWard}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full lg:w-[20%]">
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
          <Select
            value={selectedGender}
            onValueChange={setSelectedGender}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full lg:w-[20%]">
              <SelectValue placeholder="Filter by Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 justify-end w-full sm:w-auto">
          <Button
            onClick={exportToExcel}
            disabled={isLoading}
            variant="outline"
            className="w-full sm:w-auto flex-1 sm:flex-none"
          >
            <Download className="w-5 h-5 mr-2" />
            Export to Excel
          </Button>
          <Button
            onClick={handleImportClick}
            disabled={isLoading}
            variant="outline"
            className="w-full sm:w-auto flex-1 sm:flex-none"
          >
            <Upload className="w-5 h-5 mr-2" />
            Import Voters
          </Button>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelImport}
            className="hidden"
            ref={fileInputRef}
          />
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            disabled={isLoading}
            className="w-full sm:w-auto flex-1 sm:flex-none"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Voter
          </Button>
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-lg">
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
            {/* New Address Section */}
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input
                name="address"
                placeholder="Full Address (optional)"
                value={formData.address}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
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

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] cursor-pointer" onClick={() => handleSort("name")}>
                Name {getSortIcon("name")}
              </TableHead>
              <TableHead className="w-[150px]">Voter Card ID</TableHead>
              <TableHead className="w-[120px]">Ward</TableHead>
              <TableHead className="w-[120px] cursor-pointer" onClick={() => handleSort("street")}>
                Street {getSortIcon("street")}
              </TableHead>
              <TableHead className="w-[80px]">Age</TableHead>
              <TableHead className="w-[100px]">Gender</TableHead>
              <TableHead className="w-[150px]">Address</TableHead>
              <TableHead className="w-[120px]">Phone</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : filteredVoters.length > 0 ? (
              filteredVoters.map((voter) => (
                <TableRow key={voter._id}>
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
                  <TableCell>{voter.address || "-"}</TableCell>
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
                <TableCell colSpan={9} className="text-center">No voters found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VotersAdd;