const Loading = ({ message = 'Carregando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neonPurple mb-4"></div>
      <p className="text-lightText/70">{message}</p>
    </div>
  )
}

export default Loading

