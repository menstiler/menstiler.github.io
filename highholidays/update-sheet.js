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
  let amount = getElementValue("Total Amount");
  let dedication = getElementValue("Message or Dedication");
  let submissionId = getElementValue("Submission Id");
  let anonymous = getElementValue("Checkbo13");
  let displayName = getElementValue("Name to be displayed");

  if (anonymous && anonymous === "Donate anonymously") {
    displayName = "Anonymous";
  }

  if (submissionId === localStorage.getItem("submissionId")) {
    return;
  }

  let data = {
    displayName,
    amount,
    dedication,
    submissionId,
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
    localStorage.setItem("submissionId", submissionId);
  } catch (err) {
    console.error("Error:", err);
  }
}

if (document.readyState !== "loading") {
  sendToSheet();
} else {
  document.addEventListener("DOMContentLoaded", sendToSheet);
}
