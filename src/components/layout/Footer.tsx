import { forwardRef } from "react";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer className="app-footer" ref={ref}>
      <div className="container white-selection">
        made by
        <a
          className="link white"
          href="https://ahmed-profile.netlify.app"
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
