export function getName(data) {
    if (!data || typeof data !== "object") {
      return "";
    }
    const { first_name, username } = data;
    const cleanString = (str) => (str || "").replace(/\s/g, "");
    const cleanedFirstName = cleanString(first_name);
    const cleanedUsername = cleanString(username);
    if (cleanedFirstName) {
      return cleanedFirstName;
    } else if (cleanedUsername) {
      return cleanedUsername;
    } else {
      return "";
    }
  }
export  function extractFirstTwoLetters(input) {
    if (typeof input !== "string" || input.trim() === "") {
      return "";
    }
    const trimmedInput = input.trim();
    const alphabeticCharacters = [];
    for (let char of trimmedInput) {
      if (/[a-zA-Z]/.test(char)) {
        alphabeticCharacters.push(char);
        if (alphabeticCharacters.length === 2) {
          break;
        }
      }
    }
    if (alphabeticCharacters.length === 0) {
      return trimmedInput[0] || "";
    }
    return alphabeticCharacters.join("");
  }