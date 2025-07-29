function getElementValue(field) {
  const td = Array.from(document.querySelectorAll("td")).find(
    (el) => el.textContent.trim() === field
  );

  if (td) {
    const row = td.parentElement;
    const sibling = Array.from(row.children).find((el) => el !== td);

    if (sibling) {
      return sibling.textContent.trim();
    } else {
      console.log("No sibling <td> found.");
    }
  } else {
    console.log(`<td> with text ${field} not found.`);
  }
}

async function sendToSheet() {
  if (localStorage.getItem("scriptHasRun")) {
    return;
  }

  let firstName = getElementValue("Full Name - First Name");
  let lastName = getElementValue("Full Name - Last Name");
  let amount = getElementValue("Total Amount");
  let dedication = getElementValue("In Honor/Memory of");

  let data = {
    name: `${firstName} ${lastName}`,
    amount,
    dedication,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      mode: "no-cors", // Important for avoiding CORS issues
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("Data sent");
    localStorage.setItem("scriptHasRun", "true");
  } catch (err) {
    console.error("Error:", err);
  }
}

if (document.readyState !== "loading") {
  sendToSheet();
} else {
  document.addEventListener("DOMContentLoaded", sendToSheet);
}
