import createClient from "lib/supabase/server";

const Home = async () => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('users').select()

  if (error) {
    console.error(error)
  } else console.log(data)

  return (
    <div className="h-screen w-full overflow-hidden relative bg-gradient-to-b from-sky-400 via-sky-300 to-orange-200">
      {/* Logo */}
      <div className="absolute top-8 left-10 z-20">
        <div className="flex items-center gap-2 text-white">
          <span className="text-2xl">◉</span>
          <span className="text-3xl font-serif tracking-tight">Atrium</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-4xl -mt-20">
          {/* Heading */}
          <h1 className="text-8xl font-serif text-white mb-8 tracking-tight leading-none">
            Event Management<br />made simple.
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/95 mb-12 max-w-2xl mx-auto leading-relaxed">
            Atrium simplifies university club events with a robust system designed to track involvement and attendance.
          </p>

          {/* CTA Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl text-lg font-medium transition-all duration-300 shadow-lg shadow-blue-600/40 hover:shadow-xl hover:shadow-blue-600/50 hover:-translate-y-0.5">
            Sign up
          </button>
        </div>
      </div>

      {/* Mac Window Background - Cut off at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 z-0">
        <div className="w-full h-full bg-orange-400 rounded-t-2xl shadow-2xl translate-y-40">
          {/* Window Controls */}
          <div className="flex gap-2 pt-4 pl-5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home