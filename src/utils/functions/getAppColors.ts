export default (
  specific?: (
    | "--dark"
    | "--main"
    | "--light"
    | "--danger"
    | "--dark-trans"
    | "--trans"
  )[]
) => {
  const array = specific?.length ? specific : ["--dark", "--main", "--light"];

  return array.map((prop) =>
    getComputedStyle(document.documentElement).getPropertyValue(prop)
  );
};
