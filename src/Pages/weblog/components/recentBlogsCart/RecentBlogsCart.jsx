export default function RecentBlogsCart({thumbnail,date,title}) {
    return(
        <div className="flex items-center justify-between gap-x-4">
            <div className="flex flex-1/4">
            <img src={thumbnail} className="w-17 h-12 object-cover rounded-xl" alt={title} />
            </div>
            <div className="flex flex-col flex-3/4">
                <p>{title}</p>
                <span className="text-sm font-estedad-light">{date}</span>
            </div>
        </div>
    )
};
