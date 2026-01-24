const LinkCard = ({ link }) => {


  return (
    <a
      className="hover:cursor-pointer w-fit h-fit block rounded-lg"
      href={link}
      target="_blank"
    >
      <div className="flex gap-4 p-3 w-56 h-24 border border-gray-400 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all duration-300 ease-in-out">
        <div className="font-crimson w-full">
          <p className="text-xl">Sample Link</p>
        </div>
      </div>
    </a>
  )
}

export default LinkCard