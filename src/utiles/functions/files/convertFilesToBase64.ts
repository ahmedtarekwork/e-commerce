export default async (file: File): Promise<string> => {
  return new Promise((res, rej) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      res(fileReader.result as string);
    };

    fileReader.onerror = (err) => {
      rej(err);
    };
  });
};
