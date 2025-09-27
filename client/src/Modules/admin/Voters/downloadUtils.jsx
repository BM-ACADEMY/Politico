import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const downloadVotersAsExcel = (voters, wards, streets) => {
  const data = voters.map((voter) => ({
    Name: voter.name || "-",
    "Voter Card ID": voter.voter_card_id || "-",
    Ward:
      voter.ward_id && typeof voter.ward_id === "object"
        ? voter.ward_id.name || voter.ward_id.ward || "-"
        : wards.find((w) => w._id === voter.ward_id)?.name || wards.find((w) => w._id === voter.ward_id)?.ward || "-",
    Street:
      voter.street_id && typeof voter.street_id === "object"
        ? voter.street_id.name || "-"
        : streets.find((s) => s._id === voter.street_id)?.name || "-",
    Age: voter.age || "-",
    Gender: voter.gender || "-",
    Phone: voter.phone || "-",
    Religion: voter.religion || "-",
    Community: voter.community || "-",
    Notes: voter.notes || "-",
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Voters");
  XLSX.write(wb, "voters.xlsx");
};

export const downloadVotersAsPDF = (voters, wards, streets) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Voters List", 14, 22);

  const tableData = voters.map((voter) => [
    voter.name || "-",
    voter.voter_card_id || "-",
    voter.ward_id && typeof voter.ward_id === "object"
      ? voter.ward_id.name || voter.ward_id.ward || "-"
      : wards.find((w) => w._id === voter.ward_id)?.name || wards.find((w) => w._id === voter.ward_id)?.ward || "-",
    voter.street_id && typeof voter.street_id === "object"
      ? voter.street_id.name || "-"
      : streets.find((s) => s._id === voter.street_id)?.name || "-",
    voter.age || "-",
    voter.gender || "-",
    voter.phone || "-",
    voter.religion || "-",
    voter.community || "-",
    voter.notes || "-",
  ]);

  const columns = [
    "Name",
    "Voter Card ID",
    "Ward",
    "Street",
    "Age",
    "Gender",
    "Phone",
    "Religion",
    "Community",
    "Notes",
  ];

  doc.autoTable({
    head: [columns],
    body: tableData,
    startY: 30,
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
    styles: { fontSize: 10 },
  });

  doc.save("voters.pdf");
};