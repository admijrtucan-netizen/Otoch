type IconProps = { className?: string };

function base(paths: React.ReactNode) {
  return function Icon({ className = "h-5 w-5" }: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {paths}
      </svg>
    );
  };
}

export const IconHome = base(
  <path d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
);

export const IconBag = base(
  <path d="M6 8h12l1 12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L6 8Zm3 0V6a3 3 0 0 1 6 0v2" />
);

export const IconPalette = base(
  <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.9 1.6-1.9-.1-.5.2-1 .7-1.1H15a4 4 0 0 0 4-4c0-6-3-11-7-11Zm-4.5 8a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm3-4a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm4 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm3 4a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z" />
);

export const IconBuilding = base(
  <path d="M4 21V6a1 1 0 0 1 1-1h7v16M4 21h16M12 5h7a1 1 0 0 1 1 1v15M8 9h.01M8 13h.01M8 17h.01M15 9h.01M15 13h.01M15 17h.01" />
);

export const IconWallet = base(
  <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2H6a2 2 0 0 1-2-2Zm14 8.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" />
);

export const IconReceipt = base(
  <path d="M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.5V3Zm3 5h6M9 11h6M9 14h4" />
);

export const IconChevronsLeft = base(<path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />);
export const IconChevronsRight = base(<path d="m13 17 5-5-5-5M6 17l5-5-5-5" />);
export const IconMenu = base(<path d="M4 6h16M4 12h16M4 18h16" />);
export const IconX = base(<path d="M6 6l12 12M18 6 6 18" />);
