const fileInput = document.querySelector("#certificate input[type=file]");
fileInput.onchange = () => {
  if (fileInput.files.length > 0) {
    const fileName = document.querySelector("#certificate .file-name");
    fileName.textContent = fileInput.files[0].name;
  }
};
