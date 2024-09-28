import React from "react";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  {
    id: "home",
    label: "Home",
    icon: (
      <>
        <g clip-path="url(#clip0_4_82)">
          <path
            d="M5 12H3L12 3L21 12H19"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5 12V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V12"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9 21V15C9 14.4696 9.21071 13.9609 9.58579 13.5858C9.96086 13.2107 10.4696 13 11 13H13C13.5304 13 14.0391 13.2107 14.4142 13.5858C14.7893 13.9609 15 14.4696 15 15V21"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_4_82">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </>
    ),
    path: "/",
  },
  {
    id: "earn",
    label: "Earn",
    icon: (
      <>
        <g clip-path="url(#clip0_4_95)">
          <path
            d="M17.3333 8V5C17.3333 4.73478 17.228 4.48043 17.0404 4.29289C16.8529 4.10536 16.5985 4 16.3333 4H6.33333C5.8029 4 5.29419 4.21071 4.91911 4.58579C4.54404 4.96086 4.33333 5.46957 4.33333 6M4.33333 6C4.33333 6.53043 4.54404 7.03914 4.91911 7.41421C5.29419 7.78929 5.8029 8 6.33333 8H18.3333C18.5985 8 18.8529 8.10536 19.0404 8.29289C19.228 8.48043 19.3333 8.73478 19.3333 9V12M4.33333 6V18C4.33333 18.5304 4.54404 19.0391 4.91911 19.4142C5.29419 19.7893 5.8029 20 6.33333 20H18.3333C18.5985 20 18.8529 19.8946 19.0404 19.7071C19.228 19.5196 19.3333 19.2652 19.3333 19V16"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M20.3333 12V16H16.3333C15.8029 16 15.2942 15.7893 14.9191 15.4142C14.544 15.0391 14.3333 14.5304 14.3333 14C14.3333 13.4696 14.544 12.9609 14.9191 12.5858C15.2942 12.2107 15.8029 12 16.3333 12H20.3333Z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_4_95">
            <rect
              width="24"
              height="24"
              fill="white"
              transform="translate(0.333328)"
            />
          </clipPath>
        </defs>
      </>
    ),
    path: "/earn",
  },

  {
    id: "friends",
    label: "Friends",
    icon: (
      <>
        <g clip-path="url(#clip0_4_109)">
          <path
            d="M5.66666 5C5.66666 5.53043 5.87737 6.03914 6.25244 6.41421C6.62752 6.78929 7.13622 7 7.66666 7C8.19709 7 8.7058 6.78929 9.08087 6.41421C9.45594 6.03914 9.66666 5.53043 9.66666 5C9.66666 4.46957 9.45594 3.96086 9.08087 3.58579C8.7058 3.21071 8.19709 3 7.66666 3C7.13622 3 6.62752 3.21071 6.25244 3.58579C5.87737 3.96086 5.66666 4.46957 5.66666 5Z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5.66666 22V17L4.66666 16V12C4.66666 11.7348 4.77201 11.4804 4.95955 11.2929C5.14709 11.1054 5.40144 11 5.66666 11H9.66666C9.93187 11 10.1862 11.1054 10.3738 11.2929C10.5613 11.4804 10.6667 11.7348 10.6667 12V16L9.66666 17V22"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15.6667 5C15.6667 5.53043 15.8774 6.03914 16.2524 6.41421C16.6275 6.78929 17.1362 7 17.6667 7C18.1971 7 18.7058 6.78929 19.0809 6.41421C19.4559 6.03914 19.6667 5.53043 19.6667 5C19.6667 4.46957 19.4559 3.96086 19.0809 3.58579C18.7058 3.21071 18.1971 3 17.6667 3C17.1362 3 16.6275 3.21071 16.2524 3.58579C15.8774 3.96086 15.6667 4.46957 15.6667 5Z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15.6667 22V18H13.6667L15.6667 12C15.6667 11.7348 15.772 11.4804 15.9595 11.2929C16.1471 11.1054 16.4014 11 16.6667 11H18.6667C18.9319 11 19.1862 11.1054 19.3738 11.2929C19.5613 11.4804 19.6667 11.7348 19.6667 12L21.6667 18H19.6667V22"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_4_109">
            <rect
              width="24"
              height="24"
              fill="white"
              transform="translate(0.666656)"
            />
          </clipPath>
        </defs>
      </>
    ),
    path: "/friends",
  },
  {
    id: "quest",
    label: "Quest",
    icon: (
      <>
        <g clip-path="url(#clip0_4_126)">
          <path
            d="M16 18C16.5304 18 17.0391 18.2107 17.4142 18.5858C17.7893 18.9609 18 19.4696 18 20C18 19.4696 18.2107 18.9609 18.5858 18.5858C18.9609 18.2107 19.4696 18 20 18C19.4696 18 18.9609 17.7893 18.5858 17.4142C18.2107 17.0391 18 16.5304 18 16C18 16.5304 17.7893 17.0391 17.4142 17.4142C17.0391 17.7893 16.5304 18 16 18ZM16 6C16.5304 6 17.0391 6.21071 17.4142 6.58579C17.7893 6.96086 18 7.46957 18 8C18 7.46957 18.2107 6.96086 18.5858 6.58579C18.9609 6.21071 19.4696 6 20 6C19.4696 6 18.9609 5.78929 18.5858 5.41421C18.2107 5.03914 18 4.53043 18 4C18 4.53043 17.7893 5.03914 17.4142 5.41421C17.0391 5.78929 16.5304 6 16 6ZM9 18C9 16.4087 9.63214 14.8826 10.7574 13.7574C11.8826 12.6321 13.4087 12 15 12C13.4087 12 11.8826 11.3679 10.7574 10.2426C9.63214 9.11742 9 7.5913 9 6C9 7.5913 8.36786 9.11742 7.24264 10.2426C6.11742 11.3679 4.5913 12 3 12C4.5913 12 6.11742 12.6321 7.24264 13.7574C8.36786 14.8826 9 16.4087 9 18Z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_4_126">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </>
    ),
    path: "/quest",
  },
];

function Navigation() {
  const location = useLocation();
  return (
    <div className="nav  absolute bottom-0  h-20 gap-10 py-4 bg-[#09090E] w-full border-white/20 border-t-[1px] flex flex-row items-center justify-between px-10 z-20">
      {tabs.map((tab) => {
        return (
          <Link
            to={tab.path}
            key={tab.id}
            className="flex flex-col items-center justify-center"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={` font-helvetica text-sm  ${
                location.pathname === tab.path
                  ? "stroke-white"
                  : "stroke-[#535355]"
              }`}
            >
              {tab.icon}
            </svg>
            <span
              className={` font-helvetica text-sm ${
                location.pathname === tab.path
                  ? "text-[#FFFFFF]"
                  : "text-[#535355]"
              }`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default Navigation;
