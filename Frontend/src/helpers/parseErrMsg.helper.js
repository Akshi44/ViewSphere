// export const parseErrorMessage = (responseHTMLString) => {

//   const parser = new DOMParser();
//   const responseDocument = parser.parseFromString(responseHTMLString, "text/html");
//   const errorMessageElement = responseDocument.querySelector("pre");

//   if (errorMessageElement) {
//     // Extract the error message using regex
//     const errorMessage = errorMessageElement.textContent.match(/^Error:\s*(.*?)(?=\s*at)/);
//     if (errorMessage && errorMessage[1]) {
//       return errorMessage[1].trim();
//     }
//   }

//   return "Something went wrong 😕";
// };


export const parseErrorMessage = (responseHTMLString) => {
  console.log("Response received:", responseHTMLString); // Debugging log

  try {
    const parser = new DOMParser();
    const responseDocument = parser.parseFromString(responseHTMLString, "text/html");
    const errorMessageElement = responseDocument.querySelector("pre");

    if (errorMessageElement) {
      // Extract the error message using regex
      const errorMessage = errorMessageElement.textContent.match(/^Error:\s*(.*?)(?=\s*at)/);
      if (errorMessage && errorMessage[1]) {
        return errorMessage[1].trim();
      }
    }

    return "Something went wrong 😕";

  } catch (error) {
    console.error("Error in parseErrorMessage function:", error); // Log the error
    return "An unexpected error occurred while parsing the error message.";
  }
};
