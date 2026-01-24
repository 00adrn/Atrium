import createClient from "lib/supabase/server";
import { motion } from "motion/react"
import HomepageContent from "./HomepageContent";

const Home = async () => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('users').select()

  if (error) {
    console.error(error)
  } else console.log(data)

  return (
    <HomepageContent/>
  );
}

export default Home