// import React, { useState } from "react";

// const CloudinaryUploader = ({ setImageUrl, setErrorMessage }) => {
//   const [errorMessage, setLocalErrorMessage] = useState("");

//   // Maneja el cambio de archivo
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("upload_preset", "RestaurAPP");
//       formData.append("api_key", "897631255341685");
//       formData.append("timestamp", Date.now() / 1000);

//       fetch("https://api.cloudinary.com/v1_1/dxkiklgd2/image/upload", {
//         method: "POST",
//         body: formData,
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           setImageUrl(data.secure_url);  // Establece URL imagen
//         })
//         .catch(() => {
//           setLocalErrorMessage("No se pudo cargar la imagen.");
//           setErrorMessage("No se pudo cargar la imagen.");
//         });
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       {errorMessage && <p>{errorMessage}</p>}
//     </div>
//   );
// };

// export default CloudinaryUploader;


import React, { useState } from "react";

const CloudinaryUploader = ({ setImageUrl, setErrorMessage }) => {
  const [errorMessage, setLocalErrorMessage] = useState("");

  // Maneja el cambio de archivo
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "RestaurAPP");
      formData.append("api_key", "897631255341685");
      formData.append("timestamp", Date.now() / 1000);

      // Envia el archivo a Cloudinary
      fetch("https://api.cloudinary.com/v1_1/dxkiklgd2/image/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setImageUrl(data.secure_url);  // Establece URL imagen
        })
        .catch(() => {
          setLocalErrorMessage("No se pudo cargar la imagen.");
          setErrorMessage("No se pudo cargar la imagen.");
        });
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default CloudinaryUploader;


