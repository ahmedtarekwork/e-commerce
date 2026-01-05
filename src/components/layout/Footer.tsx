import { forwardRef } from "react";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer className="app-footer" ref={ref}>
      <div className="container white-selection">
        made by
        <a
          className="link white"
          href={
            import.meta.env.VITE_MY_PROFILE_URL ||
            "https://ahmed-profile.vercel.app"
          }
          target="_blank"
          rel="nofollow"
          title="maker profile link"
        >
          Ahmed Tarek
        </a>
      </div>
    </footer>
  );
});
export default Footer;
