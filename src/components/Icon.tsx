export type IconName =
  | "search"
  | "shield"
  | "users"
  | "check"
  | "arrow"
  | "flag"
  | "menu"
  | "x"
  | "chevron";
const paths: Record<IconName, string> = {
  search: "M11 4a7 7 0 1 0 4.95 11.95L21 21m-6-6 6 6",
  shield: "M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-4",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-3a4 4 0 0 1 0 7.75M22 21v-2a4 4 0 0 0-3-3.87",
  check: "m5 12 4 4L19 6",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  flag: "M5 21V4m0 0c5-3 9 3 14 0v9c-5 3-9-3-14 0",
  menu: "M4 6h16M4 12h16M4 18h16",
  x: "M6 6l12 12M18 6 6 18",
  chevron: "m6 9 6 6 6-6",
};
export default function Icon({
  name,
  size = 20,
}: {
  name: IconName;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
