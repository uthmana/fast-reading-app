import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

type Search = {
  className?: string;
  onChange: (e: any) => void;
  onSubmit: (e: any) => void;
  debounce?: number;
  value?: string;
};

const Search = ({
  className,
  onSubmit,
  onChange,
  debounce = 500,
  value,
}: Search) => {
  const [searchText, setSearchText] = useState(value || "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(searchText);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [searchText]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(searchText);
      }}
      className={`flex h-[48px] w-full items-center rounded-full ${className}`}
    >
      <p className="pl-3 pr-2 text-xl">
        <FiSearch className="h-4 w-4 text-gray-600 " />
      </p>
      <input
        value={searchText}
        type="text"
        onKeyUp={(e) => onChange(searchText)}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Arama..."
        className="h-full w-full px-3 bg-black/0 text-base font-medium outline-none placeholder:!text-gray-400  "
      />
    </form>
  );
};

export default Search;
