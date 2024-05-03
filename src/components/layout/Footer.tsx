import { forwardRef } from "react";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer className="app-footer" ref={ref}>
      <div className="container white-selection">
        made by
        <a
          className="link white"
          href="https://github.com/ahmedtarekwork"
          target="_blank"
        >
          ahmed tarek
        </a>
      </div>
    </footer>
  );
});
export default Footer;
