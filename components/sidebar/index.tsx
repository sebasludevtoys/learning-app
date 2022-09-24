import Btn from "../atoms/Btn";

const pages = [
  { pathname: "Home", path: "/" },
  { pathname: "Certificates", path: "/certificates" },
  { pathname: "Exercises", path: "/exercises" },
  { pathname: "Tools", path: "/tools" },
];

const Sidebar = ({ className }: { className: string }) => {
  return (
    <div className={[" px-5 pt-10 ", `${className}`].join(" ")}>
      <nav className='grid grid-cols-[max-content]  gap-y-5'>
        {pages.map((page) => (
          <Btn href={page.path} key={page.path}>
            {page.pathname}
          </Btn>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
