const PAGE_SCRIPTS = [
  {
    aid: "ArticleCcoResponse_cdo/aid/6973996",
    href: "https://menstiler.github.io/highholidays/update-sheet.js",
    type: "script",
  },
];

function pageSpecificJs(url) {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

function injectAsset(rule) {
  if (rule.type === "script") {
    pageSpecificJs(rule.href);
  } else if (rule.type === "style") {
    pageSpecificStyling(rule.href);
  } else if (rule.type === "redirect") {
    window.location.href = rule.href;
  }
}

PAGE_SCRIPTS.forEach((rule) => {
  if (window.location.href.indexOf(rule.aid) !== -1) {
    injectAsset(rule);
  }
});

const url =
  "https://script.google.com/macros/s/AKfycbyXHSx4zoO2iKpAI1X7_G6MQzkNkoeA7h6jIPCsDdtQmv9IZcyJyvotSGk8JjrcNcQo/exec";

function getFromSheet() {
  try {
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        console.log("Total:", data.total);
        console.log("Rows:", data.rows);

        // Example: display total in an element
        // document.getElementById('total-display').textContent = `Total: $${data.total.toLocaleString()}`;
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  } catch (err) {
    console.error("Error:", err);
  }
}

if (document.readyState !== "loading") {
  getFromSheet();
} else {
  document.addEventListener("DOMContentLoaded", getFromSheet);
}
