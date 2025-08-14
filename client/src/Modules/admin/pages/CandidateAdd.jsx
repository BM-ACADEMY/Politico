import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle } from 'lucide-react';

const CandidateAdd = () => {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    profileImage: null,
    ward: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, profileImage: URL.createObjectURL(e.target.files[0]) });
  };

  const handleAddCandidate = () => {
    setCandidates([...candidates, { ...formData, id: candidates.length + 1 }]);
    setFormData({
      name: '',
      phone: '',
      email: '',
      profileImage: null,
      ward: '',
      password: '',
    });
    setIsModalOpen(false);
  };

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 w-1/3">
          {/* <Search className="w-5 h-5 text-gray-500" /> */}
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Candidate
        </Button>
      </div>

      {/* Modal for Adding Candidate */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Candidate</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <Input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <Input
              name="email"
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <Input
              name="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <Input
              name="ward"
              placeholder="Ward"
              value={formData.ward}
              onChange={handleInputChange}
            />
            <Input
              name="password"
              placeholder="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCandidate}>Add Candidate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Data Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Ward</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCandidates.map((candidate) => (
            <TableRow
              key={candidate.id}
              onClick={() => setSelectedCandidate(candidate)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <TableCell>{candidate.name}</TableCell>
              <TableCell>{candidate.email}</TableCell>
              <TableCell>{candidate.phone}</TableCell>
              <TableCell>{candidate.ward}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Sheet for Candidate Details */}
      <Sheet open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
        <SheetContent className="w-80">
          <SheetHeader>
            <SheetTitle>Candidate Details</SheetTitle>
          </SheetHeader>
          {selectedCandidate && (
            <div className="mt-4">
              {selectedCandidate.profileImage && (
                <img
                  src={selectedCandidate.profileImage}
                  alt="Profile"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <p><strong>Name:</strong> {selectedCandidate.name}</p>
              <p><strong>Email:</strong> {selectedCandidate.email}</p>
              <p><strong>Phone:</strong> {selectedCandidate.phone}</p>
              <p><strong>Ward:</strong> {selectedCandidate.ward}</p>
              <p><strong>Password:</strong> {selectedCandidate.password}</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CandidateAdd;