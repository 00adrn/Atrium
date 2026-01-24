import DashboardContent from "./DashboardContent";
import Navbar from "./Navbar";
import createClient from "lib/supabase/server";

const Dashboard = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase.from('users').select().eq('id', user.id).single()
  if (error) console.log(error)
  const headshot = data.headshot
  const userName = data.first_name

  return (
    <div className="bg-white min-h-screen">
      <Navbar headshot={headshot}/>
      <DashboardContent userName={userName}/>
    </div>
  )
}

export default Dashboard