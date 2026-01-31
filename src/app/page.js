import createClient from "lib/supabase/server";
import HomepageContent from "./HomepageContent";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"

const Home = async () => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('users').select()

  if (error) {
    console.error(error)
  }

  return (
    <>
      <HomepageContent/>
      <Analytics/>
      <SpeedInsights />
    </>
  );
}

export default Home