export const getImgToB64 = (file) =>
  new Promise(function (resolve, reject) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.toString());
    reader.onerror = (error) => reject("Error: ", error);
  });
