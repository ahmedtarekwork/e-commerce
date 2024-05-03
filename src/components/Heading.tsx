interface props {
  content: string;
}

const Heading = ({ content }: props) => {
  return <h2 className="sec-heading">{content}</h2>;
};

export default Heading;
