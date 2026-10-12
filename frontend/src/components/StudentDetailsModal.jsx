import StatusBadge from './StatusBadge';

export default function StudentDetailsModal({ student, onClose }) {
  const rows = [
    ['Student ID', student.id],
    ['Username', student.username],
    ['Full Name', student.name],
    ['Date of Birth', student.dob],
    ['Gender', student.gender],
    ['Course', student.course],
    ['Semester', student.semester],
    ['Email', student.email],
    ['Phone', student.phone],
    ['Address', student.address],
    ['Registered On', new Date(student.createdAt).toLocaleDateString('en-IN')],
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Student Details</h2>
        <table className="profile">
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label}>
                <th>{label}</th>
                <td>{value}</td>
              </tr>
            ))}
            <tr>
              <th>Admission Status</th>
              <td><StatusBadge status={student.admissionStatus} /></td>
            </tr>
          </tbody>
        </table>
        <button className="btn btn-outline" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}