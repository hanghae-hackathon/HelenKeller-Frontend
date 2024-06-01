// upload image
const UPLOAD = async (file: Blob, text: string) => {
  const formdata = new FormData();
  formdata.append("file", file);
  formdata.append("text", text);

  try {
    const response = await fetch("https://nathankim0917.info/uploadfile/", {
      method: "POST",
      body: formdata,
    });

    // if (response.ok) {
    //   // throw new Error('Network response was not ok');
    //   return response.json();
    // }
    return response;

    // return response;
  } catch (e) {
    console.log(e);
  }
};

const UPLOAD2 = async (imageFile: Blob, audioFile: Blob) => {
  const formdata = new FormData();
  formdata.append("mp3_file", audioFile);
  formdata.append("image_file", imageFile);
  // formdata.append("text", text);

  try {
    const response = await fetch("https://nathankim0917.info/uploadfile2/", {
      method: "POST",
      body: formdata,
    });

    return response;
  } catch (e) {
    console.log(e);
  }
};

export { UPLOAD, UPLOAD2 };
