import Navbar from "../../components/layout/Navbar";

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl mb-4">
          Welcome, {user?.name}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-100 cursor-pointer">
            Create Report
          </div>

          <div className="p-4 bg-green-100 cursor-pointer">
            View Reports
          </div>

          <div className="p-4 bg-yellow-100 cursor-pointer">
            AI Detector
          </div>

          <div className="p-4 bg-purple-100 cursor-pointer">
            Knowledge Hub
          </div>
        </div>
      </div>
    </>
  );
}
