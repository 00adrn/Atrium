import DashboardContent from "./DashboardContent";
import Navbar from "./Navbar";

export default function Dashboard(){
  return (
    <div className="bg-white min-h-screen">
      <Navbar/>
      <DashboardContent/>
    </div>
  )
}