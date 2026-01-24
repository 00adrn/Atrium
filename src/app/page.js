import createClient from "lib/supabase/server";
import HomepageContent from "./HomepageContent";

const Home = async () => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('users').select()

  if (error) {
    console.error(error)
  }

  return (
    <HomepageContent/>
  );
}

export default Home