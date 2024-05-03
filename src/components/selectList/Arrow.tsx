const Arrow = ({ active }: { active: boolean }) => (
  <div className={`app-arrow ${active ? "active" : ""}`}></div>
);
export default Arrow;
