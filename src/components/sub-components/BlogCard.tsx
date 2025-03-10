import Image from "next/image";
import Link from "next/link"; // Import Link from next/link
import { FaArrowRight } from "react-icons/fa";

type Card = {
  image: string;
  title: string;
  description: string;
  date: string;
  id: string;
};

const BlogCard = ({ image, title, description, date, id }: Card) => {
  // Helper function to truncate text after a specified length.
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="relative bg-white cursor-pointer border border-gray-200 rounded-md w-full overflow-hidden group">
      {/* Date Badge */}
      <div className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded shadow-md z-10">
        {date}
      </div>

      {/* Image Section */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 transform group-hover:scale-110 group-hover:opacity-80"
        />
        {/* Hover Icons */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-4 transition-opacity duration-500">
          <div className="bg-white p-3 rounded-full shadow-md hover:bg-primary hover:text-white transition">
            <Link href={`/blog/${id}`}>
              <FaArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Clickable Title using Link */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition">
          <Link href={`/blog/${id}`} className="link">
            {title.substring(0, 29) + "..."}
          </Link>
        </h3>
        {/* Truncated description using JavaScript */}
        <p className="text-sm text-gray-600">{truncateText(description, 40)}</p>

        {/* Read More Link using Link */}
        <div className="mt-4">
          <Link href={`/blog/${id}`} className="link hover:text-underline">
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
