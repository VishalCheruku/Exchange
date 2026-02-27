

const Input = (props) => {
    const { setInput, placeholder } = props
  return (
    <div className="pt-2 w-full relative">
        <input
          onChange={(event)=> setInput(event.target.value)}
          type="text"
          id={placeholder}
          className="w-full border border-sky-400 bg-white rounded-xl p-3 pt-4 pb-2 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-200 shadow-sm transition"
          required
        />
        <label
          htmlFor={placeholder}
          className="absolute pl-1 pr-1 left-3 top-1.5 bg-white text-xs font-semibold text-slate-500 peer-focus:top-1.5 transition-all duration-200"
        >
          {placeholder}
        </label>
    </div>
  )
}

export default Input
