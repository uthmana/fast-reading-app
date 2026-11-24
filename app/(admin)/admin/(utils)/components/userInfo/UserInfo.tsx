type Props = {
  userInfo: {
    name: string;
    username: string;
    password: string;
  };
};

export default function UserInfo({ userInfo }: Props) {
  return (
    <div className="flex w-full gap-3 text-sm items-center">
      <span className="flex items-center justify-center bg-[lightGray] p-2 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="#FFFFFF"
        >
          <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm6 2H6a6 6 0 00-6 6v1h24v-1a6 6 0 00-6-6z" />
        </svg>
      </span>
      <span>
        <span className="block capitalize mb-1">{userInfo?.name}</span>
        <span className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="lightGray"
          >
            <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm6 2H6a6 6 0 00-6 6v1h24v-1a6 6 0 00-6-6z" />
          </svg>
          {userInfo?.username}
        </span>
        <span className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="lightGray"
          >
            <path d="M17 8V7a5 5 0 0 0-10 0v1H5v14h14V8h-2Zm-8-1a3 3 0 0 1 6 0v1H9V7Zm3 6a2 2 0 1 1-2 2 2 2 0 0 1 2-2Z" />
          </svg>
          {userInfo?.password}
        </span>
      </span>
    </div>
  );
}
