const MovieCard = ({ movie, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 transition-all duration-300 hover:transform hover:scale-[1.02] shadow-sm hover:shadow-lg cursor-pointer"
    >
      {/* Year Badge */}
      <div className="absolute top-3 right-3 z-10 bg-white/90 px-2.5 py-1 rounded shadow-sm">
        <p className="text-gray-700 font-raleway font-medium text-xs">
          {movie.Year}
        </p>
      </div>

      {/* Movie Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
        <img
          src={
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/400x600/e5e7eb/6b7280?text=No+Poster"
          }
          alt={movie.Title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* Movie Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="inline-block px-2 py-0.5 text-[10px] font-raleway font-medium text-gray-200 bg-black/50 rounded uppercase tracking-wide mb-1.5">
          {movie.Type}
        </span>
        <h3 className="text-base font-roboto font-semibold text-white line-clamp-2 leading-snug drop-shadow-md">
          {movie.Title}
        </h3>
      </div>
    </div>
  );
};
export default MovieCard;
