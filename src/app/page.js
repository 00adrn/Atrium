import createClient from "lib/supabase/server";

const Home = async () => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('users').select()

  if (error) {
    console.error(error)
  } else console.log(data)

  return (
    <div className="border border-gray-500 w-80 h-64">
      {data.map((user, i) => (
        <div key={i}>
          <p>{user.first_name}</p>
          <p>{user.last_name}</p>
          <p>{user.linkedin}</p>
        </div>
      ))}
    </div>
  );
}

export default Home