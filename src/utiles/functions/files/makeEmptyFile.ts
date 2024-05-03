export default () => {
  const file = new File(["empty"], "empty.txt");
  const fileList = new DataTransfer();
  fileList.items.add(file);
  return fileList.files;
};
