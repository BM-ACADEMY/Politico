import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext"; // Adjust path
import axiosInstance from "@/lib/axios"; // Adjust path
import { showToast } from "@/toast/customToast"; // Adjust path

// UI Components
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Pencil, Trash2, PlusCircle } from "lucide-react";

// Fallback Spinner
const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const StreetsAndWards = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for wards and streets
  const [wards, setWards] = useState([]);
  const [streets, setStreets] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Modals
  const [isWardDialogOpen, setIsWardDialogOpen] = useState(false);
  const [isStreetDialogOpen, setIsStreetDialogOpen] = useState(false);
  const [isViewStreetsDialogOpen, setIsViewStreetsDialogOpen] = useState(false);
  const [isDeleteWardDialogOpen, setIsDeleteWardDialogOpen] = useState(false);
  const [isDeleteStreetDialogOpen, setIsDeleteStreetDialogOpen] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedStreet, setSelectedStreet] = useState(null);
  const [wardToDelete, setWardToDelete] = useState(null);
  const [streetToDelete, setStreetToDelete] = useState(null);

  // Forms
  const [wardForm, setWardForm] = useState({
    ward: "",
    area: "",
    district: "",
    state: "",
  });
  const [streetForm, setStreetForm] = useState({
    name: "",
    ward: "",
  });
  const [isEditingWard, setIsEditingWard] = useState(false);
  const [isEditingStreet, setIsEditingStreet] = useState(false);

  // Pagination states
  const [wardPage, setWardPage] = useState(1);
  const [streetPage, setStreetPage] = useState(1);
  const rowsPerPage = 5;

  // Fetch wards & streets
  const fetchData = async (fetchWards = true, fetchStreets = true) => {
    setLoadingData(true);
    try {
      if (fetchWards) {
        const wardsResponse = await axiosInstance.get("/wards");
        setWards(wardsResponse.data);
      }
      if (fetchStreets) {
        const streetsResponse = await axiosInstance.get("/streets");
        setStreets(streetsResponse.data);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoadingData(false);
    }
  };

  // Load on mount
  useEffect(() => {
    if (!loading && !user) {
      showToast("error", "You must be logged in to view this page");
      navigate("/");
      return;
    }
    if (!loading) {
      fetchData();
    }
  }, [loading, user, navigate]);

  // Form changes
  const handleWardInputChange = (e) => {
    const { name, value } = e.target;
    setWardForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStreetInputChange = (e) => {
    const { name, value } = e.target;
    setStreetForm((prev) => ({ ...prev, [name]: value }));
  };

  // Ward submit (create or update)
  const handleWardSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditingWard) {
        const response = await axiosInstance.put(`/wards/${selectedWard._id}`, wardForm);
        setWards((prev) =>
          prev.map((ward) => (ward._id === selectedWard._id ? response.data : ward))
        );
        showToast("success", "Ward updated successfully");
      } else {
        const response = await axiosInstance.post("/wards", wardForm);
        setWards((prev) => [...prev, response.data]);
        showToast("success", "Ward created successfully");
      }
      setWardForm({ ward: "", area: "", district: "", state: "" });
      setIsWardDialogOpen(false);
      setIsEditingWard(false);
      setSelectedWard(null);
      await fetchData(true, false);
    } catch (error) {
      showToast("error", error.response?.data?.message || `Error ${isEditingWard ? "updating" : "creating"} ward`);
    }
  };

  // Street submit (create or update)
  const handleStreetSubmit = async (e) => {
    e.preventDefault();
    if (!streetForm.ward) {
      showToast("error", "Please select a ward");
      return;
    }
    try {
      if (isEditingStreet) {
        const response = await axiosInstance.put(`/streets/${selectedStreet._id}`, streetForm);
        setStreets((prev) =>
          prev.map((street) => (street._id === selectedStreet._id ? response.data : street))
        );
        showToast("success", "Street updated successfully");
      } else {
        const response = await axiosInstance.post("/streets", streetForm);
        setStreets((prev) => [...prev, response.data]);
        showToast("success", "Street created successfully");
      }
      setStreetForm({ name: "", ward: "" });
      setIsStreetDialogOpen(false);
      setIsEditingStreet(false);
      setSelectedStreet(null);
      await fetchData(false, true);
    } catch (error) {
      showToast("error", error.response?.data?.message || `Error ${isEditingStreet ? "updating" : "creating"} street`);
    }
  };

  // Edit handlers
  const handleEditWard = (ward) => {
    setSelectedWard(ward);
    setWardForm({
      ward: ward.ward,
      area: ward.area,
      district: ward.district,
      state: ward.state,
    });
    setIsEditingWard(true);
    setIsWardDialogOpen(true);
  };

  const handleEditStreet = (street) => {
    setSelectedStreet(street);
    setStreetForm({
      name: street.name,
      ward: street.ward?._id || "",
    });
    setIsEditingStreet(true);
    setIsStreetDialogOpen(true);
  };

  // Delete handlers
  const handleWardDelete = async () => {
    try {
      await axiosInstance.delete(`/wards/${wardToDelete}`);
      setWards((prev) => prev.filter((ward) => ward._id !== wardToDelete));
      showToast("success", "Ward deleted successfully");
      await fetchData(true, true);
      setIsDeleteWardDialogOpen(false);
      setWardToDelete(null);
    } catch (error) {
      showToast("error", error.response?.data?.message || "Error deleting ward");
    }
  };

  const handleStreetDelete = async () => {
    try {
      await axiosInstance.delete(`/streets/${streetToDelete}`);
      setStreets((prev) => prev.filter((street) => street._id !== streetToDelete));
      showToast("success", "Street deleted successfully");
      await fetchData(false, true);
      setIsDeleteStreetDialogOpen(false);
      setStreetToDelete(null);
    } catch (error) {
      showToast("error", error.response?.data?.message || "Error deleting street");
    }
  };

  // Open delete confirmation
  const openDeleteWardDialog = (id) => {
    setWardToDelete(id);
    setIsDeleteWardDialogOpen(true);
  };

  const openDeleteStreetDialog = (id) => {
    setStreetToDelete(id);
    setIsDeleteStreetDialogOpen(true);
  };

  // View Streets
  const handleViewStreets = (ward) => {
    setSelectedWard(ward);
    setIsViewStreetsDialogOpen(true);
  };

  // Filter streets for selected ward
  const filteredStreets = selectedWard
    ? streets.filter((street) => street.ward?._id === selectedWard._id)
    : [];

  // Pagination calculations
  const wardTotalPages = Math.ceil(wards.length / rowsPerPage);
  const streetTotalPages = Math.ceil(streets.length / rowsPerPage);
  const paginatedWards = wards.slice((wardPage - 1) * rowsPerPage, wardPage * rowsPerPage);
  const paginatedStreets = streets.slice((streetPage - 1) * rowsPerPage, streetPage * rowsPerPage);

  if (loading || loadingData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Streets and Wards Management
      </h1>

      {/* ---- Action Buttons ---- */}
      <div className="flex justify-end gap-4 mb-8">
        <Dialog open={isWardDialogOpen} onOpenChange={setIsWardDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-dark">
              <PlusCircle className="w-4 h-4 mr-2" /> Add Ward
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditingWard ? "Edit Ward" : "Add New Ward"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleWardSubmit} className="space-y-4">
              <Input
                name="ward"
                value={wardForm.ward}
                onChange={handleWardInputChange}
                placeholder="Ward Name"
                required
              />
              <Input
                name="area"
                value={wardForm.area}
                onChange={handleWardInputChange}
                placeholder="Area"
                required
              />
              <Input
                name="district"
                value={wardForm.district}
                onChange={handleWardInputChange}
                placeholder="District"
                required
              />
              <Input
                name="state"
                value={wardForm.state}
                onChange={handleWardInputChange}
                placeholder="State"
                required
              />
              <div className="flex justify-end gap-2">
                <Button type="submit" className="bg-primary hover:bg-primary-dark">
                  {isEditingWard ? "Update" : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsWardDialogOpen(false);
                    setIsEditingWard(false);
                    setWardForm({ ward: "", area: "", district: "", state: "" });
                    setSelectedWard(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isStreetDialogOpen} onOpenChange={setIsStreetDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-dark">
              <PlusCircle className="w-4 h-4 mr-2" /> Add Street
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditingStreet ? "Edit Street" : "Add New Street"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleStreetSubmit} className="space-y-4">
              <Input
                name="name"
                value={streetForm.name}
                onChange={handleStreetInputChange}
                placeholder="Street Name"
                required
              />
              <Select
                value={streetForm.ward}
                onValueChange={(value) => setStreetForm((prev) => ({ ...prev, ward: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a ward" />
                </SelectTrigger>
                <SelectContent>
                  {wards.map((ward) => (
                    <SelectItem key={ward._id} value={ward._id}>
                      {ward.ward}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-2">
                <Button type="submit" className="bg-primary hover:bg-primary-dark">
                  {isEditingStreet ? "Update" : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsStreetDialogOpen(false);
                    setIsEditingStreet(false);
                    setStreetForm({ name: "", ward: "" });
                    setSelectedStreet(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ---- Tabs ---- */}
      <Tabs defaultValue="wards" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="wards">Wards</TabsTrigger>
          <TabsTrigger value="streets">Streets</TabsTrigger>
        </TabsList>

        {/* Wards Tab */}
        <TabsContent value="wards">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Wards</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ward</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedWards.map((ward) => (
                    <TableRow key={ward._id}>
                      <TableCell>{ward.ward}</TableCell>
                      <TableCell>{ward.area}</TableCell>
                      <TableCell>{ward.district}</TableCell>
                      <TableCell>{ward.state}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewStreets(ward)}
                        >
                          View Streets
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditWard(ward)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteWardDialog(ward._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={wardPage === 1}
                  onClick={() => setWardPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </Button>
                <span>
                  Page {wardPage} of {wardTotalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={wardPage === wardTotalPages}
                  onClick={() => setWardPage((p) => p + 1)}
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Streets Tab */}
        <TabsContent value="streets">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Streets</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Street</TableHead>
                    <TableHead>Ward</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStreets.map((street) => (
                    <TableRow key={street._id}>
                      <TableCell>{street.name}</TableCell>
                      <TableCell>{street.ward?.ward || "N/A"}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditStreet(street)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteStreetDialog(street._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={streetPage === 1}
                  onClick={() => setStreetPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </Button>
                <span>
                  Page {streetPage} of {streetTotalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={streetPage === streetTotalPages}
                  onClick={() => setStreetPage((p) => p + 1)}
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Streets Dialog */}
      <Dialog open={isViewStreetsDialogOpen} onOpenChange={setIsViewStreetsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Streets in {selectedWard?.ward}</DialogTitle>
          </DialogHeader>
          {filteredStreets.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Street</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStreets.map((street) => (
                  <TableRow key={street._id}>
                    <TableCell>{street.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No streets found for this ward.
            </p>
          )}
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setIsViewStreetsDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Ward Confirmation Dialog */}
      <Dialog open={isDeleteWardDialogOpen} onOpenChange={setIsDeleteWardDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this ward? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="destructive"
              onClick={handleWardDelete}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteWardDialogOpen(false);
                setWardToDelete(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Street Confirmation Dialog */}
      <Dialog open={isDeleteStreetDialogOpen} onOpenChange={setIsDeleteStreetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this street? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="destructive"
              onClick={handleStreetDelete}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteStreetDialogOpen(false);
                setStreetToDelete(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StreetsAndWards;